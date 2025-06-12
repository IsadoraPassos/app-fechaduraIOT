import mqtt from "mqtt";
import type { MqttClient } from "mqtt";

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
    client.subscribe("fechadura/log");
  });

  client.on("message", (topic: string, message: Buffer) => {
    console.log(`📩 ${topic}: ${message.toString()}`);
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
