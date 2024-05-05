import React, { useState, useEffect } from "react";
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
  updateBaraa,
} from "../helpers/db";
import { useSelector, useDispatch } from "react-redux";

const ModalConfirmDelete = ({ visible, cancel, item, onAddItem }) => {
  const [id, setid] = useState("");
  const [ner, setner] = useState("");
  const [une, setune] = useState("");
  const [comment, secomment] = useState("");

  useEffect(() => {
    if (item !== null) {
      item && setid(item.id);
      item && setner(item.baraa);
      item && setune(item.une.toString());
    } else {
      setid("");
      setner("");
      setune("");
    }
  }, [item]);

  const save = () => {
    initDbBaraa()
      .then((result) => {
        (async () => {
          if (item === null) {
            const r1 = await insertBaraa(ner, une);
          } else {
            const r1 = await updateBaraa(ner, une, item.id);
          }
          setner("");
          setune("");
          Alert.alert("Бүртгэл", "Амжилттай хадгалагдлаа", [
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ]);

          onAddItem();
        })();
      })
      .catch((err) => console.log("Базыг бэлтгэхэд асуудал гарлаа!", err));
  };

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.view}>
        <Text>NER</Text>
        <TextInput value={ner} onChangeText={(text) => setner(text)} />
        <Text>UNE</Text>
        <TextInput
          keyboardType="numeric"
          value={une}
          onChangeText={(text) => setune(text)}
        />
        <Text>TAILBAR</Text>
        <TextInput value={comment} onChangeText={(text) => setcomment(text)} />

        <View
          style={{
            flexDirection: "row",
            marginTop: 20,
            width: "90%",
            justifyContent: "space-around",
          }}
        >
          <MyButton style={css.button} title="Хадгалах" onPress={save} />
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
  view: { marginLeft: 10, marginRight: 10 },
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
