import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
} from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('currentEmail')) {
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page with return url
    this.router.navigate(['./login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  canActivateChild() {
    // console.log(localStorage.getItem('currentRegister'));
    // if (localStorage.getItem('currentRole') === '"Admin"') {
    // console.log('checking child');
    return true;
    // }
  }
}
