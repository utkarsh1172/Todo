import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
// import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchTodos, toggleComplete, deleteTodo, editTodo, setFilter, setSort } from '../features/todos/todosSlice';
import { selectCounts, selectVisibleTodos } from '../features/todos/selectors';
import TodoItem from '../features/todos/components/TodoItem';
import colors from '../theme/colors';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import Icon from 'react-native-vector-icons/MaterialIcons';
type Props = NativeStackScreenProps<RootStackParamList, 'Main'>;

export default function MainScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const status = useAppSelector(s => s.todos.status);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { total, completed } = useAppSelector(selectCounts);
  const data = useAppSelector(selectVisibleTodos);
  const filter = useAppSelector(s => s.todos.filter);
  const sort = useAppSelector(s => s.todos.sort);

  useEffect(() => { dispatch(fetchTodos()); }, [dispatch]);

  const onToggle = useCallback((id: number) => dispatch(toggleComplete(id)), [dispatch]);
  const onDelete = useCallback((id: number) => dispatch(deleteTodo(id)), [dispatch]);
  const onSaveTitle = useCallback((id: number, title: string) => dispatch(editTodo({ id, title })), [dispatch]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TO DO List</Text>
        <Text style={styles.counts}>{completed}/{total}</Text>
      </View>

      {/* Filter & Sort controls (requirements #8, #9). :contentReference[oaicite:5]{index=5} */}
      <View style={styles.controls}>
        {(['all', 'active', 'done'] as const).map(f => (
          <Pressable key={f} onPress={() => dispatch(setFilter(f))} style={[styles.chip, filter === f && styles.chipActive]}>
            <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>{f}</Text>
          </Pressable>
        ))}
        <View style={{ width: 12 }} />
        {(['recent', 'id'] as const).map(sv => (
          <Pressable key={sv} onPress={() => dispatch(setSort(sv))} style={[styles.chip, sort === sv && styles.chipActive]}>
            <Text style={[styles.chipText, sort === sv && styles.chipTextActive]}>{sv}</Text>
          </Pressable>
        ))}
      </View>

      {status === 'loading' && <ActivityIndicator />}

      <FlatList
        data={data}
        keyExtractor={i => String(i.id)}
        renderItem={({ item }) => (
          <TodoItem item={item} onToggle={onToggle} onDelete={onDelete} onSaveTitle={onSaveTitle}   editingId={editingId} setEditingId={setEditingId} />
        )}
        contentContainerStyle={{ padding: 12 }}
        // Performance: fixed heights help; memoized row avoids re-renders
        getItemLayout={(_, index) => ({ length: 68, offset: 68 * index, index })}
        removeClippedSubviews
        initialNumToRender={12}
        windowSize={8}
      />

      {/* FAB: go to Add screen */}
      <Pressable onPress={() => navigation.navigate('AddTodo')} style={styles.fab}>
        <Icon name="add" size={34} color={'#000'} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: colors.text, fontSize: 24, fontWeight: '700' },
  counts: { color: colors.dim, fontWeight:'bold' },
  controls: { flexDirection: 'row', paddingHorizontal: 12, marginBottom: 8, flexWrap: 'wrap' },
  chip: { borderWidth: 1, borderColor: colors.border, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, marginRight: 8, marginBottom: 8 },
  chipActive: { backgroundColor: colors.text },
  chipText: { color: colors.text, textTransform: 'capitalize' },
  chipTextActive: { color: '#000' },
  fab: { position: 'absolute', right: 18, bottom: 28, width: 46, height: 46, borderRadius: 28, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
});
