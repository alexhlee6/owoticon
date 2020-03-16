import React from "react";
import HomeNav from "./HomeNav";
import FavesScreen from "./FavesNav";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

const Tab = createMaterialBottomTabNavigator();

export default () => {
  
  return (
    <Tab.Navigator 
      activeColor="#fab9b4" inactiveColor="#b8b8b8" 
      barStyle={{backgroundColor: "#fff", height: 70}}
    >
      <Tab.Screen name="Home" component={HomeNav}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Icon name="home" color={color} size={26} />
        )}}
      />
      <Tab.Screen name="Faves" component={FavesScreen} options={{
        tabBarLabel: 'Favorites',
        tabBarIcon: ({ color }) => (
          <Icon name="heart" color={color} size={20} />
        ),
      }} />
    </Tab.Navigator>
  );
}