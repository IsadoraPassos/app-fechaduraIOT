// mqttService.tsx
import mqtt, { MqttClient } from "mqtt";
import { logAcesso, validarSenhaDigitada } from "../db/validacao";
import { getSenhaEmergencia } from "../db/database";

const WS_URL = "SEU_URL";
const MQTT_OPTIONS = {
  username: "USER",
  password: "PASSWORD",
  reconnectPeriod: 2000,
  connectTimeout: 4000,
};

let client: MqttClient;

/**
 * Inicializa a conexão MQTT via WebSocket e configura handlers.
 */
export function initMQTT() {
  client = mqtt.connect(WS_URL, MQTT_OPTIONS);

  client.on("connect", async () => {
    console.log("✅ Conectado ao MQTT via WebSocket");

    // publicar senha de emergência ao conectar
    const emerg = await getSenhaEmergencia();
    if (emerg) {
      client.publish("cmnd/tasmota_44A15A/SerialSend1", `senha:${emerg}`);
      console.log("🚨 Senha de emergência enviada:");
    }

    // Inscreve nos tópicos necessários
    client.subscribe(["fechadura/comando", "tele/+/RESULT"], (err) => {
      if (err) console.error("Erro ao se inscrever:", err);
    });
  });

  client.on("message", async (topic, message) => {
    const msg = message.toString();
    console.log("📩 MQTT msg:", topic, msg);

    // Detecta senha vindo do Tasmota: tele/.../RESULT
    if (topic.startsWith("tele/") && msg.includes('"SerialReceived"')) {
    try {
      const data = JSON.parse(msg);
      const payload = data.SerialReceived as string;
      const senha = payload.replace(/\r|\n/g, "").trim();

      // Se for mensagem de emergência offline
      if (senha.startsWith("Emergencia: abertura offline")) {
        console.log("🆘 Emergência offline registrada:", senha);
        client.publish("fechadura/log", `Acesso: ${senha}`);
        await logAcesso(senha, "ACESSO");
      }
      // Filtra: só processa se for composta apenas por dígitos e letras A-D
      else if (/^[0-9A-D]+$/.test(senha)) {
        console.log("🔑 Senha recebida do teclado físico:");
        await processarSenhaRecebida(senha);
      }
      else {
        console.log("⏭️ Mensagem não numérica recebido:", senha);
      }
    } catch (err) {
      console.error("❌ Falha ao parsear JSON:", err);
    }
  }

    // Detecta comando de abrir vindo do app ou backend
    if (topic === "fechadura/comando" && msg === "ABRIR") {
      client.publish("cmnd/tasmota_44A15A/SerialSend1", "ABRIR");
      console.log("🔓 Comando ABRIR enviado ao dispositivo Tasmota");
    }
  });

  client.on("error", (err) => {
    console.error("❌ Erro MQTT:", err);
  });
}

/**
 * Verifica a senha recebida do teclado físico.
 * Se válida, publica para abrir a fechadura.
 */
async function processarSenhaRecebida(senha: string) {
  try {
    const resultado = await validarSenhaDigitada(senha);
    if (resultado.valida) {
      client.publish("cmnd/tasmota_44A15A/SerialSend1", "ABRIR");
      console.log("✅ Tecla válida — enviada 'ABRIR'");
      client.publish("fechadura/log", `Acesso: ${resultado.nome}`);
    } else {
      console.log("❌ Tecla inválida ou fora do horário:");
      client.publish("fechadura/log", `Falha acesso: ${senha}`);
    }
  } catch (err) {
    console.error("❌ Erro ao processar tecla:", err);
  }
}

/**
 * Envia a senha digitada manualmente no app.
 */
export async function abrirFechadura(
  senhaDigitada: string
): Promise<{ status: boolean; mensagem: string }> {
  if (!client || !client.connected) {
    console.warn("❗ MQTT não conectado, inicializando...");
    initMQTT();
  }

  try {
    const resultado = await validarSenhaDigitada(senhaDigitada);
    if (!resultado.valida) {
      return { status: false, mensagem: "Senha inválida ou fora do horário" };
    }
    client.publish("cmnd/tasmota_44A15A/SerialSend1", "ABRIR");
    console.log("🔓 Comando ABRIR publicado manualmente");
    return { status: true, mensagem: `Acesso autorizado: ${resultado.nome}` };
  } catch (err) {
    console.error("❌ Erro na abertura:", err);
    return { status: false, mensagem: "Erro interno" };
  }
}
