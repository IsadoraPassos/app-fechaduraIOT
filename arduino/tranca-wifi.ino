#include <Keypad.h>

const byte n_linhas = 4, n_colunas = 4;
char teclas[n_linhas][n_colunas] = { 
  {'1','2','3','A'},{'4','5','6','B'},{'7','8','9','C'},{'*','0','#','D'}
};
byte mapa_linha[n_linhas] = {9,8,7,6};
byte mapa_coluna[n_colunas] = {5,4,3,2};

Keypad teclado = Keypad(makeKeymap(teclas), mapa_linha, mapa_coluna, n_linhas, n_colunas);

char senha[12] = {};
int pos = 0;
int rele = 13;

char senhaEmergencia[12] = "D123456";  // valor default, será atualizado via MQTT

void setup() {
  pinMode(rele, OUTPUT);
  digitalWrite(rele, LOW);
  Serial.begin(9600);
}

void loop() {
  char tecla = teclado.getKey();

  if (tecla != NO_KEY) {
    if (tecla == '*') {
      // Limpar entrada
      memset(senha,0,sizeof(senha));
      pos = 0;
      Serial.println("Entrada limpa");
    }
    else if (tecla == '#') {
      // Confirmar
      senha[pos] = '\0';
      if (strcmp(senha, senhaEmergencia) == 0) {
        Serial.println("Emergencia: abertura offline");
        abrirFechadura();
      }else {
        Serial.println(senha);
      }
      pos = 0;
      memset(senha,0,sizeof(senha));
    }
    else {
      // Digitar caractere
      senha[pos++] = tecla;
      if (pos >= sizeof(senha)-1) pos = sizeof(senha)-1;
    }
  }

  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();

    if (cmd == "ABRIR") {
      Serial.println("Abertura recebida via MQTT");
      abrirFechadura();
    }
    else if (cmd.startsWith("senha:")) {
      String nova = cmd.substring(6);
      nova.trim();
      if (nova.length()>0 && nova.length()<sizeof(senhaEmergencia)) {
        nova.toCharArray(senhaEmergencia, sizeof(senhaEmergencia));
        Serial.print("Emergencia atualizada: ");
      } else Serial.println("Emergencia invalida");
    }
  }
}

void abrirFechadura() {
  digitalWrite(rele, HIGH);
  delay(5000);
  digitalWrite(rele, LOW);
}
