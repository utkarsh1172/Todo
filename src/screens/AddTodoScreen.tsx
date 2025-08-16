import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';
import { addTodo } from '../features/todos/todosSlice';
import colors from '../theme/colors';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useAppDispatch } from '../redux/hooks';

type Props = NativeStackScreenProps<RootStackParamList, 'AddTodo'>;

export default function AddTodoScreen({ navigation }: Props) {
  const [title, setTitle] = useState('');
  const dispatch = useAppDispatch();

  const onAdd = () => {
    if (!title.trim()) return;
    dispatch(addTodo(title));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="What needs to be done?"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <Pressable onPress={onAdd} style={styles.btn}><Text style={styles.btnText}>Add</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 16 },
  input: { backgroundColor: '#111', color: '#fff', borderWidth: 1, borderColor: '#333', padding: 14, borderRadius: 12, marginBottom: 12 },
  btn: { backgroundColor: '#fff', padding: 14, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#000', fontWeight: '700' },
});
