import React from "react";
import { View, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";

const UserAvatar = () => {
  const radius = 30;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;

  return (
    <View style={styles.container}>
      <Svg height="80" width="80" style={styles.svg}>
        {/* C├¡rculo base lil├ís */}
        <Circle
          cx="40"
          cy="40"
          r={radius}
          stroke="#fafafaff"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference * 0.7} ${circumference * 0.3}`} // 73% tra├ºo, 27% espa├ºo
          strokeDashoffset={10}
          strokeLinecap="round"
          transform="rotate(19, 40, 40)"
          fill="none"
        />

        {/* Tra├ºo decorativo roxo em 30┬░ */}
        <Circle
          cx="40"
          cy="40"
          r={radius}
          stroke="#6750A4"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference * 0.15} ${circumference * 0.85}`}
          strokeDashoffset={10} // controla o espa├ºo inicial
          strokeLinecap="round"
          transform="rotate(-60, 40, 40)"
        />
      </Svg>

      {/* ├ìcone central */}
      <View style={styles.iconContainer}>
        <FontAwesome name="user" size={32} color="#7c3aed" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  svg: {
    position: "absolute",
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(248, 242, 242, 0.73)",
  },
});

export default UserAvatar;
