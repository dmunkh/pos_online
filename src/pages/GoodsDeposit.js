import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  SafeAreaView,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TextInput } from "@react-native-material/core";
import MyButton from "./MyButton";

import { initDbDeposit, insertDeposit } from "../helpers/db";
import { useSelector, useDispatch } from "react-redux";

const Deposit = ({ visible, cancel, data, dt }) => {
  const [id, setid] = useState("");
  const [ner, setner] = useState("");
  const [une, setune] = useState("");
  const [too, settoo] = useState("");
  const [comment, secomment] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const currentDate = new Date();
  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, "0"); // Adding 1 to month index
  const day = String(selectedDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  React.useEffect(() => {
    data && setid(data.id);
    data && setner(data.baraa);
    data && setune(data.une);
  }, [data]);

  const handleDateChange = (event, date) => {
    if (date !== undefined) {
      setSelectedDate(date);
    }
    setShowDatePicker(false);
  };
  const saveOrder = () => {
    initDbDeposit()
      .then((result) => {
        (async () => {
          const r1 = await insertDeposit(id, ner, une, too, formattedDate);
          settoo(null);
          Alert.alert("Бүртгэл", "Захиалга бүртгэгдлээ", [
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ]);
          cancel();
        })();
      })
      .catch((err) => console.log("Базыг бэлтгэхэд асуудал гарлаа!", err));
  };

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.view}>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={styles.button}>Огноо: {formattedDate}</Text>
        </TouchableOpacity>
        <Text>Барааны нэр: {ner}</Text>
        <Text>Нэгж үнэ: {une}</Text>
        {/* <TextInput value={ner} onChangeText={(text) => setner(text)} /> */}
        {/* <Text>UNE {une} </Text> */}

        <Text>Орлого:</Text>
        <TextInput
          keyboardType="numeric"
          value={too}
          onChangeText={(text) => settoo(text)}
        />
        <View
          style={{
            flexDirection: "row",
            marginTop: 20,
            width: "90%",
            justifyContent: "space-around",
          }}
        >
          <MyButton style={css.button} title="Хадгалах" onPress={saveOrder} />
          <MyButton style={css.button} title="Хаах" onPress={cancel} />
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default Deposit;

const css = StyleSheet.create({ button: { width: "40%" } });
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 100,
    padding: 20,
  },
  view: { marginLeft: 10, marginRight: 10, marginTop: 20 },
  text: {
    color: "#41cdf4",
  },
  capitalLetter: {
    color: "red",
    fontSize: 20,
  },
  wordBold: {
    fontWeight: "bold",
    color: "black",
  },
  italicText: {
    color: "#37859b",
    fontStyle: "italic",
  },
  textShadow: {
    textShadowColor: "red",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    width: "50px",
  },
  button: {
    backgroundColor: "#A4B0F5",
    padding: 5,
    borderRadius: 2,
    marginBottom: 5,
  },
});
