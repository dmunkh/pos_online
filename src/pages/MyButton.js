import React from "react";
import { View, Button, StyleSheet } from "react-native";

export default function ({ title, onPress, style }) {
  return (
    <View style={[css.button, style]}>
      <Button title={title} onPress={onPress} />
    </View>
  );
}

const css = StyleSheet.create({
  button: {
    marginVertical: 5,
    marginHorizontal: 20,
  },
});
