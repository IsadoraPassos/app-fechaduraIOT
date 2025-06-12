import React, { useState } from "react";
import { View } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";

type Props = {
  navigation: any;
};

export default function LoginScreen({ navigation }: Props) {
  const [senha, setSenha] = useState("");

  const handleLogin = () => {
    if (senha === "1234") {
      navigation.navigate("Home");
    } else {
      alert("Senha incorreta");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text variant="titleLarge" style={{ padding: 5 }}>Login da Fechadura</Text>
      <TextInput
        label="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        style={{ marginVertical: 16 }}
      />
      <Button mode="contained" onPress={handleLogin}>
        Entrar
      </Button>
    </View>
  );
}
