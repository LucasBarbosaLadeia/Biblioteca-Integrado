import { createStackNavigator } from "@react-navigation/stack";
import HomeAdmin from "../screens/admin/HomeAdmin";
import ManageBooks from "../screens/admin/ManageBooks";
import DetailedAnalysis from "../screens/admin/DetailedAnalysis";
import EditBook from "../screens/admin/EditBook";

const Stack = createStackNavigator();

export default function AdminRoutes({ setRole }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeAdmin">
        {(props) => <HomeAdmin {...props} setRole={setRole} />}
      </Stack.Screen>
      <Stack.Screen name="ManageBooks" component={ManageBooks} />
      <Stack.Screen name="EditBook" component={EditBook} />
      <Stack.Screen name="DetailedAnalysis" component={DetailedAnalysis} />
    </Stack.Navigator>
  );
}
