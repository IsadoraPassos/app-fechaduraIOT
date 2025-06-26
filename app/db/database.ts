import * as SQLite from "expo-sqlite";

async function openDB() {
  try {
    const db = await SQLite.openDatabaseAsync("fechadura.db");
    return db;
  } catch (error) {
    console.error("Erro ao abrir banco:", error);
    throw error;
  }
}

// Gera uma senha aleatória alfanumérica de tamanho fixo
function gerarSenhaEmergencia(tamanho = 6): string {
  const chars = "ABCD123456789";
  let senha = "";
  for (let i = 0; i < tamanho; i++) {
    senha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return senha;
}

export async function initDatabase() {
  const db = await openDB();
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS senhas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        senha TEXT NOT NULL,
        hora_inicio TEXT NOT NULL,
        hora_fim TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      timestamp TEXT NOT NULL,
      status TEXT NOT NULL
      );
      `
  );

  // Verifica se o usuário de emergência já existe
  const rows = await db.getAllAsync(
    "SELECT * FROM senhas WHERE nome = ?;",
    ["Emergencia"]
  );
  if (rows.length === 0) {
    const senhaEmergencia = gerarSenhaEmergencia(8); // ex: 8 caracteres
    await db.runAsync(
      "INSERT INTO senhas (nome, senha, hora_inicio, hora_fim) VALUES (?, ?, ?, ?);",
      ["Emergencia", senhaEmergencia, "00:00", "23:59"]
    );
    console.log("Usuário Emergencia criado com senha:", senhaEmergencia);
    // OBS: essa senha deve ser enviada ao Arduino mais tarde
  } else {
    console.log("Usuário Emergencia já existe, senha não foi alterada.");
  }
}

export async function insertSenha(
  nome: string,
  senha: string,
  hora_inicio: string,
  hora_fim: string
) {
  const db = await openDB();
  await db.runAsync(
    "INSERT INTO senhas (nome, senha, hora_inicio, hora_fim) VALUES (?, ?, ?, ?);",
    [nome, senha, hora_inicio, hora_fim]
  );
  console.log("Senha inserida com sucesso");
}

export async function getSenhas(): Promise<
  { id: number; nome: string; senha: string; hora_inicio: string; hora_fim: string }[]
> {
  const db = await openDB();
  const result = await db.getAllAsync("SELECT * FROM senhas;", []);
  return result as any;
}

export async function deleteSenha(id: number) {
  const db = await openDB();
  await db.runAsync("DELETE FROM senhas WHERE id = ?;", [id]);
  console.log(`Senha com id ${id} excluída`);
}

export async function getLogs(): Promise<
  { id: number; nome: string | null; timestamp: string; status: string }[]
> {
  const db = await openDB();
  const rows = await db.getAllAsync(
    "SELECT * FROM logs ORDER BY id DESC;",
    []
  );
  return rows as any;
}

export async function getLogsPage(page = 0, pageSize = 15): Promise<{
  logs: { id: number; nome: string | null; timestamp: string; status: string }[];
  hasMore: boolean;
}> {
  const db = await openDB();
  const offset = page * pageSize;
  const logs = await db.getAllAsync(
    "SELECT * FROM logs ORDER BY id DESC LIMIT ? OFFSET ?;",
    [pageSize + 1, offset]
  );
  const hasMore = logs.length > pageSize;
  if (hasMore) logs.pop(); // remover extra
  return { logs: logs as any, hasMore };
}

export async function getSenhaEmergencia(): Promise<string | undefined> {
  const db = await openDB();
  // Busca a senha do usuário "Emergencia"
  const rows = await db.getAllAsync<{ senha: string }>(
    "SELECT senha FROM senhas WHERE nome = ? LIMIT 1;",
    ["Emergencia"]
  );
  if (rows.length > 0) {
    return rows[0].senha;
  }
  return undefined;
}