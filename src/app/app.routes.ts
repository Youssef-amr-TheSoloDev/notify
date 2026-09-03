import { Routes } from '@angular/router';
import { DashboardPage } from './Pages/dashboard/dashboard';
import { NotesPage } from './Pages/notes/notes';
import { TasksPage } from './Pages/tasks/tasks';
import { AlertsPage } from './Pages/alerts/alerts';
import { AboutPage } from './Pages/about/about';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    { path: 'dashboard', component: DashboardPage },
    { path: 'notes', component: NotesPage },
    { path: 'tasks', component: TasksPage },
    { path: 'alerts', component: AlertsPage },
    { path: 'about', component: AboutPage },
];
