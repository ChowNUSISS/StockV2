import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import StockDetailsScreen from './screens/StockDetailsScreen';
import CalendarScreen from './screens/CalendarScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Home">
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Stock Dashboard' }} />
        <Tab.Screen name="Details" component={StockDetailsScreen} options={{ title: 'Stock Details' }} />
        <Tab.Screen name="Calendar" component={CalendarScreen} options={{ title: 'Calendar' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
