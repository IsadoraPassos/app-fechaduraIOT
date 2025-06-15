// --- Bibliotecas ---
#include <Keypad.h>
#include <SoftwareSerial.h>

// --- Configuração do Teclado ---
const byte n_linhas = 4;
const byte n_colunas = 4;

char teclas[n_linhas][n_colunas] = {
  {'1', '2', '3', 'A'},
  {'4', '5', '6', 'B'},
  {'7', '8', '9', 'C'},
  {'*', '0', '#', 'D'}
};

byte mapa_linha[n_linhas] = {9, 8, 7, 6};   // Ajuste conforme seu hardware
byte mapa_coluna[n_colunas] = {5, 4, 3, 2};  // Ajuste conforme seu hardware

Keypad teclado = Keypad(makeKeymap(teclas), mapa_linha, mapa_coluna, n_linhas, n_colunas);

// --- Senha ---
int pos = 0;
char senha[12] = {};
char correta[] = "123456";   // Senha fixa

// --- Pino do LED ou relé ---
int led = 13;

// --- Configuração do ESP8266 ---
SoftwareSerial esp8266(10, 11); // RX, TX

#define DEBUG true
char q[] = "+IPD,";

// --- Protótipo das funções auxiliares ---
String sendData(String command, const int timeout, boolean debug);

// ==================================================================
// --- Setup ---
void setup() {
  pinMode(led, OUTPUT);
  digitalWrite(led, LOW);

  Serial.begin(9600);
  esp8266.begin(115200); // Velocidade padrão do ESP8266 (ajuste se necessário)

  // Conexão Wi-Fi
  Serial.println("Iniciando conexão Wi-Fi...");
  sendData("AT+RST\r\n", 2000, DEBUG);                            // Reset
  sendData("AT+CWMODE=1\r\n", 1000, DEBUG);                       // Modo estação
  sendData("AT+CWJAP=\"Ana paula\",\"999269675\"\r\n", 5000, DEBUG); // Conectar Wi-Fi
  sendData("AT+CIFSR\r\n", 1000, DEBUG);                          // Ver IP
  sendData("AT+CIPMUX=1\r\n", 1000, DEBUG);                       // Permitir múltiplas conexões
  sendData("AT+CIPSERVER=1,80\r\n", 1000, DEBUG);                 // Servidor na porta 80

  Serial.println("Wi-Fi conectado.");
}

// ==================================================================
// --- Loop ---
void loop() {
  // --- Leitura do teclado ---
  char tecla = teclado.getKey();
  if (tecla != NO_KEY) {
    if (tecla != '#') {
      senha[pos] = tecla;
      pos++;
      if (pos >= sizeof(senha) - 1) pos = 0;
    } else {
      senha[pos] = '\0';
      Serial.print("Senha digitada: ");
      Serial.println(senha);

      if (!strcmp(correta, senha)) {
        Serial.println("Senha correta -> Abrindo fechadura");
        digitalWrite(led, HIGH);
        delay(5000);
      } else {
        Serial.println("Senha incorreta");
      }

      // Limpar senha
      memset(senha, 0, sizeof(senha));
      pos = 0;
      digitalWrite(led, LOW);
    }
  }

  // --- Verificar se há conexão HTTP recebida ---
  if (esp8266.available()) {
    if (esp8266.find(q)) {
      delay(100);
      int connectionId = esp8266.read() - 48;

      String webpage = "<h1>Fechadura Inteligente</h1>";
      webpage += "<p>Senha digitada: ";
      webpage += senha;
      webpage += "</p>";

      String cipSend = "AT+CIPSEND=";
      cipSend += connectionId;
      cipSend += ",";
      cipSend += webpage.length();
      cipSend += "\r\n";

      sendData(cipSend, 1000, DEBUG);
      sendData(webpage, 1000, DEBUG);

      String closeCommand = "AT+CIPCLOSE=";
      closeCommand += connectionId;
      closeCommand += "\r\n";

      sendData(closeCommand, 3000, DEBUG);
    }
  }
}

// ==================================================================
// --- Função auxiliar para enviar dados AT ---
String sendData(String command, const int timeout, boolean debug) {
  String response = "";
  esp8266.print(command);
  long int time = millis();

  while ((time + timeout) > millis()) {
    while (esp8266.available()) {
      char c = esp8266.read();
      response += c;
    }
  }
  if (debug) {
    Serial.print(response);
  }
  return response;
}
