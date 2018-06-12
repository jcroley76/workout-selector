import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MaterialModule} from '../material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxMaskModule} from 'ngx-mask';
import {AutocompleteComponent} from './widgets/autocomplete/autocomplete.component';
import {SearchBoxComponent} from './widgets/search-box/search-box.component';
import {NgAisModule} from 'angular-instantsearch';



@NgModule({
  declarations: [
    AutocompleteComponent,
    SearchBoxComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    NgxMaskModule.forRoot(),
    NgAisModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    NgxMaskModule,
    NgAisModule,
    AutocompleteComponent,
    SearchBoxComponent
  ]
})
export class SharedModule {
}
