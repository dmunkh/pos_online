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
    baraa,
    delguur_id,
    delguur_ner,
    userInfo,
    set_balance_id,
    set_order_list,
    order_id,
  } = useContext(AuthContext);

  // console.log("baraaaaa", baraa[0]?.une);
  useEffect(() => {
    settoo(0);
    setbox(null);
  }, [baraa]);

  const save = () => {
    const postData = {
      order_id: order_id,
      type_id: 3,
      delguur_id: delguur_id,
      delguur_ner: delguur_ner,
      baraa_id: baraa[0].id,
      baraa_ner: baraa[0].baraa_ner,
      company_name: baraa[0].company_ner,
      company_id: baraa[0].company_id,
      count: too,
      unit: baraa[0].unit,
      price: baraa[0].une,
      register_date: moment(),
      box_count: box && parseInt(box),
      mc_id: userInfo[0].main_company_id,
      user_id: userInfo[0].id,
      comment: "",
      bonus: 0,
      src_id: userInfo[0].sub_code,
      dest_id: 0,
    };
    console.log("Good orders", postData);

    const response = fetch("https://dmunkh.store//api/backend/balance", {
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
        setIsSaveLoading(true);
        // console.log("dataaaa", data.id, data.message);
        Alert.alert("Бүртгэл", "Амжилттай хадгалагдлаа", [
          {
            text: "OK",
            onPress: () => {
              cancel();
              console.log("OK Pressed");
            },
          },
        ]);
        if (data.message === "Inserted") {
          set_balance_id(data.id);
        } else {
          console.log("updateee", data.id[0]);
          set_balance_id(data.id[0]);
        }

        set_order_list(order_id);
        setIsSaveLoading(false);
        // onAddItem();
      })
      .catch((error) => {
        setIsSaveLoading(false);
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.view}>
        <Text>
          Барааны нэр: {baraa[0]?.baraa_ner} - {order_id}{" "}
        </Text>
        <Text>Нэгж үнэ:{baraa[0]?.une} </Text>
        <View>
          <View style={styles.row1}></View>
          <View style={styles.row2}></View>
        </View>
        <Text>Тоо ширхэг: {too && too}</Text>
        <TextInput
          keyboardType="numeric"
          value={too}
          onChangeText={(text) => settoo(text)}
        />
        <Text>Хайрцаг:</Text>
        <TextInput
          keyboardType="numeric"
          value={box}
          onChangeText={(text) => {
            console.log(baraa[0], baraa[0].box_count, text);
            var ss = baraa[0]?.box_count * parseInt(text);
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
            <MyButton style={css.button} title="Хадгалах" onPress={save} />
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
