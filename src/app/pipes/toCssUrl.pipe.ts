import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ standalone: true, name: 'toCssUrl' })
export class ToCssUrlPipe implements PipeTransform {
  constructor() {}
  transform(plainUrl: string | undefined) {
    // console.log(plainUrl);
    if (plainUrl) {
      return `url('${plainUrl}')`;
    } else {
      return `url('https://data.utrechttimemachine.nl/sites/default/files/2023-07/utm-about.jpg')`;
    }
  }
}
