import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode: WritableSignal<boolean> = signal(false);

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode.set(savedTheme === 'dark');
    }
  }

  toggleTheme() {
    this.isDarkMode.update(value => !value);

    localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
  }
}