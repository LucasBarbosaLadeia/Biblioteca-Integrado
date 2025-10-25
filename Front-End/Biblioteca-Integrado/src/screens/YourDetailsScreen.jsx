import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_HOST } from "@env";
import Header from "../components/Perfil/Header";
import UserCard from "../components/Perfil/UserCard";
import StatsCards from "../components/Perfil/StatsCards";
import AlertCard from "../components/Perfil/AlertCard";
import LoanCard from "../components/Perfil/LoanCard";
import TabBar from "../components/home/TagBar";

// Example fallback used if network calls fail
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
  ],
};

const MeuPerfilScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProfile = async () => {
      const API = API_HOST || "http://localhost:3001";
      try {
        setLoading(true);
        setError(null);

        const token = await AsyncStorage.getItem("token");
        const usuarioId = await AsyncStorage.getItem("userId");
        if (!usuarioId) {
          // if no logged user, fallback to example
          setProfile(exampleApiResponse);
          return;
        }

        // Fetch profile, loans and favorites in parallel
        const headers = token
          ? { Authorization: `Bearer ${token}` }
          : undefined;

        const [resProfile, resLoans, resFavs] = await Promise.all([
          fetch(`${API}/api/usuarios/${usuarioId}`, {
            headers,
            signal: controller.signal,
          }),
          fetch(`${API}/api/emprestimos/usuario/${usuarioId}`, {
            headers,
            signal: controller.signal,
          }),
          fetch(`${API}/api/favoritos/usuario/${usuarioId}`, {
            headers,
            signal: controller.signal,
          }),
        ]);

        const [profileJson, loansJson, favsJson] = await Promise.all([
          resProfile.ok ? resProfile.json() : null,
          resLoans.ok ? resLoans.json() : null,
          resFavs.ok ? resFavs.json() : null,
        ]);

        // Map profile
        let mappedProfile = {
          name:
            profileJson && profileJson.success && profileJson.data
              ? profileJson.data.nome || profileJson.data.name
              : undefined,
          registration:
            profileJson && profileJson.success && profileJson.data
              ? profileJson.data.RA || profileJson.data.registration
              : undefined,
          email:
            profileJson && profileJson.success && profileJson.data
              ? profileJson.data.email
              : undefined,
          phone:
            profileJson && profileJson.success && profileJson.data
              ? profileJson.data.phone
              : undefined,
        };

        // Map loans (history) and stats
        const loansArray =
          loansJson && loansJson.success && Array.isArray(loansJson.data)
            ? loansJson.data
            : [];
        const favsArray =
          favsJson && favsJson.success && Array.isArray(favsJson.data)
            ? favsJson.data
            : [];

        const history = loansArray.map((l) => {
          const livro = l.livro || l.book || l;
          return {
            title:
              livro.titulo ||
              livro.title ||
              l.titulo ||
              l.title ||
              "Sem título",
            status:
              l.status || l.estado || (l.devolvido ? "Devolvido" : "Ativo"),
            loanDate: l.data_emprestimo || l.loanDate || l.data || null,
            returnDate: l.data_devolucao_prevista || l.returnDate || null,
            returnedAt: l.data_devolvido || l.returnedAt || null,
          };
        });

        const loansCount = loansArray.length;
        const returnedCount = loansArray.filter(
          (x) =>
            (x.status || x.estado || (x.devolvido ? "Devolvido" : "Ativo")) ===
            "Devolvido"
        ).length;
        const favoritesCount = favsArray.length;

        const hasOverdue = loansArray.some(
          (x) =>
            (x.status || x.estado || (x.atrasado ? "Atrasado" : null)) ===
            "Atrasado"
        );
        const alert = hasOverdue
          ? {
              hasOverdue: true,
              message: "Você tem livros em atraso. Verifique seu histórico.",
            }
          : { hasOverdue: false };

        setProfile({
          name: mappedProfile.name || exampleApiResponse.name,
          registration:
            mappedProfile.registration || exampleApiResponse.registration,
          email: mappedProfile.email || exampleApiResponse.email,
          phone: mappedProfile.phone || exampleApiResponse.phone,
          stats: {
            loans: loansCount,
            favorites: favoritesCount,
            returned: returnedCount,
          },
          alert,
          history: history.length ? history : exampleApiResponse.history,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Erro ao carregar perfil do usuário:", err);
          setError("Erro ao carregar perfil. Usando dados locais.");
          setProfile(exampleApiResponse);
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
