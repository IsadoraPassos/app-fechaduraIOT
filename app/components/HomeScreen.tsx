import React, { useEffect, useState } from "react";
import { View, Alert } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { initMQTT, abrirFechadura } from "../mqtt/mqttService";

type Props = {
  navigation: any;
};

export default function HomeScreen({ navigation }: Props) {
  useEffect(() => {
    initMQTT();
  }, []);

  const [senha, setSenha] = useState("");

  const handleAbrir = async () => {
    if (senha.trim().length === 0) {
      Alert.alert("Aviso", "Digite a senha antes de abrir a fechadura");
      return;
    }
    const resposta = await abrirFechadura(senha); // senha vinda do usuário
    alert(resposta.mensagem);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text variant="titleLarge" style={{ marginBottom: 20, color: "#111" }}>
        Controle da Fechadura
      </Text>

      <Text style={{ color: "#111" }}>Digite a senha para abrir:</Text>
      <TextInput // Importe de react-native
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        style={{
          borderBottomWidth: 1,
          marginVertical: 16,
          paddingBottom: 4,
        }}
        placeholder="Sua senha"
      />

      <Button mode="contained" onPress={handleAbrir}>
        Enviar Senha e Abrir
      </Button>

      <Button
        mode="outlined"
        style={{ marginTop: 16 }}
        onPress={() => navigation.navigate("Nova Senha")}
      >
        Cadastrar Nova Senha
      </Button>

      <Button
        mode="outlined"
        style={{ marginTop: 16 }}
        onPress={() => navigation.navigate("Lista de Senhas")}
      >
        Ver Senhas Cadastradas
      </Button>

      <Button
        mode="outlined"
        onPress={() => navigation.navigate("Logs")}
        style={{ marginTop: 16 }}
      >
        Histórico de Acessos
      </Button>
    </View>
  );
}
