import React from "react";
import HomeNav from "./HomeNav";
import FavesScreen from "./FavesNav";

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
// import { FontAwesome }  from '@expo/vector-icons';
const HOME_ICON = require("../../assets/images/home_icon.png");
const FAVES_ICON = require("../../assets/images/faves_icon.png");
import { Image } from 'react-native';
const Tab = createMaterialBottomTabNavigator();

export default () => {
  
  return (
    <Tab.Navigator 
      // activeColor="#fab9b4" inactiveColor="#b8b8b8" 
      activeColor="#ffc3bf" inactiveColor="#b8b8b8" 
      barStyle={{backgroundColor: "#fff", height: 70}}
    >
      <Tab.Screen name="Home" component={HomeNav}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => (
            <Image source={HOME_ICON} 
              style={{ 
                tintColor: color,
                width: 23,
                height: 23
              }}
            />
          )
        //   tabBarIcon: ({ color }) => (
        //     <FontAwesome name={'home'} color={color} size={26} />
        // )
          
      }}
      />
      <Tab.Screen name="Faves" component={FavesScreen} options={{
        tabBarLabel: 'Favorites',
        tabBarIcon: ({color}) => (
          <Image source={FAVES_ICON} 
            style={{ 
              tintColor: color,
              width: 21,
              height: 21
            }}
          />
        )
        // tabBarIcon: ({ color }) => (
        //   <FontAwesome name={'heart'} color={color} size={20} />
        // ),
        
      }}
        
       />
    </Tab.Navigator>
  );
}