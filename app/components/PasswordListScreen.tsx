import React, { useState } from "react";
import { View, FlatList, Alert } from "react-native";
import { Text, Button } from "react-native-paper";
import { getSenhas, deleteSenha } from "../db/database";
import { Password } from "../models/Password";
import { useFocusEffect } from "@react-navigation/native";

export default function PasswordListScreen() {
  const [senhas, setSenhas] = useState<Password[]>([]);

  const carregarSenhas = () => {
    getSenhas()
      .then((data) => setSenhas(data))
      .catch(console.error);
  };

  useFocusEffect(
    React.useCallback(() => {
      carregarSenhas();
    }, [])
  );

  const handleExcluir = (id: number) => {
    Alert.alert("Excluir senha", "Tem certeza que deseja remover esta senha?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteSenha(id);
            carregarSenhas(); // Atualiza a lista
          } catch (error) {
            console.error("Erro ao excluir:", error);
          }
        },
      },
    ]);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text variant="titleMedium" style={{ color: "#111", marginBottom: 12 }}>
        Senhas Cadastradas
      </Text>
      <FlatList
        data={senhas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#f5f5f5",
              padding: 12,
              marginBottom: 8,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "#111", marginBottom: 4 }}>
              {item.nome}: {item.senha} ({item.hora_inicio} - {item.hora_fim})
            </Text>
            <Button
              mode="outlined"
              onPress={() => handleExcluir(item.id)}
              compact
            >
              Excluir
            </Button>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: "#888" }}>Nenhuma senha cadastrada.</Text>
        }
      />
    </View>
  );
}
