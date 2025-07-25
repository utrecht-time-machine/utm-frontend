import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor() {}

  getImageUrl(originalUrl: string, source?: string, license?: string): string {
    // if (!originalUrl || !source || !license) {
    //   return 'https://data.utrechttimemachine.nl/sites/default/files/2025-05/Afbeelding-tijdelijk-niet-beschikbaar_3.png';
    // }
    return originalUrl;
  }
}
