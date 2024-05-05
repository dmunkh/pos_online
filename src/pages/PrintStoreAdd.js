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

const PrintStoreAdd = ({ navigation, visible, cancel, onAddItem, item }) => {
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
    const postData = {
      id: 999,
      order_num: 0,
      delguur_id: 0,
      delguur_ner: "",
      baraa_id: 1,
      baraa_ner: "Alim banana",
      company_name: "",
      company_id: "",
      count: "999",
      box_count: "9",
      type: 1,
      unit: "sh",
      une: 99999,
      year: 2024,
      month: 4,
      day: 25,
    };

    console.log("try to insert");
    const response = fetch(
      "https://9xz5rjl8ej.execute-api.us-east-1.amazonaws.com/production/balance",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Assuming the server returns JSON data
      })
      .then((data) => {
        onAddItem();
        console.log("Response data:", data);
        // fetchData(); // Refresh data
        //     setModalVisible(false); // Close modal
        // Handle the response data
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
    console.log("return", response.data);
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
          <MyButton title="Cancel" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default PrintStoreAdd;

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
