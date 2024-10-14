import { Routes } from '@angular/router';
import { LoginComponent } from '../auth/login.component';
import { LayoutComponent } from '../_metronic/layout/layout.component';
import { AuthGuard } from '../auth/guards';
import { InventoryUsageModule } from './Inventory/inventoryusage/inventoryusage.module';

const Routing: Routes = [
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'accounting/checkcredit',
    loadChildren: () =>
      import('./accounting/checkcredit/checkcredit.module').then(
        (m) => m.CheckCreditModule
      ),
  },
  {
    path: 'accounting/reviewcredit',
    loadChildren: () =>
      import('./accounting/reviewcredit/reviewcredit.module').then(
        (m) => m.ReviewCreditModule
      ),
  },
  {
    path: 'accounting/listcredit',
    loadChildren: () =>
      import('./accounting/listcredit/listcredit.module').then(
        (m) => m.ListCreditModule
      ),
  },
  {
    path: 'approval/pr',
    loadChildren: () =>
      import('./approval/pr/pr.module').then((m) => m.PRModule),
  },
  {
    path: 'approval/pr1',
    loadChildren: () =>
      import('./approval/pr1/pr1.module').then((m) => m.PR1Module),
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
    path: 'inventory/salesreports',
    loadChildren: () =>
      import('./Inventory/salesreports/salesreports.module').then(
        (m) => m.SalesReportsModule
      ),
  },
  {
    path: 'inventory/finishedgoodproduct',
    loadChildren: () =>
      import('./Inventory/finishedgoodproduct/finishedgoodproduct.module').then(
        (m) => m.FinishedGoodProductModule
      ),
  },
  {
    path: 'inventory/finishedgoodinventoryflow',
    loadChildren: () =>
      import(
        './Inventory/finishedgoodinventoryflow/finishedgoodinventoryflow.module'
      ).then((m) => m.FinishedGoodInventoryFlowModule),
  },
  {
    path: 'inventory/goodsreceipt',
    loadChildren: () =>
      import('./Inventory/goodsreceipt/goodsreceipt.module').then(
        (m) => m.GoodsReceiptModule
      ),
  },
  {
    path: 'inventory/inventoryusage',
    loadChildren: () =>
      import('./Inventory/inventoryusage/inventoryusage.module').then(
        (m) => m.InventoryUsageModule
      ),
  },
  {
    path: 'inventory/inventorystock',
    loadChildren: () =>
      import('./Inventory/stock/stock.module').then((m) => m.StockModule),
  },
  {
    path: 'mrp/inputmasterResep',
    loadChildren: () =>
      import('./mrp/masterResep/inputmasterResep/inputmasterResep.module').then(
        (m) => m.InputMasterResepModule
      ),
  },
  {
    path: 'mrp/listmasterResep',
    loadChildren: () =>
      import('./mrp/masterResep/listmasterResep/listmasterResep.module').then(
        (m) => m.ListMasterResepModule
      ),
  },
  {
    path: 'mrp/inputformulaUsage',
    loadChildren: () =>
      import(
        './mrp/formulaUsage/inputformulaUsage/inputformulaUsage.module'
      ).then((m) => m.InputFormulaUsageModule),
  },
  {
    path: 'mrp/listformulaUsage',
    loadChildren: () =>
      import(
        './mrp/formulaUsage/listformulaUsage/listformulaUsage.module'
      ).then((m) => m.ListFormulaUsageModule),
  },
  {
    path: 'mrp/formulaUsageReport',
    loadChildren: () =>
      import(
        './mrp/formulaUsage/reportformulaUsage/reportformulaUsage.module'
      ).then((m) => m.ReportFormulaUsageModule),
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
    path: 'electricity/electricityusage',
    loadChildren: () =>
      import('./utility/listrik/inputPemakaian/inputPemakaian.module').then(
        (m) => m.InputPemakaianModule
      ),
  },
  {
    path: 'electricity/electricitypaymentinput',
    loadChildren: () =>
      import('./utility/listrik/inputPembayaran/inputPembayaran.module').then(
        (m) => m.InputPembayaranModule
      ),
  },
  {
    path: 'electricity/electricityreport',
    loadChildren: () =>
      import('./utility/listrik/laporanListrik/laporanListrik.module').then(
        (m) => m.LaporanListrikModule
      ),
  },
  {
    path: 'water/waterpaymentinpuut',
    loadChildren: () =>
      import('./utility/air/inputPembayaran/inputPembayaran.module').then(
        (m) => m.InputPembayaranModule
      ),
  },
  {
    path: 'water/waterusage',
    loadChildren: () =>
      import('./utility/air/inputPemakaian/inputPemakaian.module').then(
        (m) => m.InputPemakaianModule
      ),
  },
  {
    path: 'water/waterreport',
    loadChildren: () =>
      import('./utility/air/laporanAir/laporanAir.module').then(
        (m) => m.LaporanAirModule
      ),
  },
  {
    path: 'quality/qualityinput',
    loadChildren: () =>
      import('./utility/wwt/kualitas/inputKualitas/inputKualitas.module').then(
        (m) => m.InputKualitasModule
      ),
  },
  {
    path: 'quality/qualitylist',
    loadChildren: () =>
      import('./utility/wwt/kualitas/listKualitas/listKualitas.module').then(
        (m) => m.ListKualitasModule
      ),
  },
  {
    path: 'quality/qualityreport',
    loadChildren: () =>
      import(
        './utility/wwt/kualitas/laporanKualitas/laporanKualitas.module'
      ).then((m) => m.LaporanKualitasModule),
  },
  {
    path: 'quantity/quantityreport',
    loadChildren: () =>
      import(
        './utility/wwt/kuantitas/laporanKuantitas/laporanKuantitas.module'
      ).then((m) => m.LaporanKuantitasModule),
  },
  {
    path: 'quantity/quantitylist',
    loadChildren: () =>
      import('./utility/wwt/kuantitas/listKuantitas/listKuantitas.module').then(
        (m) => m.ListKuantitasModule
      ),
  },
  {
    path: 'quantity/quantityinput',
    loadChildren: () =>
      import(
        './utility/wwt/kuantitas/inputKuantitas/inputKuantitas.module'
      ).then((m) => m.InputKuantitasModule),
  },
  {
    path: 'cost/costinput',
    loadChildren: () =>
      import('./utility/wwt/biaya/inputBiaya/inputBiaya.module').then(
        (m) => m.InputBiayaModule
      ),
  },
  {
    path: 'cost/costlist',
    loadChildren: () =>
      import('./utility/wwt/biaya/listBiaya/listBiaya.module').then(
        (m) => m.ListBiayaModule
      ),
  },
  {
    path: 'cost/costreport',
    loadChildren: () =>
      import('./utility/wwt/biaya/laporanBiaya/laporanBiaya.module').then(
        (m) => m.LaporanBiayaModule
      ),
  },
  {
    path: 'marketingdenim/salescontract/formpo',
    loadChildren: () =>
      import(
        './marketing/marketingDenim/salescontract/formPO/formPO.module'
      ).then((m) => m.FormPOModule),
  },
  {
    path: 'marketingdenim/salescontract/poreport',
    loadChildren: () =>
      import(
        './marketing/marketingDenim/salescontract/reportPO/reportPO.module'
      ).then((m) => m.ReportPOModule),
  },
  {
    path: 'marketingdenim/salescontract/outstandingpo',
    loadChildren: () =>
      import(
        './marketing/marketingDenim/salescontract/outstandingPO/outstandingPO.module'
      ).then((m) => m.OutStandingPOModule),
  },
  {
    path: 'marketingdenim/salescontract/outstandingpoterm',
    loadChildren: () =>
      import(
        './marketing/marketingDenim/salescontract/outstandingPOTerm/outstandingPOTerm.module'
      ).then((m) => m.OutStandingPOTermModule),
  },
  {
    path: 'marketingdenim/shipment/formshipment',
    loadChildren: () =>
      import(
        './marketing/marketingPoy/shipment/formShipment/formShipment.module'
      ).then((m) => m.FormShipmentModule),
  },
  {
    path: 'marketingdenim/shipment/shipmentreport',
    loadChildren: () =>
      import(
        './marketing/marketingPoy/shipment/reportShipment/reportShipment.module'
      ).then((m) => m.ReportShipmentModule),
  },
  {
    path: 'marketingdenim/shipment/shipmentreportprice',
    loadChildren: () =>
      import(
        './marketing/marketingPoy/shipment/reportpriceShipment/reportpriceShipment.module'
      ).then((m) => m.ReportPriceShipmentModule),
  },
  {
    path: 'marketingdenim/return/returninput',
    loadChildren: () =>
      import(
        './marketing/marketingPoy/return/returnInput/returnInput.module'
      ).then((m) => m.ReturnInputModule),
  },
  {
    path: 'marketingdenim/return/returnrevision',
    loadChildren: () =>
      import(
        './marketing/marketingPoy/return/returnRevisi/returnRevisi.module'
      ).then((m) => m.ReturnRevisiModule),
  },
  {
    path: 'marketingdenim/return/returnreport',
    loadChildren: () =>
      import(
        './marketing/marketingPoy/return/returnReport/returnReport.module'
      ).then((m) => m.ReturnReportModule),
  },
  {
    path: 'marketingdenim/return/listinvoice',
    loadChildren: () =>
      import(
        './marketing/marketingDenim/invoice/listInvoice/listInvoice.module'
      ).then((m) => m.ListInvoiceModule),
  },
  {
    path: 'marketingpoy/salescontract/formpo',
    loadChildren: () =>
      import(
        './marketing/marketingPoy/salescontract/formPO/formPO.module'
      ).then((m) => m.FormPOModule),
  },
  {
    path: 'marketingpoy/salescontract/poreport',
    loadChildren: () =>
      import(
        './marketing/marketingPoy/salescontract/reportPO/reportPO.module'
      ).then((m) => m.ReportPOModule),
  },
  {
    path: 'marketingpoy/salescontract/outstandingpo',
    loadChildren: () =>
      import(
        './marketing/marketingPoy/salescontract/outstandingPO/outstandingPO.module'
      ).then((m) => m.OutStandingPOModule),
  },
  {
    path: 'marketingpoy/salescontract/outstandingpoterm',
    loadChildren: () =>
      import(
        './marketing/marketingPoy/salescontract/outstandingPOPrice/outstandingPOPrice.module'
      ).then((m) => m.OutStandingPOTermModule),
  },
  {
    path: 'marketingpoy/shipment/formshipment',
    loadChildren: () =>
      import(
        './marketing/marketingPoy/shipment/formShipment/formShipment.module'
      ).then((m) => m.FormShipmentModule),
  },
  {
    path: 'marketingpoy/shipment/shipmentreport',
    loadChildren: () =>
      import(
        './marketing/marketingPoy/shipment/reportShipment/reportShipment.module'
      ).then((m) => m.ReportShipmentModule),
  },
  {
    path: 'marketingpoy/shipment/shipmentreportprice',
    loadChildren: () =>
      import(
        './marketing/marketingPoy/shipment/reportpriceShipment/reportpriceShipment.module'
      ).then((m) => m.ReportPriceShipmentModule),
  },
  {
    path: 'marketingpoy/return/returninput',
    loadChildren: () =>
      import(
        './marketing/marketingPoy/return/returnInput/returnInput.module'
      ).then((m) => m.ReturnInputModule),
  },
  {
    path: 'marketingpoy/return/returnrevision',
    loadChildren: () =>
      import(
        './marketing/marketingPoy/return/returnRevisi/returnRevisi.module'
      ).then((m) => m.ReturnRevisiModule),
  },
  {
    path: 'marketingpoy/return/returnreport',
    loadChildren: () =>
      import(
        './marketing/marketingPoy/return/returnReport/returnReport.module'
      ).then((m) => m.ReturnReportModule),
  },
  {
    path: 'marketingpoy/invoice/listinvoice',
    loadChildren: () =>
      import(
        './marketing/marketingPoy/invoice/listInvoice/listInvoice.module'
      ).then((m) => m.ListInvoiceModule),
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
