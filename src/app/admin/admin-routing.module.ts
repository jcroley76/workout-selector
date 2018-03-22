import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  // TODO: Figure out how to get roles on Users.
  // https://angularfirebase.com/lessons/role-based-permissions-and-authorization-with-firebase-auth/
  { path: 'admin', component: AdminComponent, canLoad: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
