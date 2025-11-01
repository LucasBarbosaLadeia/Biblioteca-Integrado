import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // log to console and optionally a remote logger
    console.error("ErrorBoundary caught:", error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Ocorreu um erro na tela</Text>
          <Text style={styles.message}>{String(this.state.error)}</Text>
          <View style={styles.buttons}>
            <Button
              title="Recarregar"
              onPress={() => {
                this.setState({ hasError: false, error: null, info: null });
              }}
            />
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#071028",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 8 },
  message: { color: "#ddd", marginBottom: 16 },
  buttons: { width: "80%" },
});

export default ErrorBoundary;
