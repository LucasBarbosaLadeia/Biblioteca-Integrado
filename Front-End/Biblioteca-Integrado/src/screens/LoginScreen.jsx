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
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

import BackgroundImage from "../assets/background.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { maskRA, unmaskRA } from "../utils/mask";
import { api } from "../services/api";
import CustomAlert from "../components/CustomAlert";
import notificationService from "../services/NotificationService";

const LoginScreen = ({ navigation, setRole }) => {
  const { width } = useWindowDimensions();
  const isSmall = width < 360;
  // responsive sizing helpers
  const horizontalPadding = Math.min(
    32,
    Math.max(12, Math.floor(width * 0.05))
  );
  const titleFontSize = width < 360 ? 26 : width < 420 ? 32 : 36;
  const inputHeight = Math.max(44, Math.min(56, Math.floor(width * 0.12)));
  const buttonHeight = inputHeight;
  const innerMaxWidth = Math.min(560, Math.max(340, Math.floor(width * 0.85)));
  const [ra, setRa] = useState("");
  const [senha, setSenha] = useState("");
  const [showEsqueceuSenha, setShowEsqueceuSenha] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Função para registrar o Expo Push Token
  const registerExpoToken = async (userId) => {
    try {
      // Solicitar permissões
      const hasPermission = await notificationService.requestPermissions();
      if (!hasPermission) {
        console.warn("Permissões de notificação negadas");
        return;
      }

      // Obter o Expo Push Token
      // Para Expo Go, usamos o experienceId como fallback
      const experienceId = "@anonymous/biblioteca-integrado";

      const tokenData = await Notifications.getExpoPushTokenAsync({
        experienceId: experienceId,
      });

      const expoToken = tokenData.data;
      console.log("📱 Expo Push Token:", expoToken);

      // Salvar no AsyncStorage
      await AsyncStorage.setItem("expoToken", expoToken);

      // Enviar para o backend
      await api.put(`usuarios/${userId}`, { expoToken });
      console.log("✅ ExpoToken registrado no backend");

      // Conectar ao serviço de notificações
      await notificationService.connect();
    } catch (error) {
      console.error("❌ Erro ao registrar ExpoToken:", error);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    // create an abort controller so we can timeout the request if it hangs
    const controller = new AbortController();
    const timeoutMs = 8000; // 8 seconds
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      // Use centralized api helper. The helper will throw on non-2xx responses.
      const data = await api.post(
        "usuarios/login",
        { ra: unmaskRA(ra), senha },
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      if (data && data.token) {
        await AsyncStorage.setItem("userToken", data.token);
        await AsyncStorage.setItem("token", data.token); // mantém retrocompatibilidade
        await AsyncStorage.setItem("userId", String(data.data.id_usuario));
        // save user name and role quickly so drawer/profile can show immediately without extra fetch
        try {
          // debug: show returned payload (remove in production)
          try {
            console.log("[Login] response data:", data);
          } catch (e) {}

          const nome = data.data?.nome || data.data?.name || "";
          const rawTipo = data.data?.tipo ?? data.data?.role ?? "";

          // normalize role to either 'student' or 'librarian'
          // Heuristics cover common values returned by backends:
          // - Portuguese strings: 'ALUNO', 'aluno', 'bibliotecario', 'BIB', etc.
          // - English strings: 'student', 'librarian', 'admin'
          // - Numeric ids: '1' -> student, '2' -> librarian (adjust if your backend uses different ids)
          let roleToSet = "student";
          if (rawTipo !== "") {
            const rStr = String(rawTipo).trim();
            const r = rStr.toLowerCase();

            // numeric id mapping (common conventions; change if your backend differs)
            if (/^\d+$/.test(rStr)) {
              if (rStr === "1") roleToSet = "student";
              else if (rStr === "2") roleToSet = "librarian";
              else roleToSet = "student"; // safe default for unknown numeric ids
            }
            // explicit textual matches for students
            else if (
              ["aluno", "estudante", "student"].some(
                (k) => r === k || r.includes(k)
              )
            ) {
              roleToSet = "student";
            }
            // explicit textual matches for admins (map to 'admin' first)
            else if (
              [
                "admin",
                "administrador",
                "administradora",
                "administrator",
                "administration",
              ].some((k) => r === k || r.includes(k))
            ) {
              roleToSet = "admin";
            }

            // explicit textual matches for librarians
            else if (
              [
                "bibliotecario",
                "bibliotecaria",
                "bib",
                "funcionario",
                "funcionário",
                "librarian",
                "librar",
                "bibliotec",
              ].some((k) => r === k || r.includes(k))
            ) {
              roleToSet = "librarian";
            } else {
              // fallback to simple substring check and default to student
              if (
                r.includes("bibliotec") ||
                r.includes("librar") ||
                r.includes("admin") ||
                r.includes("librarian")
              ) {
                roleToSet = "librarian";
              } else {
                roleToSet = "student";
              }
            }
          }

          if (nome) await AsyncStorage.setItem("userName", String(nome));
          if (rawTipo) await AsyncStorage.setItem("userRole", String(rawTipo));

          await AsyncStorage.setItem("userRoleNormalized", roleToSet);

          // Registrar ExpoToken para notificações push
          await registerExpoToken(data.data.id_usuario);

          try {
            if (typeof setRole === "function") {
              console.log("[Login] setting role to", roleToSet);
              setRole(roleToSet);
            } else if (
              navigation &&
              typeof navigation.navigate === "function"
            ) {
              console.log("[Login] navigating to Home via navigation.navigate");
              navigation.navigate("Home");
            } else {
              console.warn(
                "[Login] neither setRole nor navigation.navigate available after login"
              );
            }
          } catch (e) {
            console.error("[Login] error applying role/navigation:", e);
            // try a safe fallback
            try {
              navigation && navigation.navigate && navigation.navigate("Home");
            } catch (err) {
              console.error("[Login] fallback navigation also failed:", err);
            }
          }
        } catch (e) {
          // ignore storage errors
        }
      } else {
        setErrorMessage(data?.message || "Credenciais inválidas");
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
        // api helper throws Error with stored body on non-2xx. Use body.message if present.
        const msg =
          error?.body?.message ||
          error.message ||
          "Erro ao fazer login. Tente novamente mais tarde.";
        setErrorMessage(msg);
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
                <Text
                  style={[
                    styles.title,
                    {
                      fontSize: titleFontSize,
                      marginBottom: titleFontSize > 32 ? 40 : 28,
                    },
                  ]}
                >
                  Biblioteca Integrado
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      height: inputHeight,
                      fontSize: Math.max(14, Math.floor(titleFontSize * 0.5)),
                    },
                  ]}
                  placeholder="Registro (RA)"
                  placeholderTextColor="#BBBBBB"
                  keyboardType="numeric"
                  value={ra}
                  onChangeText={(text) => setRa(maskRA(text))}
                />
                <View
                  style={[
                    styles.inputPasswordContainer,
                    { height: inputHeight },
                  ]}
                >
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
                    { height: buttonHeight },
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
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  inner: {
    width: "100%",
    maxWidth: 420,
    alignItems: "center",
    paddingHorizontal: 12,
  },
  title: {
    // fontSize set dynamically in-line for responsiveness
    fontWeight: "bold", // Deixa o texto em negrito
    color: "#E0E0E0", // Cor do texto (cinza claro)
    marginBottom: 40, // Espaço abaixo do título
  },
  titleSmall: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#E0E0E0",
    marginBottom: 36,
  },
  input: {
    width: "100%", // Ocupar toda a largura do container interno
    height: 50, // altura base (sobrescrita dinamicamente)
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
    height: 50, // Altura base (sobrescrita dinamicamente)
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
