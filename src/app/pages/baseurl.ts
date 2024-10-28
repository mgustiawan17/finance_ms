'use strict';
export const baseUrlLuar = 'https://bstm.co.id/backend_sgiscss/';
export const baseUrl = 'http://192.168.1.25/backend_sgiscss/';

export function checkUrl(): boolean {
  if (
    window.location.href.includes('localhost') ||
    window.location.href.includes('192.168.1.25/css/') ||
    window.location.href.includes('sis/css/')
  ) {
    return true;
  }
  // tslint:disable-next-line: one-line
  else {
    return false;
  }
}

// export const baseUrlLuar = 'https://bstm.co.id/backend_fmtx_cp/';
// export const baseUrl = 'http://192.168.9.9:8080/backend_fmtx/';

// export function checkUrl() {
//     if ((window.location.href.includes('localhost')) || (window.location.href.includes('192.168.1.25/fmtx/')) ||
//         (window.location.href.includes('sis/fmtx/')) || (window.location.href.includes('sis/fmtxcp/'))) {
//         return true;
//     }
//     // tslint:disable-next-line: one-line
//     else {
//         return false;
//     }
// }
