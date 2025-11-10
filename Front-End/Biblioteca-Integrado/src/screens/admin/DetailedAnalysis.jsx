import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { api } from "../../services/api";
import TrendChart from "../../components/admin/analysis/TrendChart";
import CategoryPerformance from "../../components/admin/analysis/CategoryPerformance";
import InsightCard from "../../components/admin/analysis/InsightCard";
import PlaceholderCard from "../../components/common/PlaceholderCard";

// Note: Removed hard-coded sample data. When backend data is unavailable
// we default to empty arrays/objects so the UI shows "no data" instead of
// presenting mocked examples.

const DetailedAnalysis = () => {
  // Start with empty collections so UI shows zeros/placeholders when backend
  // data is not available instead of rendering NaN or using mocked data.
  const [data, setData] = useState({ monthly: [], categories: [], insights: [] });
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        // tenta buscar dados reais do backend via helper; se falhar, cai no fallback
        try {
          const json = await api.get("analytics");
          if (mounted) setData(json);
        } catch (e) {
          // fallback será aplicado abaixo
          throw e;
        }
      } catch (err) {
        // fallback: sem dados (vazio). Não usar dados mocados.
        if (mounted)
          setData({ monthly: [], categories: [], insights: [] });
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => (mounted = false);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#16a34a" />
      </SafeAreaView>
    );
  }

  // Derived numeric values with safe fallbacks to 0
  const totalMonthly = (data?.monthly || []).reduce(
    (s, m) => s + (m?.value || 0),
    0
  );
  const avgMonthly = (data?.monthly && data.monthly.length)
    ? Math.round(totalMonthly / data.monthly.length)
    : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topRow}>
        <TouchableOpacity
          onPress={() => navigation && navigation.goBack && navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={22} color="#9fb0c8" />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.title}>Análise Detalhada</Text>
          <Text style={styles.subtitle}>Relatórios e gráficos</Text>
        </View>
        <Ionicons name="analytics" size={22} color="#9fb0c8" />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.rowTop}>
          <View style={styles.colLeft}>
            {data?.monthly && data.monthly.length > 0 ? (
              <TrendChart data={data.monthly} />
            ) : (
              <PlaceholderCard title="Sem dados disponíveis" subtitle="Nenhuma informação de tendência mensal." />
            )}

            {data?.categories && data.categories.length > 0 ? (
              <CategoryPerformance categories={data.categories} />
            ) : (
              <PlaceholderCard title="Sem dados disponíveis" subtitle="Nenhuma categoria para exibir desempenho." />
            )}
          </View>

          <View style={styles.colRight}>
            <InsightCard
              emoji={"📊"}
              title={`Total Empréstimos: ${totalMonthly}`}
              subtitle={`Média mensal: ${avgMonthly}`}
              color={"#06b6d4"}
            />

            {data?.insights && data.insights.length > 0 ? (
              data.insights.map((ins, i) => (
                <InsightCard
                  key={i}
                  emoji={ins.emoji}
                  title={ins.title}
                  subtitle={ins.subtitle}
                  color={ins.color}
                />
              ))
            ) : (
              <PlaceholderCard title="Sem insights" subtitle="Nenhuma observação disponível no momento." />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#071023" },
  container: { padding: 16, alignContent: "center" },
  header: { color: "#fff", fontSize: 22, fontWeight: "800", marginBottom: 12 },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginTop: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#061248ff",
    backgroundColor: "#071023",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },
  title: { color: "#fff", fontSize: 20, fontWeight: "800" },
  subtitle: { color: "#9fb0c8", fontSize: 14, fontWeight: "400" },
  rowTop: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  colLeft: { flex: 2, marginRight: 2, minWidth: 290 },
  colRight: {
    width: 360,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#071023",
  },
  
});

export default DetailedAnalysis;
