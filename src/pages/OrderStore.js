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
  TouchableOpacity,
} from "react-native";
import { TextInput } from "@react-native-material/core";
import MyButton from "./MyButton";
import {
  deleteOrderInfo,
  initDbOrderInfo,
  insertOrderInfo,
  initDbDelguur,
} from "../helpers/db";

const ModalConfirmDelete = ({ visible, cancel, data, onSelectItem }) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Adding 1 to month index
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  const [id, setid] = useState();
  const [ner, setner] = useState("");

  const [item, setitem] = useState([]);

  const [filterdata, setfilterdata] = useState([]);
  const [masterdata, setmasterdata] = useState([]);
  const [search, setsearch] = useState("");
  useEffect(() => {
    setfilterdata(data);
    setmasterdata(data);
  }, [data]);
  const handleItemPress = (item) => {
    Alert.alert("Дэлгүүр сонголт", ` ${item.ner} дэлгүүрийг сонгох уу?`, [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => {
          onSelectItem(item);
          setitem(item);
          // save();
          cancel();
        },
      },
    ]);
  };
  const searchfilter = (text) => {
    if (text) {
      const newData = masterdata.filter((item) => {
        const itemData = item.ner ? item.ner.toUpperCase() : "".toUpperCase();
        const textData = text.toUpperCase();

        return itemData.indexOf(textData) > -1;
      });
      setfilterdata(newData);
      setsearch(text);
    } else {
      setfilterdata(masterdata);
      setsearch(text);
    }
  };

  return (
    <Modal visible={visible}>
      <SafeAreaView>
        <View style={styles.row}>
          <View style={styles.alignLeft}>
            <TextInput
              value={search}
              onChangeText={(text) => searchfilter(text)}
              placeholder="Дэлгүүр хайх"
            />
          </View>
          <View style={styles.alignRight}>
            <MyButton title="Хаах" onPress={cancel} />
          </View>
        </View>

        <View style={styles.list}>
          <FlatList
            data={filterdata}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  setid(item.id);
                  setner(item.ner);
                  handleItemPress(item);
                }}
              >
                <Text style={styles.textlist}>
                  {parseInt(index) + 1} | {item.ner} - {item.hayag} -{" "}
                  {item.utas} - {item.rd} - {item.dans}
                </Text>
                <View style={styles.bottomLine} />
              </TouchableOpacity>
            )}
          />
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
  bottomLine: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 0,
    height: 1,
    backgroundColor: "#E0E0E0", // Same as the borderBottomColor above
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  alignLeft: {
    flex: 0.6,
    textAlign: "left",
    paddingLeft: 6,
    fontSize: 11,
  },
  alignRight: {
    flex: 0.4,
    textAlign: "right",
    paddingRight: 0,
  },
  list: {
    textAlign: "left",
    paddingLeft: 6,
    fontSize: 11,
  },
  text: {
    color: "#41cdf4",
  },
  textlist: {
    fontSize: 12,
    paddingBottom: 2,
    paddingTop: 5,
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
