import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sb_ui';
  name: string = '';
  message: string | null = null;

  constructor(private http: HttpClient) {}

  async fetchMessage(): Promise<void> {
    const url = `/.netlify/functions/generate-text`;
    const body = { name: this.name };
    try {
      const response = await this.http.post<any>(url, body).toPromise();
      this.message = response.message;
    } catch (error) {
      console.error('Error fetching message', error);
      this.message = 'Failed to fetch message.';
    }
  }


} // end export