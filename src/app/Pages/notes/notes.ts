import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../component/icon/icon';
import { NotifyDataService } from '../../services/notify-data.service';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [FormsModule, IconComponent],
  template: `<section class="page">
    <header class="page-head">
      <div>
        <p class="eyebrow">Your thoughts, organized</p>
        <h1>Notes</h1>
      </div>
      <div class="header-actions">
        <span class="counter">{{ data.notes().length }} notes</span>
        <button class="primary" (click)="adding = !adding">
          <app-icon name="plus" />
          {{ adding ? 'Cancel' : 'Add Note' }}
        </button>
      </div>
    </header>

    @if (adding) {
      <form class="composer" (ngSubmit)="add()">
        <div class="composer-fields">
          <input
            name="title"
            [(ngModel)]="title"
            placeholder="Note title"
            required
            autofocus
          />
          <textarea
            name="body"
            [(ngModel)]="body"
            placeholder="Write something..."
          ></textarea>
        </div>
        <div class="composer-actions">
          <button type="button" class="cancel-btn" (click)="adding = false">Cancel</button>
          <button class="primary" type="submit" aria-label="Save note" title="Save note">
            <app-icon name="check" /> Save Note
          </button>
        </div>
      </form>
    }

    <div class="toolbar">
      <label>
        <span>⌕</span>
        <input [(ngModel)]="query" placeholder="Search notes..." />
      </label>
      <button
        class="view"
        [class.active]="view === 'grid'"
        (click)="view = 'grid'"
        aria-label="Grid view"
      >
        <app-icon name="grid" Size="1em" />
      </button>
      <button
        class="view"
        [class.active]="view === 'list'"
        (click)="view = 'list'"
        aria-label="List view"
      >
        <app-icon name="list" Size="1em" />
      </button>
    </div>

    @if (filtered().length === 0) {
      <div class="empty-state">
        <app-icon name="notes" Size="3em" />
        <p>No notes yet</p>
        <small>Create your first note to capture your thoughts</small>
      </div>
    } @else {
      <div class="notes-grid" [class.list-view]="view === 'list'">
        @for (note of filtered(); track note.id) {
          <article class="note-card {{ note.tone }}">
            @if (editingId === note.id) {
              <form class="edit-form" (ngSubmit)="saveEdit(note.id)">
                <input
                  name="editTitle"
                  [(ngModel)]="editTitle"
                  required
                  placeholder="Note title"
                />
                <textarea
                  name="editBody"
                  [(ngModel)]="editBody"
                  placeholder="Write something..."
                ></textarea>
                <div class="edit-actions">
                  <button class="save-btn" type="submit" aria-label="Save note" title="Save note">
                    <app-icon name="check" Size="0.875em" /> Save
                  </button>
                  <button
                    class="cancel-btn"
                    type="button"
                    (click)="cancelEdit()"
                    aria-label="Cancel editing"
                    title="Cancel editing"
                  >
                    <app-icon name="x" Size="0.875em" /> Cancel
                  </button>
                </div>
              </form>
            } @else {
              <button class="edit-btn" aria-label="Edit note" (click)="startEdit(note)">
                <app-icon name="edit" Size="0.875em" />
              </button>
              <h2>{{ note.title }}</h2>
              <p>{{ note.body }}</p>
              <footer>
                <span>{{ note.date }} · {{ note.time }}</span>
                <button class="delete-btn" (click)="data.removeNote(note.id)" aria-label="Delete note">
                  <app-icon name="trash" Size="2em" />
                </button>
              </footer>
            }
          </article>
        }
      </div>
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
        flex-direction: column;
        gap: var(--space-2);
        margin-bottom: var(--space-2);
      }

      .composer-fields input,
      .composer-fields textarea {
        border: 1px solid var(--color-border-soft);
        border-radius: 6px;
        padding: 10px 12px;
        font-size: 11px;
        transition: border-color 0.2s ease;
        background: var(--color-surface);
        color: var(--color-ink);
        font-family: inherit;
      }

      .composer-fields input:focus,
      .composer-fields textarea:focus {
        border-color: var(--color-blue);
        outline: none;
        box-shadow: 0 0 0 3px var(--color-blue-soft);
      }

      .composer-fields textarea {
        min-height: 80px;
        resize: vertical;
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

      .view {
        width: 34px;
        height: 34px;
        border: 1px solid var(--color-border);
        background: var(--color-surface);
        border-radius: 8px;
        color: var(--color-control);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }

      .view:hover {
        background: var(--color-bg-soft);
        border-color: var(--color-border);
      }

      .view.active {
        background: var(--color-blue-soft);
        color: var(--color-blue);
        border-color: var(--color-blue);
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

      .notes-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-3);
      }

      .notes-grid.list-view {
        grid-template-columns: 1fr;
      }

      .note-card {
        position: relative;
        min-height: 150px;
        padding: var(--space-card);
        padding-left: 20px;
        border: 1px solid var(--color-border-soft);
        border-radius: 10px;
        background: var(--color-surface);
        box-shadow: 0 2px 12px var(--shadow-soft);
        position: relative;
        overflow: hidden;
        transition: all 0.2s ease;
      }

      .note-card:hover {
        box-shadow: 0 4px 20px var(--shadow-soft);
        transform: translateY(-2px);
      }

      .note-card::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        border-radius: 10px 0 0 10px;
      }

      .note-card.blue::before {
        background: var(--color-blue-border);
      }

      .note-card.pink::before {
        background: var(--color-purple);
      }

      .note-card.yellow::before {
        background: var(--color-yellow);
      }

      .note-card h2 {
        font: 600 14px 'Space Grotesk', sans-serif;
        margin: 0 0 9px;
        color: var(--color-ink);
        padding-right: 30px;
      }

      .note-card p {
        font-size: 12px;
        line-height: 1.6;
        color: var(--color-body);
        white-space: pre-line;
        margin: 0 0 40px 0;
      }

      .edit-btn {
        position: absolute;
        right: 10px;
        top: 10px;
        border: 0;
        background: none;
        color: var(--color-control);
        padding: 4px 6px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .edit-btn:hover {
        color: var(--color-blue);
        background: var(--color-blue-soft);
      }

      .note-card footer {
        position: absolute;
        bottom: 12px;
        left: 20px;
        right: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--color-faint);
        font-size: 9px;
      }

      .delete-btn {
        border: 0;
        background: none;
        color: var(--color-control);
        padding: 4px 6px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .delete-btn:hover {
        color: var(--color-red);
        background: var(--color-red-soft);
      }

      .edit-form {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        padding: 0;
        height: 100%;
      }

      .edit-form input,
      .edit-form textarea {
        border: 1px solid var(--color-border-soft);
        border-radius: 6px;
        padding: 8px 10px;
        font-size: 11px;
        transition: border-color 0.2s ease;
        background: var(--color-surface);
        color: var(--color-ink);
        font-family: inherit;
      }

      .edit-form input:focus,
      .edit-form textarea:focus {
        border-color: var(--color-blue);
        outline: none;
        box-shadow: 0 0 0 3px var(--color-blue-soft);
      }

      .edit-form textarea {
        min-height: 80px;
        resize: vertical;
        flex: 1;
      }

      .edit-actions {
        display: flex;
        gap: var(--space-1);
        justify-content: flex-end;
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

        .notes-grid {
          grid-template-columns: 1fr 1fr;
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
        .notes-grid {
          grid-template-columns: 1fr;
        }

        .composer-actions {
          flex-direction: column;
        }

        .composer-actions .primary,
        .composer-actions .cancel-btn {
          width: 100%;
          justify-content: center;
        }

        .note-card h2 {
          font-size: 13px;
        }

        .note-card p {
          font-size: 11px;
        }
      }
    `,
  ],
})
export class NotesPage {
  readonly data = inject(NotifyDataService);
  title = '';
  body = '';
  query = '';
  adding = false;
  view: 'grid' | 'list' = 'grid';
  editingId: number | null = null;
  editTitle = '';
  editBody = '';

  filtered = () =>
    this.data
      .notes()
      .filter((note) =>
        `${note.title} ${note.body}`.toLowerCase().includes(this.query.toLowerCase()),
      );

  add() {
    if (this.title.trim()) {
      this.data.addNote(this.title.trim(), this.body.trim());
      this.title = '';
      this.body = '';
      this.adding = false;
    }
  }

  startEdit(note: { id: number; title: string; body: string }) {
    this.editingId = note.id;
    this.editTitle = note.title;
    this.editBody = note.body;
  }

  saveEdit(id: number) {
    if (this.editTitle.trim()) {
      this.data.updateNote(id, this.editTitle.trim(), this.editBody.trim());
      this.cancelEdit();
    }
  }

  cancelEdit() {
    this.editingId = null;
    this.editTitle = '';
    this.editBody = '';
  }
}
