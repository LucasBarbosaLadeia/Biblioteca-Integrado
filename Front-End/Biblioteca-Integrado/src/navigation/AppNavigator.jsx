import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";

import NotificationScreen from "../screens/student/NotificationScreen";
import FavoritesScreen from "../screens/student/FavoritesScreen";
import YourDetailsScreen from "../screens/student/YourDetailsScreen";
import BookSpecificationsScreen from "../screens/student/BookSpecificationsScreen";
import SearchScreen from "../screens/student/SearchScreen";
import LoginScreen from "../screens/LoginScreen.jsx";
import HomeScreen from "../screens/student/HomeScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          transitionSpec: {
            open: { animation: "timing", config: { duration: 250 } },
            close: { animation: "timing", config: { duration: 250 } },
          },
          cardStyleInterpolator: ({ current }) => ({
            cardStyle: {
              opacity: current.progress,
              transform: [
                {
                  scale: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.98, 1],
                  }),
                },
              ],
            },
          }),
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Pesquisa" component={SearchScreen} />
        <Stack.Screen name="YourDetails" component={YourDetailsScreen} />
        <Stack.Screen name="Favoritos" component={FavoritesScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen} />

        <Stack.Screen
          name="EspecificacoesLivro"
          component={BookSpecificationsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
