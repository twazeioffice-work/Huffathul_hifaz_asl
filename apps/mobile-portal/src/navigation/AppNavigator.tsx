import React, { useEffect, useState } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HifzInstructorScreen } from '../screens/HifzInstructorScreen';
import { LoginScreen } from '../screens/LoginScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'react-native';
import { Spinner } from '@ui-kitten/components';

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<'Login' | 'HifzInstructor'>('Login');

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
          setInitialRoute('HifzInstructor');
        }
      } catch (e) {
        // Fallback to login
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0F1D' }}>
        <Spinner size="giant" status="primary" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0A0F1D' }, // Deep Midnight
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="HifzInstructor" component={HifzInstructorScreen} />
        {/* Add Student Evaluation Screen, Settings Screen, etc. */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
