import ActionsPanel from "../../components/admin/actions/ActionsPanel";
import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MetricGrid from "../../components/admin/MetricGrid";
import MonthlyActivity from "../../components/admin/MonthlyActivity";
import TeamCard from "../../components/admin/TeamCard";

import TotalUsersCard from "../../components/admin/cards/TotalUsersCard";
import UniqueTitlesCard from "../../components/admin/cards/UniqueTitlesCard";
import ActiveLoansCard from "../../components/admin/cards/ActiveLoansCard";
import OverdueLoansCard from "../../components/admin/cards/OverdueLoansCard";

// Static/demo data so the screen works without API requests
const metrics = [
  TotalUsersCard,
  UniqueTitlesCard,
  ActiveLoansCard,
  OverdueLoansCard,
];

const activity = { loans: 45, returns: 38, newUsers: 12 };
const team = { students: 4, librarians: 2 };

const HomeAdmin = () => {
  return (
    <View style={styles.page}>
      <View style={styles.topRow}>
        <Text style={styles.topTitle}>Painel do Bibliotecário</Text>
        <Text style={styles.topSubtitle}>Visão Geral do Sistema</Text>
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.header}>Métricas Principais</Text>

        <MetricGrid metrics={metrics} />

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
