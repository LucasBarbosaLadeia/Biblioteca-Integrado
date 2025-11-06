import ActionsPanel from "../../components/admin/actions/ActionsPanel";
import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { API_HOST } from "@env";
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

// Defaults (used as fallback)
const defaultActivity = { loans: 45, returns: 38, newUsers: 12 };
const defaultTeam = { students: 4, librarians: 2 };
const defaultTopBooks = [
  {
    title: "Algoritmos e Estruturas de Dados",
    author: "Thomas H. Cormen",
    timesLoaned: 2,
  },
  { title: "Clean Code", author: "Robert C. Martin", timesLoaned: 1 },
  {
    title: "Harry Potter e a Pedra Filosofal",
    author: "J.K. Rowling",
    timesLoaned: 1,
  },
];

const HomeAdmin = () => {
  const [metrics, setMetrics] = useState([
    TotalUsersCard,
    UniqueTitlesCard,
    ActiveLoansCard,
    OverdueLoansCard,
  ]);

  const [activity, setActivity] = useState(defaultActivity);
  const [team, setTeam] = useState(defaultTeam);
  const [topBooks, setTopBooks] = useState(defaultTopBooks);
  const [circulation, setCirculation] = useState({
    circulationRate: 5.3,
    returnRate: 84,
    inCirculation: 19,
    available: 18,
  });

  useEffect(() => {
    let mounted = true;
    const API = API_HOST || "http://localhost:3001";

    const fetchData = async () => {
      try {
        // Users: get total and breakdown by tipo
        const resUsers = await fetch(`${API}/api/usuarios?page=1&limit=1000`);
        const dataUsers = await resUsers.json();
        const users = dataUsers?.data ?? [];
        const totalUsers = Array.isArray(users)
          ? users.length
          : dataUsers?.pagination?.total ?? 0;
        const studentsCount = users.filter((u) => u.tipo === "aluno").length;
        const librariansCount = users.filter(
          (u) => u.tipo === "funcionario"
        ).length;

        // Books: total and available
        const resBooks = await fetch(`${API}/api/livros?page=1&limit=1`);
        const dataBooks = await resBooks.json();
        const totalBooks = dataBooks?.pagination?.total ?? null;

        const resBooksAvail = await fetch(
          `${API}/api/livros/disponiveis?page=1&limit=1`
        );
        const dataBooksAvail = await resBooksAvail.json();
        const availableBooks = dataBooksAvail?.pagination?.total ?? null;

        // Empréstimos estatísticas
        const resLoans = await fetch(`${API}/api/emprestimos/estatisticas`);
        const dataLoans = await resLoans.json();
        const loanStats = dataLoans?.data ?? {};

        // Favoritos estatísticas (top livros favoritados)
        const resFav = await fetch(`${API}/api/favoritos/estatisticas`);
        const dataFav = await resFav.json();
        const favStats = dataFav?.data ?? {};

        if (!mounted) return;

        // Build metrics array expected by MetricGrid
        const builtMetrics = [
          {
            icon: TotalUsersCard.icon,
            value: totalUsers ?? TotalUsersCard.value,
            title: "Total de Usuários",
            subtitle: `${studentsCount} alunos`,
            color: TotalUsersCard.color,
            backgroundColor: TotalUsersCard.backgroundColor,
            borderColor: TotalUsersCard.borderColor,
          },
          {
            icon: UniqueTitlesCard.icon,
            value: totalBooks ?? UniqueTitlesCard.value,
            title: "Títulos Únicos",
            subtitle: availableBooks
              ? `${availableBooks} disponíveis`
              : UniqueTitlesCard.subtitle,
            color: UniqueTitlesCard.color,
            backgroundColor: UniqueTitlesCard.backgroundColor,
            borderColor: UniqueTitlesCard.borderColor,
          },
          {
            icon: ActiveLoansCard.icon,
            value: loanStats.emprestimosAtivos ?? ActiveLoansCard.value,
            title: "Empréstimos Ativos",
            subtitle: `${loanStats.totalEmprestimos ?? ActiveLoansCard.subtitle}`,
            color: ActiveLoansCard.color,
            backgroundColor: ActiveLoansCard.backgroundColor,
            borderColor: ActiveLoansCard.borderColor,
          },
          {
            icon: OverdueLoansCard.icon,
            value: loanStats.emprestimosAtrasados ?? OverdueLoansCard.value,
            title: "Empréstimos Atrasados",
            subtitle: `${loanStats.emprestimosAtrasados ?? OverdueLoansCard.subtitle}`,
            color: OverdueLoansCard.color,
            backgroundColor: OverdueLoansCard.backgroundColor,
            borderColor: OverdueLoansCard.borderColor,
          },
        ];

        setMetrics(builtMetrics);
        setActivity({
          loans: loanStats.totalEmprestimos ?? defaultActivity.loans,
          returns: loanStats.emprestimosDevolvidos ?? defaultActivity.returns,
          newUsers: studentsCount ?? defaultActivity.newUsers,
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

        <MetricGrid metrics={metrics} />

        <CirculationSummary
          circulationRate={circulation.circulationRate}
          returnRate={circulation.returnRate}
          inCirculation={circulation.inCirculation}
          available={circulation.available}
        />

        <TopBooksList books={topBooks} />

        <Text style={styles.subHeader}>Atividade do Mês</Text>
        <MonthlyActivity
          loans={activity.loans}
          returns={activity.returns}
          newUsers={activity.newUsers}
        />

        <Text style={styles.subHeader}>Equipe da Biblioteca</Text>
        <TeamCard students={team.students} librarians={team.librarians} />

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
