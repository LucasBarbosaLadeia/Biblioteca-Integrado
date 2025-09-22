import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ImageBackground,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import BackgroundImage from "../assets/background.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { maskRA, unmaskRA } from "../utils/mask";
import { API_HOST } from "@env";
import CustomAlert from "../components/CustomAlert";

const LoginScreen = ({ navigation }) => {
  const [ra, setRa] = useState("");
  const [senha, setSenha] = useState("");
  const [showEsqueceuSenha, setShowEsqueceuSenha] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    try {
      const API = API_HOST;
      const respose = await fetch(`${API}/api/usuarios/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ra: unmaskRA(ra), senha }),
      });

      const data = await respose.json();

      if (data.token) {
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("userId", String(data.data.id_usuario));

        navigation.navigate("Home");
      } else {
        setErrorMessage(data.message || "Credenciais inválidas");
        setShowErrorAlert(true);
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setErrorMessage("Erro ao fazer login. Tente novamente mais tarde.");
      setShowErrorAlert(true);
    }
  };

  return (
    <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
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
          <Text style={styles.title}>Biblioteca Integrado</Text>
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
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowEsqueceuSenha(true)}>
            <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
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
    padding: 20, // Espaçamento interno de 20 em todos os lados
    backgroundColor: "transparent", // Torna o fundo do container transparente
  },
  title: {
    fontSize: 32, // Tamanho da fonte grande para o título
    fontWeight: "bold", // Deixa o texto em negrito
    color: "#E0E0E0", // Cor do texto (cinza claro)
    marginBottom: 50, // Espaço abaixo do título
  },
  input: {
    width: "90%", // Largura de 90% do container
    height: 50, // Altura de 50 pixels
    backgroundColor: "#FFFFFF", // Fundo branco
    borderRadius: 10, // Bordas arredondadas
    paddingHorizontal: 15, // Espaço interno nas laterais
    fontSize: 16, // Tamanho da fonte
    color: "#333333", // Cor do texto (cinza escuro)
    marginBottom: 20, // Espaço abaixo do campo
  },
  inputPasswordContainer: {
    width: "90%",
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
    width: "90%", // Largura de 90% do container
    height: 50, // Altura de 50 pixels
    backgroundColor: "#000000", // Fundo preto
    borderRadius: 10, // Bordas arredondadas
    justifyContent: "center", // Centraliza o texto verticalmente
    alignItems: "center", // Centraliza o texto horizontalmente
    marginTop: 10, // Espaço acima do botão
    marginBottom: 20, // Espaço abaixo do botão
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
