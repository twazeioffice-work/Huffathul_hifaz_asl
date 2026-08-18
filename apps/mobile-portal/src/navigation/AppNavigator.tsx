import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HifzInstructorScreen } from '../screens/HifzInstructorScreen';

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0A0F1D' }, // Deep Midnight
        }}
      >
        <Stack.Screen name="HifzInstructor" component={HifzInstructorScreen} />
        {/* Add Student Evaluation Screen, Settings Screen, etc. */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
