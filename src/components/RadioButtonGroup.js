import * as React from "react";
import { View, StyleSheet } from "react-native";
import { RadioButton, Text } from "react-native-paper";

const RadioButtonGroup = () => {
  const [checked, setChecked] = React.useState("first");

  return (
    <View style={styles.container}>
      <View style={styles.radioButton}>
        <RadioButton
          value="first"
          status={checked === "first" ? "checked" : "unchecked"}
          onPress={() => setChecked("first")}
        />
        <Text>First Option</Text>
      </View>
      <View style={styles.radioButton}>
        <RadioButton
          value="second"
          status={checked === "second" ? "checked" : "unchecked"}
          onPress={() => setChecked("second")}
        />
        <Text>Second Option</Text>
      </View>
      <View style={styles.radioButton}>
        <RadioButton
          value="third"
          status={checked === "third" ? "checked" : "unchecked"}
          onPress={() => setChecked("third")}
        />
        <Text>Third Option</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    padding: 20,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});

export default RadioButtonGroup;
