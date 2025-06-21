import { validarSenhaDigitada } from "../db/validacao";

const GATEWAY_URL = "http://192.168.3.39:3000";  // IP correto do gateway

// Envia a senha pro gateway (MQTT) para que o app que roda no backend a processe
export async function enviarSenha(senha: string): Promise<{ valida: boolean; mensagem: string }> {
  try {
    console.log("📩 Enviando senha:", senha);
    const res = await fetch(`${GATEWAY_URL}/enviar-senha`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senha }),
    });
    const body = await res.json();
    console.log("🔁 Resposta gateway:", body);
    return body;
  } catch (err) {
    console.error("❌ Erro ao enviar senha", err);
    return { valida: false, mensagem: "Erro de conexão" };
  }
}

// Valida a senha localmente antes de enviar o comando para abrir
export async function abrirFechadura(senhaDigitada: string): Promise<{ status: boolean; mensagem: string }> {
  try {
    // Valida localmente com o banco
    const resultado = await validarSenhaDigitada(senhaDigitada);
    if (!resultado.valida) {
      return { status: false, mensagem: "Senha inválida ou fora do horário" };
    }

    // Chama o gateway para abrir
    const res = await fetch(`${GATEWAY_URL}/abrir`, { method: "POST" });
    const body = await res.json();
    console.log("🔁 Resposta abrir:", body);
    return body;
  } catch (err) {
    console.error("❌ Erro HTTP abrir", err);
    return { status: false, mensagem: "Erro de conexão" };
  }
}
