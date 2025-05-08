import { Routes } from '@angular/router';
import { LoginComponent } from '../auth/login.component';
import { LayoutComponent } from '../_metronic/layout/layout.component';
import { AuthGuard } from '../auth/guards';

const Routing: Routes = [
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'announcement',
    loadChildren: () =>
      import('./announcement/announcement.module').then(
        (m) => m.AnnouncementModule
      ),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'approval/pr',
    loadChildren: () =>
      import('./approval/pr/pr.module').then((m) => m.PRModule),
  },
  {
    path: 'approval/po',
    loadChildren: () =>
      import('./approval/po/po.module').then((m) => m.POModule),
  },
  {
    path: 'approval/leave',
    loadChildren: () =>
      import('./approval/leave/leave.module').then((m) => m.LeaveModule),
  },
  {
    path: 'accounting/puchaseflow/reportbtb',
    loadChildren: () =>
      import('./accounting/puchase-flow/reportbtb/reportbtb.module').then(
        (m) => m.ReportbtbModule
      ),
  },
  {
    path: 'accounting/puchaseflow/usagereport',
    loadChildren: () =>
      import('./accounting/puchase-flow/usagereport/usagereport.module').then(
        (m) => m.UsagereportModule
      ),
  },
  {
    path: 'accounting/puchaseflow/returintern',
    loadChildren: () =>
      import('./accounting/puchase-flow/returintern/returintern.module').then(
        (m) => m.ReturinternModule
      ),
  },
  {
    path: 'accounting/puchaseflow/returextern',
    loadChildren: () =>
      import('./accounting/puchase-flow/returextern/returextern.module').then(
        (m) => m.ReturexternModule
      ),
  },
  {
    path: 'accounting/puchaseflow/stocksparepart',
    loadChildren: () =>
      import(
        './accounting/puchase-flow/stocksparepart/stocksparepart.module'
      ).then((m) => m.StocksparepartModule),
  },
  {
    path: 'accounting/kontannote/listkontrabon',
    loadChildren: () =>
      import(
        './accounting/kontan-note/listkontrabon/listkontrabon.module'
      ).then((m) => m.ListkontrabonModule),
  },
  {
    path: 'accounting/kontannote/checkkontrabon',
    loadChildren: () =>
      import(
        './accounting/kontan-note/checkkontrabon/checkkontrabon.module'
      ).then((m) => m.CheckkontrabonModule),
  },
  {
    path: 'accounting/kontannote/returkontrabon',
    loadChildren: () =>
      import(
        './accounting/kontan-note/returkontrabon/returkontrabon.module'
      ).then((m) => m.ReturkontrabonModule),
  },
  {
    path: 'accounting/kontannote/reviewkontrabon',
    loadChildren: () =>
      import(
        './accounting/kontan-note/reviewkontrabon/reviewkontrabon.module'
      ).then((m) => m.ReviewkontrabonModule),
  },
  {
    path: 'hr/attendance',
    loadChildren: () =>
      import('./hr/attendance/attendanceperiode/attendanceperiode.module').then(
        (m) => m.AttendancePeriodeModule
      ),
  },
  {
    path: 'hr/leaverequest/newrequest',
    loadChildren: () =>
      import('./hr/leave-request/option-surat/option-surat.module').then(
        (m) => m.OptionSuratModule
      ),
  },
  {
    path: 'hr/leaverequest/newrequest/suratCuti',
    loadChildren: () =>
      import('./hr/leave-request/surat-cuti/surat-cuti.module').then(
        (m) => m.SuratCutiModule
      ),
  },
  {
    path: 'hr/leaverequest/newrequest/suratIzin',
    loadChildren: () =>
      import('./hr/leave-request/surat-izin/surat-izin.module').then(
        (m) => m.SuratIzinModule
      ),
  },
  {
    path: 'hr/leaverequest/newrequest/suratDinas',
    loadChildren: () =>
      import('./hr/leave-request/surat-dinas/surat-dinas.module').then(
        (m) => m.SuratDinasModule
      ),
  },
  {
    path: 'hr/leaverequest/newrequest/suratLembur',
    loadChildren: () =>
      import('./hr/leave-request/surat-lembur/surat-lembur.module').then(
        (m) => m.SuratLemburModule
      ),
  },
  {
    path: 'hr/leaverequest/newrequest/suratKendaraan',
    loadChildren: () =>
      import('./hr/leave-request/surat-kendaraan/surat-kendaraan.module').then(
        (m) => m.SuratKendaraanModule
      ),
  },
  {
    path: 'hr/leaverequest/listreport',
    loadChildren: () =>
      import(
        './hr/leave-request/option-list-surat/option-list-surat.module'
      ).then((m) => m.OptionListSuratModule),
  },
  {
    path: 'hr/leaverequest/listreport/suratCuti',
    loadChildren: () =>
      import('./hr/leave-request/surat-cuti-list/surat-cuti-list.module').then(
        (m) => m.SuratCutiListModule
      ),
  },
  {
    path: 'hr/leaverequest/listreport/suratIzin',
    loadChildren: () =>
      import('./hr/leave-request/surat-izin-list/surat-izin-list.module').then(
        (m) => m.SuratIzinListModule
      ),
  },
  {
    path: 'hr/leaverequest/listreport/suratDinas',
    loadChildren: () =>
      import(
        './hr/leave-request/surat-dinas-list/surat-dinas-list.module'
      ).then((m) => m.SuratDinasListModule),
  },
  {
    path: 'hr/leaverequest/listreport/suratLembur',
    loadChildren: () =>
      import(
        './hr/leave-request/surat-lembur-list/surat-lembur-list.module'
      ).then((m) => m.SuratLemburListModule),
  },
  {
    path: 'hr/leaverequest/report',
    loadChildren: () =>
      import(
        './hr/leave-request/option-laporan-surat/option-laporan-surat.module'
      ).then((m) => m.OptionLaporanSuratModule),
  },
  {
    path: 'hr/leaverequest/sisacuti',
    loadChildren: () =>
      import('./hr/leave-request/sisa-cuti/sisa-cuti.module').then(
        (m) => m.SisaCutiModule
      ),
  },
  {
    path: 'setting/register',
    loadChildren: () =>
      import('./setting/register/register.module').then(
        (m) => m.RegisterModule
      ),
  },
  {
    path: 'setting/security_management',
    loadChildren: () =>
      import('./setting/security_management/secum.module').then(
        (m) => m.SecurityManagementModule
      ),
  },
  {
    path: 'purchasing/purchasereport',
    loadChildren: () =>
      import('./purchasing/purchasereport/purchasereport.module').then(
        (m) => m.PurchaseReportModule
      ),
  },
  {
    path: 'purchasing/priceindex',
    loadChildren: () =>
      import('./purchasing/priceindex/priceindex.module').then(
        (m) => m.PriceIndexModule
      ),
  },
  {
    path: 'purchasing/purchaseanalysis',
    loadChildren: () =>
      import('./purchasing/purchaseanalysis/purchaseanalysis.module').then(
        (m) => m.PurchaseAnalysisModule
      ),
  },
  {
    path: 'purchasing/outstandingpo',
    loadChildren: () =>
      import('./purchasing/outstandingpo/outstandingpo.module').then(
        (m) => m.OutStandingPOModule
      ),
  },
  {
    path: 'purchasing/outstandingpr',
    loadChildren: () =>
      import('./purchasing/outstandingpr/outstandingpr.module').then(
        (m) => m.OutStandingPRModule
      ),
  },
  {
    path: 'purchasing/outstandingdept',
    loadChildren: () =>
      import('./purchasing/outstandingdept/outstandingdept.module').then(
        (m) => m.OutStandingDeptModule
      ),
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
