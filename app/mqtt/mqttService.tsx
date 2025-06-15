import type { MqttClient } from "mqtt";
import mqtt from "mqtt";
import { validarSenhaDigitada } from "../db/validacao";

let client: MqttClient;

export const connectMQTT = () => {
  client = mqtt.connect("mqtt://200.143.224.99:1183", {
    username: "passos",
    password: "passos123",
    connectTimeout: 4000,
    reconnectPeriod: 1000,
  });

  client.on("connect", () => {
    console.log("📡 Conectado ao broker MQTT");
    client.subscribe("fechadura/senha");
  });

  client.on("message", async (topic: string, message: Buffer) => {
    const senhaRecebida = message.toString();
    console.log(`📩 Senha recebida: ${senhaRecebida}`);

    const resultado = await validarSenhaDigitada(senhaRecebida);
    if (resultado.valida) {
      client.publish("fechadura/comando", "ABRIR");
      console.log("🔓 Senha válida. Fechadura será aberta.");
    } else {
      console.log("❌ Senha inválida ou fora do horário.");
    }
  });

  client.on("error", (err: Error) => {
    console.log("❌ Erro MQTT:", err);
  });
};

export const abrirFechadura = () => {
  if (client && client.connected) {
    client.publish("fechadura/comando", "ABRIR");
  } else {
    console.log("⚠️ MQTT não conectado");
  }
};
