import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../services/api";
import Header from "../../components/Perfil/Header";
import UserCard from "../../components/Perfil/UserCard";
import StatsCards from "../../components/Perfil/StatsCards";
import AlertCard from "../../components/Perfil/AlertCard";
import LoanCard from "../../components/Perfil/LoanCard";
import ReservationCard from "../../components/Perfil/ReservationCard";
import TabBar from "../../components/home/TagBar";

// Dados de exemplo para fallback
const exampleApiResponse = {
  name: "Usuário",
  registration: "000000",
  email: "usuario@exemplo.com",
  phone: "(00) 00000-0000",
  stats: {
    loans: 0,
    favorites: 0,
    returned: 0,
  },
  alert: { hasOverdue: false },
  history: [],
};

const MeuPerfilScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = await AsyncStorage.getItem("token");
        const usuarioId = await AsyncStorage.getItem("userId");
        console.log("Usuario ID:", usuarioId);
        console.log("Token:", token);
        console.log("Fetching profile data...");
        if (!usuarioId) {
          setProfile(exampleApiResponse);
          return;
        }

        const headers = token
          ? { Authorization: `Bearer ${token}` }
          : undefined;

        console.log("Chamando API:", `/usuarios/${usuarioId}`);

        const [profileJson, loansJson, favsJson, reservasJson] =
          await Promise.all([
            api.get(`/usuarios/${usuarioId}`, {
              headers,
              signal: controller.signal,
            }),
            api.get(`/emprestimos/usuario/${usuarioId}`, {
              headers,
              signal: controller.signal,
            }),
            api.get(`/favoritos/usuario/${usuarioId}`, {
              headers,
              signal: controller.signal,
            }),
            api.get(`/reservas/usuario/${usuarioId}`, {
              headers,
              signal: controller.signal,
            }),
          ]);

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

        const loansArray = Array.isArray(loansJson)
          ? loansJson
          : loansJson && loansJson.success && Array.isArray(loansJson.data)
          ? loansJson.data
          : [];
        const favsArray =
          favsJson && favsJson.success && Array.isArray(favsJson.data)
            ? favsJson.data
            : [];

        // Buscar dados completos dos livros dos empréstimos
        const livrosPromises = loansArray.map(async (loan) => {
          try {
            const livroId = loan.idLivro || loan.id_livro;
            const livroData = await api.get(`/livros/${livroId}`, {
              headers,
              signal: controller.signal,
            });
            return livroData?.data || { titulo: `Livro #${livroId}` };
          } catch (error) {
            return { titulo: `Livro #${loan.idLivro || loan.id_livro}` };
          }
        });

        const livrosData = await Promise.all(livrosPromises);

        // Buscar dados dos livros das reservas
        const reservasArray = reservasJson?.data || [];
        const activeReservations = reservasArray.filter(
          (r) => r.status === "PENDENTE"
        );

        const reservasWithBooks = await Promise.all(
          activeReservations.map(async (reserva) => {
            try {
              const livroId = reserva.livroId;
              const livroData = await api.get(`/livros/${livroId}`, {
                headers,
                signal: controller.signal,
              });
              return {
                ...reserva,
                bookTitle: livroData?.data?.titulo || `Livro #${livroId}`,
                bookData: livroData?.data,
              };
            } catch (error) {
              return {
                ...reserva,
                bookTitle: `Livro #${reserva.livroId}`,
              };
            }
          })
        );

        setReservations(reservasWithBooks);

        const history = loansArray.map((l, index) => {
          const livro = livrosData[index] || {};

          return {
            title:
              livro.titulo ||
              livro.title ||
              `Livro #${l.idLivro || l.id_livro || "N/A"}`,
            status:
              l.status === "ATIVO"
                ? "Ativo"
                : l.status === "DEVOLVIDO"
                ? "Devolvido"
                : l.status === "ATRASADO"
                ? "Atrasado"
                : l.status || "Ativo",
            loanDate:
              l.dataEmprestimo || l.data_emprestimo || l.loanDate || null,
            returnDate:
              l.dataPrevistaDevolucao ||
              l.data_devolucao_prevista ||
              l.returnDate ||
              null,
            returnedAt:
              l.dataDevolucao || l.data_devolvido || l.returnedAt || null,
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
            returned: loansCount,
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
            returned={profile.stats?.loans}
          />

          {profile.alert?.hasOverdue && (
            <AlertCard message={profile.alert.message} />
          )}

          {/* Seção de Reservas Ativas */}
          {reservations.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Reservas Ativas</Text>
                <Text style={styles.sectionSubtitle}>
                  {reservations.length} reserva
                  {reservations.length > 1 ? "s" : ""}
                </Text>
              </View>

              {reservations.map((reserva, idx) => (
                <ReservationCard
                  key={reserva.id || idx}
                  item={reserva}
                  onPress={() => {
                    if (reserva.bookData) {
                      navigation.navigate("EspecificacoesLivro", {
                        book: {
                          ...reserva.bookData,
                          id_livro: reserva.livroId,
                          titulo: reserva.bookTitle,
                        },
                      });
                    }
                  }}
                />
              ))}
            </>
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
  sectionHeader: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "500",
  },
  historyHeader: { alignItems: "center", marginTop: 24, marginBottom: 6 },
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
