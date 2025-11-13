import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useWindowDimensions } from "react-native";

const DashboardCard = ({
  title,
  value,
  subtitle,
  color = "#0f1724",
  onPress,
  icon,
  accent,
  size,
}) => {
  // accent: optional color for icon background (circle)
  const iconBg = accent || "rgba(255,255,255,0.12)";

  // compute dynamic font sizes based on provided size (square side)
  // sensible defaults when size is not provided
  const valueFontSize = size
    ? Math.max(16, Math.min(40, Math.round(size * 0.2)))
    : 28;
  const subtitleFontSize = size
    ? Math.max(10, Math.min(16, Math.round(size * 0.07)))
    : 12;
  const titleFontSize = size
    ? Math.max(11, Math.min(18, Math.round(size * 0.085)))
    : 13;

  // layout responsiveness based on available width
  const { width: _width } = useWindowDimensions();
  const smallScreen = _width < 360;
  const mediumScreen = _width >= 360 && _width < 480;
  // decide how many columns the grid should show (1 column on narrow screens)
  const columns = _width < 420 ? 1 : _width < 900 ? 2 : 3;
  const iconCircle = size
    ? Math.max(28, Math.min(48, Math.round(size * 0.27)))
    : smallScreen
    ? 26
    : mediumScreen
    ? 30
    : 34;
  const iconInnerSize = Math.max(12, Math.round(iconCircle * 0.55));

  // prepare cloned icon with adjusted size if it's a valid React element
  let iconElement = icon;
  try {
    if (icon && React.isValidElement(icon)) {
      iconElement = React.cloneElement(icon, {
        size: iconInnerSize,
        color: icon.props?.color || "#fff",
      });
    }
  } catch (e) {
    // ignore clone errors and keep provided icon
  }

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={onPress}
      style={[
        styles.container,
        { backgroundColor: color },
        // responsive width / height behavior: prefer square cards on larger layouts,
        // but on narrow screens use full-width stacked cards with comfortable height.
        size
          ? {
              width: size,
              height: size,
              padding: Math.max(10, Math.round(size * 0.08)),
            }
          : columns === 1
          ? {
              flexBasis: "100%",
              maxWidth: "100%",
              aspectRatio: undefined,
              padding: 14,
            }
          : columns === 2
          ? { flexBasis: "48%", maxWidth: "48%", aspectRatio: 1 }
          : { flexBasis: "31%", maxWidth: "31%", aspectRatio: 1 },
      ]}
    >
      {icon ? (
        <View
          style={[
            styles.iconWrap,
            {
              backgroundColor: iconBg,
              width: iconCircle,
              height: iconCircle,
              borderRadius: Math.round(iconCircle / 2),
              top: smallScreen ? 6 : mediumScreen ? 8 : 10,
              right: smallScreen ? 6 : mediumScreen ? 8 : 10,
            },
          ]}
        >
          {iconElement}
        </View>
      ) : null}

      <View style={styles.content}>
        <Text style={[styles.value, { fontSize: valueFontSize }]}>{value}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { fontSize: subtitleFontSize }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={styles.footer}>
        <Text style={[styles.title, { fontSize: titleFontSize }]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexBasis: "48%",
    maxWidth: "48%",
    aspectRatio: 1,
    borderRadius: 10,
    padding: 14,
    marginVertical: 6,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "space-between",
  },
  iconWrap: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 38,
    height: 38,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.98,
    // subtle shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    // center area
  },
  footer: {
    // bottom area for title
  },
  title: {
    color: "#e5e7eb",
    fontSize: 14,
    fontWeight: "600",
  },
  value: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    marginTop: 6,
  },
  // footer title (smaller, slightly transparent)
  title: {
    color: "rgba(255,255,255,0.95)",
    fontSize: 13,
    fontWeight: "700",
  },
  // ensure footer area sits at bottom
  footer: {},
});

export default DashboardCard;
