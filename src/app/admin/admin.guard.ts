// import { Injectable } from '@angular/core';
// import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route, CanLoad} from '@angular/router';
// import { Observable } from 'rxjs/Observable';
// import { AuthService } from '../auth/auth.service';
//
// import * as _ from 'lodash';
// import 'rxjs/add/operator/do';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/take';
//
//
// @Injectable()
// export class AdminGuard implements CanActivate, CanLoad {
//
//   constructor(private authService: AuthService, private router: Router) {}
//
//
//   canActivate(
//     next: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
//       return this.authService.user
//         .take(1)
//         .map(user => _.has(_.get(user, 'roles'), 'admin'))
//         .do(authorized => {
//           if (!authorized) {
//             console.log('route prevented!');
//             this.router.navigate(['']);
//           }
//         });
//   }
//
//   canLoad(route: Route) {
//     if (this.authService.isAdmin()) {
//       return true;
//     } else {
//       this.router.navigate(['']);
//     }
//   }
// }
