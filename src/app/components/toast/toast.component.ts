import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit, OnDestroy {
  message: string | null = null;
  hiding = false;
  private _sub: Subscription | undefined;
  private _showTimer: ReturnType<typeof setTimeout> | undefined;
  private _hideTimer: ReturnType<typeof setTimeout> | undefined;

  constructor(private toast: ToastService) {}

  ngOnInit(): void {
    this._sub = this.toast.message$.subscribe(msg => {
      clearTimeout(this._showTimer);
      clearTimeout(this._hideTimer);
      this.hiding = false;
      this.message = msg;
      this._showTimer = setTimeout(() => {
        this.hiding = true;
        this._hideTimer = setTimeout(() => (this.message = null), 300);
      }, 3000);
    });
  }

  ngOnDestroy(): void {
    this._sub?.unsubscribe();
    clearTimeout(this._showTimer);
    clearTimeout(this._hideTimer);
  }
}
