import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { Viewer } from '@photo-sphere-viewer/core';

@Component({
  selector: 'app-ar-360-viewer',
  templateUrl: './ar-360-viewer.component.html',
  styleUrls: ['./ar-360-viewer.component.scss'],
})
export class Ar360Viewer implements AfterViewInit {
  @Input() imageSrc: string | undefined = undefined;
  @Input() defaultYaw: number = 0;
  @Input() defaultPitch: number = 0;
  @Input() defaultZoom: number = 50;

  @ViewChild('viewer', { static: false }) viewerElement!: ElementRef;
  @ViewChild('arIcon', { static: false }) arIconElement!: ElementRef;
  viewer?: Viewer;

  ngAfterViewInit() {
    this.viewer = new Viewer({
      container: this.viewerElement.nativeElement,
      panorama: this.imageSrc,
      navbar: [
        'zoom',
        'move',
        'caption',
        // {
        //   id: 'my-button',
        //   content: this.arIconElement.nativeElement,
        //   title: 'Hello world',
        //   className: 'custom-button',
        //   onClick: (viewer) => {
        //     alert('Hello from custom button');
        //   },
        // },
        'fullscreen',
      ],
      defaultYaw: this.defaultYaw,
      defaultPitch: this.defaultPitch,
      defaultZoomLvl: this.defaultZoom,
    });
  }
}
