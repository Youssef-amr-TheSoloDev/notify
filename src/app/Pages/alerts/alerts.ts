import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../component/icon/icon';
import { NotifyDataService } from '../../services/notify-data.service';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [FormsModule, IconComponent],
  template: `<section class="page">
    <header class="page-head">
      <div>
        <p class="eyebrow">Stay on top of what matters</p>
        <h1>Alerts</h1>
      </div>
      <div class="header-actions">
        <span class="counter">{{ data.alerts().length }} alerts</span>
        <button class="primary" (click)="adding = !adding">
          <app-icon name="plus" />
          {{ adding ? 'Cancel' : 'Add Alert' }}
        </button>
      </div>
    </header>

    @if (adding) {
      <form class="composer" (ngSubmit)="add()">
        <div class="composer-fields">
          <input
            name="title"
            [(ngModel)]="title"
            placeholder="Alert title"
            required
            autofocus
          />
          <input
            name="date"
            type="datetime-local"
            [(ngModel)]="date"
          />
        </div>
        <div class="composer-actions">
          <button type="button" class="cancel-btn" (click)="adding = false">Cancel</button>
          <button class="primary" type="submit" aria-label="Save alert" title="Save alert">
            <app-icon name="check" /> Save Alert
          </button>
        </div>
      </form>
    }

    <div class="toolbar">
      <label>
        <span>⌕</span>
        <input [(ngModel)]="query" placeholder="Search alerts..." />
      </label>
    </div>

    @if (filteredAlerts().length === 0) {
      <div class="empty-state">
        <app-icon name="alerts" Size="3em" />
        <p>No alerts yet</p>
        <small>Create your first alert to stay on track</small>
      </div>
    } @else {
      <section class="panel">
        @for (alert of filteredAlerts(); track alert.id) {
          <div class="alert-row">
            @if (editingId === alert.id) {
              <form class="edit-form" (ngSubmit)="saveEdit(alert.id)">
                <input
                  name="editAlertTitle"
                  [(ngModel)]="editTitle"
                  required
                  placeholder="Alert title"
                />
                <input
                  name="editAlertDate"
                  type="datetime-local"
                  [(ngModel)]="editDate"
                />
                <div class="edit-actions">
                  <button type="submit" class="save-btn">
                    <app-icon name="check" Size="0.875em" /> Save
                  </button>
                  <button type="button" class="cancel-btn" (click)="cancelEdit()">
                    <app-icon name="x" Size="0.875em" /> Cancel
                  </button>
                </div>
              </form>
            } @else {
              <span class="alert-icon {{ alert.tone || 'purple' }}">
                <app-icon name="alerts" Size="1em" />
              </span>
              <div class="alert-content">
                <strong>{{ alert.title }}</strong>
                <small>{{ displayDate(alert.date) }}</small>
              </div>
              <div class="alert-actions">
                <button
                  class="trigger-btn"
                  [class.triggered]="triggered === alert.id"
                  (click)="triggerAlert(alert.id)"
                >
                  {{ triggered === alert.id ? '✓ Triggered' : 'Trigger' }}
                </button>
                <button class="edit-btn" (click)="startEdit(alert)" aria-label="Edit alert">
                  <app-icon name="edit" Size="0.875em" />
                </button>
                <button class="delete-btn" (click)="data.removeAlert(alert.id)" aria-label="Delete alert">
                  <app-icon name="trash" Size="0.875em" />
                </button>
              </div>
            }
          </div>
        }
      </section>
    }

    <div class="info">
      <app-icon name="about" />
      <span>When an alert time is reached, you'll see a notification. Alerts without a time will trigger immediately.</span>
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
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
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

      .header-actions {
        display: flex;
        align-items: center;
        gap: var(--space-3);
      }

      .counter {
        font-size: 11px;
        color: var(--color-muted);
        background: var(--color-surface);
        padding: 4px 12px;
        border-radius: 20px;
        border: 1px solid var(--color-border-soft);
      }

      .primary {
        background: var(--color-blue);
        color: var(--color-surface);
        border: 0;
        border-radius: 8px;
        padding: var(--space-2) var(--space-control-wide);
        font-size: 10px;
        font-weight: 500;
        display: flex;
        gap: var(--space-1);
        align-items: center;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 4px 12px var(--color-blue) 33;
      }

      .primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 20px var(--color-blue) 44;
      }

      .composer {
        background: var(--color-surface);
        border: 1px solid var(--color-border-soft);
        padding: var(--space-3);
        margin-top: 16px;
        margin-bottom: 22px;
        border-radius: 10px;
        box-shadow: 0 4px 16px var(--shadow-soft);
      }

      .composer-fields {
        display: flex;
        gap: var(--space-2);
        flex-wrap: wrap;
        margin-bottom: var(--space-2);
      }

      .composer-fields input {
        flex: 1;
        min-width: 160px;
        border: 1px solid var(--color-border-soft);
        border-radius: 6px;
        padding: 10px 12px;
        font-size: 11px;
        transition: border-color 0.2s ease;
        background: var(--color-surface);
        color: var(--color-ink);
      }

      .composer-fields input:focus {
        border-color: var(--color-blue);
        outline: none;
        box-shadow: 0 0 0 3px var(--color-blue-soft);
      }

      .composer-actions {
        display: flex;
        gap: var(--space-2);
        justify-content: flex-end;
      }

      .composer-actions .cancel-btn {
        background: none;
        border: 1px solid var(--color-border-soft);
        padding: 6px 16px;
        border-radius: 6px;
        font-size: 10px;
        color: var(--color-muted);
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .composer-actions .cancel-btn:hover {
        background: var(--color-bg-soft);
        border-color: var(--color-border);
      }

      .composer-actions .primary {
        padding: 6px 16px;
        font-size: 10px;
      }

      .toolbar {
        display: flex;
        gap: 7px;
        margin: 0 0 18px;
      }

      .toolbar label {
        display: flex;
        align-items: center;
        gap: var(--space-1);
        border: 1px solid var(--color-border);
        border-radius: 8px;
        background: var(--color-surface);
        padding: 0 12px;
        flex: 1;
        max-width: 300px;
        transition: border-color 0.2s ease;
      }

      .toolbar label:focus-within {
        border-color: var(--color-blue);
        box-shadow: 0 0 0 3px var(--color-blue-soft);
      }

      .toolbar label span {
        color: var(--color-muted);
        font-size: 12px;
      }

      .toolbar input {
        border: 0;
        outline: 0;
        padding: 9px 0;
        font-size: 10px;
        width: 100%;
        background: transparent;
        color: var(--color-ink);
      }

      .empty-state {
        text-align: center;
        padding: 50px 20px;
        background: var(--color-surface);
        border: 1px solid var(--color-border-soft);
        border-radius: 12px;
      }

      .empty-state app-icon {
        color: var(--color-border);
        margin-bottom: 12px;
        display: block;
      }

      .empty-state p {
        margin: 4px 0;
        font-weight: 600;
        font-size: 14px;
        color: var(--color-ink);
      }

      .empty-state small {
        font-size: 11px;
        color: var(--color-muted);
      }

      .panel {
        background: var(--color-surface);
        border: 1px solid var(--color-border-soft);
        border-radius: 12px;
        padding: 0 16px;
        box-shadow: 0 2px 12px var(--shadow-soft);
        transition: box-shadow 0.2s ease;
      }

      .panel:hover {
        box-shadow: 0 4px 20px var(--shadow-soft);
      }

      .alert-row {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-3) 0;
        border-bottom: 1px solid var(--color-divider);
        transition: background 0.15s ease;
      }

      .alert-row:last-child {
        border: 0;
      }

      .alert-row:hover {
        background: var(--color-bg-soft);
        margin: 0 -12px;
        padding: var(--space-3) 12px;
        border-radius: 6px;
      }

      .alert-icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        flex-shrink: 0;
      }

      .alert-icon.purple {
        background: var(--color-purple-soft);
        color: var(--color-purple);
      }

      .alert-icon.orange {
        background: var(--color-orange-soft);
        color: var(--color-orange);
      }

      .alert-icon.blue {
        background: var(--color-blue-pale);
        color: var(--color-blue);
      }

      .alert-icon.green {
        background: var(--color-green-soft);
        color: var(--color-green);
      }

      .alert-content {
        flex: 1;
        min-width: 0;
      }

      .alert-content strong {
        display: block;
        font-size: 12px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: var(--color-ink);
      }

      .alert-content small {
        display: block;
        font-size: 10px;
        color: var(--color-muted);
        margin-top: 2px;
      }

      .alert-actions {
        display: flex;
        align-items: center;
        gap: var(--space-1);
        flex-shrink: 0;
      }

      .trigger-btn {
        border: 1px solid var(--color-purple-soft);
        background: var(--color-purple-soft);
        color: var(--color-purple);
        border-radius: 8px;
        padding: 5px 12px;
        font-size: 9px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
      }

      .trigger-btn:hover {
        background: var(--color-purple);
        color: white;
        border-color: var(--color-purple);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px var(--color-purple) 33;
      }

      .trigger-btn.triggered {
        background: var(--color-green-soft);
        color: var(--color-green);
        border-color: var(--color-green);
      }

      .trigger-btn.triggered:hover {
        background: var(--color-green);
        color: white;
      }

      .edit-btn,
      .delete-btn {
        border: 0;
        background: none;
        color: var(--color-control);
        padding: 6px 8px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .edit-btn:hover {
        color: var(--color-blue);
        background: var(--color-blue-soft);
      }

      .delete-btn:hover {
        color: var(--color-red);
        background: var(--color-red-soft);
      }

      .edit-form {
        display: flex;
        gap: var(--space-2);
        align-items: center;
        width: 100%;
        flex-wrap: wrap;
      }

      .edit-form input {
        flex: 1;
        min-width: 120px;
        border: 1px solid var(--color-border-soft);
        border-radius: 6px;
        padding: 8px 10px;
        font-size: 11px;
        transition: border-color 0.2s ease;
        background: var(--color-surface);
        color: var(--color-ink);
      }

      .edit-form input:focus {
        border-color: var(--color-blue);
        outline: none;
        box-shadow: 0 0 0 3px var(--color-blue-soft);
      }

      .edit-actions {
        display: flex;
        gap: var(--space-1);
      }

      .edit-actions .save-btn {
        border: 0;
        background: var(--color-blue-soft);
        color: var(--color-blue);
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 10px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 4px;
        transition: all 0.2s ease;
      }

      .edit-actions .save-btn:hover {
        background: var(--color-blue);
        color: white;
      }

      .edit-actions .cancel-btn {
        border: 0;
        background: var(--color-bg-soft);
        color: var(--color-muted);
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 10px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 4px;
        transition: all 0.2s ease;
      }

      .edit-actions .cancel-btn:hover {
        background: var(--color-border-soft);
        color: var(--color-ink);
      }

      .info {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        background: var(--color-blue-soft);
        color: var(--color-blue);
        border-radius: 10px;
        font-size: 10px;
        padding: 14px 18px;
        margin-top: 18px;
        border: 1px solid var(--color-blue-pale);
        line-height: 1.5;
      }

      .info app-icon {
        margin-top: 1px;
        flex-shrink: 0;
      }

      @media (max-width: 768px) {
        .page {
          padding: var(--space-page-y) 14px;
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

        .composer-fields {
          flex-direction: column;
        }

        .composer-fields input {
          min-width: 0;
          width: 100%;
        }

        .composer-actions {
          flex-direction: column;
        }

        .composer-actions .primary,
        .composer-actions .cancel-btn {
          width: 100%;
          justify-content: center;
        }

        .alert-row {
          flex-wrap: wrap;
          gap: var(--space-2);
        }

        .alert-actions {
          margin-left: auto;
        }

        .edit-form {
          flex-direction: column;
          align-items: stretch;
        }

        .edit-form input {
          min-width: 0;
          width: 100%;
        }

        .edit-actions {
          justify-content: flex-end;
        }

        .toolbar label {
          max-width: 100%;
        }
      }

      @media (max-width: 480px) {
        .alert-actions {
          flex-wrap: wrap;
          gap: var(--space-1);
        }

        .trigger-btn {
          font-size: 8px;
          padding: 4px 10px;
        }

        .edit-btn,
        .delete-btn {
          padding: 4px 6px;
        }

        .counter {
          font-size: 10px;
          padding: 3px 10px;
        }
      }
    `,
  ],
})
export class AlertsPage {
  readonly data = inject(NotifyDataService);
  adding = false;
  title = '';
  date = '';
  query = '';
  triggered: number | null = null;
  editingId: number | null = null;
  editTitle = '';
  editDate = '';

  filteredAlerts = () =>
    this.data.alerts().filter((alert) =>
      alert.title.toLowerCase().includes(this.query.toLowerCase()),
    );

  add() {
    if (this.title.trim()) {
      this.data.addAlert(this.title.trim(), this.date || 'No scheduled time');
      this.title = '';
      this.date = '';
      this.adding = false;
    }
  }

  startEdit(alert: { id: number; title: string; date: string }) {
    this.editingId = alert.id;
    this.editTitle = alert.title;
    this.editDate = this.toInput(alert.date);
  }

  saveEdit(id: number) {
    if (this.editTitle.trim()) {
      this.data.updateAlert(id, this.editTitle.trim(), this.editDate || 'No scheduled time');
      this.cancelEdit();
    }
  }

  cancelEdit() {
    this.editingId = null;
    this.editTitle = '';
    this.editDate = '';
  }

  triggerAlert(id: number) {
    this.triggered = id;
    setTimeout(() => {
      this.triggered = null;
    }, 3000);
  }

  displayDate(value: string) {
    if (value === 'No scheduled time' || !value) return 'No scheduled time';
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  }

  private toInput(value: string) {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? ''
      : new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }
}
