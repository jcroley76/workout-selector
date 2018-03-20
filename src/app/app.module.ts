import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { environment } from '../environments/environment';

import { MaterialModule } from './material.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { TrainingComponent } from './training/training.component';
import { AvailableWorkoutsComponent } from './admin/available-workouts/available-workouts.component';
import { RecommendWorkoutComponent } from './training/recommend-workout/recommend-workout.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AppRoutingModule } from './app-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { PastWorkoutsComponent } from './training/past-workouts/past-workouts.component';
import { AdminComponent } from './admin/admin.component';
import { AvailableWorkoutAddEditComponent } from './admin/available-workout-add-edit/available-workout-add-edit.component';
import { AuthService } from './auth/auth.service';
import { AvailableWorkoutService } from './admin/available-workout.service';
import { DropdownService } from './shared/dropdown.service';
import { UIService } from './shared/ui.service';
import { DeleteDialogComponent } from './shared/delete-dialog/delete-dialog.component';



@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    TrainingComponent,
    AvailableWorkoutsComponent,
    RecommendWorkoutComponent,
    WelcomeComponent,
    HeaderComponent,
    SidenavListComponent,
    PastWorkoutsComponent,
    AdminComponent,
    AvailableWorkoutAddEditComponent,
    DeleteDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    FlexLayoutModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
  ],
  providers: [
    AuthService,
    DropdownService,
    AvailableWorkoutService,
    UIService
  ],
  bootstrap: [AppComponent],
  entryComponents: [DeleteDialogComponent]
})
export class AppModule { }
