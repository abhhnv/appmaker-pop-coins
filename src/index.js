import React from 'react';
import { AppmakerApp } from '@appmaker-xyz/react-native';
import { ApThemeProvider, styles } from '@appmaker-xyz/uikit';
import { setProject } from '@appmaker-xyz/app-config';
import './initApp';
import config from './config';
import { SafeAreaProvider } from 'react-native-safe-area-context';

setProject({ id: config.projectId });
export default function CustomAppmakerApp() {
  return (
    <SafeAreaProvider>
      <ApThemeProvider styles={styles}>
        <AppmakerApp />
      </ApThemeProvider>
    </SafeAreaProvider>
  );
}

// export default App;
