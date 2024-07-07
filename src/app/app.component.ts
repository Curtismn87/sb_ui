import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputFormComponent } from './input-form/input-form.component';
import { ResultScreenComponent } from './result-screen/result-screen.component';
import { UserPreferencesComponent } from './user-preferences/user-preferences.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, FormsModule, CommonModule, InputFormComponent, ResultScreenComponent, UserPreferencesComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sb_ui';
  message: string | null = null;
  loading: boolean = false;
  audioSrc: string | null = null;
  audio: HTMLAudioElement | null = null;
  isPlaying: boolean = false;
  isAudioGenerated: boolean = false; 
  currentScreen: 'preferences' | 'input' | 'result' = 'preferences';
  user_prefs: { gender: string } | null = null;



  constructor(private http: HttpClient) {}

  async fetchMessage(data: { name: string; age: number }): Promise<void> {
    console.log('Current preferences:', this.user_prefs); // For debugging
    const url = `/.netlify/functions/generate-text`;
    const body = { name: data.name, age: data.age, gender: this.user_prefs?.gender || 'child'};
    console.log('Sending to server:', body); 

    this.loading = true;
    try {
      const response = await this.http.post<any>(url, body).toPromise();
      this.message = response.message;
      await this.generateSpeech(response.message);
      this.currentScreen = 'result';
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
      const response = await this.http.post<{ audioContent: string }>(url, body).toPromise();
      if (response && response.audioContent) {
        const byteCharacters = atob(response.audioContent);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'audio/mp3' });
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

  setPreferences(prefs: { gender: string }): void {
    if (prefs instanceof SubmitEvent) {
      // If it's a SubmitEvent, we don't want to set it as preferences
      console.log('Received SubmitEvent, ignoring');
      return;
    }
    
    this.user_prefs = prefs;
    console.log('Preferences set:', this.user_prefs);
    this.currentScreen = 'input';
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

  regenerateStory(): void {
    this.message = null;
    this.audioSrc = null;
    this.isPlaying = false;
    this.currentScreen = 'preferences'; // Go back to preferences screen
    this.user_prefs = null; // Reset preferences
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }
  
} // end export
