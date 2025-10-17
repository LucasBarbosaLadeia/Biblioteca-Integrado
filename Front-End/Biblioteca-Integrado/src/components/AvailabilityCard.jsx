import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomAlert from "./CustomAlert";

const AvailabilityCard = ({ book }) => {
  const [showAlert, setShowAlert] = useState(false);

  const handleNotifyClick = () => {
    setShowAlert(true);
  };

  return (
    <View style={styles.cardContainer}>
      <CustomAlert
        visible={showAlert}
        title="Aviso"
        message={
          "Funcionalidade será implementada quando houver integração com o lado da empresa."
        }
        onClose={() => setShowAlert(false)}
        buttonText="OK"
      />
      {book.isAvailable ? (
        <>
          <View style={styles.statusRow}>
            <Ionicons name="checkmark-circle" size={24} color="#2ECC71" />
            <Text style={styles.statusText}>Disponível</Text>
          </View>
          <Text style={styles.detailText}>
            Exemplares Disponíveis: {book.qt_atual}
          </Text>
          <Text style={styles.detailText}>
            Localização: Prateleira {book.prateleira}
          </Text>
        </>
      ) : (
        <>
          <View style={styles.statusRow}>
            <Ionicons name="close-circle" size={24} color="#E74C3C" />
            <Text style={styles.statusText}>Indisponível</Text>
          </View>

          <TouchableOpacity
            style={styles.notifyButton}
            onPress={handleNotifyClick}
          >
            <Text style={styles.notifyButtonText}>
              Notificar quando disponível
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

// Seus estilos continuam os mesmos
const styles = StyleSheet.create({
  cardContainer: {
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
    marginBottom: 20,
  },
  statusRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  statusText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 10,
  },
  detailText: { color: "white", fontSize: 16, marginTop: 5 }, // Adicionei um marginTop para espaçamento
  notifyButton: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
  },
  notifyButtonText: {
    color: "white",
    fontSize: 14,
  },
  notifyButtonActive: {
    backgroundColor: "#20f038ff",
    borderColor: "#20f062ff",
  },
  notifyButtonTextActive: {
    color: "white",
    fontWeight: "bold",
  },
});

export default AvailabilityCard;
