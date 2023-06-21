import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unescape',
})
export class UnescapePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    // TODO: Do not use in SSR-mode
    const doc = new DOMParser().parseFromString(value, 'text/html');
    return doc.documentElement.textContent;
  }
}
