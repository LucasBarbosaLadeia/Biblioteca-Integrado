import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";

import NotificationScreen from "../screens/NotificationScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import YourDetailsScreen from "../screens/YourDetailsScreen";
import BookSpecificationsScreen from "../screens/BookSpecificationsScreen";
import SearchScreen from "../screens/SearchScreen";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";

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
