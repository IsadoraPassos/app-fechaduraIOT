import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { Text } from "react-native-paper";
import { getSenhas } from "../db/database";
import { Password } from "../models/Password";

export default function PasswordListScreen() {
  const [senhas, setSenhas] = useState<Password[]>([]);

  useEffect(() => {
  getSenhas()
    .then(data => setSenhas(data))
    .catch(console.error);
}, []);

  return (
    <View style={{ padding: 20 }}>
      <Text variant="titleMedium" style = {{color: "#111"}}>Senhas Cadastradas</Text>
      <FlatList
        data={senhas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style = {{color: "#111"}}>
            {item.nome}: {item.senha} ({item.hora_inicio} - {item.hora_fim})
          </Text>
        )}
      />
    </View>
  );
}
