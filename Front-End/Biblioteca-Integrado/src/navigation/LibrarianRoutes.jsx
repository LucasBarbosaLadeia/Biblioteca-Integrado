import { createStackNavigator } from "@react-navigation/stack";
import PendingRequests from "../screens/librarian/PendingRequestsScreen";
import HomeAdmin from "../screens/admin/HomeAdmin";
import ManageBooks from "../screens/admin/ManageBooks";
import EditBook from "../screens/admin/EditBook";

const Stack = createStackNavigator();

export default function LibrarianRoutes({ setRole }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeAdmin">
        {(props) => <HomeAdmin {...props} setRole={setRole} />}
      </Stack.Screen>
      <Stack.Screen name="PendingRequests" component={PendingRequests} />
      <Stack.Screen name="ManageBooks" component={ManageBooks} />
      <Stack.Screen name="EditBook" component={EditBook} />
    </Stack.Navigator>
  );
}
