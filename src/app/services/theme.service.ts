import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    readonly dark = signal(localStorage.getItem('notify-theme') === 'dark');
    toggle() { const next = !this.dark(); this.dark.set(next); localStorage.setItem('notify-theme', next ? 'dark' : 'light'); }
}
