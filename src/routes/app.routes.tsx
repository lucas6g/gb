import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from '../screens/Dashboard/Dashboard';
import CreateAppointment from '../screens/CreateAppointment/CreateAppointment';
import AppointmentCreated from '../screens/AppointmentCreated/AppointmentCreated';
import Profile from '../screens/Profile/Profile';

const AppStack = createStackNavigator();

// para cada navegacao criar uma tipo de navegacao
const AppRoutes: React.FC = () => {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#312e38' },
      }}
    >
      <AppStack.Screen name="Dashboard" component={Dashboard} />
      <AppStack.Screen name="CreateAppointment" component={CreateAppointment} />
      <AppStack.Screen
        name="AppointmentCreated"
        component={AppointmentCreated}
      />
      <AppStack.Screen name="Profile" component={Profile} />
    </AppStack.Navigator>
  );
};

export default AppRoutes;
