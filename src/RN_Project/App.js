import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import StockDetailsScreen from './screens/StockDetailsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Stock Dashboard' }} />
        <Stack.Screen name="Details" component={StockDetailsScreen} options={{ title: 'Stock Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
