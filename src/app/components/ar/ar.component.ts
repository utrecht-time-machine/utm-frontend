import { Component } from '@angular/core';
import { MediaItemType } from '../../models/media-item';

@Component({
  selector: 'app-ar',
  templateUrl: './ar.component.html',
  styleUrls: ['./ar.component.scss'],
})
export class ArComponent {
  protected readonly MediaItemType = MediaItemType;
}
