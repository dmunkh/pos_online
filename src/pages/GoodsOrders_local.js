import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Modal,
  SafeAreaView,
  FlatList,
  Alert,
} from "react-native";
import { TextInput } from "@react-native-material/core";
import MyButton from "./MyButton";
import { AuthContext } from "../context/AuthContext";

import moment from "moment";

const ModalConfirmDelete = ({ visible, cancel, deleteItem, item, data }) => {
  const [ner, setner] = useState("");
  const [une, setune] = useState("");
  const [too, settoo] = useState("");
  const [box, setbox] = useState("");
  const [bonus, setbonus] = useState("");
  const [comment, secomment] = useState("");
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const {
    baraalist,
    // baraa,
    delguur_id,
    delguur_ner,
    userInfo,
    set_balance_id,
    set_order_list,
    order_id,
    set_baraa_list_local,
    baraa_local,
  } = useContext(AuthContext);

  // console.log("baraa_local", baraa_local[0].baraa, data);
  useEffect(() => {
    settoo(0);
    setbox(null);
  }, [baraa_local]);

  // console.log("baraa", baraa?);

  const setCount = (id, newCount) => {
    settoo(newCount);
    set_baraa_list_local(
      (prevList) => {
        const index = prevList.findIndex((item) => item.baraa_id === id);
        if (index !== -1) {
          const newList = [...prevList];
          newList[index] = {
            ...newList[index],
            count: newCount,
          };
          return newList;
        }
        return prevList;
      }
      // prevList.map((item) =>
      //   item.id === id ? { ...item, count: newCount } : item
      // )
    );
  };

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.view}>
        <Text>
          Барааны нэр: {baraa_local[0]?.ner} - {order_id}{" "}
        </Text>
        <Text>Нэгж үнэ:{baraa_local[0]?.une} </Text>
        <View>
          <View style={styles.row1}></View>
          <View style={styles.row2}></View>
        </View>
        <Text>Тоо ширхэг: {too && too}</Text>
        <TextInput
          keyboardType="numeric"
          value={too}
          onChangeText={(text) => setCount(baraa_local[0].baraa_id, text)}
        />
        <Text>Хайрцаг:</Text>
        <TextInput
          keyboardType="numeric"
          value={box}
          onChangeText={(text) => {
            // console.log(baraa[0], baraa[0]?.box_count, text);
            var ss = baraa_local[0]?.box_count * parseInt(text);
            settoo(ss);
            setbox(text);
          }}
        />
        <Text>Урамшуулал:</Text>
        <TextInput
          keyboardType="numeric"
          value={bonus}
          onChangeText={(text) => setbonus(text)}
        />

        <View
          style={{
            flexDirection: "row",
            marginTop: 20,
            width: "90%",
            justifyContent: "space-around",
          }}
        >
          {isSaveLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <MyButton style={css.button} title="Хадгалах" onPress={setCount} />
          )}
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
  view: { marginLeft: 10, marginRight: 10, marginTop: 120 },
  text: {
    color: "#41cdf4",
  },
  row1: {
    flex: 0.6,
    marginRight: 5,
  },
  row2: {
    flex: 0.4,
    marginRight: 5,
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
