import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Modal,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import LibrarianHeader from "../../components/librarian/header/Header";
import TextField from "../../components/librarian/AddBook/TextField";
import NumberField from "../../components/librarian/AddBook/NumberField";
import SelectField from "../../components/librarian/AddBook/SelectField";
import ImageUpload from "../../components/librarian/AddBook/ImageUpload";
import CustomAlert from "../../components/CustomAlert";
import { api } from "../../services/api";

export default function AddBookScreen({ navigation }) {
  const [cover, setCover] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [category, setCategory] = useState(null);
  const [year, setYear] = useState("");
  const [copies, setCopies] = useState("1");
  const [publisher, setPublisher] = useState("");
  const [description, setDescription] = useState("");

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [newCatModalVisible, setNewCatModalVisible] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await api.get("/categorias");
      const list = res?.data ?? res ?? [];
      setCategories(
        list.map((c) => ({
          id: String(c.id ?? c.id_categoria ?? c.id),
          nome: c.nome,
        }))
      );
    } catch (err) {
      console.warn("Erro ao carregar categorias", err);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const validate = () => {
    if (!title.trim()) return "Título é obrigatório.";
    if (!author.trim()) return "Autor é obrigatório.";
    if (!isbn.trim()) return "ISBN é obrigatório.";
    if (!category) return "Categoria é obrigatória.";
    if (!year || isNaN(Number(year)) || Number(year) < 1000)
      return "Ano inválido.";
    if (!copies || isNaN(Number(copies)) || Number(copies) < 1)
      return "Cópias inválidas.";
    return null;
  };

  const handleSubmit = () => {
    const err = validate();
    if (err) {
      setAlertMessage(err);
      setAlertVisible(true);
      return;
    }

    const payload = {
      cover,
      title,
      author,
      isbn,
      category,
      year: Number(year),
      copies: Number(copies),
      publisher,
      description,
    };

    // In a real app you would call your API here (e.g. api.post('/livros', payload))
    console.log("Adicionar livro ->", payload);

    setAlertMessage("Livro adicionado com sucesso.");
    setAlertVisible(true);

    // reset form
    setCover(null);
    setTitle("");
    setAuthor("");
    setIsbn("");
    setCategory(null);
    setYear("");
    setCopies("1");
    setPublisher("");
    setDescription("");
  };

  const createCategory = async () => {
    if (!newCatName.trim()) {
      setAlertMessage("Nome da categoria não pode ficar em branco.");
      setAlertVisible(true);
      return;
    }

    try {
      const res = await api.post("/categorias", { nome: newCatName.trim() });
      const created = res?.data ?? res;
      await loadCategories();
      const createdId = String(created.id ?? created.id_categoria ?? created);
      setCategory(createdId);
      setNewCatModalVisible(false);
      setAlertMessage("Categoria criada com sucesso.");
      setAlertVisible(true);
    } catch (err) {
      console.warn("Erro criar categoria", err);
      setAlertMessage(err?.message || "Erro ao criar categoria.");
      setAlertVisible(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LibrarianHeader
        title="Adicionar Novo Livro"
        navigation={navigation}
        iconSecond="book-outline"
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 10}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ScrollView contentContainerStyle={styles.content}>
            <ImageUpload image={cover} onChangeImage={setCover} />

            <TextField
              label="Título *"
              value={title}
              onChangeText={setTitle}
              placeholder="Digite o título do livro"
            />
            <TextField
              label="Autor *"
              value={author}
              onChangeText={setAuthor}
              placeholder="Digite o nome do autor"
            />
            <TextField
              label="ISBN *"
              value={isbn}
              onChangeText={setIsbn}
              placeholder="978-3-16-148410-0"
            />

            <SelectField
              label="Categoria *"
              options={[
                ...categories,
                { id: "__new__", nome: " Nova Categoria" },
              ]}
              value={category}
              onValueChange={(val) => {
                if (val === "__new__") {
                  setNewCatName("");
                  setNewCatModalVisible(true);
                } else {
                  setCategory(val);
                }
              }}
              placeholder={
                loadingCategories
                  ? "Carregando categorias..."
                  : "Selecione uma categoria"
              }
            />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <NumberField
                  label="Ano de Publicação *"
                  value={year}
                  onChangeText={setYear}
                  placeholder="2024"
                />
              </View>
              <View style={{ width: 120 }}>
                <NumberField
                  label="Cópias *"
                  value={copies}
                  onChangeText={setCopies}
                  placeholder="1"
                />
              </View>
            </View>

            <TextField
              label="Editora"
              value={publisher}
              onChangeText={setPublisher}
              placeholder="Nome da editora"
            />
            <TextField
              label="Descrição"
              value={description}
              onChangeText={setDescription}
              placeholder="Breve descrição do livro..."
              multiline
            />

            <TouchableOpacity style={styles.addBtn} onPress={handleSubmit}>
              <Text style={styles.addBtnText}>Adicionar Livro</Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <CustomAlert
        visible={alertVisible}
        title={
          alertMessage.startsWith("Livro") ||
          alertMessage.startsWith("Categoria")
            ? "Sucesso"
            : "Aviso"
        }
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
        buttonText="OK"
        type={
          alertMessage.startsWith("Livro") ||
          alertMessage.startsWith("Categoria")
            ? "success"
            : "error"
        }
      />

      <Modal
        visible={newCatModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setNewCatModalVisible(false)}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.box}>
            <Text style={modalStyles.title}>Nova Categoria</Text>
            <TextInput
              value={newCatName}
              onChangeText={setNewCatName}
              placeholder="Nome da categoria"
              placeholderTextColor="#6b7b8c"
              style={modalStyles.input}
            />
            <View style={modalStyles.row}>
              <TouchableOpacity
                style={[modalStyles.btn, modalStyles.cancel]}
                onPress={() => setNewCatModalVisible(false)}
              >
                <Text style={modalStyles.btnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[modalStyles.btn, modalStyles.confirm]}
                onPress={createCategory}
              >
                <Text style={modalStyles.btnText}>Criar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#071025" },
  content: { padding: 16, paddingBottom: 40 },
  row: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },
  addBtn: {
    backgroundColor: "#2f8cff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  addBtnText: { color: "#fff", fontWeight: "700" },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  box: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#071028",
    borderRadius: 12,
    padding: 16,
  },
  title: { color: "#e6eef8", fontSize: 18, fontWeight: "700", marginBottom: 8 },
  input: {
    backgroundColor: "#0b1220",
    color: "#e6eef8",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  row: { flexDirection: "row", justifyContent: "flex-end" },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancel: { backgroundColor: "#374151" },
  confirm: { backgroundColor: "#10B981" },
  btnText: { color: "#fff", fontWeight: "700" },
});
