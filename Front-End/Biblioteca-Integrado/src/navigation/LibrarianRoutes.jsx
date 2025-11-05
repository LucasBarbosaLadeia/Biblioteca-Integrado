import { createStackNavigator } from "@react-navigation/stack";
// import HomeLibrarian from "../screens/librarian/HomeLibrarian";
import PendingRequests from "../screens/librarian/PendingRequestsScreen";
import HomeAdmin from "../screens/admin/HomeAdmin";

const Stack = createStackNavigator();

export default function LibrarianRoutes({ setRole }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeAdmin">
        {(props) => <HomeAdmin {...props} setRole={setRole} />}
      </Stack.Screen>
      <Stack.Screen name="PendingRequests" component={PendingRequests} />
    </Stack.Navigator>
  );
}
