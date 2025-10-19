import React, { useState } from "react";
import {
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
    <ImageBackground
      source={BackgroundImage}
      resizeMode="cover"
      // CLASSE NATIVEWIND APLICADA AQUI
      className="flex-1"
      style={
        Platform.OS === "web"
          ? { minHeight: "100vh", width: "100%" }
          : { flex: 1 }
      }
    >
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          // CLASSE NATIVEWIND APLICADA AQUI
          className="flex-1 justify-center items-center p-5"
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
          <Text
            // CLASSE NATIVEWIND E RESPONSIVIDADE APLICADA AQUI
            className="text-3xl md:text-4xl font-bold text-gray-200 mb-12"
          >
            Biblioteca Integrado
          </Text>

          <View
            // CLASSE NATIVEWIND E RESPONSIVIDADE APLICADA AQUI
            className="w-11/12 md:w-2/3 lg:w-1/3"
          >
            <TextInput
              // CLASSE NATIVEWIND APLICADA AQUI
              className="h-12 bg-white rounded-lg px-4 text-base text-gray-800 mb-4"
              placeholder="Registro (RA)"
              placeholderTextColor="#BBBBBB"
              keyboardType="numeric"
              value={ra}
              onChangeText={(text) => setRa(maskRA(text))}
            />

            <View
              // CLASSE NATIVEWIND APLICADA AQUI
              className="flex-row items-center bg-white rounded-lg h-12 px-1 mb-4"
            >
              <TextInput
                // CLASSE NATIVEWIND APLICADA AQUI
                className="flex-1 h-12 px-3 text-base text-gray-800 bg-transparent"
                placeholder="Senha"
                placeholderTextColor="#BBBBBB"
                secureTextEntry={!showPassword}
                value={senha}
                onChangeText={setSenha}
              />
              <TouchableOpacity
                className="p-2"
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
              // CLASSE NATIVEWIND APLICADA AQUI
              className="h-12 bg-black rounded-lg justify-center items-center mt-2 mb-5"
              onPress={handleLogin}
            >
              <Text
                // CLASSE NATIVEWIND APLICADA AQUI
                className="text-white text-lg font-bold"
              >
                Entrar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowEsqueceuSenha(true)}>
              <Text
                // CLASSE NATIVEWIND APLICADA AQUI
                className="text-gray-200 text-sm text-center"
              >
                Esqueceu a senha?
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default LoginScreen;
