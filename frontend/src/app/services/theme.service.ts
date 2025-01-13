import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkModeSubject = new BehaviorSubject<boolean>(true);
  isDarkMode$ = this.isDarkModeSubject.asObservable();

  constructor() {
    // Initialize theme from local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkModeSubject.next(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      this.isDarkModeSubject.next(prefersDark);
    }
  }

  toggleTheme(): void {
    const newValue = !this.isDarkModeSubject.value;
    this.isDarkModeSubject.next(newValue);
    localStorage.setItem('theme', newValue ? 'dark' : 'light');

    // Update document body class
    if (newValue) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}
