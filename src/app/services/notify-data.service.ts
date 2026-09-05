import { Injectable, signal } from '@angular/core';
import { Activity, AlertItem, Note, Task } from '../types/models';

const seedNotes: Note[] = [
  { id: 1, title: 'Project Ideas', body: 'Some ideas for the new product we want to build...', date: 'May 20, 2025', time: '10:30 AM', tone: 'pink' },
  { id: 2, title: 'Daily Thoughts', body: 'Just a note to keep my mind clear and focused.', date: 'May 20, 2025', time: '9:15 AM', tone: 'blue' },
  { id: 3, title: 'Books to Read', body: '• Atomic Habits\n• Deep Work\n• The 5 AM Club', date: 'May 19, 2025', time: '8:45 PM', tone: 'yellow' },
  { id: 4, title: 'Shopping List', body: '• Headphones\n• Keyboard\n• Monitor', date: 'May 19, 2025', time: '6:20 PM', tone: 'pink' },
  { id: 5, title: 'Workout Plan', body: 'Push day, Pull day, Leg day, Rest.', date: 'May 19, 2025', time: '5:10 PM', tone: 'blue' },
  { id: 6, title: 'Travel Plans', body: 'Vacation ideas for the summer.', date: 'May 18, 2025', time: '11:00 AM', tone: 'yellow' },
];
const seedTasks: Task[] = [
  { id: 1, title: 'Buy groceries', due: 'May 22, 2025 5:00 PM', completed: false, Priority: 'Low' },
  { id: 2, title: 'Finish the report', due: 'May 21, 2025 11:00 AM', completed: false, Priority: 'Medium' },
  { id: 3, title: 'Workout', due: 'May 20, 2025 6:00 PM', completed: true, Priority: 'Low' },
  { id: 4, title: 'Call mom', due: 'No reminder', completed: false, Priority: 'High' },
  { id: 5, title: 'Read 20 pages', due: 'May 19, 2025 9:00 PM', completed: true, Priority: 'Medium' },
];
const seedAlerts: AlertItem[] = [
  { id: 1, title: 'Drink water', date: 'May 21, 2025 2:00 PM', tone: 'purple' },
  { id: 2, title: 'Meeting at 3 PM', date: 'May 21, 2025 3:00 PM', tone: 'orange' },
  { id: 3, title: 'Take a break', date: 'May 21, 2025 5:30 PM', tone: 'blue' },
];

@Injectable({ providedIn: 'root' })
export class NotifyDataService {
  readonly notes = signal<Note[]>(this.load('notify-notes', seedNotes));
  readonly tasks = signal<Task[]>(this.load('notify-tasks', seedTasks));
  readonly alerts = signal<AlertItem[]>(this.load('notify-alerts', seedAlerts));

  get activities(): Activity[] {
    return [
      ...this.notes().map(note => ({ id: note.id, title: note.title, detail: note.body.split('\n')[0], age: this.age(note.id), type: 'note' as const })),
      ...this.tasks().map(task => ({ id: task.id, title: task.title, detail: task.completed ? 'Completed task' : 'Task to complete', age: this.age(task.id), type: 'task' as const })),
      ...this.alerts().map(alert => ({ id: alert.id, title: alert.title, detail: 'Scheduled alert', age: this.age(alert.id), type: 'alert' as const })),
    ].sort((first, second) => (second.id ?? 0) - (first.id ?? 0)).slice(0, 5);
  }

  addNote(title: string, body: string) {
    const notes = [{ id: Date.now(), title, body, date: 'Today', time: 'Now', tone: 'blue' as const }, ...this.notes()];
    this.notes.set(notes); this.save('notify-notes', notes);
  }
  addTask(title: string, due = '', priority: string) {
    const tasks = [...this.tasks(), { id: Date.now(), title, due, completed: false, Priority: priority }];
    this.tasks.set(tasks); this.save('notify-tasks', tasks);
  }
  addAlert(title: string, date: string) {
    const alerts = [...this.alerts(), { id: Date.now(), title, date, tone: 'blue' as const }];
    this.alerts.set(alerts); this.save('notify-alerts', alerts);
  }
  updateNote(id: number, title: string, body: string) {
    const notes = this.notes().map(note => note.id === id ? { ...note, title, body } : note);
    this.notes.set(notes); this.save('notify-notes', notes);
  }
  updateTask(id: number, title: string, due: string, Priority: string) {
    const tasks = this.tasks().map(task => task.id === id ? { ...task, title, due, Priority } : task);
    this.tasks.set(tasks); this.save('notify-tasks', tasks);
  }
  updateAlert(id: number, title: string, date: string) {
    const alerts = this.alerts().map(alert => alert.id === id ? { ...alert, title, date } : alert);
    this.alerts.set(alerts); this.save('notify-alerts', alerts);
  }
  toggleTask(id: number) {
    const tasks = this.tasks().map(task => task.id === id ? { ...task, completed: !task.completed } : task);
    this.tasks.set(tasks); this.save('notify-tasks', tasks);
  }
  removeNote(id: number) { const notes = this.notes().filter(note => note.id !== id); this.notes.set(notes); this.save('notify-notes', notes); }
  removeTask(id: number) { const tasks = this.tasks().filter(task => task.id !== id); this.tasks.set(tasks); this.save('notify-tasks', tasks); }
  removeAlert(id: number) { const alerts = this.alerts().filter(alert => alert.id !== id); this.alerts.set(alerts); this.save('notify-alerts', alerts); }

  private load<T>(key: string, fallback: T[]): T[] { try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback; } catch { return fallback; } }
  private save<T>(key: string, value: T[]) { localStorage.setItem(key, JSON.stringify(value)); }
  private age(id: number) { if (id < 10000000000) return 'Earlier'; const minutes = Math.max(1, Math.floor((Date.now() - id) / 60000)); return minutes < 60 ? `${minutes}m ago` : `${Math.floor(minutes / 60)}h ago`; }
}
