import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View, Alert, Text } from "react-native";
import LibrarianHeader from "../../components/librarian/header/Header";
import {
  Stepper,
  BookSelector,
  StudentSelector,
  ConfirmLoan,
} from "../../components/librarian/ManualLoan";
import CustomAlert from "../../components/CustomAlert";
import { api } from "../../services/api";

export default function ManualLoanScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const goNext = () => setStep((s) => Math.min(2, s + 1));
  const goBack = () => setStep((s) => Math.max(0, s - 1));

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("info");

  const handleConfirm = ({ book, student, dueDate }) => {
    const run = async () => {
      setConfirming(true);
      try {
        const id_usuario = student?.id_usuario || student?.id || student?._id;
        const id_livro = book?.id_livro || book?.id || book?._id;

        if (!id_usuario || !id_livro) {
          setAlertTitle("Atenção");
          setAlertMessage("Livro ou aluno inválido.");
          setAlertType("error");
          setAlertVisible(true);
          setConfirming(false);
          return;
        }

        // parse DD/MM/YYYY -> YYYY-MM-DD
        const parseDate = (d) => {
          if (!d) return null;
          const parts = d.split("/");
          if (parts.length === 3)
            return `${parts[2]}-${parts[1].padStart(
              2,
              "0"
            )}-${parts[0].padStart(2, "0")}`;
          // fallback: try Date
          const dt = new Date(d);
          return isNaN(dt.getTime()) ? null : dt.toISOString();
        };

        const iso = parseDate(dueDate);
        if (!iso) {
          setAlertTitle("Atenção");
          setAlertMessage("Data de devolução inválida. Use DD/MM/YYYY.");
          setAlertType("error");
          setAlertVisible(true);
          setConfirming(false);
          return;
        }

        const payload = {
          idUsuario: id_usuario,
          idLivro: id_livro,
          dataPrevistaDevolucao: iso,
        };

        const res = await api.post("/emprestimos", payload);
        // Success: show custom alert and reset flow
        setAlertTitle("Sucesso");
        setAlertMessage("Empréstimo criado com sucesso.");
        setAlertType("success");
        setAlertVisible(true);
        // Reset flow on success
        setSelectedBook(null);
        setSelectedStudent(null);
        setStep(0);
      } catch (e) {
        // api.request throws an Error with .status and .body when available
        const status = e?.status;
        const bodyMessage =
          e?.body?.message || (e?.message && String(e.message));
        if (
          status === 409 ||
          (bodyMessage &&
            bodyMessage.toLowerCase().includes("já possui empréstimo"))
        ) {
          setAlertTitle("Atenção");
          setAlertMessage("Usuário já possui empréstimo ativo deste livro.");
          setAlertType("error");
          setAlertVisible(true);
        } else {
          console.error("Erro ao criar empréstimo", e);
          setAlertTitle("Erro");
          setAlertMessage(
            bodyMessage || "Erro ao criar empréstimo. Tente novamente."
          );
          setAlertType("error");
          setAlertVisible(true);
        }
      } finally {
        setConfirming(false);
      }
    };

    run();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LibrarianHeader
        title="Emprestar Livro"
        navigation={navigation}
        iconSecond="swap-vertical-outline"
      />

      <View style={styles.headerMeta}>
        <Stepper step={step} />
        <Text style={styles.subtitle}>
          Siga os passos: escolha o livro, selecione o aluno e confirme a data.
        </Text>
      </View>

      <View style={styles.content}>
        {step === 0 && (
          <BookSelector
            selectedBook={selectedBook}
            onSelect={(b) => {
              setSelectedBook(b);
              // move to next step automatically when selected
              setTimeout(goNext, 200);
            }}
          />
        )}

        {step === 1 && (
          <StudentSelector
            selectedStudent={selectedStudent}
            onSelect={(s) => {
              setSelectedStudent(s);
              setTimeout(goNext, 200);
            }}
            onBack={goBack}
          />
        )}

        {step === 2 && (
          <ConfirmLoan
            book={selectedBook}
            student={selectedStudent}
            onBack={goBack}
            onConfirm={handleConfirm}
            loading={confirming}
          />
        )}
      </View>

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
        buttonText="OK"
        type={alertType}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#071025" },
  headerMeta: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 6 },
  subtitle: { color: "#9aa4c7", fontSize: 12, marginTop: 8 },
  content: { flex: 1, marginTop: 8 },
});
