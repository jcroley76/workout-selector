import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

import { tap, map, take } from 'rxjs/operators';


@Injectable()
export class AdminGuard implements CanActivate, CanLoad {

  constructor(private authService: AuthService) {}


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
      return this.authService.loggedInUser$.pipe(
        take(1),
        map(user => user && user.roles.admin ? true : false),
        tap(isAdmin => {
          if (!isAdmin) {
            console.error('Access denied - Admins only');
          }
        })
      );
  }

  canLoad(route: Route) {
    return this.authService.loggedInUser$.pipe(
      take(1),
      map(user => user && user.roles.admin ? true : false),
      tap(isAdmin => {
        if (!isAdmin) {
          console.error('Access denied - Admins only');
        }
      })
    );
  }
}
