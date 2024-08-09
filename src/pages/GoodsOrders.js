import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  SafeAreaView,
  FlatList,
  Alert,
} from "react-native";
import { TextInput } from "@react-native-material/core";
import MyButton from "./MyButton";

import { loadPlaces } from "../store/places-actions";
import PlaceItem from "../components/PlaceItem";
import {
  initDb,
  initDbCompany,
  insertCompany,
  getCompany,
  initDbBaraa,
  insertBaraa,
  getBaraa,
  insertOrder,
  getOrder,
  initDbOrder,
} from "../helpers/db";
import { useSelector, useDispatch } from "react-redux";

const ModalConfirmDelete = ({ visible, cancel, deleteItem, item, data }) => {
  const [ner, setner] = useState("");
  const [une, setune] = useState("");
  const [too, settoo] = useState("");
  const [comment, secomment] = useState("");

  // const places = useSelector((state) => state.data.places);
  // const dispatch = useDispatch();

  React.useEffect(() => {
    data && setner(data.baraa);
    data && setune(data.une);
    settoo(data.id);
  }, [data]);

  const save = () => {
    initDbBaraa()
      .then((result) => {
        (async () => {
          const r1 = await insertBaraa(ner, une, comment);
          const result = await getBaraa();
        })();
      })
      .catch((err) => console.log("Базыг бэлтгэхэд асуудал гарлаа!", err));
  };

  const saveOrder = () => {
    initDbOrder()
      .then((result) => {
        (async () => {
          const r1 = await insertOrder(ner, une, too);
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
        <Text>Барааны нэр: {ner}</Text>
        <Text>Нэгж үнэ: {une}</Text>
        {/* <TextInput value={ner} onChangeText={(text) => setner(text)} /> */}
        {/* <Text>UNE {une} </Text> */}

        <Text>Тоо ширхэг:</Text>
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
      </SafeAreaView>
    </Modal>
  );
};

export default ModalConfirmDelete;

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
});
