import React from "react";
import { TouchableOpacity, Text, StyleSheet, View, Alert } from "react-native";
import * as Updates from "expo-updates";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";

const LogoutButton = ({ navigation, setRole }) => {
  const handleLogout = async () => {
    try {
      // remove known auth/user keys (add more keys if your app stores others)
      await AsyncStorage.multiRemove(["userName", "userRole", "token"]);
    } catch (e) {
      // ignore errors
      console.warn("Erro ao limpar storage durante logout", e);
    }

    // If the parent provides setRole (app uses role to show Login), use it
    if (setRole && typeof setRole === "function") {
      try {
        setRole(null);
      } catch (e) {
        console.warn("Erro chamando setRole(null)", e);
      }
      return;
    }

    // reset/navigation fallback when setRole isn't available
    try {
      const tryNavs = [];
      if (navigation) tryNavs.push(navigation);
      if (navigation && navigation.getParent) {
        const p1 = navigation.getParent();
        if (p1) tryNavs.push(p1);
        try {
          const p2 = p1 && p1.getParent ? p1.getParent() : null;
          if (p2) tryNavs.push(p2);
        } catch (e) {}
      }

      let resetDispatched = false;
      for (const navCandidate of tryNavs) {
        try {
          const state =
            navCandidate && navCandidate.getState
              ? navCandidate.getState()
              : null;
          const routeNames =
            state?.routeNames || (state?.routes || []).map((r) => r.name);
          const candidates = [
            "Login",
            "SignIn",
            "SignInScreen",
            "Auth",
            "Welcome",
            "Home",
          ];
          const found = Array.isArray(routeNames)
            ? candidates.find((n) => routeNames.includes(n))
            : null;
          if (found && navCandidate.dispatch) {
            navCandidate.dispatch(
              CommonActions.reset({ index: 0, routes: [{ name: found }] })
            );
            resetDispatched = true;
            break;
          }
        } catch (e) {
          // ignore and continue
        }
      }

      if (resetDispatched) return;

      // if we couldn't dispatch a reset and setRole() wasn't available,
      // offer to reload the app. Reloading will re-run AppNavigator and show Login.
      Alert.alert(
        "Logout",
        "Não foi possível redirecionar automaticamente. Deseja recarregar o app agora?",
        [
          {
            text: "Recarregar agora",
            onPress: async () => {
              try {
                if (Updates && Updates.reloadAsync) {
                  await Updates.reloadAsync();
                } else {
                  // fallback: just show a confirmation
                  Alert.alert(
                    "Instrução",
                    "Por favor, feche e reabra o aplicativo."
                  );
                }
              } catch (e) {
                console.warn("Erro ao recarregar app", e);
                Alert.alert(
                  "Erro",
                  "Não foi possível recarregar o app. Feche e abra manualmente."
                );
              }
            },
          },
          { text: "Cancelar", style: "cancel" },
        ]
      );
    } catch (e) {
      console.warn("Erro ao resetar navegação durante logout", e);
    }
  };

  return (
    <View style={styles.wrap}>
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Ionicons
          name="log-out-outline"
          size={18}
          color="#fff"
          style={styles.icon}
        />
        <Text style={styles.text}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginTop: 18,
    marginBottom: 36,
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ef4444",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default LogoutButton;
