import React, { useState } from "react";
import { View, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { insertSenha } from "../db/database";

const tecladoPermitido = /^[0-9A-D*#]+$/;
const formatoHora = /^([01]\d|2[0-3]):[0-5]\d$/;

export default function CreatePasswordScreen({ navigation }: any) {
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");

  const handleSalvar = async () => {
    if (!nome || !senha || !horaInicio || !horaFim) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }
    if (!formatoHora.test(horaInicio) || !formatoHora.test(horaFim)) {
        Alert.alert("Erro", "Informe a hora no formato HH:MM (ex: 08:30)");
        return;
    }
    if (!tecladoPermitido.test(senha)) {
      Alert.alert("Senha inválida", "Use apenas caracteres do teclado 4x4 (0-9, A-D, *, #)");
      return;
    }
  try {
    console.log("Valores para inserir:", nome, senha, horaInicio, horaFim);
    await insertSenha(nome, senha, horaInicio, horaFim);
    Alert.alert("Sucesso", "Senha cadastrada!");
    navigation.goBack();
  } catch (error) {
    console.error(error);
    Alert.alert("Erro", "Falha ao cadastrar a senha.");
  }
};


  return (
    <View style={{ padding: 20 }}>
      <Text variant="titleMedium">Nova Senha</Text>
      <TextInput label="Nome" value={nome} onChangeText={setNome} />
      <TextInput
        label="Senha"
        value={senha}
        onChangeText={setSenha}
        placeholder="Ex: 1234A"
      />
      <TextInput
        label="Hora início (HH:MM)"
        value={horaInicio}
        onChangeText={setHoraInicio}
        keyboardType="default"
      />
      <TextInput
        label="Hora fim (HH:MM)"
        value={horaFim}
        onChangeText={setHoraFim}
        keyboardType="default"
      />
      <Button mode="contained" style={{ marginTop: 20 }} onPress={handleSalvar}>
        Salvar
      </Button>
    </View>
  );
}
