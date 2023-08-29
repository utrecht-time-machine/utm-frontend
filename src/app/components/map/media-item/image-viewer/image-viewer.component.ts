import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import Viewer from 'viewerjs';
import { ImageViewerService } from '../../../../services/image-viewer.service';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
})
export class ImageViewerComponent implements AfterViewInit {
  @Input() imageSrc: string | undefined = undefined;
  @Input() imageAlt: string | undefined = '';

  @ViewChild('imageElement', { static: false }) imageElement!: ElementRef;

  private viewer: Viewer | undefined;

  constructor(private imageViewerService: ImageViewerService) {}

  ngAfterViewInit() {
    this.imageElement.nativeElement.addEventListener('shown', () => {
      this.imageViewerService.isModalShown.next(true);
    });

    this.imageElement.nativeElement.addEventListener('hidden', () => {
      this.imageViewerService.isModalShown.next(false);
    });

    this.viewer = new Viewer(this.imageElement.nativeElement, {
      inline: false,
      navbar: false,
      title: false,
      toolbar: false,
      keyboard: true,
      loading: true,
      movable: true,
      rotatable: false,
      scalable: true,
      zoomable: true,
      zoomOnTouch: true,
      zoomOnWheel: true,
      tooltip: false,
    });
    this.viewer.zoomTo(1);
  }
}
