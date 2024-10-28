import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LayoutService } from '../../_metronic/layout';
import { NgxSpinnerService } from 'ngx-spinner';
import { baseUrl, checkUrl, baseUrlLuar } from '../baseurl';
import { AnnouncementService } from './announcement.service';
import { MessageService } from 'primeng/api';
import { data } from 'jquery';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss'],
  providers: [AnnouncementService, MessageService],
})
export class AnnouncementComponent implements OnInit {
  event: any;

  optionAnnouncement: any;
  constructor(
    private httpService: AnnouncementService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getAnno();
  }

  formatNotes(notes: string): string {
    return notes.replace(/-/g, '<br>-');
  }

  getAnno() {
    this.httpService.getAnno().subscribe(
      (data) => {
        const annos = data.map((item: any) => {
          return {
            status: item.AppVersion,
            date: item.DateInput,
            notes: item.Notes,
          };
        });

        this.event = annos;
      },
      (error) => {
        console.error('Error fetching data', error);
      }
    );
  }
}
