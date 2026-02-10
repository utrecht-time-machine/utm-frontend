import { Pipe, PipeTransform } from '@angular/core';
import { PlatformService } from '../services/platform.service';

@Pipe({
    name: 'unescape',
    standalone: false
})
export class UnescapePipe implements PipeTransform {
  constructor(private platform: PlatformService) {}

  transform(value: any, args?: any): any {
    if (!this.platform.isBrowser()) {
      return value;
    }
    const doc = new DOMParser().parseFromString(value, 'text/html');
    return doc.documentElement.textContent;
  }
}
