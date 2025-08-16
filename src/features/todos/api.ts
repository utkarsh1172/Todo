import axios from 'axios';
import type { Todo } from './types';

export async function fetchTodosAPI(): Promise<Todo[]> {
  const res = await axios.get<Array<{ id: number; title: string; completed: boolean }>>(
    'https://jsonplaceholder.typicode.com/todos'
  );

  const now = new Date().toISOString();

  return res.data.map(d => ({
    id: d.id,
    title: d.title,
    completed: d.completed,
    createdAt: now,
    updatedAt: now,
  }));
}
