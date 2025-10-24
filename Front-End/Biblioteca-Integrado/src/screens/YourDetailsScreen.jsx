import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import Header from "../components/Perfil/Header";
import UserCard from "../components/Perfil/UserCard";
import StatsCards from "../components/Perfil/StatsCards";
import AlertCard from "../components/Perfil/AlertCard";
import LoanCard from "../components/Perfil/LoanCard";
import TabBar from "../components/home/TagBar";

// Example screen "Meu Perfil" using NativeWind className for styling
const exampleApiResponse = {
  name: "João Silva",
  registration: "2023001234",
  email: "joao.silva@universidade.edu.br",
  phone: "(11) 98765-4321",
  stats: { loans: 2, favorites: 2, returned: 1 },
  alert: {
    hasOverdue: true,
    message:
      "Você tem 1 livro em atraso. Devolva o mais rápido possível para evitar multas.",
  },
  history: [
    {
      title: "Clean Code",
      status: "Ativo",
      loanDate: "2025-09-30",
      returnDate: "2025-10-28",
    },
    {
      title: "Harry Potter e a Pedra Filosofal",
      status: "Devolvido",
      loanDate: "2025-09-14",
      returnDate: "2025-10-14",
      returnedAt: "2025-10-13",
    },
    {
      title: "Algoritmos e Estruturas de Dados",
      status: "Atrasado",
      loanDate: "2025-09-19",
      returnDate: "2025-10-19",
    },
    {
      title: "Design Patterns",
      status: "Atrasado",
      loanDate: "2025-09-25",
      returnDate: "2025-10-25",
    },
    {
      title: "Clean Code",
      status: "Ativo",
      loanDate: "2025-09-30",
      returnDate: "2025-10-28",
    },
    {
      title: "Harry Potter e a Pedra Filosofal",
      status: "Devolvido",
      loanDate: "2025-09-14",
      returnDate: "2025-10-14",
      returnedAt: "2025-10-13",
    },
  ],
};

const MeuPerfilScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate fetch delay; replace with actual fetch/axios in production
        await new Promise((res) => setTimeout(res, 900));
        // Simulate success
        // const res = await fetch('/api/profile', { signal: controller.signal });
        // const data = await res.json();
        const data = exampleApiResponse;
        setProfile(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Erro ao carregar perfil");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    return () => controller.abort();
  }, []);

  return (
    <View style={styles.container}>
      <Header onBack={() => navigation?.goBack?.()} />
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#47b3ff" />
          <Text style={styles.loadingText}>Carregando perfil...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <UserCard
            name={profile.name}
            registration={profile.registration}
            email={profile.email}
            phone={profile.phone}
          />
          <StatsCards
            loans={profile.stats?.loans}
            favorites={profile.stats?.favorites}
            returned={profile.stats?.returned}
          />

          {profile.alert?.hasOverdue && (
            <AlertCard message={profile.alert.message} />
          )}

          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Histórico de Empréstimos</Text>
          </View>

          {Array.isArray(profile.history) && profile.history.length > 0 ? (
            profile.history.map((h, idx) => (
              <LoanCard key={`${h.title}-${idx}`} item={h} />
            ))
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Nenhum histórico encontrado.</Text>
            </View>
          )}
        </ScrollView>
      )}
      <TabBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1221" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { color: "#cbd5e1", marginTop: 8 },
  errorText: { color: "#f87171" },
  scrollContent: { paddingBottom: 36 },
  historyHeader: { alignItems: "center", marginTop: 1, marginBottom: 6 },
  historyTitle: { color: "white", fontSize: 16, fontWeight: "700" },
  empty: {
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#0f1724",
  },
  emptyText: { color: "#c6d1e6" },
});
export default MeuPerfilScreen;
