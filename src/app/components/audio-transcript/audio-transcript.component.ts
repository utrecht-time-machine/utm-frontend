import { NgFor, NgIf } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-audio-transcript',
  standalone: true,
  imports: [NgIf, NgFor, TranslateModule, MatIconModule],
  templateUrl: './audio-transcript.component.html',
  styleUrls: ['./audio-transcript.component.css'],
})
export class AudioTranscriptComponent implements OnChanges {
  @Input() transcript?: string;
  isVisible = false;

  @ViewChild('transcriptContent')
  transcriptContent?: ElementRef<HTMLDivElement>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transcript'] && !changes['transcript'].firstChange) {
      setTimeout(() => {
        this._scrollToTop();
      });
    }
  }

  private _scrollToTop(): void {
    if (this.transcriptContent) {
      this.transcriptContent.nativeElement.scrollTop = 0;
    }
  }

  getTranscriptLines(): string[] {
    return this.transcript?.split('\n') ?? [];
  }

  toggleTranscript(): void {
    this.isVisible = !this.isVisible;
  }
}
