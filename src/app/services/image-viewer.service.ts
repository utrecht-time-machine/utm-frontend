import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageViewerService {
  constructor() {}

  isModalShown(): boolean {
    return document.body.classList.contains('viewer-open');
  }
}
