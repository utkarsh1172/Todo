import React, { useState, memo } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import colors from '../../../theme/colors';
import type { Todo } from '../types';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Memoized to avoid re-rendering unrelated rows (performance).
const TodoItem = memo(function TodoItem({
  item,
  onToggle,
  onDelete,
  onSaveTitle,
  editingId,
  setEditingId,
}: {
  item: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onSaveTitle: (id: number, title: string) => void;
  editingId: number | null;
  setEditingId: (id: number | null) => void;
}) {
  const [text, setText] = useState(item.title);

  const editing = editingId === item.id;

  return (
    <View style={styles.row}>
      {/* Checkbox */}
      {!editing && (<Pressable onPress={() => onToggle(item.id)} style={styles.checkbox}>
        <Icon
          name={item.completed ? 'check-box' : 'check-box-outline-blank'}
          size={24}
          color={colors.text}
        />
      </Pressable>)}

      {/* Title / Edit mode */}
      {editing ? (
        <TextInput
          value={text}
          onChangeText={setText}
          onSubmitEditing={() => {
            onSaveTitle(item.id, text);
            setEditingId(null); // close edit mode
          }}
          style={[styles.title, { borderBottomWidth: 1, borderColor: colors.border }]}
          autoFocus
        />
      ) : (
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.title,
              item.completed && { textDecorationLine: 'line-through', opacity: 0.6 },
            ]}
          >
            {item.title}
          </Text>
          <Text style={styles.meta}>
            created: {new Date(item.createdAt).toLocaleString()}
          </Text>
        </View>
      )}

      {/* Edit + Delete buttons */}
      <View style={styles.actions}>
        {!editing && (
          <Pressable onPress={() => setEditingId(item.id)} style={styles.iconBtn}>
            <Icon name="edit" size={22} color={colors.text} />
          </Pressable>
        )}
        {editing && (
          <Pressable onPress={() => setEditingId(null)} style={styles.iconBtn}>
            <Icon name="close" size={22} color={colors.text} />
          </Pressable>
        )}
       {!editing && ( <Pressable onPress={() => onDelete(item.id)} style={styles.iconBtn}>
          <Icon name="delete" size={22} color={colors.text} />
        </Pressable>)}
      </View>
    </View>
  );
});


const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.card,
    marginBottom: 8,
    borderRadius: 12,
    borderColor: colors.border,
    borderWidth: 1,
  },
  checkbox: { marginRight: 12 },
  title: { color: colors.text, fontSize: 16, flex: 1 },
  meta: { color: colors.dim, fontSize: 11, marginTop: 4 },
  actions: {
    flexDirection: 'row',  // icons in a row
    alignItems: 'center',
    // marginLeft: 10,
  },
  iconBtn: {
    marginLeft: 12,        // spacing between edit & delete
    padding: 4,            // touchable area
  },
});

export default TodoItem;
