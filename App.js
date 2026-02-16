import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { PregnancyProvider } from './src/context/PregnancyContext';

const AppTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#000000',
    card: '#111',
    text: '#FFF',
  }
}

export default function App() {
  useEffect(() => {
    // Set Android Navigation Bar to Black
    NavigationBar.setBackgroundColorAsync("#000000");
    NavigationBar.setButtonStyleAsync("light");
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <PregnancyProvider>
        <NavigationContainer theme={AppTheme}>
          <RootNavigator />
        </NavigationContainer>
      </PregnancyProvider>
    </SafeAreaProvider>
  );
}
