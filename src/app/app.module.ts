import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { environment } from '../environments/environment';

import { MaterialModule } from './material.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AppRoutingModule } from './app-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { AuthService } from './auth/auth.service';
import { AvailableWorkoutService } from './admin/available-workout.service';
import { DropdownService } from './shared/dropdown.service';
import { UIService } from './shared/ui.service';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { TrainingModule } from './training/training.module';
import { ExerciseService } from './admin/exercise.service';
import { UserService } from './admin/user.service';
import { EquipmentService } from './admin/equipment.service';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { FirestoreService } from './shared/firestore.service';
import { DocPipe } from './shared/utils/doc.pipe';


@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    HeaderComponent,
    SidenavListComponent,
    DocPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    FlexLayoutModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AuthModule,
    AdminModule,
    TrainingModule
  ],
  providers: [
    FirestoreService,
    AuthService,
    DropdownService,
    AvailableWorkoutService,
    ExerciseService,
    EquipmentService,
    UserService,
    UIService,
    DocPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
