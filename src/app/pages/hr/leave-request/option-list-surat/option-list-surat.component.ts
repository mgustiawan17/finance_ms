import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-option-list-surat',
  templateUrl: './option-list-surat.component.html',
  styleUrl: './option-list-surat.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class OptionListSuratComponent implements OnInit {
  surat: any = '';
  suratOption: any[] = [
    { label: 'Surat Cuti', value: 'SC' },
    { label: 'Surat Izin', value: 'SI' },
    { label: 'Surat Dinas', value: 'SD' },
    { label: 'Surat Lembur', value: 'SL' },
  ];
  selectedSurat: any;

  constructor(private route: Router) {}

  ngOnInit(): void {
    this.proses();
  }

  onChangeSurat(selectedSurat: any) {
    console.log(selectedSurat);
    this.selectedSurat = selectedSurat;
  }

  proses() {
    switch (this.selectedSurat) {
      case 'SC':
        this.route.navigate(['hr/leaverequest/listreport/suratCuti']);
        break;
      case 'SI':
        this.route.navigate(['hr/leaverequest/listreport/suratIzin']);
        break;
      case 'SD':
        this.route.navigate(['hr/leaverequest/listreport/suratDinas']);
        break;
      case 'SL':
        this.route.navigate(['hr/leaverequest/listreport/suratLembur']);
        break;
      default:
        this.route.navigate(['hr/leaverequest/listreport']);
        break;
    }
  }
}
