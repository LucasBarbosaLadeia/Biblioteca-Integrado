import React, { useState } from "react";
import {
  ScrollView,
  StatusBar,
  useWindowDimensions,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ImageBackground,
  View,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import BackgroundImage from "../assets/background.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { maskRA, unmaskRA } from "../utils/mask";
import { API_HOST } from "@env";
import CustomAlert from "../components/feedback/CustomAlert";

const LoginScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isSmall = width < 360;
  const [ra, setRa] = useState("");
  const [senha, setSenha] = useState("");
  const [showEsqueceuSenha, setShowEsqueceuSenha] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    // create an abort controller so we can timeout the request if it hangs
    const controller = new AbortController();
    const timeoutMs = 8000; // 8 seconds
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      // Fallback: when running on emulador Android via Expo, `localhost` won't work.
      // Use API_HOST from env when available, otherwise try Android emulator loopback.
      const API = API_HOST || "http://10.0.2.2:3001";
      if (!API_HOST)
        console.warn("API_HOST not defined — falling back to", API);

      const response = await fetch(`${API}/api/usuarios/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ra: unmaskRA(ra), senha }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // handle non-2xx responses quickly
      if (!response.ok) {
        // try to parse a JSON error body if present
        let errMsg = `Erro ${response.status}`;
        try {
          const errData = await response.json();
          errMsg = errData.message || errMsg;
        } catch (e) {
          // ignore parse errors, use status text
          errMsg = response.statusText || errMsg;
        }
        setErrorMessage(errMsg || "Credenciais inválidas");
        setShowErrorAlert(true);
        return;
      }

      const data = await response.json();

      if (data.token) {
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("userId", String(data.data.id_usuario));
        // save user name and role quickly so drawer/profile can show immediately without extra fetch
        try {
          const nome = data.data?.nome || data.data?.name || "";
          const tipo = data.data?.tipo || data.data?.role || "";
          if (nome) await AsyncStorage.setItem("userName", String(nome));
          if (tipo) await AsyncStorage.setItem("userRole", String(tipo));
        } catch (e) {
          // ignore storage errors
        }

        navigation.navigate("Home");
      } else {
        setErrorMessage(data.message || "Credenciais inválidas");
        setShowErrorAlert(true);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("Erro ao fazer login:", error);
      if (error.name === "AbortError") {
        setErrorMessage(
          "A requisição expirou. Verifique sua conexão e tente novamente."
        );
      } else {
        setErrorMessage("Erro ao fazer login. Tente novamente mais tarde.");
      }
      setShowErrorAlert(true);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
      <SafeAreaView style={styles.safeArea}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={
              Platform.OS === "ios" ? 0 : StatusBar.currentHeight || 0
            }
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.inner}>
                <CustomAlert
                  visible={showEsqueceuSenha}
                  onClose={() => setShowEsqueceuSenha(false)}
                  title={"Aviso"}
                  message={"Funcionalidade em desenvolvimento"}
                  buttonText={"OK"}
                />
                <CustomAlert
                  visible={showErrorAlert}
                  onClose={() => setShowErrorAlert(false)}
                  title={"Erro"}
                  message={errorMessage}
                  buttonText={"OK"}
                />
                <Text style={isSmall ? styles.titleSmall : styles.title}>
                  Biblioteca Integrado
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Registro (RA)"
                  placeholderTextColor="#BBBBBB"
                  keyboardType="numeric"
                  value={ra}
                  onChangeText={(text) => setRa(maskRA(text))}
                />
                <View style={styles.inputPasswordContainer}>
                  <TextInput
                    style={styles.inputPassword}
                    placeholder="Senha"
                    placeholderTextColor="#BBBBBB"
                    secureTextEntry={!showPassword}
                    value={senha}
                    onChangeText={setSenha}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword((prev) => !prev)}
                  >
                    <Ionicons
                      name={showPassword ? "eye" : "eye-off"}
                      size={24}
                      color="#888"
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={[
                    styles.button,
                    loading ? styles.buttonDisabled : null,
                  ]}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Entrar</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowEsqueceuSenha(true)}>
                  <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1, // Faz a imagem cobrir toda a tela
    resizeMode: "cover", // Garante que a imagem cubra a área, cortando se necessário
    justifyContent: "center", // Alinha o conteúdo interno verticalmente (opcional)
  },
  safeArea: {
    flex: 1, // Ocupa todo o espaço disponível
    // backgroundColor: '#0A1931', // <--- REMOVA ou COMENTE esta linha
  },
  container: {
    flex: 1, // Ocupa todo o espaço disponível
    justifyContent: "center", // Centraliza verticalmente os itens
    alignItems: "center", // Centraliza horizontalmente os itens
    padding: 0, // Padding movido para scrollContent para evitar duplicidade
    backgroundColor: "transparent", // Torna o fundo do container transparente
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  inner: {
    width: "100%",
    maxWidth: 420,
    alignItems: "center",
  },
  title: {
    fontSize: 32, // Tamanho da fonte grande para o título
    fontWeight: "bold", // Deixa o texto em negrito
    color: "#E0E0E0", // Cor do texto (cinza claro)
    marginBottom: 50, // Espaço abaixo do título
  },
  titleSmall: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#E0E0E0",
    marginBottom: 36,
  },
  input: {
    width: "100%", // Ocupar toda a largura do container interno
    height: 50, // Altura de 50 pixels
    backgroundColor: "#FFFFFF", // Fundo branco
    borderRadius: 10, // Bordas arredondadas
    paddingHorizontal: 15, // Espaço interno nas laterais
    fontSize: 16, // Tamanho da fonte
    color: "#333333", // Cor do texto (cinza escuro)
    marginBottom: 20, // Espaço abaixo do campo
  },
  inputPasswordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: 20,
    height: 50,
    paddingHorizontal: 5,
  },
  inputPassword: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#333333",
    backgroundColor: "transparent",
  },
  eyeIcon: {
    padding: 8,
  },
  button: {
    width: "100%", // Preencher largura do container interno
    height: 50, // Altura de 50 pixels
    backgroundColor: "#000000", // Fundo preto
    borderRadius: 10, // Bordas arredondadas
    justifyContent: "center", // Centraliza o texto verticalmente
    alignItems: "center", // Centraliza o texto horizontalmente
    marginTop: 10, // Espaço acima do botão
    marginBottom: 20, // Espaço abaixo do botão
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF", // Cor do texto (branco)
    fontSize: 18, // Tamanho da fonte
    fontWeight: "bold", // Texto em negrito
  },
  forgotPassword: {
    color: "#E0E0E0", // Cor do texto (cinza claro)
    fontSize: 14, // Tamanho da fonte
  },
});

export default LoginScreen;
