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

  @Output() submit = new EventEmitter<{ gender: string }>();

  onSubmit(): void {
    console.log("What gender is set? " + this.gender)
    this.submit.emit({ gender: this.gender });
  }
}
