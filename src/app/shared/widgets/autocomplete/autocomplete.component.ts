import { Component, Inject, forwardRef, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { BaseWidget, NgAisInstantSearch } from 'angular-instantsearch';
import { connectAutocomplete } from 'instantsearch.js/es/connectors';
import { MatAutocompleteSelectedEvent } from '@angular/material';

@Component({
  selector: 'app-ais-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent extends BaseWidget implements OnInit {

  @Input() public placeholder = 'Type to search';

  /*
  **
  ** IMPORTANT
  ** autocomplete returns list of search results as user types
  ** each of the result items is an object
  ** if that object has a parameter for a url path to an image, then set imageUrlParam to the name of the parameter
  ** e.g.
  **
  ** in your algolia index if you have an index of objects that look like this:
  **
  **    {id: "q3lk4fk", name: "itemName", imageUrl: "www.imagelibrary.com/the/location/of/my/image.png"}
  **
  ** then you would want to app-ais-autocomplete where to look
  **
  **    <app-ais-autocomplete [imageUrlParam]="imageUrl"></app-ais-autocomplete>
  **
  */
  @Input() public imageUrlParam = 'image';
  @Input() public selectTitle = 'SELECT';
  // Text insid of clear button
  @Input() public clearTitle = 'CLEAR';
  // Do you want to display clear button?
  @Input() public displayClearButton = false;
  // Do you want to display the select button. MAKE SURE selectToSubmit IS NOT SET TO FALSE!!
  @Input() public displaySelectButton = false;
  // Resets state of instantSearch's autocomplete mechanisms on submission of selected item
  @Input() public clearOnSubmit = false;
  @Input() public validators: Validators[] = [];

  @Output() select = new EventEmitter();

  selected: any;
  formContainer: FormGroup;
  hits: any[] = [];

  public state: {
    query: '';
    refine: (value: string) => void;
    indices: { hits: any[], index: string, label: string }[];
  };

  constructor (@Inject(forwardRef(() => NgAisInstantSearch))
               public instantSearchParent,
               private fb: FormBuilder
    ) {
    super('Autocomplete');
    this.formContainer = this.fb.group({
      'autocomplete': [null, [Validators.required, ...this.validators]]
    });
  }

  public ngOnInit() {
    this.createWidget(connectAutocomplete);
    super.ngOnInit();
  }
  public handleChange( query: string ) {
    this.formContainer.setErrors({'valueSelected': false});
    this.state.refine(query);
    console.log(`this.state`, this.state);
    this.hits = !!this.state && !!this.state.indices ? this.state.indices[0].hits : [];
  }

  public handleSelect( event: MatAutocompleteSelectedEvent ) {
    const item = event.option.value;
    this.select.emit({ item } );
    this.selected = item;
  }

  public handleSubmit(event: MouseEvent | KeyboardEvent) {
    // send submit event to parent component with selected item
    if ( event ) {
      event.preventDefault();
    }
    // this.submit.emit({ event, item : this.selected } );
    if ( this.clearOnSubmit ) {
      this.clearValue();
    }
  }

  public handleClear(event: MouseEvent | KeyboardEvent) {
    // send reset event to parent component

    // this.reset.emit(event);

    // reset search
    this.state.refine('');
    this.clearValue();
  }

  clearValue() {
    this.formContainer.get('autocomplete').reset();
  }
  // used to map selected items name to autocomplete input
  mapToName(val) {
    return val ? val.name : '';
  }

}
