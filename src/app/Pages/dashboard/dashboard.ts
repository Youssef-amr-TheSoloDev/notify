import { Component, inject } from '@angular/core';
import { StatCardComponent } from '../../component/stat-card/stat-card';
import { IconComponent } from '../../component/icon/icon';
import { NotifyDataService } from '../../services/notify-data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StatCardComponent, IconComponent],
  template: `<section class="page dashboard">
    <header class="page-head">
      <div>
        <p class="eyebrow">{{ today }}</p>
        <h1>Dashboard</h1>
      </div>
      <div class="header-actions">
        <span class="greeting">{{ greeting }}</span>
        <app-icon name="sun" class="weather-icon" />
      </div>
    </header>

    <div class="stats">
      <app-stat-card
        [value]="data.notes().length"
        label="Notes"
        tone="blue"
        icon="notes"
        link="/notes"
      />
      <app-stat-card
        [value]="data.tasks().length"
        label="Tasks"
        tone="green"
        icon="tasks"
        link="/tasks"
      />
      <app-stat-card
        [value]="data.alerts().length"
        label="Alerts"
        tone="purple"
        icon="alerts"
        link="/alerts"
      />
      <app-stat-card
        [value]="dueSoonCount"
        label="Due Soon"
        tone="yellow"
        icon="clock"
        link="/tasks"
      />
    </div>

    <section class="panel summary">
      <div class="section-title">
        <div class="title-group">
          <app-icon name="chart" class="title-icon" />
          <h2>Quick Summary</h2>
        </div>
      </div>
      <div class="summary-grid">
        <div class="summary-item">
          <span class="summary-value">{{ completionRate }}%</span>
          <span class="summary-label">Completion Rate</span>
        </div>
        <div class="summary-item">
          <span class="summary-value">{{ totalItems }}</span>
          <span class="summary-label">Total Items</span>
        </div>
        <div class="summary-item">
          <span class="summary-value">{{ completedTasks }}</span>
          <span class="summary-label">Completed Tasks</span>
        </div>
        <div class="summary-item">
          <span class="summary-value">{{ pendingTasks }}</span>
          <span class="summary-label">Pending Tasks</span>
        </div>
      </div>
    </section>

    <section class="panel activity">
      <div class="section-title">
        <div class="title-group">
          <app-icon name="clock" class="title-icon" />
          <h2>Recent Activity</h2>
        </div>
      </div>

      @if (data.activities.length === 0) {
        <div class="empty-state">
          <app-icon name="inbox" Size="2em" />
          <p>No activity yet</p>
          <small>Start by creating a note, task, or alert</small>
        </div>
      } @else {
        @for (item of data.activities.slice(0, 5); track item.title) {
          <div class="activity-row">
            <span class="activity-icon {{ item.type }}">
              <app-icon
                [name]="item.type === 'note' ? 'notes' : item.type === 'task' ? 'tasks' : 'alerts'"
                Size="0.875em"
              />
            </span>
            <div class="activity-content">
              <strong>{{ item.title }}</strong>
              <small>{{ item.detail }}</small>
            </div>
            <div class="activity-right">
              <time>{{ item.age }}</time>
              <span class="tag {{ item.type }}">
                {{ item.type === 'note' ? 'Note' : item.type === 'task' ? 'Task' : 'Alert' }}
              </span>
            </div>
          </div>
        }
      }
    </section>
  </section>`,
  styles: [
    `
      .page {
        max-width: 1000px;
        margin: 0 auto;
        padding: var(--space-page-y) var(--space-page-x) 50px;
      }

      .page-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--color-divider);
      }

      .page-head h1 {
        font: 700 24px 'Space Grotesk', sans-serif;
        margin: 0;
        background: linear-gradient(135deg, var(--color-ink), var(--color-muted));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .eyebrow {
        color: var(--color-muted);
        font-size: 11px;
        margin: 0 0 4px;
        font-weight: 500;
        letter-spacing: 0.3px;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: var(--space-2);
      }

      .greeting {
        font-size: 12px;
        font-weight: 500;
        color: var(--color-muted);
      }

      .weather-icon {
        color: var(--color-yellow);
        font-size: 1.2em;
      }

      .stats {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: var(--space-3);
        margin-bottom: 20px;
      }

      .panel {
        background: var(--color-surface);
        border: 1px solid var(--color-border-soft);
        border-radius: 12px;
        box-shadow: 0 2px 12px var(--shadow-soft);
        transition: box-shadow 0.2s ease;
      }

      .panel:hover {
        box-shadow: 0 4px 20px var(--shadow-soft);
      }

      .summary {
        margin-top: 16px;
        padding: 20px;
      }

      .activity {
        margin-top: 16px;
        padding: 20px 20px 12px;
      }

      .section-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .title-group {
        display: flex;
        align-items: center;
        gap: var(--space-1);
      }

      .title-icon {
        color: var(--color-blue);
        font-size: 1em;
      }

      .section-title h2 {
        font: 600 14px 'Space Grotesk', sans-serif;
        margin: 0;
        color: var(--color-ink);
      }

      .activity-row {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        border-top: 1px solid var(--color-divider);
        padding: 12px 0;
        transition: background 0.15s ease;
      }

      .activity-row:hover {
        background: var(--color-bg-soft);
        margin: 0 -8px;
        padding: 12px 8px;
        border-radius: 6px;
      }

      .activity-icon {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
      }

      .activity-icon.note {
        background: var(--color-blue-pale);
        color: var(--color-blue);
      }

      .activity-icon.task {
        background: var(--color-green-soft);
        color: var(--color-green);
      }

      .activity-icon.alert {
        background: var(--color-purple-soft);
        color: var(--color-purple);
      }

      .activity-content {
        min-width: 0;
        flex: 1;
      }

      .activity-content strong {
        display: block;
        font-size: 12px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: var(--color-ink);
      }

      .activity-content small {
        display: block;
        color: var(--color-muted);
        font-size: 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .activity-right {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        flex-shrink: 0;
      }

      time {
        color: var(--color-muted);
        font-size: 10px;
        white-space: nowrap;
      }

      .tag {
        font-size: 9px;
        padding: 3px 10px;
        border-radius: 12px;
        font-weight: 500;
        letter-spacing: 0.2px;
        white-space: nowrap;
      }

      .tag.note {
        color: var(--color-blue);
        background: var(--color-blue-soft);
      }

      .tag.task {
        color: var(--color-green);
        background: var(--color-green-soft);
      }

      .tag.alert {
        color: var(--color-purple);
        background: var(--color-purple-soft);
      }

      .empty-state {
        text-align: center;
        padding: 30px 20px;
        color: var(--color-muted);
      }

      .empty-state app-icon {
        color: var(--color-border);
        margin-bottom: 8px;
      }

      .empty-state p {
        margin: 4px 0;
        font-weight: 500;
        font-size: 12px;
        color: var(--color-ink);
      }

      .empty-state small {
        font-size: 10px;
        color: var(--color-muted);
      }

      .summary-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: var(--space-3);
      }

      .summary-item {
        text-align: center;
        padding: 14px;
        background: var(--color-bg-soft);
        border-radius: 8px;
        border: 1px solid var(--color-border-soft);
        transition: transform 0.2s ease;
      }

      .summary-item:hover {
        transform: translateY(-2px);
      }

      .summary-value {
        display: block;
        font: 700 22px 'Space Grotesk', sans-serif;
        color: var(--color-ink);
        margin-bottom: 4px;
      }

      .summary-label {
        font-size: 10px;
        color: var(--color-muted);
        font-weight: 500;
      }

      @media (max-width: 768px) {
        .page {
          padding: var(--space-page-y) 14px;
        }

        .stats {
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .summary-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-2);
        }

        .activity-row {
          flex-wrap: wrap;
        }

        .activity-right {
          margin-left: auto;
        }

        .page-head {
          flex-direction: column;
          align-items: flex-start;
          gap: var(--space-2);
        }

        .header-actions {
          width: 100%;
          justify-content: space-between;
        }

        time {
          display: none;
        }
      }

      @media (max-width: 480px) {
        .stats {
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .summary-grid {
          grid-template-columns: 1fr;
        }

        .activity-content strong {
          font-size: 11px;
        }

        .tag {
          font-size: 8px;
          padding: 2px 8px;
        }
      }
    `,
  ],
})
export class DashboardPage {
  readonly data = inject(NotifyDataService);

  get today(): string {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  get dueSoonCount(): number {
    return this.data.tasks().filter(t => !t.completed).length || 0;
  }

  get completionRate(): number {
    const tasks = this.data.tasks();
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  }

  get totalItems(): number {
    return this.data.notes().length + this.data.tasks().length + this.data.alerts().length;
  }

  get completedTasks(): number {
    return this.data.tasks().filter(t => t.completed).length;
  }

  get pendingTasks(): number {
    return this.data.tasks().filter(t => !t.completed).length;
  }
}
