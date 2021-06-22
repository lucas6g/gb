import React, { useContext } from 'react';

import { ActivityIndicator, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';

import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

// para cada navegacao criar uma tipo de navegacao
const Routes: React.FC = () => {
  const { user, isLoading } = useContext(AuthContext);
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }
  return user ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
