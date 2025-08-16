import type { RootState } from '../../redux/store';
import type { Todo } from './types';

export const selectCounts = (s: RootState) => {
  const total = s.todos.items.length;
  const completed = s.todos.items.filter(i => i.completed).length;
  return { total, completed };
};

export const selectVisibleTodos = (s: RootState): Todo[] => {
  let arr = s.todos.items;

  // Filter
  if (s.todos.filter === 'active') arr = arr.filter(i => !i.completed);
  else if (s.todos.filter === 'done') arr = arr.filter(i => i.completed);

  // Sort
  if (s.todos.sort === 'recent') {
    return [...arr].sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
  }
  return [...arr].sort((a, b) => a.id - b.id);
};
