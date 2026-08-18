import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { AppNavigator } from './src/navigation/AppNavigator';
import customTheme from './custom-theme.json';
import mapping from './mapping.json';

export default function App() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider 
        {...eva} 
        theme={{ ...eva.dark, ...customTheme }}
        customMapping={mapping as any}
      >
        <AppNavigator />
      </ApplicationProvider>
    </>
  );
}
