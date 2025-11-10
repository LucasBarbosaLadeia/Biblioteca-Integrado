import ActionsPanel from "../../components/admin/actions/ActionsPanel";
import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { api } from "../../services/api";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MetricGrid from "../../components/admin/MetricGrid";
import MonthlyActivity from "../../components/admin/MonthlyActivity";
import TeamCard from "../../components/admin/TeamCard";
import CirculationSummary from "../../components/admin/CirculationSummary";
import TopBooksList from "../../components/admin/TopBooksList";

import TotalUsersCard from "../../components/admin/cards/TotalUsersCard";
import UniqueTitlesCard from "../../components/admin/cards/UniqueTitlesCard";
import ActiveLoansCard from "../../components/admin/cards/ActiveLoansCard";
import OverdueLoansCard from "../../components/admin/cards/OverdueLoansCard";
import PlaceholderCard from "../../components/common/PlaceholderCard";

// Defaults removed: do not present mocked examples in the admin dashboard.
// Use empty arrays / zero-values so the UI reflects real backend data (or empty state).

const HomeAdmin = () => {
  const [metrics, setMetrics] = useState([]);

  // Start with empty/zero values; real values will be populated from the API.
  const [activity, setActivity] = useState({
    loans: 0,
    returns: 0,
    newUsers: 0,
  });
  const [team, setTeam] = useState({ students: 0, librarians: 0 });
  const [topBooks, setTopBooks] = useState([]);
  const [circulation, setCirculation] = useState({
    circulationRate: 0,
    returnRate: 0,
    inCirculation: 0,
    available: 0,
  });

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        // Users: get total and breakdown by tipo
        const dataUsers = await api.get("usuarios?page=1&limit=1000");
        const users = dataUsers?.data ?? [];
        const totalUsers = Array.isArray(users)
          ? users.length
          : dataUsers?.pagination?.total ?? 0;
        const studentsCount = users.filter((u) => u.tipo === "aluno").length;
        const librariansCount = users.filter(
          (u) => u.tipo === "funcionario"
        ).length;

        // Books: total and available
        const dataBooks = await api.get("livros?page=1&limit=1");
        const totalBooks = dataBooks?.pagination?.total ?? null;
        const dataBooksAvail = await api.get(
          "livros/disponiveis?page=1&limit=1"
        );
        const availableBooks = dataBooksAvail?.pagination?.total ?? null;

        // Empréstimos estatísticas
        const dataLoans = await api.get("emprestimos/estatisticas");
        const loanStats = dataLoans?.data ?? {};

        // Favoritos estatísticas (top livros favoritados)
        const dataFav = await api.get("favoritos/estatisticas");
        const favStats = dataFav?.data ?? {};

        if (!mounted) return;

        // Build metrics array expected by MetricGrid
        const builtMetrics = [
          {
            icon: TotalUsersCard.icon,
            value: totalUsers ?? 0,
            title: "Total de Usuários",
            subtitle: `${studentsCount ?? 0} alunos`,
            color: TotalUsersCard.color,
            backgroundColor: TotalUsersCard.backgroundColor,
            borderColor: TotalUsersCard.borderColor,
          },
          {
            icon: UniqueTitlesCard.icon,
            value: totalBooks ?? 0,
            title: "Títulos Únicos",
            subtitle: availableBooks
              ? `${availableBooks} disponíveis`
              : `0 disponíveis`,
            color: UniqueTitlesCard.color,
            backgroundColor: UniqueTitlesCard.backgroundColor,
            borderColor: UniqueTitlesCard.borderColor,
          },
          {
            icon: ActiveLoansCard.icon,
            value: loanStats.emprestimosAtivos ?? 0,
            title: "Empréstimos Ativos",
            subtitle: `${loanStats.totalEmprestimos ?? 0}`,
            color: ActiveLoansCard.color,
            backgroundColor: ActiveLoansCard.backgroundColor,
            borderColor: ActiveLoansCard.borderColor,
          },
          {
            icon: OverdueLoansCard.icon,
            value: loanStats.emprestimosAtrasados ?? 0,
            title: "Empréstimos Atrasados",
            subtitle: `${loanStats.emprestimosAtrasados ?? 0}`,
            color: OverdueLoansCard.color,
            backgroundColor: OverdueLoansCard.backgroundColor,
            borderColor: OverdueLoansCard.borderColor,
          },
        ];

        setMetrics(builtMetrics);
        setActivity({
          loans: loanStats.totalEmprestimos ?? 0,
          returns: loanStats.emprestimosDevolvidos ?? 0,
          newUsers: studentsCount ?? 0,
        });
        setTeam({ students: studentsCount, librarians: librariansCount });

        setTopBooks(
          (favStats.livrosMaisFavoritados || []).map((l) => ({
            title: l.livro?.titulo ?? "-",
            author: l.livro?.autor ?? "-",
            timesLoaned: l.total_favoritos ?? 0,
          }))
        );

        setCirculation((prev) => ({
          ...prev,
          inCirculation: loanStats.emprestimosAtivos ?? prev.inCirculation,
          available: availableBooks ?? prev.available,
        }));
      } catch (err) {
        console.warn("Erro ao buscar dados do dashboard:", err);
        // fallback: keep defaults
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <View style={styles.page}>
      <View style={styles.topRow}>
        <Text style={styles.topTitle}>Dashboard Administrativo</Text>
        <Text style={styles.topSubtitle}>Análise de Dados da Biblioteca</Text>
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.header}>Métricas Principais</Text>

        {metrics && metrics.length > 0 ? (
          <MetricGrid metrics={metrics} />
        ) : (
          <PlaceholderCard
            title="Sem dados disponíveis"
            subtitle="Nenhuma métrica disponível no momento."
          />
        )}

        <CirculationSummary
          circulationRate={circulation.circulationRate}
          returnRate={circulation.returnRate}
          inCirculation={circulation.inCirculation}
          available={circulation.available}
        />

        {topBooks && topBooks.length > 0 ? (
          <TopBooksList books={topBooks} />
        ) : (
          <PlaceholderCard
            title="Sem livros populares"
            subtitle="Nenhum livro foi favoritado o suficiente para aparecer aqui."
          />
        )}

        <Text style={styles.subHeader}>Atividade do Mês</Text>
        {activity &&
        (activity.loans || activity.returns || activity.newUsers) ? (
          <MonthlyActivity
            loans={activity.loans}
            returns={activity.returns}
            newUsers={activity.newUsers}
          />
        ) : (
          <PlaceholderCard
            title="Sem atividade"
            subtitle="Nenhuma atividade registrada neste mês."
          />
        )}

        <Text style={styles.subHeader}>Equipe da Biblioteca</Text>
        {team && (team.students || team.librarians) ? (
          <TeamCard students={team.students} librarians={team.librarians} />
        ) : (
          <PlaceholderCard
            title="Sem dados da equipe"
            subtitle="Informações da equipe não disponíveis."
          />
        )}

        <ActionsPanel />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#020618",
    flex: 1,
  },
  container: {
    padding: 10,
  },
  scroll: {
    flex: 1,
  },
  topRow: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: 40,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#061248ff",
    backgroundColor: "#020618",
    // subtle shadow to separate header from content
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },
  topTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
  },
  topSubtitle: {
    color: "#9fb0c8",
    fontSize: 14,
    fontWeight: "400",
  },
  header: {
    color: "#9fb0c8",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 8,
  },
  subHeader: {
    color: "#9fb0c8",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 8,
  },
});

export default HomeAdmin;
