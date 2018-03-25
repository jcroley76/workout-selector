import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { AuthGuard } from '../auth/auth.guard';

// TODO: Reorganize admin routes to individual pages
const routes: Routes = [
  { path: 'admin', component: AdminComponent, canLoad: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
