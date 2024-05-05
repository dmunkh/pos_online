import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  SafeAreaView,
  FlatList,
  ScrollView,
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
  insertDelguur,
  initDbDelguur,
  getStore,
  updateStore,
} from "../helpers/db";
import { useSelector, useDispatch } from "react-redux";

const ModalConfirmDelete = ({ visible, cancel, onAddItem, item }) => {
  const [id, setid] = useState("");
  const [ner, setner] = useState("");
  const [hayag, sethayag] = useState("");
  const [utas, setutas] = useState("");
  const [code, setcode] = useState("");
  const [dans, setdans] = useState("");
  const [comment, setcomment] = useState("");

  useEffect(() => {
    if (item !== null) {
      item && setid(item.id);
      item && setner(item.ner);
      item && sethayag(item.hayag);
      item && setutas(item.utas);
      item && setcode(item.rd);
      item && setdans(item.dans);
      item && setcomment(item.comment);
    } else {
      setid("");
      setner("");
      sethayag("");
      setutas("");
      setcode("");
      setdans("");
      setcomment("");
    }
  }, [item]);

  const save = () => {
    initDbDelguur()
      .then((result) => {
        (async () => {
          if (item === null) {
            const r1 = await insertDelguur(
              ner,
              hayag,
              utas,
              code,
              dans,
              comment
            );
          } else {
            const r1 = await updateStore(
              ner,
              hayag,
              utas,
              code,
              dans,
              comment,
              item.id
            );
          }
          const result = await getStore();
          Alert.alert("Бүртгэл", "Амжилттай хадгалагдлаа", [
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ]);

          setner("");
          sethayag("");
          setutas("");
          setcode("");
          setdans("");
          setcomment("");
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
        <Text>hayag</Text>
        <TextInput value={hayag} onChangeText={(text) => sethayag(text)} />
        <Text>utas</Text>
        <TextInput value={utas} onChangeText={(text) => setutas(text)} />
        <Text>Регистер дугаар</Text>
        <TextInput value={code} onChangeText={(text) => setcode(text)} />
        <Text>Банкны мэдээлэл</Text>
        <TextInput value={dans} onChangeText={(text) => setdans(text)} />
        <Text>tailbar</Text>
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
