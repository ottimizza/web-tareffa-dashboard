import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thousandSeparator'
})
export class ThousandSeparatorPipe implements PipeTransform {
  transform(value: any, digits: string = ' '): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, digits);
  }
}
