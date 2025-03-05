import { NgIf } from '@angular/common';
import { Component, Input, type OnInit } from '@angular/core';

@Component({
  selector: 'app-filter-header',
  standalone: true,
  imports: [NgIf],
  templateUrl: './filter-header.component.html',
  styleUrls: ['./filter-header.component.scss'],
})
export class FilterHeaderComponent implements OnInit {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() isActive: boolean = false;

  ngOnInit(): void {}
}
