import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from '../screens/MainScreen';
import AddTodoScreen from '../screens/AddTodoScreen';

export type RootStackParamList = {
  Main: undefined;
  AddTodo: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={MainScreen} options={{ title: 'TODO' }} />
      <Stack.Screen name="AddTodo" component={AddTodoScreen} options={{ title: 'Add TODO' }} />
    </Stack.Navigator>
  );
}
