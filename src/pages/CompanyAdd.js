import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  SafeAreaView,
  FlatList,
} from "react-native";
import { TextInput } from "@react-native-material/core";
import MyButton from "./MyButton";

import { loadCompany } from "../store/places-actions";
import {
  initDb,
  initDbCompany,
  insertPlace,
  getPlaces,
  insertCompany,
  getCompany,
  deleteCompany,
} from "../helpers/db";
import { useSelector, useDispatch } from "react-redux";

const ModalConfirmDelete = ({ visible, cancel, deleteItem, item }) => {
  const [ner, setner] = useState("");
  const [hayag, sethayag] = useState("");
  const [utas, setutas] = useState("");
  const [code, setcode] = useState("");
  const [dans, setdans] = useState("");
  const company = useSelector((state) => state.data.company);
  const dispatch = useDispatch();

  // React.useEffect(() => {
  //   dispatch(loadPlaces());
  // }, [dispatch]);

  const save = () => {
    initDbCompany()
      .then((result) => {
        (async () => {
          const deleteC = await deleteCompany();
          const r1 = await insertCompany(ner, hayag, utas, code, dans);
          const result = await getCompany();
          dispatch(loadCompany());
        })();
      })
      .catch((err) => console.log("Базыг бэлтгэхэд асуудал гарлаа!", err));
  };

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView>
        <Text>NER</Text>
        <TextInput value={ner} onChangeText={(text) => setner(text)} />
        <Text>hayag</Text>
        <TextInput value={hayag} onChangeText={(text) => sethayag(text)} />
        <Text>utas</Text>
        <TextInput value={utas} onChangeText={(text) => setutas(text)} />
        <Text>code</Text>
        <TextInput value={code} onChangeText={(text) => setcode(text)} />
        <Text>dans</Text>
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
