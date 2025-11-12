import React from "react";
import { View, Text, StyleSheet } from "react-native";

const COLORS = {
  bg: "#071025",
  card: "#0b1320",
  accent: "#2f8cff",
  muted: "#9aa0b6",
};

const Stepper = ({ step = 0, steps = ["Livro", "Aluno", "Data"] }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.progressRow}>
        {steps.map((label, idx) => (
          <View key={label} style={styles.stepWrap}>
            <View
              style={[
                styles.dot,
                idx <= step ? styles.dotActive : styles.dotInactive,
              ]}
            />
            {idx < steps.length - 1 && (
              <View
                style={[
                  styles.line,
                  idx < step ? styles.lineActive : styles.lineInactive,
                ]}
              />
            )}
          </View>
        ))}
      </View>
      <View style={styles.labelsRow}>
        {steps.map((label, idx) => (
          <Text
            key={label}
            style={[styles.label, idx === step && styles.labelActive]}
          >
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 12,
    marginTop: 10,
    marginBottom: 8,
    backgroundColor: "rgba(15,20,30,0.25)",
    borderRadius: 12,
    paddingVertical: 8,
  },
  progressRow: { flexDirection: "row", alignItems: "center", height: 26 },
  stepWrap: { flexDirection: "row", alignItems: "center", flex: 1 },
  dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2 },
  dotActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  dotInactive: { backgroundColor: "transparent", borderColor: "#203046" },
  line: { height: 4, flex: 1, marginHorizontal: 8, borderRadius: 4 },
  lineActive: { backgroundColor: COLORS.accent },
  lineInactive: { backgroundColor: "#172033" },
  labelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  label: { color: COLORS.muted, fontSize: 12 },
  labelActive: { color: "#fff", fontWeight: "600" },
});

export default Stepper;
