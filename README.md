
# Fechadura Eletrônica IoT 🔒📱

Este projeto apresenta um protótipo funcional de uma fechadura eletrônica com controle de acesso via teclado físico e aplicativo móvel, utilizando Arduino, ESP8266 com Tasmota e comunicação MQTT.

---

## 📦 Estrutura do Projeto

```
.
├── arduino/
│   └── tranca-wifi.ino
├── app/
│   └── (código do aplicativo desenvolvido com React Native + Expo)
├── artigo/
│   └── Trabalho_IOT.pdf
└── README.md
```

---

## 🚀 Como Executar o Projeto

### 1. ⚙️ Upload do código para o Arduino

1. Abra a IDE do Arduino.
2. Vá em **Arquivo > Abrir** e selecione o arquivo `arduino/tranca-wifi.ino`.
3. Conecte seu Arduino Uno via cabo USB.
4. Certifique-se de ter a biblioteca **Keypad** instalada ([link](https://github.com/fbryan/Keypad)).
5. Selecione a porta correta (menu **Ferramentas > Porta**) e clique em **Upload**.

> Obs: durante o upload, desconecte o RX/TX do Arduino se o ESP estiver conectado.

---

### 2. 🌐 Configuração do módulo ESP8266 com Tasmota

1. Siga as instruções deste tutorial para instalar o firmware Tasmota no seu ESP-01:  
   👉 https://www.instructables.com/Easy-ESP-01-Tasmota-Programming
2. Após instalar, configure a rede Wi-Fi no Tasmota.
3. Acesse a interface web do Tasmota pelo IP do ESP na rede.
4. Vá em **Configuration > Configure MQTT** e adicione:
   - **Host:** IP do broker MQTT
   - **Port:** `1883` ou `9001` (WebSocket)
   - **User/Password:** `user / password`
   - **Topic:** `4497700` (ou personalizado)

---

### 3. 📱 Executando o aplicativo mobile

#### Pré-requisitos:
- Node.js e npm instalados
- Expo CLI (`npm install -g expo-cli`)
- Aplicativo **Expo Go** instalado no seu celular (Android/iOS)

#### Passos:

```bash
# Clone o repositório
git clone https://github.com/IsadoraPassos/app-fechaduraIOT.git
cd app-fechaduraIOT

# Instale as dependências
npm install

# Inicie o projeto
npx expo start
```

1. Com o terminal aberto, escaneie o QR Code com o aplicativo Expo Go.
2. O app será aberto no celular.
3. Faça login e comece a cadastrar senhas.

---

## 🔧 Montagem da Parte Física

A descrição completa da montagem física da fechadura (componentes, conexões e esquema) está detalhada no artigo do projeto, disponível em:

📄 `artigo/Trabalho_IOT.pdf`

---

## ✅ Pronto!

Agora você pode utilizar o teclado físico ou o aplicativo para abrir a fechadura.  
Acompanhe os acessos na tela de **Histórico** do app!

---

## 📄 Licença

Este projeto foi desenvolvido como protótipo acadêmico e pode ser adaptado livremente com os devidos créditos.
