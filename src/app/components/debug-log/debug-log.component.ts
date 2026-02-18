import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DebugLogEntry, DebugLogService } from '../../services/debug-log.service';

@Component({
  selector: 'app-debug-log',
  imports: [CommonModule],
  templateUrl: './debug-log.component.html',
  styleUrls: ['./debug-log.component.scss'],
})
export class DebugLogComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  entries: DebugLogEntry[] = [];
  expandedIndices = new Set<number>();

  constructor(private debugLog: DebugLogService) {}

  ngOnInit(): void {
    this.entries = [...this.debugLog.logs];

    this.debugLog.entry$.pipe(takeUntil(this.destroy$)).subscribe(entry => {
      this.entries = [...this.entries, entry];
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  clear(): void {
    this.debugLog.clear();
    this.entries = [];
  }

  trackByIndex(index: number): number {
    return index;
  }

  toggleData(index: number): void {
    if (this.expandedIndices.has(index)) {
      this.expandedIndices.delete(index);
    } else {
      this.expandedIndices.add(index);
    }
  }

  isExpanded(index: number): boolean {
    return this.expandedIndices.has(index);
  }
}
