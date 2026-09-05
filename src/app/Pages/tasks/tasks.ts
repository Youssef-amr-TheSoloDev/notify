import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../component/icon/icon';
import { NotifyDataService } from '../../services/notify-data.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [FormsModule, IconComponent],
  template: `<section class="page">
    <header class="page-head">
      <div>
        <p class="eyebrow">Make progress, one step at a time</p>
        <h1>Tasks</h1>
      </div>
      <div class="header-actions">
        <span class="counter">{{ getTaskCount() }}</span>
        <button class="primary" (click)="adding = !adding">
          <app-icon name="plus" />
          {{ adding ? 'Cancel' : 'Add Task' }}
        </button>
      </div>
    </header>

    @if (adding) {
      <form class="composer" (ngSubmit)="add()">
        <div class="composer-fields">
          <input
            name="title"
            [(ngModel)]="title"
            placeholder="What needs doing?"
            required
            autofocus
          />
          <input
            name="due"
            type="datetime-local"
            [(ngModel)]="due"
            placeholder="Due date"
          />
          <select required [(ngModel)]="priority" name="priority">
            <option value="">Select Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div class="composer-actions">
          <button type="button" class="cancel-btn" (click)="adding = false">Cancel</button>
          <button class="primary" type="submit" aria-label="Save task" title="Save task">
            <app-icon name="check" /> Add Task
          </button>
        </div>
      </form>
    }

    <div class="toolbar">
      <label>
        <span>⌕</span>
        <input [(ngModel)]="query" placeholder="Search tasks..." />
      </label>
    </div>

    <div class="tabs">
      <button [class.selected]="filter === 'all'" (click)="filter = 'all'">
        All <span class="badge">{{ getCountByStatus('all') }}</span>
      </button>
      <button [class.selected]="filter === 'pending'" (click)="filter = 'pending'">
        Pending <span class="badge">{{ getCountByStatus('pending') }}</span>
      </button>
      <button [class.selected]="filter === 'completed'" (click)="filter = 'completed'">
        Completed <span class="badge">{{ getCountByStatus('completed') }}</span>
      </button>
      <button [class.selected]="filter === 'low'" (click)="filter = 'low'">
        Low <span class="badge">{{ getCountByStatus('low') }}</span>
      </button>
      <button [class.selected]="filter === 'medium'" (click)="filter = 'medium'">
        Medium <span class="badge">{{ getCountByStatus('medium') }}</span>
      </button>
      <button [class.selected]="filter === 'high'" (click)="filter = 'high'">
        High <span class="badge">{{ getCountByStatus('high') }}</span>
      </button>
      <div class="sort-group">
        <label>
          Sort by
          <select [(ngModel)]="sort" name="sort">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="title">Title</option>
          </select>
        </label>
      </div>
    </div>

    @if (visibleTasks().length === 0) {
      <div class="empty-state">
        <app-icon name="tasks" Size="3em" />
        <p>No tasks {{ filter !== 'all' ? 'in this category' : 'yet' }}</p>
        <small>{{ filter !== 'all' ? 'Try changing your filter' : 'Create your first task to get started' }}</small>
      </div>
    } @else {
      <section class="panel">
        @for (task of visibleTasks(); track task.id) {
          <div class="task">
            @if (editingId === task.id) {
              <form class="edit-form" (ngSubmit)="saveEdit(task.id)">
                <input
                  name="editTaskTitle"
                  [(ngModel)]="editTitle"
                  required
                  placeholder="Task title"
                />
                <input
                  name="editTaskDue"
                  type="datetime-local"
                  [(ngModel)]="editDue"
                />
                <select required [(ngModel)]="priority" name="priority">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
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
              <button
                class="check"
                [class.done]="task.completed"
                (click)="data.toggleTask(task.id)"
                aria-label="Toggle task completion"
              >
                @if (task.completed) {
                  ✓
                }
              </button>
              <div class="task-content">
                <strong [class.strike]="task.completed">{{ task.title }}</strong>
                <small>{{ displayDate(task.due) }}</small>
              </div>
              <span class="priority priority-{{ task.Priority.toLowerCase() }}">
                {{ task.Priority }}
              </span>
              <span class="status" [class.completed]="task.completed">
                {{ task.completed ? 'Done' : 'Pending' }}
              </span>
              <div class="task-actions">
                <button class="edit-btn" (click)="startEdit(task)" aria-label="Edit task">
                  <app-icon name="edit" Size="2em" />
                </button>
                <button class="delete-btn" (click)="data.removeTask(task.id)" aria-label="Delete task">
                  <app-icon name="trash" Size="2em" />
                </button>
              </div>
            }
          </div>
        }
      </section>
    }
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
        padding: 4px 14px;
        border-radius: 20px;
        border: 1px solid var(--color-border-soft);
        white-space: nowrap;
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

      .composer-fields input,
      .composer-fields select {
        flex: 1;
        min-width: 140px;
        border: 1px solid var(--color-border-soft);
        border-radius: 6px;
        padding: 10px 12px;
        font-size: 11px;
        transition: border-color 0.2s ease;
        background: var(--color-surface);
        color: var(--color-ink);
      }

      .composer-fields input:focus,
      .composer-fields select:focus {
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

      .tabs {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        padding: 0 0 16px;
        font-size: 10px;
        color: var(--color-control);
        flex-wrap: wrap;
        border-bottom: 1px solid var(--color-divider);
        margin-bottom: 16px;
      }

      .tabs button {
        border: 0;
        background: none;
        padding: 6px 12px;
        color: var(--color-control);
        display: flex;
        align-items: center;
        gap: 6px;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 10px;
        font-weight: 500;
      }

      .tabs button:hover {
        background: var(--color-bg-soft);
      }

      .tabs .selected {
        color: var(--color-blue);
        background: var(--color-blue-soft);
      }

      .badge {
        background: var(--color-border-soft);
        color: var(--color-control);
        padding: 1px 8px;
        border-radius: 12px;
        font-size: 8px;
        font-weight: 600;
        min-width: 18px;
        text-align: center;
        transition: all 0.2s ease;
      }

      button.selected .badge {
        background: var(--color-blue-pale);
        color: var(--color-blue);
      }

      .sort-group {
        margin-left: auto;
      }

      .sort-group label {
        display: flex;
        align-items: center;
        gap: var(--space-1);
        font-size: 10px;
        color: var(--color-muted);
      }

      .sort-group select {
        border: 1px solid var(--color-border-soft);
        background: var(--color-surface);
        border-radius: 6px;
        padding: 4px 8px;
        font-size: 10px;
        color: var(--color-ink);
        cursor: pointer;
      }

      .sort-group select:focus {
        border-color: var(--color-blue);
        outline: none;
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

      .task {
        min-height: 52px;
        display: grid;
        grid-template-columns: 28px 1fr auto auto auto;
        align-items: center;
        gap: var(--space-3);
        border-bottom: 1px solid var(--color-divider);
        font-size: 10px;
        padding: var(--space-2) 0;
        transition: background 0.15s ease;
      }

      .task:last-child {
        border: 0;
      }

      .task:hover {
        background: var(--color-bg-soft);
        margin: 0 -12px;
        padding: var(--space-2) 12px;
        border-radius: 6px;
      }

      .check {
        width: 20px;
        height: 20px;
        padding: 0;
        border: 2px solid var(--color-border);
        background: var(--color-surface);
        border-radius: 6px;
        color: var(--color-surface);
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .check:hover {
        border-color: var(--color-blue);
        background: var(--color-blue-soft);
      }

      .check.done {
        background: var(--color-green);
        border-color: var(--color-green);
        color: white;
      }

      .check.done:hover {
        background: var(--color-green-dark);
        border-color: var(--color-green-dark);
      }

      .task-content {
        flex: 1;
        min-width: 0;
      }

      .task-content strong {
        display: block;
        font-size: 12px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: var(--color-ink);
      }

      .task-content strong.strike {
        text-decoration: line-through;
        color: var(--color-muted);
      }

      .task-content small {
        display: block;
        color: var(--color-muted);
        font-size: 9px;
        margin-top: 2px;
      }

      .priority {
        font-size: 8px;
        padding: 3px 10px;
        border-radius: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        white-space: nowrap;
      }

      .priority-low {
        background: var(--color-green-soft);
        color: var(--color-green);
      }

      .priority-medium {
        background: var(--color-yellow-soft);
        color: #b87a00;
      }

      .priority-high {
        background: var(--color-red-soft);
        color: var(--color-red);
      }

      .status {
        font-size: 9px;
        padding: 3px 10px;
        border-radius: 12px;
        font-weight: 500;
        white-space: nowrap;
        background: var(--color-yellow-soft);
        color: #b87a00;
      }

      .status.completed {
        background: var(--color-green-pale);
        color: var(--color-green);
      }

      .task-actions {
        display: flex;
        gap: 2px;
        flex-shrink: 0;
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
        grid-column: 1/-1;
        display: flex;
        gap: var(--space-2);
        align-items: center;
        padding: var(--space-2) 0;
        flex-wrap: wrap;
        width: 100%;
      }

      .edit-form input,
      .edit-form select {
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

      .edit-form input:focus,
      .edit-form select:focus {
        border-color: var(--color-blue);
        outline: none;
        box-shadow: 0 0 0 3px var(--color-blue-soft);
      }

      .edit-actions {
        display: flex;
        gap: var(--space-1);
        flex-shrink: 0;
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

        .composer-fields input,
        .composer-fields select {
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

        .task {
          grid-template-columns: 28px 1fr auto;
          gap: var(--space-2);
        }

        .task-content small,
        .status {
          display: none;
        }

        .tabs {
          gap: var(--space-1);
          justify-content: center;
        }

        .tabs button {
          padding: 4px 10px;
          font-size: 9px;
        }

        .sort-group {
          margin-left: 0;
          width: 100%;
        }

        .sort-group label {
          width: 100%;
          justify-content: space-between;
        }

        .edit-form {
          flex-direction: column;
          align-items: stretch;
        }

        .edit-form input,
        .edit-form select {
          min-width: 0;
          width: 100%;
        }

        .edit-actions {
          justify-content: flex-end;
        }

        .toolbar label {
          max-width: 100%;
        }

        .counter {
          font-size: 10px;
          padding: 3px 10px;
        }
      }

      @media (max-width: 480px) {
        .task {
          grid-template-columns: 24px 1fr auto;
          gap: var(--space-2);
        }

        .priority {
          font-size: 7px;
          padding: 2px 8px;
        }

        .check {
          width: 18px;
          height: 18px;
          font-size: 10px;
        }

        .task-content strong {
          font-size: 11px;
        }

        .tabs button {
          font-size: 8px;
          padding: 3px 8px;
        }

        .badge {
          font-size: 7px;
          padding: 1px 6px;
          min-width: 14px;
        }
      }
    `,
  ],
})
export class TasksPage {
  readonly data = inject(NotifyDataService);
  title = '';
  due = '';
  priority = '';
  query = '';
  adding = false;
  filter: 'all' | 'pending' | 'completed' | 'low' | 'medium' | 'high' = 'all';
  sort: 'newest' | 'oldest' | 'title' = 'newest';
  editingId: number | null = null;
  editTitle = '';
  editDue = '';

  visibleTasks = () => {
    let tasks = this.data.tasks();

    // Filter by search query
    if (this.query.trim()) {
      tasks = tasks.filter(task =>
        task.title.toLowerCase().includes(this.query.toLowerCase())
      );
    }

    // Filter by priority or status
    tasks = tasks.filter((task) => {
      if (this.filter === 'low' || this.filter === 'medium' || this.filter === 'high') {
        return task.Priority.toLowerCase() === this.filter;
      }
      if (this.filter === 'all') return true;
      if (this.filter === 'completed') return task.completed;
      if (this.filter === 'pending') return !task.completed;
      return true;
    });

    // Sort tasks
    return tasks.sort((first, second) => {
      if (this.sort === 'title') {
        return first.title.localeCompare(second.title);
      }
      if (this.sort === 'newest') {
        return second.id - first.id;
      }
      return first.id - second.id;
    });
  };

  getTaskCount() {
    const total = this.data.tasks().length;
    const completed = this.data.tasks().filter(task => task.completed).length;
    const pending = total - completed;

    switch (this.filter) {
      case 'all':
        return `${pending} pending · ${completed} done`;
      case 'completed':
        return `${completed} / ${total}`;
      case 'pending':
        return `${pending} / ${total}`;
      case 'low':
      case 'medium':
      case 'high':
        const count = this.data.tasks().filter(
          task => task.Priority.toLowerCase() === this.filter
        ).length;
        return `${count} / ${total}`;
      default:
        return `${total}`;
    }
  }

  getCountByStatus(status: string) {
    const tasks = this.data.tasks();

    switch (status) {
      case 'all':
        return tasks.length;
      case 'completed':
        return tasks.filter(t => t.completed).length;
      case 'pending':
        return tasks.filter(t => !t.completed).length;
      case 'low':
      case 'medium':
      case 'high':
        return tasks.filter(t => t.Priority.toLowerCase() === status).length;
      default:
        return 0;
    }
  }

  add() {
    if (this.title.trim() && this.priority) {
      this.data.addTask(this.title.trim(), this.due || 'No reminder', this.priority);
      this.title = '';
      this.due = '';
      this.adding = false;
      this.priority = '';
    }
  }

  startEdit(task: { id: number; title: string; due: string; Priority: string }) {
    this.editingId = task.id;
    this.editTitle = task.title;
    this.editDue = this.toInput(task.due);
    this.priority = task.Priority;
  }

  saveEdit(id: number) {
    if (this.editTitle.trim() && this.priority) {
      this.data.updateTask(id, this.editTitle.trim(), this.editDue || 'No reminder', this.priority);
      this.cancelEdit();
    }
  }

  cancelEdit() {
    this.editingId = null;
    this.editTitle = '';
    this.editDue = '';
    this.priority = '';
  }

  displayDate(value: string) {
    if (value === 'No reminder' || !value) return 'No reminder';
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
