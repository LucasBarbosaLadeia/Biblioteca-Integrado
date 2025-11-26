import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const ImageUpload = ({ image, onChangeImage }) => {
  const [local, setLocal] = useState(image || null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Função para garantir compatibilidade com versões antigas e novas
  const getMediaTypes = () => {
    if (ImagePicker.MediaType) return [ImagePicker.MediaType.Images];
    if (ImagePicker.MediaTypeOptions)
      return ImagePicker.MediaTypeOptions.Images;
    return undefined;
  };

  const pickFromLibrary = async () => {
    setPickerOpen(false);
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permissão de acesso à galeria negada");
        return;
      }

      setLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: getMediaTypes(),
        quality: 0.8,
        // don't force a crop/center-zoom in the picker; keep original photo
        allowsEditing: false,
      });
      setLoading(false);

      if (!result.canceled) {
        const uri = result.assets?.[0]?.uri;
        setLocal(uri);
        onChangeImage?.(uri);
      }
    } catch (err) {
      setLoading(false);
      console.warn("Erro ao abrir galeria", err);
    }
  };

  const takePhoto = async () => {
    setPickerOpen(false);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Permissão de câmera negada");
        return;
      }

      setLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: getMediaTypes(),
        quality: 0.8,
        // don't force a crop/center-zoom in the camera picker
        allowsEditing: false,
      });
      setLoading(false);

      if (!result.canceled) {
        const uri = result.assets?.[0]?.uri;
        setLocal(uri);
        onChangeImage?.(uri);
      }
    } catch (err) {
      setLoading(false);
      console.warn("Erro ao abrir câmera", err);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Capa do Livro *</Text>
      <TouchableOpacity
        style={styles.box}
        onPress={() => setPickerOpen(true)}
        activeOpacity={0.9}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : local ? (
          <Image
            source={{ uri: local }}
            style={styles.cover}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.hint}>
            Clique para fazer upload {"\n"} PNG, JPG até 5MB
          </Text>
        )}
        {local ? (
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => {
              setLocal(null);
              onChangeImage?.(null);
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="trash" size={18} color="#fff" />
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>

      <Modal
        visible={pickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalInner}>
            <TouchableOpacity style={styles.modalBtn} onPress={takePhoto}>
              <Text style={styles.modalBtnText}>Abrir Câmera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBtn} onPress={pickFromLibrary}>
              <Text style={styles.modalBtnText}>Selecionar da Galeria</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalBtn, styles.modalCancel]}
              onPress={() => setPickerOpen(false)}
            >
              <Text style={styles.modalBtnText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: 12 },
  label: { color: "#9fb0c8", marginBottom: 6, fontWeight: "600" },
  box: {
    height: 390,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.19)",
    backgroundColor: "#071129",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  hint: { color: "#9aa4c7", textAlign: "center" },
  cover: { width: "90%", height: "90%", borderRadius: 10 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 12,
  },
  modalInner: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#071028",
    borderRadius: 12,
    padding: 12,
  },
  modalBtn: {
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#0b2540",
    alignItems: "center",
    marginBottom: 8,
  },
  modalBtnText: { color: "#e6eef8", fontWeight: "700" },
  modalCancel: { backgroundColor: "#374151" },
  removeBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 6,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ImageUpload;
