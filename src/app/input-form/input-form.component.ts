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
  name: string = '';
  age: number = 0;

  @Output() submit = new EventEmitter<{ name: string; age: number }>();

  onSubmit(): void {
    this.submit.emit({ name: this.name, age: this.age });
  }
}
