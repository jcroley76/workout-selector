import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatToolbarModule,
  MatListModule,
  MatTabsModule,
  MatCardModule,
  MatSelectModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatSnackBarModule,
  MatDialogModule,
  MatGridListModule,
  MatExpansionModule,
  MatAutocompleteModule,
  MatMenuModule
} from '@angular/material';

@NgModule({
  imports: [MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatCheckboxModule, MatSidenavModule, MatToolbarModule, MatListModule, MatTabsModule, MatCardModule, MatSelectModule, MatSnackBarModule, MatTableModule, MatSortModule, MatPaginatorModule, MatDialogModule, MatGridListModule, MatExpansionModule, MatAutocompleteModule, MatMenuModule],
  exports: [MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatCheckboxModule, MatSidenavModule, MatToolbarModule, MatListModule, MatTabsModule, MatCardModule, MatSelectModule, MatSnackBarModule, MatTableModule, MatSortModule, MatPaginatorModule, MatDialogModule, MatGridListModule, MatExpansionModule, MatAutocompleteModule, MatMenuModule]
})
export class MaterialModule {}
