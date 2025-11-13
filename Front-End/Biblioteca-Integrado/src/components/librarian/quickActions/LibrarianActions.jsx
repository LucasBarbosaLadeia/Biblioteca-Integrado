import React from "react";
import { View, StyleSheet } from "react-native";
import QuickAction from "./QuickAction";
import SolicitacoesPendentes from "./SolicitacoesPendentes";
import EmprestimoManual from "./EmprestimoManual";
import AdicionarLivro from "./AdicionarLivro";
import GerenciarEmprestimos from "./GerenciarEmprestimos";
import GerenciarLivros from "./GerenciarLivros";

const LibrarianActions = ({ actions = [], navigation }) => {
  if (actions && actions.length > 0) {
    return (
      <View style={styles.container}>
        {actions.map((a, i) => (
          <QuickAction
            key={i}
            title={a.title}
            subtitle={a.subtitle}
            onPress={a.onPress}
            color={a.color}
            icon={a.icon}
          />
        ))}
      </View>
    );
  }

  // default: render the 4 built-in quick action components
  return (
    <View style={styles.container}>
      <SolicitacoesPendentes
        onPress={() =>
          navigation &&
          navigation.navigate &&
          navigation.navigate("PendingRequests")
        }
      />
      <EmprestimoManual
        onPress={() =>
          navigation && navigation.navigate && navigation.navigate("ManualLoan")
        }
      />
      <AdicionarLivro
        onPress={() =>
          navigation && navigation.navigate && navigation.navigate("AddBook")
        }
      />
      <GerenciarLivros
        onPress={() =>
          navigation &&
          navigation.navigate &&
          navigation.navigate("ManageBooks")
        }
      />
      <GerenciarEmprestimos
        onPress={() =>
          navigation &&
          navigation.navigate &&
          navigation.navigate("ManageLoans")
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
});

export default LibrarianActions;
