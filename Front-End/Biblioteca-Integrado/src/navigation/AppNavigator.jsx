import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import StudentRoutes from "./StudentRoutes";
import LibrarianRoutes from "./LibrarianRoutes";
import AdminRoutes from "./AdminRoutes";
import { useNotifications } from "../hooks/useNotifications";

export default function AppNavigator() {
  const [role, setRole] = useState(null); // null | "student" | "librarian" | "admin"

  // Inicializar notificações quando usuário estiver logado
  const { isConnected } = useNotifications();

  useEffect(() => {
    if (role && isConnected) {
      console.log("✅ Notificações configuradas e conectadas");
    }
  }, [role, isConnected]);

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
