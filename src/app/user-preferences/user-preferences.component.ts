import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-user-preferences',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-preferences.component.html',
  styleUrl: './user-preferences.component.scss'
})
export class UserPreferencesComponent {
  gender: string = '';
  name: string = '';
  age: number = 0;
  story_type: string = '';
  fav_character: string = '';

  @Output() preferencesSubmit = new EventEmitter<{ gender: string; name: string; age: number; story_type: string; fav_character: string }>();

  onSubmit(): void {
    this.preferencesSubmit.emit({
      gender: this.gender,
      name: this.name,
      age: this.age,
      story_type: this.story_type,
      fav_character: this.fav_character
    });
  }
}
