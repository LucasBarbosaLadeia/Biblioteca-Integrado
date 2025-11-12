import { createStackNavigator } from "@react-navigation/stack";
import PendingRequests from "../screens/librarian/PendingRequestsScreen";
import HomeLibrarian from "../screens/librarian/HomeLibrarian";
import ManualLoanScreen from "../screens/librarian/ManualLoanScreen";
import AddBookScreen from "../screens/librarian/AddBookScreen";
import ManageLoansScreen from "../screens/librarian/ManageLoansScreen";

const Stack = createStackNavigator();

export default function LibrarianRoutes({ setRole }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeLibrarian">
        {(props) => <HomeLibrarian {...props} setRole={setRole} />}
      </Stack.Screen>
      <Stack.Screen name="PendingRequests" component={PendingRequests} />
      <Stack.Screen name="ManualLoan" component={ManualLoanScreen} />
      <Stack.Screen name="AddBook" component={AddBookScreen} />
      <Stack.Screen name="ManageLoans" component={ManageLoansScreen} />
    </Stack.Navigator>
  );
}
