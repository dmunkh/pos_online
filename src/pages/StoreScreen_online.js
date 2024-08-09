import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Button,
} from "react-native";
// import { useSelector, useDispatch } from "react-redux";
import { TextInput } from "@react-native-material/core";
import StoreAdd from "./StoreAdd_online";
import { initDbDelguur, getStore } from "../helpers/db";
import { useFocusEffect } from "@react-navigation/native";
import { loadPlaces, loadStore } from "../store/places-actions";
import StoreList from "../components/StoreList";
import MyButton from "./MyButton";
import _ from "lodash";

const Store = ({ navigation }) => {
  // const store = useSelector((state) => state.data.store);
  // const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState(null);
  const [item, setItem] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cc, setcc] = useState([]);
  const [list, setlist] = useState([]);
  const [search, setsearch] = useState("");
  const [masterdata, setmasterdata] = useState([]);
  const [refresh, setrefresh] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://dmunkh.store/api/backend/delguur"
        );

        const json = await response.json();
        setlist(_.orderBy(json.response, ["delguur_ner"]));
        setmasterdata(_.orderBy(json.response, ["delguur_ner"]));

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchData();
  }, [refresh]);

  const fetchCompany = () => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://dmunkh.store/api/backend/delguur"
        );

        const json = await response.json();
        setlist(_.orderBy(json.response, ["delguur_ner"]));
        setmasterdata(_.orderBy(json.response, ["delguur_ner"]));

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchData();
  };

  const confirmDelete = (item) => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete '${item.baraa}'?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => handleDelete(item.id) },
      ]
    );
  };

  const handleDelete = (itemId) => {
    deleteOrder(itemId);
  };

  const deleteStore = (id) => {
    initDbOrder()
      .then((result) => {
        (async () => {
          const result = await clearOrdern(id);
          fetchOrder();
        })();
      })
      .catch((err) => console.log("Базыг бэлтгэхэд асуудал гарлаа!", err));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setShowModal(true);
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
      setlist(newData);
      setsearch(text);
    } else {
      setlist(masterdata);
      setsearch(text);
    }
  };

  return (
    <View style={styles.container}>
      <StoreAdd
        item={selectedItem}
        visible={showModal}
        onAddItem={fetchCompany}
        cancel={() => handleCloseModal(false)}
      />

      <View style={styles.row}>
        <View style={styles.row1}>
          <Button
            title="Дэлгүүр нэмэх"
            visible={showModal}
            cancel={() => setShowModal(false)}
            onPress={() => setShowModal(true)}
          />
        </View>
        <View style={styles.row2}>
          <Button title="Харах" onPress={fetchCompany} />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.alignLeft}>
          <TextInput
            // style={{ height: 10, borderWidth: 1, borderColor: "gray" }}
            value={search}
            onChangeText={(text) => searchfilter(text)}
            placeholder="Дэлгүүр хайх"
          />
        </View>
        <View style={styles.alignRight}>
          {/* <Text>order_id - {order_id}</Text> */}
          {/* <View style={styles.container}>
            <BarcodeScanner />
          </View> */}
          {/* <Button title="Шалгах" onPress={() => setrefresh(refresh + 1)} /> */}
        </View>
      </View>

      {/* <MyButton title="Нэмэх" onPress={() => handleClick("name")} /> */}

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.row}>
              <Text style={styles.alignLeft}>
                <Text style={styles.itemText}>
                  {parseInt(index) + 1}. {item.delguur_ner} -{item.d_register}-{" "}
                  {item.d_hayag} - {item.d_utas}
                </Text>
              </Text>
              {/* <Text style={styles.alignRight}>
                <Text style={styles.alignRight}>
                  <TouchableOpacity onPress={() => handleOpenModal(item)}>
                    <Text style={styles.orderText}>Засах</Text>
                  </TouchableOpacity>
                </Text>
              </Text> */}
              <View style={styles.bottomLine} />
            </View>
          )}
        />
      )}
    </View>
  );
};
export default Store;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
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
  row1: {
    flex: 0.6,
    marginRight: 5,
  },
  row2: {
    flex: 0.4,
    marginRight: 5,
  },
  row3: {
    flex: 0.2,
    marginRight: 5,
  },
  alignLeft: {
    flex: 0.8,
    textAlign: "left",
    paddingLeft: 6,
    fontSize: 12,
  },
  alignRight: {
    flex: 0.2,
    textAlign: "right",
    paddingRight: 0,
  },
  orderText: {
    color: "blue",
    fontSize: 12,
    marginRight: 10,
  },
  itemText: {
    fontSize: 13,
    marginRight: 10,
  },
});
