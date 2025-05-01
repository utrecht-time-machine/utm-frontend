import { Component, Input } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  animations: [
    trigger('collapse', [
      transition(':enter', [
        style({ height: 0, opacity: 0, overflow: 'hidden' }),
        animate(
          '200ms cubic-bezier(0.4,0,0.2,1)',
          style({ height: '*', opacity: 1, overflow: 'hidden' })
        ),
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1, overflow: 'hidden' }),
        animate(
          '200ms cubic-bezier(0.4,0,0.2,1)',
          style({ height: 0, opacity: 0, overflow: 'hidden' })
        ),
      ]),
    ]),
  ],
})
export class FilterComponent {
  collapsed = true;
  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() maxHeight: string = '10rem';
  @Input() isActive: boolean = false;
}
