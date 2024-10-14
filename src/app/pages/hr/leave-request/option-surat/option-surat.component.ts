import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-option-surat',
  templateUrl: './option-surat.component.html',
  styleUrl: './option-surat.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class OptionSuratComponent implements OnInit {
  surat: any = '';
  suratOption: any[] = [
    { label: 'Surat Cuti', value: 'SC' },
    { label: 'Surat Izin', value: 'SI' },
    { label: 'Surat Dinas', value: 'SD' },
    { label: 'Surat Lembur', value: 'SL' },
    { label: 'Surat Kendaraan', value: 'SK' },
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
        this.route.navigate(['hr/leaverequest/newrequest/suratCuti']);
        break;
      case 'SI':
        this.route.navigate(['hr/leaverequest/newrequest/suratIzin']);
        break;
      case 'SD':
        this.route.navigate(['hr/leaverequest/newrequest/suratDinas']);
        break;
      case 'SL':
        this.route.navigate(['hr/leaverequest/newrequest/suratLembur']);
        break;
      case 'SK':
        this.route.navigate(['hr/leaverequest/newrequest/suratKendaraan']);
        break;
      default:
        this.route.navigate(['hr/leaverequest/newrequest']);
        break;
    }
  }
}
