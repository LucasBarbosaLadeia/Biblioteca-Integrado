import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AvailabilityBadge = ({ isAvailable, copies }) => {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isAvailable ? "#022D23" : "#340E1E" },
      ]}
    >
      <Text style={styles.text}>
        {isAvailable ? `Disponível · ${copies || 0} cópias` : "Indisponível "}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
    marginBottom: 6,
  },
  text: { color: "white", fontWeight: "600" },
});

export default AvailabilityBadge;
