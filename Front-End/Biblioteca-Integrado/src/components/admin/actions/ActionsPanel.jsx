import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ActionCard from "./ActionCard";

const ActionsPanel = () => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.header}>Ações Rápidas</Text>

      <ActionCard
        title="Adicionar Usuário"
        subtitle="Cadastrar aluno ou bibliotecário"
        iconName="account-plus"
        iconColor="#60a5fa"
      />

      <ActionCard
        title="Gerenciar Usuários"
        subtitle="6 usuários cadastrados"
        iconName="account-group"
        iconColor="#8b5cf6"
      />

      <ActionCard
        title="Configurações"
        subtitle="Parâmetros da biblioteca"
        iconName="cog"
        iconColor="#94a3b8"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 16,
  },
  header: {
    color: "#cfe8ff",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 12,
  },
});

export default ActionsPanel;
