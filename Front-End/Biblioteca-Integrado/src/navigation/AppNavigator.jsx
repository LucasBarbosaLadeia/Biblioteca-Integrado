import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import StudentRoutes from "./StudentRoutes";
import LibrarianRoutes from "./LibrarianRoutes";
import AdminRoutes from "./AdminRoutes";

export default function AppNavigator() {
  const [role, setRole] = useState(null); // null | "student" | "librarian" | "admin"

  // Se ainda não fez login → mostra Login
  if (!role) return <LoginScreen setRole={setRole} />;

  return (
    <NavigationContainer>
      {role === "student" ? (
        <StudentRoutes setRole={setRole} />
      ) : role === "librarian" ? (
        <LibrarianRoutes setRole={setRole} />
      ) : (
        <AdminRoutes setRole={setRole} />
      )}
    </NavigationContainer>
  );
}
