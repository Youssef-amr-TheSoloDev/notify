import { Component } from '@angular/core';
import { IconComponent } from '../../component/icon/icon';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [IconComponent],
  template: `<section class="page">
    <header class="page-head">
      <div>
        <p class="eyebrow">A little more about the app</p>
        <h1>About</h1>
      </div>
    </header>

    <div class="about-grid">
      <article class="about-card main-card">
        <div class="logo-container">
          <div class="logo">
            <app-icon name="alerts" Size="2em" />
          </div>
        </div>
        <div class="about-content">
          <h2>Notify</h2>
          <p class="version">Version 1.4.0</p>
          <p class="description">
            A simple and clean productivity tool to organize your notes, tasks, and alerts.
            Stay on top of what matters with a distraction-free experience.
          </p>
          <div class="divider"></div>
          <div class="credit">
            <strong>Made by Youssef Amr &amp; Team 5</strong>
            <small>© 2026 All rights reserved.</small>
          </div>
        </div>
      </article>

      <article class="about-card features-card">
        <h3>Features</h3>
        <div class="features-grid">
          <div class="feature-item">
            <app-icon name="notes" Size="1.25em" />
            <span>Notes</span>
          </div>
          <div class="feature-item">
            <app-icon name="tasks" Size="1.25em" />
            <span>Tasks</span>
          </div>
          <div class="feature-item">
            <app-icon name="alerts" Size="1.25em" />
            <span>Alerts</span>
          </div>
          <div class="feature-item">
            <app-icon name="clock" Size="1.25em" />
            <span>Reminders</span>
          </div>
        </div>
      </article>

      <article class="about-card tech-card">
        <h3>Tech Stack</h3>
        <div class="tech-tags">
          <span class="tag">Angular 17</span>
          <span class="tag">TypeScript</span>
          <span class="tag">SCSS</span>
          <span class="tag">FontAwesome</span>
          <span class="tag">Space Grotesk</span>
          <span class="tag">Manrope</span>
        </div>
      </article>
    </div>
  </section>`,
  styles: [
    `
      .page {
        max-width: 1000px;
        margin: auto;
        padding: var(--space-page-y) var(--space-page-x) 50px;
      }

      .page-head {
        margin-bottom: 30px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--color-divider);
      }

      .eyebrow {
        font-size: 11px;
        color: var(--color-muted);
        margin: 0 0 4px;
        font-weight: 500;
        letter-spacing: 0.3px;
      }

      .page-head h1 {
        font: 700 24px 'Space Grotesk', sans-serif;
        margin: 0;
        background: linear-gradient(135deg, var(--color-ink), var(--color-muted));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .about-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: var(--space-3);
        max-width: 800px;
        margin: 0 auto;
      }

      .about-card {
        background: var(--color-surface);
        border: 1px solid var(--color-border-soft);
        border-radius: 12px;
        padding: 28px;
        box-shadow: 0 2px 12px var(--shadow-soft);
      }

      .main-card {
        grid-row: span 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .logo-container {
        margin-bottom: 20px;
      }

      .logo {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: linear-gradient(135deg, var(--color-blue-pale), var(--color-blue-soft));
        color: var(--color-blue);
        font-size: 34px;
        border: 2px solid var(--color-blue-soft);
      }

      .about-content {
        width: 100%;
      }

      .about-content h2 {
        font: 700 22px 'Space Grotesk', sans-serif;
        margin: 0 0 4px;
        color: var(--color-ink);
      }

      .version {
        color: var(--color-muted);
        font-size: 10px;
        margin: 0 0 12px;
        font-weight: 500;
      }

      .description {
        font-size: 11px;
        line-height: 1.7;
        color: var(--color-body);
        margin: 0 0 16px;
      }

      .divider {
        height: 1px;
        background: var(--color-divider);
        margin: 16px 0;
      }

      .credit {
        margin-top: 4px;
      }

      .credit strong {
        display: block;
        font-size: 13px;
        font-weight: 700;
        color: var(--color-ink);
        margin-bottom: 4px;
      }

      .credit strong::before {
        content: '❤️ ';
        color: var(--color-red);
      }

      .credit small {
        display: block;
        color: var(--color-muted);
        font-size: 9px;
      }

      .features-card,
      .tech-card {
        grid-column: 2;
      }

      .features-card h3,
      .tech-card h3 {
        font: 600 13px 'Space Grotesk', sans-serif;
        margin: 0 0 14px;
        color: var(--color-ink);
        text-align: center;
      }

      .features-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-2);
      }

      .feature-item {
        display: flex;
        align-items: center;
        gap: var(--space-1);
        padding: 8px 12px;
        background: var(--color-bg-soft);
        border-radius: 8px;
        border: 1px solid var(--color-border-soft);
        font-size: 10px;
        color: var(--color-body);
        font-weight: 500;
      }

      .feature-item app-icon {
        color: var(--color-blue);
      }

      .tech-tags {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-1);
        justify-content: center;
      }

      .tag {
        font-size: 9px;
        padding: 4px 12px;
        background: var(--color-bg-soft);
        border: 1px solid var(--color-border-soft);
        border-radius: 20px;
        color: var(--color-body);
        font-weight: 500;
      }

      @media (max-width: 768px) {
        .page {
          padding: var(--space-page-y) 14px;
        }

        .about-grid {
          grid-template-columns: 1fr;
          gap: var(--space-3);
        }

        .main-card {
          grid-row: span 1;
        }

        .features-card,
        .tech-card {
          grid-column: 1;
        }

        .features-grid {
          grid-template-columns: 1fr 1fr;
        }

        .logo {
          width: 70px;
          height: 70px;
          font-size: 28px;
        }

        .about-card {
          padding: 20px;
        }

        .about-content h2 {
          font-size: 20px;
        }
      }

      @media (max-width: 480px) {
        .features-grid {
          grid-template-columns: 1fr;
        }

        .logo {
          width: 60px;
          height: 60px;
          font-size: 24px;
        }

        .about-content h2 {
          font-size: 18px;
        }

        .description {
          font-size: 10px;
        }

        .credit strong {
          font-size: 12px;
        }

        .tag {
          font-size: 8px;
          padding: 3px 10px;
        }
      }
    `,
  ],
})
export class AboutPage { }
