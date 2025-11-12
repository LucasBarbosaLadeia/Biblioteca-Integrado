import React, { useEffect, useState } from "react";
import { View, ScrollView, SafeAreaView, StyleSheet, Text } from "react-native";
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

  const { width: windowWidth } = useWindowDimensions();
  const PAGE_PADDING = 15;
  const CONTENT_PADDING = 16;
  const GAP = 8;
  const itemSize = Math.floor(
    (windowWidth - PAGE_PADDING * 2 - CONTENT_PADDING * 2 - GAP) / 2
  );
  const adjustedItemSize = itemSize + 5;

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

  // actions are rendered by LibrarianActions by default (no API data needed)

  return (
    <View style={styles.containerRoot}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.page}>
          <View style={styles.topRow}>
            <Text style={styles.topTitle}>Painel do Bibliotecário</Text>
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
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
                size={adjustedItemSize}
              />
              <CardActiveLoans
                value={
                  statsCounts.activeLoans != null
                    ? String(statsCounts.activeLoans)
                    : "-"
                }
                onPress={() => {}}
                size={adjustedItemSize}
              />
              <CardOverdue
                value={
                  statsCounts.overdue != null
                    ? String(statsCounts.overdue)
                    : "-"
                }
                onPress={() => {}}
                size={adjustedItemSize}
              />
              <CardRequests
                value={
                  statsCounts.requests != null
                    ? String(statsCounts.requests)
                    : "-"
                }
                onPress={() => {}}
                size={adjustedItemSize}
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
    paddingTop: 50,
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
    marginTop: 10,
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
});

export default HomeLibrarian;
