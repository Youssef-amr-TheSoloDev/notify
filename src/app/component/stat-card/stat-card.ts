import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../icon/icon';
import { IconName } from '../../types/models';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `<article class="stat-card {{ tone() }}">
    <app-icon [name]="icon()" Size="2em" />
    <div class="number">{{ value() }}</div>
    <div class="label">{{ label() }}</div>
    <a [routerLink]="link()">View all <span>→</span></a>
  </article>`,
  styles: [
    `
      .stat-card {
        padding: var(--space-card) 13px var(--space-3);
        border-radius: 9px;
        min-height: 116px;
      }
      .stat-card.blue {
        background: var(--color-blue-soft);
        color: var(--color-blue);
      }
      .stat-card.green {
        background: var(--color-green-soft);
        color: var(--color-green);
      }
      .stat-card.purple {
        background: var(--color-purple-soft);
        color: var(--color-purple);
      }
      .stat-card.yellow {
        background: var(--color-yellow-soft);
        color: var(--color-yellow);
      }
      .number {
        color: var(--color-ink);
        font:
          700 20px 'Space Grotesk',
          sans-serif;
        margin-top: 8px;
      }
      .label {
        color: var(--color-body);
        font-size: 10px;
      }
      .stat-card a {
        display: block;
        color: inherit;
        font-size: 9px;
        text-decoration: none;
        margin-top: 10px;
      }
      .stat-card a span {
        font-size: 14px;
        margin-left: 3px;
      }
    `,
  ],
})
export class StatCardComponent {
  value = input.required<number>();
  label = input.required<string>();
  tone = input.required<string>();
  icon = input.required<IconName>();
  link = input('/dashboard');
}
