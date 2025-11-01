import React from "react";
import { View, Image, StyleSheet } from "react-native";

const CoverImage = ({ cover, style }) => {
  const source = cover
    ? typeof cover === "string"
      ? { uri: cover }
      : cover
    : null;

  return (
    <View style={styles.wrapper}>
      {source && <Image source={source} style={[styles.image, style]} />}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", marginVertical: 10 },
  image: {
    width: 160,
    height: 220,
    borderRadius: 12,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
});

export default CoverImage;
