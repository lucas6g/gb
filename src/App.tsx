import 'react-native-gesture-handler';

import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import AuthProvider from './context/AuthContext';
import Routes from './routes';

const App: React.FC = () => {
  return (
    <>
      <NavigationContainer>
        <AuthProvider>
          <StatusBar backgroundColor="#312e38" />
          <Routes />
        </AuthProvider>
      </NavigationContainer>
    </>
  );
};

export default App;
