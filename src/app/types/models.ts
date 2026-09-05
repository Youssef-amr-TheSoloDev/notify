export type IconName =
  | 'dashboard'
  | 'notes'
  | 'tasks'
  | 'alerts'
  | 'about'
  | 'moon'
  | 'sun'
  | 'plus'
  | 'trash'
  | 'edit'
  | 'clock'
  | 'check'
  | 'x'
  | 'menu'
  | 'grid'
  | 'list'
  | 'chart'
  | 'arrowRight'
  | 'inbox';
export interface Note {
  id: number;
  title: string;
  body: string;
  date: string;
  time: string;
  tone: 'blue' | 'pink' | 'yellow';
}

export interface Task {
  id: number;
  title: string;
  due: string;
  completed: boolean;
  Priority: string
}

export interface AlertItem {
  id: number;
  title: string;
  date: string;
  tone: 'blue' | 'purple' | 'orange';
}

export interface Activity {
  id?: number;
  title: string;
  detail: string;
  age: string;
  type: 'note' | 'task' | 'alert';
}
