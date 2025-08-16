export async function fetchTodosAPI(limit = 50) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos?_limit=${limit}`);
  const data: Array<{ id: number; title: string; completed: boolean }> = await res.json();
  const now = new Date().toISOString();
  return data.map(d => ({
    id: d.id,
    title: d.title,
    completed: d.completed,
    createdAt: now,
    updatedAt: now,
  }));
}
