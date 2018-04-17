import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})

export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {

    if (!items) { return []; }

    if (!searchText) { return []; }

    searchText = searchText.toLowerCase();

    return items.filter( it => {
      console.log('it', it);
      for (const col in it) {
        console.log('col', it[col]);
        if (it[col]) {
          if (Array.isArray(col)) {
            col.forEach(item => {
              return item.toLowerCase().includes(searchText);
            });
          } else {
            return it[col].toLowerCase().includes(searchText);
          }
        }
      }
    });
  }
}
