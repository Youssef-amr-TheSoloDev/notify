import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../icon/icon';

@Component({
    selector: 'app-mobile-nav-bar', standalone: true, imports: [RouterLink, RouterLinkActive, IconComponent],
    template: `<nav class="mobile-nav">@for (item of items; track item.path) { <a [routerLink]="item.path" routerLinkActive="active"><app-icon [name]="item.icon" /><span>{{ item.label }}</span></a> }</nav>`,
    styles: [`.mobile-nav { display:none; } @media(max-width:700px){.mobile-nav{position:fixed;display:flex;justify-content:space-around;align-items:center;bottom:0;left:0;right:0;height:70px;background:var(--color-surface);border-top:1px solid var(--color-border);z-index:10;padding:var(--space-compact) var(--space-1)}.mobile-nav a{display:flex;flex-direction:column;align-items:center;gap:var(--space-1);color:var(--color-control);text-decoration:none;font-size:9px;padding:var(--space-compact) var(--space-2);border-radius:8px}.mobile-nav a.active{color:var(--color-blue);background:var(--color-blue-soft);font-weight:600}}`],
})
export class MobileNavBarComponent { items = [{ path: '/dashboard', label: 'Dashboard', icon: 'dashboard' as const }, { path: '/notes', label: 'Notes', icon: 'notes' as const }, { path: '/tasks', label: 'Tasks', icon: 'tasks' as const }, { path: '/alerts', label: 'Alerts', icon: 'alerts' as const }, { path: '/about', label: 'About', icon: 'about' as const }]; }
