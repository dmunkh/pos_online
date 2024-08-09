import React, { useContext, useState, useEffect } from "react";
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
import { AuthContext } from "../context/AuthContext";
import { TextInput } from "@react-native-material/core";
import MyButton from "./MyButton";
import moment from "moment";
import RadioGroup from "react-native-radio-buttons-group";

const ModalConfirmDelete = ({ visible, cancel, data, onSelectItem }) => {
  const { set_order_id, set_delguur, delguur_id, delguur_ner, userInfo } =
    useContext(AuthContext);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Adding 1 to month index
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  const [id, setid] = useState(0);
  const [ner, setner] = useState("");

  const [item, setitem] = useState([]);
  const [list, setlist] = useState([]);
  const [filterdata, setfilterdata] = useState([]);
  const [masterdata, setmasterdata] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setsearch] = useState("");

  // useEffect(() => {
  //   setfilterdata(data);
  //   setmasterdata(data);
  // }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://dmunkh.store/api/backend/delguur"
        );

        const json = await response.json();

        setfilterdata(json.response);
        setmasterdata(json.response);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchData();
  }, []);
  const save = (item) => {
    const postData = {
      delguur_id: item.id,
      delguur_ner: item.delguur_ner,
      order_number: 0,
      cash: 0,
      register_date: moment(),
      is_approve: 0,
      is_cash_loan: 2,
      mc_id: userInfo[0].main_company_id,
      user_id: userInfo[0].id,
    };
    console.log("INSERTING ORDER........", postData);

    const response = fetch("https://dmunkh.store//api/backend/orders", {
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
        console.log("dataa id........", response.reponse, data, data.id);
        set_order_id(data.id);
        Alert.alert("Бүртгэл", "Амжилттай хадгалагдлаа", [
          {
            text: "OK",
            onPress: () => {
              cancel();
              console.log("OK Pressed");
            },
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

  const handleItemPress = (item) => {
    Alert.alert(
      "Захиалга үүсгэх",
      ` ${item.delguur_ner} дэлгүүрт захиалга үүсгэх үү?`,
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            save(item);
            cancel();
          },
        },
      ]
    );
  };
  const searchfilter = (text) => {
    if (text) {
      const newData = masterdata.filter((item) => {
        const itemData = item.delguur_ner
          ? item.delguur_ner.toUpperCase()
          : "".toUpperCase();
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
    <Modal visible={visible} style={styles.bottomLine}>
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
                  console.log(item, item.id, item.delguur_ner);
                  setner(item.delguur_ner);
                  setid(item.id);
                  set_delguur(item.id, item.delguur_ner, item.d_utas);

                  handleItemPress(item);
                }}
              >
                <Text style={styles.textlist}>
                  {parseInt(index) + 1} | {item.delguur_ner} - {item.d_hayag} -{" "}
                  {item.d_utas} - {item.d_rd} - {item.d_dans}
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
    fontSize: 14,
    paddingBottom: 10,
    paddingTop: 10,
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
