import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { baseUrlCss, checkUrlCSS, baseUrlCssLuar } from '../../../baseurlCSS';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';
import { ListkontrabonService } from './listkontrabon.service';

@Component({
  selector: 'app-listkontrabon',
  templateUrl: './listkontrabon.component.html',
  styleUrl: './listkontrabon.component.scss',
  providers: [MessageService, ListkontrabonService],
})
export class ListkontrabonComponent implements OnInit {
  optionListSupplier: any;
  selectedSupplier: any = {};
  optionListBTB: any;
  selectedSupp: any;
  selectedBTB: any;
  table: any;
  listdataTable: any;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private httpService: ListkontrabonService
  ) {}

  ngOnInit(): void {
    this.getSupplier();
    // this.getListkontrabon();
  }

  onChangeSupplier(selectedSupplier: any) {
    console.log(selectedSupplier);
    this.selectedSupp = selectedSupplier;
    if (this.selectedSupp) {
      this.getBTB();
    }
  }

  onChangeBTB(selectedBTB: any[]) {
    console.log(selectedBTB);
    this.selectedBTB = selectedBTB;
  }

  getBTBIds() {
    return this.selectedBTB.map((emp: any) => emp.value);
  }

  getSupplier() {
    this.optionListSupplier = [];
    this.httpService.getSupp('3').subscribe(
      (data) => {
        const suppliers = data.map((item: any) => {
          return {
            label: item.NamaSupp,
            value: item.KdSupp,
          };
        });
        this.optionListSupplier = suppliers;
      },
      (error) => {
        // Handle error
      }
    );
  }

  getBTB() {
    this.optionListBTB = [];
    this.httpService.getBTB(this.selectedSupp).subscribe(
      (data) => {
        const BTB = data.map((item: any) => {
          return {
            label: item.TRXTEXT,
            value: item.TRX,
          };
        });
        this.optionListBTB = BTB;
      },
      (error) => {
        // Handle error
      }
    );
  }

  getListkontrabon() {
    $('#ListKontrabon').removeAttr('hidden');
    let url: string;
    if (checkUrlCSS()) {
      url = baseUrlCss + 'Accounting/SP_11_data_ajax';
    } else {
      url = baseUrlCssLuar + 'Accounting/SP_11_data_ajax';
    }

    const BTBString = this.getBTBIds().join(',');
    this.table = $('#tabelListKontrabon').DataTable();
    this.table.destroy();
    this.listdataTable = {
      destroy: true,
      paging: true,
      scrollY: '60vh',
      scrollX: true,
      scrollCollapse: true,
      dom: 'Bfrltip',
      lengthMenu: [10, 20, 50, 100, 200],
      ajax: {
        url: url,
        type: 'POST',
        dataType: 'JSON',
        data: {
          code: 1,
          supp: this.selectedSupp,
          Kode: BTBString,
        },
      },
      columns: [
        {
          title: 'Date',
          data: 'TGL',
        },
        {
          title: 'No OP',
          data: 'NoOP',
        },
        {
          title: 'TOP',
          data: 'KdTOPx',
        },
        {
          title: 'Supplier Code',
          data: 'KdSupp',
        },
        {
          title: 'Supplier Name',
          data: 'NamaSupp',
        },
        {
          title: 'No BTB',
          data: 'NoBTB',
        },
        {
          title: 'Barang Code',
          data: 'KdBrg',
        },
        {
          title: 'Brand',
          data: 'Brand',
        },
        {
          title: 'Barang Name',
          data: 'NamaBrg',
        },
        {
          title: 'Group Name',
          data: 'NamaGroup',
        },
        {
          title: 'Sub Group Name',
          data: 'NamaSubGroup',
        },
        {
          title: 'QTY BTB SB',
          data: 'QtyBTB_SB',
        },
        {
          title: 'Satuan Beli',
          data: 'SatuanBeli',
        },
        {
          title: 'Currency',
          data: 'Currency',
        },
        {
          title: 'Kurs',
          data: 'Kurs',
        },
        {
          title: 'Harga Satuan',
          data: 'HrgSatuan',
          render: $.fn.dataTable.render.number(',', '.', 2),
        },
        {
          title: 'Harga Satuan CURR',
          data: 'HrgSatuanCURR',
          render: $.fn.dataTable.render.number(',', '.', 2),
        },
        {
          title: 'Disc 1',
          data: 'Disc1',
          render: $.fn.dataTable.render.number(',', '.', 2),
        },
        {
          title: 'Disc 2',
          data: 'Disc2',
          render: $.fn.dataTable.render.number(',', '.', 2),
        },
        {
          title: 'PPN',
          data: 'PPN',
          render: $.fn.dataTable.render.number(',', '.', 2),
        },
        {
          title: 'Disc 1 Value',
          data: 'Nilai_Disc1',
          render: $.fn.dataTable.render.number(',', '.', 2),
        },
        {
          title: 'Disc 1 Valas Value',
          data: 'Nilai_Disc1_Valas',
          render: $.fn.dataTable.render.number(',', '.', 2),
        },
        {
          title: 'Disc 2 Value',
          data: 'Nilai_Disc2',
          render: $.fn.dataTable.render.number(',', '.', 2),
        },
        {
          title: 'Disc 2 Valas Value',
          data: 'Nilai_Disc2_Valas',
          render: $.fn.dataTable.render.number(',', '.', 2),
        },
        {
          title: 'PPN Value',
          data: 'Nilai_PPN',
          render: $.fn.dataTable.render.number(',', '.', 2),
        },
        {
          title: 'PPN Valas Value',
          data: 'Nilai_PPN_Valas',

          render: $.fn.dataTable.render.number(',', '.', 2),
        },
        {
          title: 'OC1',
          data: 'OC1',
          render: $.fn.dataTable.render.number(',', '.', 2),
        },
        {
          title: 'OC2',
          data: 'OC2',
          render: $.fn.dataTable.render.number(',', '.', 2),
        },
        {
          title: 'DPP Value',
          data: 'Nilai_DPP',
          render: $.fn.dataTable.render.number(',', '.', 2),
        },
        {
          title: 'Grand Total Valas',
          data: 'GRANDTOTAL',
          render: $.fn.dataTable.render.number(',', '.', 2),
        },
        {
          title: 'Due Date',
          data: 'JATUH_TEMPO',
        },
      ],
    };
    this.table = $('#tabelListKontrabon').DataTable(this.listdataTable);
  }
}
