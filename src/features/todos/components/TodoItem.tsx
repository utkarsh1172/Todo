import React, { useState, memo } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import colors from '../../../theme/colors';
import type { Todo } from '../types';

// Memoized to avoid re-rendering unrelated rows (performance).
const TodoItem = memo(function TodoItem({
  item,
  onToggle,
  onDelete,
  onSaveTitle,
}: {
  item: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onSaveTitle: (id: number, title: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(item.title);

  return (
    <View style={styles.row}>
      <Pressable onPress={() => onToggle(item.id)} style={styles.checkbox}>
        <Text>{item.completed ? '☑' : '☐'}</Text>
      </Pressable>

      {editing ? (
        <TextInput
          value={text}
          onChangeText={setText}
          onSubmitEditing={() => { onSaveTitle(item.id, text); setEditing(false); }}
          style={[styles.title, { borderBottomWidth: 1, borderColor: colors.border }]}
          autoFocus
        />
      ) : (
        <Pressable style={{ flex: 1 }} onLongPress={() => setEditing(true)}>
          <Text style={[styles.title, item.completed && { textDecorationLine: 'line-through', opacity: 0.6 }]}>
            {item.title}
          </Text>
          {/* Optional small meta line */}
          <Text style={styles.meta}>created: {new Date(item.createdAt).toLocaleString()}</Text>
        </Pressable>
      )}

      <Pressable onPress={() => onDelete(item.id)} style={styles.delete}>
        <Text>🗑</Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: colors.card, marginBottom: 8, borderRadius: 12, borderColor: colors.border, borderWidth: 1 },
  checkbox: { marginRight: 12 },
  title: { color: colors.text, fontSize: 16, flex: 1 },
  meta: { color: colors.dim, fontSize: 11, marginTop: 4 },
  delete: { marginLeft: 10 },
});

export default TodoItem;
