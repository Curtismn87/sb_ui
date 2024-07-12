import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.scss']
})
export class InputFormComponent {
  learning_pref: string = '';
  story_length: number = 0;

  @Output() storySubmit = new EventEmitter<{ learning_pref: string; story_length: number }>();

  onSubmit(): void {
    console.log("storySubmit: " + this.learning_pref + " " + this.story_length)
    this.storySubmit.emit({ learning_pref: this.learning_pref, story_length: this.story_length });
  }
}
