import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type LogLevel = 'log' | 'warn' | 'error';

export type DebugLogEntry = {
  timestamp: Date;
  level: LogLevel;
  source: string;
  message: string;
  data?: any;
};

@Injectable({
  providedIn: 'root',
})
export class DebugLogService {
  private readonly entries: DebugLogEntry[] = [];
  private readonly entrySubject = new Subject<DebugLogEntry>();

  public readonly entry$ = this.entrySubject.asObservable();

  public get logs(): ReadonlyArray<DebugLogEntry> {
    return this.entries;
  }

  log(source: string, message: string, data?: any): void {
    console.log(`[${source}] ${message}`, ...(data !== undefined ? [data] : []));
    this.push('log', source, message, data);
  }

  warn(source: string, message: string, data?: any): void {
    console.warn(`[${source}] ${message}`, ...(data !== undefined ? [data] : []));
    this.push('warn', source, message, data);
  }

  error(source: string, message: string, data?: any): void {
    console.error(`[${source}] ${message}`, ...(data !== undefined ? [data] : []));
    this.push('error', source, message, data);
  }

  clear(): void {
    this.entries.length = 0;
  }

  private push(level: LogLevel, source: string, message: string, data?: any): void {
    const entry: DebugLogEntry = { timestamp: new Date(), level, source, message, data };
    this.entries.push(entry);
    this.entrySubject.next(entry);
  }
}
