import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { AuthGuard } from './auth/auth.guard';
import { TrainingComponent } from './training/training.component';
import { AdminGuard } from './admin/admin.guard';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent},
  { path: 'training', component: TrainingComponent },
  { path: 'admin', component: AdminComponent },
  // TODO: Figure out how to make AdminGuard work
  // https://github.com/angular/angular-cli/issues/9488
  // { path: 'admin', loadChildren: './admin/admin.module#AdminModule', canLoad: [AdminGuard] },
  // { path: 'training', loadChildren: './training/training.module#TrainingModule', canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AdminGuard]
})
export class AppRoutingModule {}
