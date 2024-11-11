import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from './src/screens/HomeScreen';
import BookDetailScreen from './src/screens/BookDetailScreen';
import BorrowedScreen from './src/screens/BorrowedScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BooksList" component={HomeScreen} options={{ title: 'Books' }} />
      <Stack.Screen name="BookDetail" component={BookDetailScreen} options={{ title: 'Book Details' }} />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home-outline';
            } else if (route.name === 'Borrowed') {
              iconName = 'book-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Borrowed" component={BorrowedScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
