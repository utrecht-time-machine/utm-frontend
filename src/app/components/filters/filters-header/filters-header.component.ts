import { AsyncPipe, NgIf } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-filters-header',
  standalone: true,
  imports: [NgIf, AsyncPipe],
  templateUrl: './filters-header.component.html',
  styleUrls: ['./filters-header.component.scss'],
})
export class FiltersHeaderComponent implements OnInit {
  constructor(public filters: FilterService) {}

  ngOnInit(): void {}

  onClose($event: MouseEvent) {
    $event.stopPropagation();
    this.filters.hide();
  }
}
