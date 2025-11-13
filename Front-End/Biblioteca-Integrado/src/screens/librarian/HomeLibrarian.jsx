import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useWindowDimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../services/api";
import {
  LibrarianActions,
  CardTotalBooks,
  CardActiveLoans,
  CardOverdue,
  CardRequests,
  RecentLoans,
} from "../../components/librarian";

const HomeLibrarian = ({ navigation, setRole }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [user, setUser] = useState({});
  const [statsCounts, setStatsCounts] = useState({
    totalBooks: null,
    activeLoans: null,
    overdue: null,
    requests: null,
  });
  const [loadingStats, setLoadingStats] = useState(false);

  // compute some responsive paddings based on window size
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  // header padding: proportional but clamped to reduce excessive top spacing
  // use a smaller multiplier and lower max so header stays compact on tall screens
  const responsivePaddingTop = Math.min(
    16,
    Math.max(4, Math.round(windowHeight * 0.02))
  );
  const responsiveContentPadding = Math.max(12, Math.round(windowWidth * 0.03));
  const responsiveTitleFont =
    windowWidth < 360 ? 18 : windowWidth < 420 ? 20 : 22;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const nome = await AsyncStorage.getItem("userName");
        const tipo = await AsyncStorage.getItem("userRole");
        setUser({ name: nome || "", role: tipo || "" });
      } catch (e) {}
    };
    fetchUser();
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        // total books: use livros with limit=1 and read pagination.total
        const dataBooks = await api.get("livros?page=1&limit=1");
        const totalBooks = dataBooks?.pagination?.total ?? null;

        // active loans
        const dataActive = await api.get("emprestimos/ativos?page=1&limit=1");
        const activeLoans = dataActive?.pagination?.total ?? null;

        // overdue
        const dataOver = await api.get("emprestimos/atrasados?page=1&limit=1");
        const overdue = dataOver?.pagination?.total ?? null;

        // requests: attempt to fetch emprestimos with status=pendente or use 0 as fallback
        let requests = null;
        try {
          const dataReq = await api.get(
            "emprestimos?status=pendente&page=1&limit=1"
          );
          requests = dataReq?.pagination?.total ?? 0;
        } catch (e) {
          requests = 0;
        }

        if (!mounted) return;
        setStatsCounts({ totalBooks, activeLoans, overdue, requests });
      } catch (err) {
        console.error("Erro ao buscar estatísticas:", err);
      } finally {
        if (mounted) setLoadingStats(false);
      }
    };

    fetchStats();
    return () => {
      mounted = false;
    };
  }, []);

  const stats = [
    {
      title: "Total de Livros",
      value: "8",
      subtitle: "6 disponíveis",
      color: "#0b1220",
      icon: (
        <Ionicons
          name="book-outline"
          size={22}
          color="rgba(255,255,255,0.95)"
        />
      ),
    },
    {
      title: "Empréstimos Ativos",
      value: "1",
      subtitle: "Em circulação",
      color: "#07182b",
      icon: (
        <Ionicons
          name="swap-vertical-outline"
          size={22}
          color="rgba(255,255,255,0.95)"
        />
      ),
    },
    {
      title: "Atrasados",
      value: "1",
      subtitle: "Necessitam atenção",
      color: "#3b0f0f",
      icon: (
        <Ionicons
          name="time-outline"
          size={22}
          color="rgba(255,255,255,0.95)"
        />
      ),
    },
    {
      title: "Solicitações",
      value: "2",
      subtitle: "Aguardando retirada",
      color: "#3d2b0b",
      icon: (
        <Ionicons
          name="notifications-outline"
          size={22}
          color="rgba(255,255,255,0.95)"
        />
      ),
    },
  ];

  const handleNavigate = (route) => {
    if (navigation && route) navigation.navigate(route);
  };

  // actions are rendered by LibrarianActions by default (no API data needed)

  return (
    <View style={styles.containerRoot}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.page}>
          <View style={[styles.topRow, { paddingTop: responsivePaddingTop }]}>
            <Text style={[styles.topTitle, { fontSize: responsiveTitleFont }]}>
              Painel do Bibliotecário
            </Text>
          </View>

          <ScrollView
            contentContainerStyle={[
              styles.content,
              { padding: responsiveContentPadding },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.cardsGrid}>
              <CardTotalBooks
                value={
                  statsCounts.totalBooks != null
                    ? String(statsCounts.totalBooks)
                    : "-"
                }
                onPress={() => {}}
              />
              <CardActiveLoans
                value={
                  statsCounts.activeLoans != null
                    ? String(statsCounts.activeLoans)
                    : "-"
                }
                onPress={() => handleNavigate && handleNavigate("ManageLoans")}
              />
              <CardOverdue
                value={
                  statsCounts.overdue != null
                    ? String(statsCounts.overdue)
                    : "-"
                }
                onPress={() => handleNavigate && handleNavigate("ManageLoans")}
              />
              <CardRequests
                value={
                  statsCounts.requests != null
                    ? String(statsCounts.requests)
                    : "-"
                }
                onPress={() =>
                  handleNavigate && handleNavigate("PendingRequests")
                }
              />
            </View>

            <View style={styles.sectionQuickActions}>
              <Text style={styles.sectionTitleActions}>Ações Rápidas</Text>
              <LibrarianActions navigation={navigation} />
            </View>

            <View style={styles.sectionRecentLoans}>
              <Text style={styles.sectionTitleRecentLoans}>
                Empréstimos Recentes
              </Text>
              <RecentLoans />
            </View>
            <View style={styles.signOutRow}>
              <TouchableOpacity
                style={styles.signOutButton}
                onPress={async () => {
                  try {
                    await AsyncStorage.multiRemove([
                      "userName",
                      "userRole",
                      "token",
                    ]);
                  } catch (e) {
                    // ignore
                  }

                  if (setRole && typeof setRole === "function") {
                    try {
                      setRole(null);
                    } catch (e) {}
                    return;
                  }

                  if (handleNavigate) {
                    handleNavigate("Login");
                  } else if (navigation && navigation.replace) {
                    navigation.replace("Login");
                  }
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
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  containerRoot: {
    flex: 1,
    backgroundColor: "#020618",
  },
  safe: {
    flex: 1,
  },
  page: {
    flex: 1,
    paddingHorizontal: 1,
    paddingTop: 0,
  },
  content: {
    padding: 16,
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  topRow: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 25,
  },
  topTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#1b2546",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionQuickActions: {
    marginTop: 18,
  },
  sectionTitleActions: {
    color: "#cbd5e1",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    marginInlineStart: 4,
  },
  sectionRecentLoans: {
    marginTop: 18,
    marginBottom: 25,
  },
  sectionTitleRecentLoans: {
    color: "#cbd5e1",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    marginInlineStart: 4,
  },
  signOutRow: {
    borderTopWidth: 1,
    borderTopColor: "#0E1A22",
    paddingTop: 12,
    paddingBottom: 25,

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
    fontWeight: "700",
    fontSize: 16,
  },
});

export default HomeLibrarian;
