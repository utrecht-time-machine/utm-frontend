import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Viewer } from '@photo-sphere-viewer/core';

@Component({
  selector: 'app-ar-viewer',
  templateUrl: './ar-viewer.component.html',
  styleUrls: ['./ar-viewer.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ArViewerComponent implements AfterViewInit {
  @Input() imageSrc: string | undefined = undefined;
  @Input() imageCaption: string | undefined = undefined;
  @Input() defaultYaw: number = 0;
  @Input() defaultPitch: number = 0;

  @ViewChild('viewer', { static: false }) viewerElement!: ElementRef;

  ngAfterViewInit() {
    const viewer: Viewer = new Viewer({
      container: this.viewerElement.nativeElement,
      panorama: this.imageSrc,
      navbar: ['zoom', 'move', 'caption', 'fullscreen'],
      defaultYaw: this.defaultYaw,
      defaultPitch: this.defaultPitch,
    });
  }
}
