import React, { useState } from "react";
import { View, FlatList } from "react-native";
import { Text, Card } from "react-native-paper";
import { getLogs } from "../db/database";
import { useFocusEffect } from "@react-navigation/native";

interface LogEntry {
  id: number;
  nome: string | null;
  timestamp: string;
  status: string;
}

export default function LogScreen() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      getLogs().then(setLogs).catch(console.error);
    }, [])
  );

  const formatTs = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleString();
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant="titleLarge" style={{ marginBottom: 12, color: "#111" }}>
        Histórico de Acessos
      </Text>
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: 8, padding: 8 }}>
            <Text>
              {item.status === "INVALIDO"
                ? `Tentativa inválida — ${formatTs(item.timestamp)}`
                : `${item.nome} — ${item.status === "ACESSO" ? "Acesso" : "Fora do horário"} — ${formatTs(item.timestamp)}`}
            </Text>
          </Card>
        )}
        ListEmptyComponent={<Text style={{color: "#111"}}>Nenhum log registrado.</Text>}
      />
    </View>
  );
}
