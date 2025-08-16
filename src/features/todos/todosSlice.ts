import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchTodosAPI } from './api';
import type { Todo, SortOrder, Filter } from './types';

interface TodosState {
  items: Todo[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
  filter: Filter;
  sort: SortOrder;
}

const initialState: TodosState = {
  items: [],
  status: 'idle',
  filter: 'all',
  sort: 'recent',
};

// Fetch on app load (requirement #1). :contentReference[oaicite:3]{index=3}
export const fetchTodos = createAsyncThunk('todos/fetch', async () => {
  return await fetchTodosAPI();
});

const slice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // Add (requirement #3). We generate id from timestamp for local items.
    addTodo: {
      reducer(state, action: PayloadAction<Todo>) {
        state.items.unshift(action.payload); // unshift to make "Most Recent" visible
      },
      prepare(title: string) {
        const now = new Date().toISOString();
        return {
          payload: {
            id: Date.now(),
            title: title.trim(),
            completed: false,
            createdAt: now,
            updatedAt: now,
          } as Todo,
        };
      },
    },
    // Complete toggle (requirement #4)
    toggleComplete(state, action: PayloadAction<number>) {
      const t = state.items.find(i => i.id === action.payload);
      if (t) {
        t.completed = !t.completed;
        t.updatedAt = new Date().toISOString();
      }
    },
    // Delete (requirement #5)
    deleteTodo(state, action: PayloadAction<number>) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    // Edit (requirement #10)
    editTodo(state, action: PayloadAction<{ id: number; title: string }>) {
      const t = state.items.find(i => i.id === action.payload.id);
      if (t) {
        t.title = action.payload.title.trim();
        t.updatedAt = new Date().toISOString();
      }
    },
    // Sort + Filter controls (requirements #8 and #9)
    setSort(state, action: PayloadAction<SortOrder>) { state.sort = action.payload; },
    setFilter(state, action: PayloadAction<Filter>) { state.filter = action.payload; },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTodos.pending, state => { state.status = 'loading'; })
      .addCase(fetchTodos.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        // Merge by id to avoid duplicates if user refreshes
        const existing = new Map(state.items.map(i => [i.id, i]));
        payload.forEach(item => { if (!existing.has(item.id)) state.items.push(item); });
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addTodo, toggleComplete, deleteTodo, editTodo, setSort, setFilter } = slice.actions;
export default slice.reducer;
