import * as SQLite from "expo-sqlite";

// Abre o banco de dados de forma assíncrona
async function openDB() {
  return await SQLite.openDatabaseAsync("fechadura.db");
}

// Retorna horário atual no formato "HH:MM"
const getHoraAtual = (): string => {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, "0");
  const m = now.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
};

interface ValidacaoResult {
  valida: boolean;
  nome?: string;
}

export async function validarSenhaDigitada(
  senhaRecebida: string
): Promise<ValidacaoResult> {
  if (!senhaRecebida) return { valida: false };

  const db = await openDB();
  const horaAtual = getHoraAtual();

  // Faz a consulta
  const rows = await db.getAllAsync(
    "SELECT nome, senha, hora_inicio, hora_fim FROM senhas WHERE senha = ?;",
    [senhaRecebida]
  );

  if (rows.length === 0) {
    return { valida: false };
  }

  const { nome, hora_inicio, hora_fim } = rows[0] as {
    nome: string;
    senha: string;
    hora_inicio: string;
    hora_fim: string;
  };

  // Verifica se está dentro do horário
  if (hora_inicio <= horaAtual && horaAtual <= hora_fim) {
    return { valida: true, nome };
  }

  return { valida: false };
}
