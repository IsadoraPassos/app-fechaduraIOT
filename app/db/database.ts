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
