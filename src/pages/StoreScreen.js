import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Button,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import StoreAdd from "../pages/StoreAdd";
import { initDbDelguur, getStore } from "../helpers/db";
import { useFocusEffect } from "@react-navigation/native";
import { loadPlaces, loadStore } from "../store/places-actions";
import StoreList from "../components/StoreList";
import MyButton from "./MyButton";

const Store = ({ navigation }) => {
  const store = useSelector((state) => state.data.store);
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState(null);
  const [item, setItem] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [text, setText] = useState("");
  const [cc, setcc] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      fetchCompany();
    }, [])
  );

  const fetchCompany = () => {
    initDbDelguur()
      .then((result) => {
        (async () => {
          const result = await getStore();
          setcc(result.rows._array);
        })();
      })
      .catch((err) => console.log("Базыг бэлтгэхэд асуудал гарлаа!", err));
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

  return (
    <View>
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

      {/* <MyButton title="Нэмэх" onPress={() => handleClick("name")} /> */}

      {cc && (
        <FlatList
          data={cc}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.row}>
              <Text style={styles.alignLeft}>
                <Text style={styles.itemText}>
                  {parseInt(index) + 1} | {item.ner} - {item.rd} - {item.hayag}{" "}
                  - {item.dans}
                </Text>
              </Text>
              <Text style={styles.alignRight}>
                <Text style={styles.alignRight}>
                  <TouchableOpacity onPress={() => handleOpenModal(item)}>
                    <Text style={styles.orderText}>Засах</Text>
                  </TouchableOpacity>
                </Text>
              </Text>
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
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
