import { NgIf } from '@angular/common';
import { Component, Input, type OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-filter-header',
  imports: [NgIf],
  templateUrl: './filter-header.component.html',
  styleUrls: ['./filter-header.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-5px)' }),
        animate(
          '150ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' }),
        ),
      ]),
      transition(':leave', [
        animate(
          '150ms ease-in',
          style({ opacity: 0, transform: 'translateX(-5px)' }),
        ),
      ]),
    ]),
  ],
})
export class FilterHeaderComponent implements OnInit {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() isActive: boolean = false;

  ngOnInit(): void {}
}
