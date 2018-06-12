import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterContains'
})

/// Inspired by: https://codeburst.io/create-a-search-pipe-to-dynamically-filter-results-with-angular-4-21fd3a5bec5c
export class FilterContainsPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {

    if (!items) { return []; }

    if (!searchText) { return []; }

    searchText = searchText.toLowerCase();
    const filteredObjects: any[] = [];

    items.filter( it => {
      for (const prop in it) {
        if (it[prop]) {
          if (Array.isArray(it[prop])) {
            it[prop].forEach(item => {
              if (item.toLowerCase().includes(searchText)) {
                if (!this.isPresent(filteredObjects, it)) {
                  filteredObjects.push(it);
                }
              }
            });
          } else {
            if (typeof it[prop] === 'string'
                && it[prop].toLowerCase().includes(searchText)) {
              if (!this.isPresent(filteredObjects, it)) {
                filteredObjects.push(it);
              }
            }
          }
        }
      }
    });
    return filteredObjects;
  }

  /// checks if object is present in array
  isPresent(array, item) {
    return array.some(el => {
      return el.id === item.id;
    });
  }
}
