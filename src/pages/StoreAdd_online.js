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
  insertDelguur,
  initDbDelguur,
  getStore,
  updateStore,
} from "../helpers/db";

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
  const save = (item) => {
    const postData = {
      delguur_ner: ner,
      d_dans: "",
      d_hayag: hayag,
      d_register: code,
      d_utas: utas,
      company_name: dans,
    };
    console.log("INSERTING ORDER........", postData);

    const response = fetch("https://dmunkh.store//api/backend/delguur", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Assuming the server returns JSON data
      })
      .then((data) => {
        // setIsSaveLoading(true);
        onAddItem();
        Alert.alert("Бүртгэл", "Амжилттай хадгалагдлаа", [
          {
            text: "OK",
          },
        ]);

        // setIsSaveLoading(false);
        // onAddItem();
      })
      .catch((error) => {
        // setIsSaveLoading(false);
        console.error("There was a problem with the fetch operation:", error);
      });
    console.log("return", response.data);
  };
  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.view}>
        <Text>Дэлгүүр нэр:</Text>
        <TextInput value={ner} onChangeText={(text) => setner(text)} />
        <Text>Хаяг</Text>
        <TextInput value={hayag} onChangeText={(text) => sethayag(text)} />
        <Text>Утас</Text>
        <TextInput value={utas} onChangeText={(text) => setutas(text)} />
        <Text>Регистер дугаар</Text>
        <TextInput value={code} onChangeText={(text) => setcode(text)} />
        <Text>Компани нэр</Text>
        <TextInput value={dans} onChangeText={(text) => setdans(text)} />

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
