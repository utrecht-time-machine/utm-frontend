import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-route-toggle',
  standalone: true,
  templateUrl: './route-toggle.component.html',
  styleUrls: ['./route-toggle.component.scss'],
})
export class RouteToggleComponent {
  @Input() enabled = false;
  @Input() busy = false;
  @Input() shaking = false;
  @Input() variant: 'normal' | 'compact' = 'normal';
  @Output() toggleClick = new EventEmitter<void>();

  onClick(event: Event): void {
    event.preventDefault();
    this.toggleClick.emit();
  }
}
