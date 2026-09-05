import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../icon/icon';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent],
  template: `<aside class="nav-bar">
    <div class="brand">
      <span class="brand-mark"><app-icon name="alerts" Size="1.25em" /></span>
      <strong>Notify</strong>
    </div>

    <nav>
      @for (item of items; track item.path) {
        <a
          [routerLink]="item.path"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: item.path === '/dashboard' }"
        >
          <app-icon [name]="item.icon" Size="1.1em" />
          <span>{{ item.label }}</span>
        </a>
      }
    </nav>
  </aside>`,
  styles: [`
    .nav-bar {
      position: fixed;
      inset: 0 auto 0 0;
      width: 220px;
      padding: 24px 16px;
      background: var(--color-surface);
      border-right: 1px solid var(--color-border-soft);
      z-index: 5;
      display: flex;
      flex-direction: column;
      box-shadow: 2px 0 12px var(--shadow-soft);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: 0 10px 28px;
      font: 700 18px 'Space Grotesk', sans-serif;
      color: var(--color-ink);
      border-bottom: 1px solid var(--color-divider);
      margin-bottom: 4px;
    }

    .brand-mark {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-blue);
      background: var(--color-blue-soft);
      padding: 4px;
      border-radius: 8px;
    }

    nav {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
    }

    nav a {
      display: flex;
      align-items: center;
      gap: var(--space-control);
      height: 40px;
      padding: 0 12px;
      border-radius: 10px;
      color: var(--color-body);
      font-size: 13px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.15s ease;
    }

    nav a:hover {
      background: var(--color-bg-soft);
      color: var(--color-ink);
    }

    nav a.active {
      color: var(--color-blue);
      background: var(--color-blue-soft);
      font-weight: 600;
      box-shadow: 0 2px 8px var(--color-blue) 22;
    }

    nav a.active app-icon {
      color: var(--color-blue);
    }

    nav a app-icon {
      color: var(--color-control);
      flex-shrink: 0;
    }

    nav a.active app-icon {
      color: var(--color-blue);
    }

    @media (max-width: 768px) {
      .nav-bar {
        display: none;
      }
    }
  `],
})
export class NavBarComponent {
  readonly theme = inject(ThemeService);

  items = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' as const },
    { path: '/notes', label: 'Notes', icon: 'notes' as const },
    { path: '/tasks', label: 'Tasks', icon: 'tasks' as const },
    { path: '/alerts', label: 'Alerts', icon: 'alerts' as const },
    { path: '/about', label: 'About', icon: 'about' as const }
  ];
}
