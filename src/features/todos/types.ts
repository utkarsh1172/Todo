export type SortOrder = 'recent' | 'id';
export type Filter = 'all' | 'active' | 'done';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}