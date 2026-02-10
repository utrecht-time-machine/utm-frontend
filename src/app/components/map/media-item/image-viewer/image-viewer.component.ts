import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import Viewer from 'viewerjs';
import { ImageViewerService } from '../../../../services/image-viewer.service';
import { ImageService } from 'src/app/services/image.service';
import { PlatformService } from 'src/app/services/platform.service';

@Component({
    selector: 'app-image-viewer',
    templateUrl: './image-viewer.component.html',
    styleUrls: ['./image-viewer.component.scss'],
    standalone: false
})
export class ImageViewerComponent implements AfterViewInit, OnChanges {
  @Input() imageUrl: string | undefined = undefined;
  @Input() imageSource: string | undefined = undefined;
  @Input() imageLicense: string | undefined = undefined;
  @Input() imageAlt: string | undefined = '';

  @ViewChild('imageElement', { static: false }) imageElement!: ElementRef;

  private viewer: Viewer | undefined;

  constructor(
    public imageService: ImageService,
    private imageViewerService: ImageViewerService,
    private platform: PlatformService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if ('imageSrc' in changes) {
      setTimeout(() => {
        if (this.viewer) {
          this.viewer.update();
        }
      });
    }
  }

  private _initImageViewer() {
    if (!this.imageElement) {
      return;
    }

    if (!this.platform.isBrowser()) {
      return;
    }
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

  ngAfterViewInit() {
    this._initImageViewer();
  }
}
