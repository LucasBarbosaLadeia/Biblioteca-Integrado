import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ActionCard from "./ActionCard";
import { useNavigation } from "@react-navigation/native";

const ActionsPanel = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.wrapper}>
      <Text style={styles.header}>Ações Rápidas da Biblioteca</Text>

      <ActionCard
        title="Gerenciar Livros"
        subtitle="Adicionar, editar ou remover acervo"
        iconName="book-open-page-variant"
        iconColor="#60a5fa"
        onPress={() => navigation.navigate("ManageBooks")}
      />

      <ActionCard
        title="Análise Detalhada"
        subtitle="Relatórios e gráficos"
        iconName="chart-box"
        iconColor="#8b5cf6"
        onPress={() => {
          try {
            // tentamos navegar; se a rota não estiver registrada, o erro será capturado
            navigation.navigate("DetailedAnalysis");
          } catch (err) {
            console.warn("Erro ao navegar para DetailedAnalysis:", err);
            // fallback visual para facilitar debug em dispositivo
            try {
              // eslint-disable-next-line no-undef
              alert("Erro ao abrir tela de Análise: " + (err?.message || err));
            } catch (e) {
              // ignore
            }
          }
        }}
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
