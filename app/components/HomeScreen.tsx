import React, { useEffect } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { connectMQTT, abrirFechadura } from "../mqtt/mqttService";

type Props = {
  navigation: any;
};

export default function HomeScreen({ navigation }: Props) {
  useEffect(() => {
    connectMQTT();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text variant="titleLarge" style={{ marginBottom: 20, color: "#111" }} >
        Controle da Fechadura
      </Text>

      <Button mode="contained" onPress={abrirFechadura}>
        Abrir Fechadura
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
    </View>
  );
}
