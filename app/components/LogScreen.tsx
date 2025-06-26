import React, { useState, useCallback } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text, Card, useTheme, Button } from "react-native-paper";
import { getLogsPage } from "../db/database";
import { useFocusEffect } from "@react-navigation/native";

interface LogEntry {
  id: number;
  nome: string | null;
  timestamp: string;
  status: string;
}

export default function LogScreen() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const theme = useTheme();

  const loadPage = useCallback(async (next = false) => {
    const pg = next ? page + 1 : 0;
    try {
      const { logs: newLogs, hasMore: more } = await getLogsPage(pg);
      setLogs(next ? [...logs, ...newLogs] : newLogs);
      setPage(pg);
      setHasMore(more);
    } catch (e) {
      console.error(e);
    }
  }, [page, logs]);

  useFocusEffect(useCallback(() => { loadPage(false); }, []));

  const formatTs = (ts: string) => new Date(ts).toLocaleString();

  const getStyleForStatus = (status: string) => {
    switch (true) {
      case status === "ACESSO":
        return { backgroundColor: "#E0F7FA", borderColor: "#00796B" }; // verde água
      case status === "FORA_HORARIO":
        return { backgroundColor: "#FFF3E0", borderColor: "#F57C00" }; // laranja claro
      case status === "INVALIDO":
        return { backgroundColor: "#FFEBEE", borderColor: "#C62828" }; // vermelho leve
      case status.startsWith("Emergencia"):
        return { backgroundColor: "#E3F2FD", borderColor: "#2962FF" }; // azul emergência
      default:
        return { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline };
    }
  };

  const renderItem = ({ item }: { item: LogEntry }) => {
    const style = getStyleForStatus(item.status);
    const message =
      item.status === "INVALIDO"
        ? `Tentativa inválida — ${formatTs(item.timestamp)}`
        : item.status === "FORA_HORARIO"
        ? `${item.nome} — Fora do horário — ${formatTs(item.timestamp)}`
        : item.status === "ACESSO"
        ? `${item.nome} — Acesso permitido — ${formatTs(item.timestamp)}`
        : item.status.startsWith("Emergencia")
        ? `🆘 ${item.status} — ${formatTs(item.timestamp)}`
        : `${item.status} — ${item.nome ? item.nome + ' — ' : ''}${formatTs(item.timestamp)}`;

    return (
      <Card style={[styles.card, { backgroundColor: style.backgroundColor, borderColor: style.borderColor }]}>
        <Text style={{color: "#111"}}>{message}</Text>
      </Card>
    );
  };

  return (
    <View style={{ flex: 1, padding: 16, marginBottom: 40, backgroundColor: theme.colors.background }}>
      <Text variant="titleLarge" style={{ marginBottom: 12, color: theme.colors.onBackground }}>
        Histórico de Acessos
      </Text>
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{ color: "#111" }}>Nenhum log registrado.</Text>}
        ListFooterComponent={
          hasMore ? (
            <Button onPress={() => loadPage(true)} style={{ marginTop: 8 }}>
              Carregar mais
            </Button>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
    padding: 12,
    borderWidth: 1,
  },
});
