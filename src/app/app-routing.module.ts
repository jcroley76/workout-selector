import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { TrainingComponent } from './training/training.component';
import { AuthGuard } from './auth/auth.guard';
// import { AdminGuard } from './admin/admin.guard';

const routes: Routes = [
  { path: '', component: WelcomeComponent},
  { path: 'training', component: TrainingComponent },
  // TODO: This isn't working. Will prevent loading if not auth
  // { path: 'admin', loadChildren: './admin/admin.module#AdminModule', canActivate: [AuthGuard] },
  { path: 'training', loadChildren: './training/training.module#TrainingModule', canLoad: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard] //, AdminGuard]
})
export class AppRoutingModule {}
