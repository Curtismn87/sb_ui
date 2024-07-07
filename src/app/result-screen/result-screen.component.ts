import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-result-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result-screen.component.html',
  styleUrls: ['./result-screen.component.scss']
})
export class ResultScreenComponent {
  @Input() message: string | null = null;
  @Input() audioSrc: string | null = null;
  @Input() isPlaying: boolean = false;
  @Output() regenerate = new EventEmitter<void>();

  audio: HTMLAudioElement | null = null;

  playPauseAudio(): void {
    if (this.audio) {
      if (this.isPlaying) {
        this.audio.pause();
      } else {
        this.audio.play();
      }
      this.isPlaying = !this.isPlaying;
    } else if (this.audioSrc) {
      this.audio = new Audio(this.audioSrc);
      this.audio.play();
      this.isPlaying = true;
    }
  }

  onRegenerate(): void {
    this.regenerate.emit();
  }
}
