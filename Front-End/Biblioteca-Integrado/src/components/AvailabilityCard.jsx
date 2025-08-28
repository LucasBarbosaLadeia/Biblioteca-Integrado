import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AvailabilityCard = ({ book }) => {
  const [notified, setNotified] = useState(false);

  // --- 1. MUDANÇA NA LÓGICA DA FUNÇÃO ---
  const handleNotifyClick = () => {
    // a função de callback garante que estamos usando o valor mais atual do estado.
    setNotified((currentValue) => !currentValue);

    // O console.log usa o valor atual de 'notified' antes da mudança
    console.log(notified ? "Notificação CANCELADA!" : "Notificação ATIVADA!");
  };

  return (
    <View style={styles.cardContainer}>
      {book.isAvailable ? (
        <>
          <View style={styles.statusRow}>
            <Ionicons name="checkmark-circle" size={24} color="#2ECC71" />
            <Text style={styles.statusText}>Disponível</Text>
          </View>
          <Text style={styles.detailText}>Exemplares Disponíveis: 3</Text>
        </>
      ) : (
        <>
          <View style={styles.statusRow}>
            <Ionicons name="close-circle" size={24} color="#E74C3C" />
            <Text style={styles.statusText}>Indisponível</Text>
          </View>

          <TouchableOpacity
            // 3. O estilo agora alterna para um visual "ativo"
            style={[styles.notifyButton, notified && styles.notifyButtonActive]}
            onPress={handleNotifyClick}
            // 2. REMOVIDA a propriedade 'disabled'
          >
            <Text
              style={[
                styles.notifyButtonText,
                notified && styles.notifyButtonTextActive,
              ]}
            >
              {notified
                ? "Você será notificado!"
                : "Notificar quando disponível"}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

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
  detailText: { color: "white", fontSize: 16 },
  notifyButton: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "transparent", // Estado original transparente
  },
  notifyButtonText: {
    color: "white",
    fontSize: 14,
  },
  // Estilo para quando o botão estiver ATIVADO
  notifyButtonActive: {
    backgroundColor: "#20f038ff", // Roxo, por exemplo
    borderColor: "#20f062ff",
  },
  notifyButtonTextActive: {
    color: "white",
    fontWeight: "bold",
  },
});

export default AvailabilityCard;
