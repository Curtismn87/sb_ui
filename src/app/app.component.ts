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
  loading: boolean = false;
  audioSrc: string | undefined;
  audio: HTMLAudioElement | null = null;
  isPlaying: boolean = false;



  constructor(private http: HttpClient) {}

  async fetchMessage(): Promise<void> {
    const url = `/.netlify/functions/generate-text`;
    const body = { name: this.name };
    this.loading = true;
    try {
      const response = await this.http.post<any>(url, body).toPromise();
      this.message = response.message;
      await this.generateSpeech(response.message);
    } catch (error) {
      console.error('Error fetching message', error);
      this.message = 'Failed to fetch message.';
    } finally {
      this.loading = false;
    }
  }

  async generateSpeech(text: string): Promise<void> {
    const url = `/.netlify/functions/text-to-speech`;
    const body = { text };
    this.loading = true;
    try {
      const response = await this.http.post<{audioContent: string}>(url, body).toPromise();
      if (response && response.audioContent) {
        // Create a Blob from the base64 encoded audio content
        const byteCharacters = atob(response.audioContent);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'audio/mp3' });
        
        // Create a URL for the Blob
        this.audioSrc = URL.createObjectURL(blob);
        this.audio = new Audio(this.audioSrc);
      } else {
        throw new Error('Received invalid response from the server');
      }
    } catch (error) {
      console.error('Error generating speech', error);
      this.message = 'Failed to generate speech.';
    } finally {
      this.loading = false;
    }

  }

  playAudio(): void {
    if (this.audio) {
      if (this.isPlaying) {
        this.audio.pause();
      } else {
        this.audio.play();
      }
      this.isPlaying = !this.isPlaying;
    }
  }
  


} // end export