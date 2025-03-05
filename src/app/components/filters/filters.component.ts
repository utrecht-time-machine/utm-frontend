import { Component } from '@angular/core';
import { TimeService } from '../../services/time.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent {
  constructor(public time: TimeService) {}

  getBlurStyle$ = this.time.isSliding.pipe(
    map((isSliding) => ({
      background: `rgba(255, 255, 255, ${isSliding ? 0.6 : 0.85})`,
      'backdrop-filter': `blur(${isSliding ? 0 : 16}px)`,
    }))
  );
}
