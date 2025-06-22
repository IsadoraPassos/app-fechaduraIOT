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

// função para gravação de logs
export async function logAcesso(
  nome: string | null,
  status: "ACESSO" | "FORA_HORARIO" | "INVALIDO"
) {
  const db = await openDB();
  const now = new Date();
  const ts = now.toISOString(); // ex: 2025-06-22T14:35:00Z

  await db.runAsync(
    "INSERT INTO logs (nome, timestamp, status) VALUES (?, ?, ?);",
    [nome, ts, status]
  );
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
    await logAcesso(null, "INVALIDO");
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
    await logAcesso(nome, "ACESSO");
    return { valida: true, nome };
  }

  await logAcesso(nome, "FORA_HORARIO");
  return { valida: false };
}
