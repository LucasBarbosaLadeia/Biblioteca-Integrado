import React, { useEffect, useRef } from "react";
import {
  Animated,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_W } = Dimensions.get("window");
const DRAWER_WIDTH = Math.min(280, SCREEN_W * 0.78);

const DrawerMenu = ({
  visible,
  onClose,
  navigation,
  user = {},
  onLogout,
  activeRoute,
}) => {
  // open from left: start off-screen to the left
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 240,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 240,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -DRAWER_WIDTH,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, translateX, overlayOpacity]);

  const handleNavigate = (route) => {
    onClose && onClose();
    if (navigation && route) navigation.navigate(route);
  };

  return (
    <View pointerEvents={visible ? "auto" : "none"} style={styles.container}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.drawer,
          { width: DRAWER_WIDTH, transform: [{ translateX }] },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Menu</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityLabel="Fechar menu"
            >
              <View style={styles.closeCircle}>
                <Ionicons name="close" size={18} color="#E6F1FF" />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.userRow}>
            <View style={styles.avatarPlaceholder}>
              {user.avatar ? (
                <Image source={user.avatar} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarInitial}>
                  {(user.name && user.name[0]) || "U"}
                </Text>
              )}
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.userName}>{user.name || "Usuário"}</Text>
              <Text style={styles.userRole}>{user.role || "Estudante"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.profileDivider} />

        <View style={styles.menuItems}>
          <TouchableOpacity
            style={[
              styles.menuItem,
              activeRoute === "Pesquisa" ? styles.menuItemActive : null,
            ]}
            onPress={() => handleNavigate("Pesquisa")}
          >
            <Ionicons
              name="search-outline"
              size={18}
              color={
                activeRoute === "Pesquisa" ? "#fff" : "rgba(255,255,255,0.72)"
              }
              style={styles.menuIcon}
            />
            <Text
              style={[
                styles.menuText,
                activeRoute === "Pesquisa" ? styles.menuTextActive : null,
              ]}
            >
              Pesquisar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.menuItem,
              activeRoute === "Favoritos" ? styles.menuItemActive : null,
            ]}
            onPress={() => handleNavigate("Favoritos")}
          >
            <Ionicons
              name="heart-outline"
              size={18}
              color={
                activeRoute === "Favoritos" ? "#fff" : "rgba(255,255,255,0.72)"
              }
              style={styles.menuIcon}
            />
            <Text
              style={[
                styles.menuText,
                activeRoute === "Favoritos" ? styles.menuTextActive : null,
              ]}
            >
              Favoritos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.menuItem,
              activeRoute === "YourDetails" ? styles.menuItemActive : null,
            ]}
            onPress={() => handleNavigate("YourDetails")}
          >
            <Ionicons
              name="person-outline"
              size={18}
              color={
                activeRoute === "YourDetails"
                  ? "#fff"
                  : "rgba(255,255,255,0.72)"
              }
              style={styles.menuIcon}
            />
            <Text
              style={[
                styles.menuText,
                activeRoute === "YourDetails" ? styles.menuTextActive : null,
              ]}
            >
              Meu Perfil
            </Text>
          </TouchableOpacity>

          <View style={styles.divider} />
        </View>

        <View style={styles.signOutRow}>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={() => {
              onLogout && onLogout();
              onClose && onClose();
            }}
            accessibilityRole="button"
          >
            <Ionicons
              name="exit-outline"
              size={18}
              color="#FF6B6B"
              style={styles.signOutIcon}
            />
            <Text style={styles.signOutText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    zIndex: 9998,
    elevation: 9998,
  },
  drawer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#071028",
    paddingTop: 52,
    paddingBottom: 24,
    paddingHorizontal: 18,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 6, height: 0 },
    elevation: 9999,
  },
  header: {
    // header now contains a top row with title + close, and below it user row
    marginBottom: 12,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarPlaceholder: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#24313F",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  avatarInitial: {
    color: "rgba(255,255,255,0.72)",
    fontWeight: "700",
  },
  userName: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  userRole: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 13,
  },
  closeBtn: {
    padding: 6,
  },
  closeCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeX: {
    color: "#9CA8B6",
    fontSize: 20,
  },
  menuItems: {
    marginTop: 18,
    flex: 1,
  },
  menuItemActive: {
    backgroundColor: "#000000",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  menuItemIcon: {
    marginRight: 10,
  },
  menuItem: {
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  menuText: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 16,
  },
  menuTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  menuIcon: {
    marginRight: 12,
  },
  menuTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.72)",
    marginVertical: 16,
  },
  profileDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    marginVertical: 10,
    borderRadius: 2,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  themeText: { color: "#9CA8B6" },
  themeValue: { color: "#EAF1F8" },
  signOutRow: {
    borderTopWidth: 1,
    borderTopColor: "#0E1A22",
    paddingTop: 12,

    alignItems: "center",
    transform: [{ translateY: -20 }],
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#FF6B6B",
  },
  signOutIcon: {
    marginRight: 8,
  },
  signOutText: {
    color: "#FF6B6B",
    fontWeight: "600",
  },
});

export default DrawerMenu;
