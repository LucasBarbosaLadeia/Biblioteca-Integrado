import { createStackNavigator } from "@react-navigation/stack";
import NotificationScreen from "../screens/student/NotificationScreen";
import FavoritesScreen from "../screens/student/FavoritesScreen";
import YourDetailsScreen from "../screens/student/YourDetailsScreen";
import BookSpecificationsScreen from "../screens/student/BookSpecificationsScreen";
import HomeStudent from "../screens/student/HomeScreen";

const Stack = createStackNavigator();

export default function StudentRoutes({ setRole }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home">
        {(props) => <HomeStudent {...props} setRole={setRole} />}
      </Stack.Screen>
      <Stack.Screen name="YourDetails" component={YourDetailsScreen} />
      <Stack.Screen name="Favoritos" component={FavoritesScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />

      <Stack.Screen
        name="EspecificacoesLivro"
        component={BookSpecificationsScreen}
      />
    </Stack.Navigator>
  );
}
