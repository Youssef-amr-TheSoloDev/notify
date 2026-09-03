import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../icon/icon';
import { ThemeService } from '../../services/theme.service';

@Component({
    selector: 'app-nav-bar', standalone: true, imports: [RouterLink, RouterLinkActive, IconComponent],
    template: `<aside class="nav-bar">
    <div class="brand"><span class="brand-mark"><app-icon name="alerts" /></span><strong>Notify</strong></div>
    <nav>
      @for (item of items; track item.path) { <a [routerLink]="item.path" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: item.path === '/dashboard' }"><app-icon [name]="item.icon" /><span>{{ item.label }}</span></a> }
    </nav>
    <button class="mode" type="button" (click)="theme.toggle()"><app-icon [name]="theme.dark() ? 'sun' : 'moon'" />{{ theme.dark() ? 'Light Mode' : 'Dark Mode' }}</button>
  </aside>`,
    styles: [`.nav-bar { position: fixed; inset: 0 auto 0 0; width: 188px; padding: 20px 12px; background: var(--color-surface); border-right: 1px solid var(--color-border); z-index: 5; display: flex; flex-direction: column; } .brand { display:flex; align-items:center; gap:var(--space-2); padding: 0 10px 24px; font: 700 16px 'Space Grotesk', sans-serif; } .brand-mark { color:var(--color-blue); font-size:20px; } nav { display:grid; gap:var(--space-1); } nav a { display:flex; align-items:center; gap:var(--space-control); height:40px; padding:0 10px; border-radius:8px; color:var(--color-body); font-size:12px; text-decoration:none; } nav a.active { color:var(--color-blue); background:var(--color-blue-soft); font-weight:600; } .mode { margin-top:auto; border:0; background:none; color:var(--color-body); display:flex; align-items:center; gap:9px; font-size:11px; padding:var(--space-control); } @media(max-width:700px){.nav-bar{display:none}}`],
})
export class NavBarComponent {
    readonly theme = inject(ThemeService);
    items = [{ path: '/dashboard', label: 'Dashboard', icon: 'dashboard' as const }, { path: '/notes', label: 'Notes', icon: 'notes' as const }, { path: '/tasks', label: 'Tasks', icon: 'tasks' as const }, { path: '/alerts', label: 'Alerts', icon: 'alerts' as const }, { path: '/about', label: 'About', icon: 'about' as const }];
}
