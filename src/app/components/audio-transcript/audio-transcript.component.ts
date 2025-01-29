import { NgFor, NgIf } from '@angular/common';
import { Component, Input, type OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-audio-transcript',
  standalone: true,
  imports: [NgIf, NgFor, TranslateModule, MatIconModule],
  templateUrl: './audio-transcript.component.html',
  styleUrls: ['./audio-transcript.component.css'],
})
export class AudioTranscriptComponent implements OnInit {
  @Input() transcript?: string;
  isVisible = false;

  ngOnInit(): void {}

  getTranscriptLines(): string[] {
    return this.transcript?.split('\n') ?? [];
  }

  toggleTranscript(): void {
    this.isVisible = !this.isVisible;
  }
}
