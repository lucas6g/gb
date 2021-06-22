import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import SignIn from '../screens/SingIn/SignIn';
import SignUp from '../screens/SignUp/SignUp';

const AuthStack = createStackNavigator();

// para cada navegacao criar uma tipo de navegacao
const AuthRoutes: React.FC = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#312e38' },
      }}
    >
      <AuthStack.Screen name="SignIn" component={SignIn} />
      <AuthStack.Screen name="SignUp" component={SignUp} />
    </AuthStack.Navigator>
  );
};

export default AuthRoutes;
