import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import BaraaList from "../components/BaraaItem";
import BaraaAdd from "./GoodsAdd";
import OrderAdd from "./GoodsOrders";
import Deposit from "./GoodsDeposit";

import { useSelector, useDispatch } from "react-redux";
import { getBaraa, initDbBaraa } from "../helpers/db";
import { loadBaraa } from "../store/places-actions";
import { useFocusEffect } from "@react-navigation/native";
export default function Setting() {
  const baraa = useSelector((state) => state.data.baraa);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showModalOrder, setShowModalOrder] = useState(false);
  const [showModalDeposit, setShowModalDeposit] = useState(false);
  const [list, setlist] = useState([]);
  const [cc, setcc] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      fetchBaraa();
    }, [])
  );

  const fetchBaraa = () => {
    initDbBaraa()
      .then((result) => {
        (async () => {
          const result = await getBaraa();
          setcc(result.rows._array);
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
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.row1}>
          <Button title="Бүртгэх" onPress={() => setShowModal(true)} />
        </View>
        <View style={styles.row1}>
          <Button title="Data" onPress={fetchBaraa} />
        </View>
      </View>

      <BaraaAdd
        item={selectedItem}
        visible={showModal}
        onAddItem={fetchBaraa}
        cancel={() => handleCloseModal(false)}
      />
      <OrderAdd
        visible={showModalOrder}
        cancel={() => setShowModalOrder(false)}
        data={list}
      />
      <Deposit
        visible={showModalDeposit}
        cancel={() => setShowModalDeposit(false)}
        data={list}
      />

      <View style={styles.spacer} />

      {cc && (
        <FlatList
          data={cc}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.row}>
              <Text style={styles.alignLeft}>
                <TouchableOpacity
                  onPress={() => {
                    handleOpenModal(item);
                  }}
                >
                  <Text style={styles.itemText}>
                    {" "}
                    {parseInt(index) + 1} | {item.baraa} - {item.une}
                  </Text>
                </TouchableOpacity>
              </Text>
              <Text style={styles.alignRight}>
                <TouchableOpacity
                  onPress={() => {
                    setShowModalDeposit(true);
                    setlist(item);
                  }}
                >
                  <Text style={styles.orderText}>Орлого</Text>
                </TouchableOpacity>
              </Text>
              <Text style={styles.alignRight}>
                <TouchableOpacity
                  onPress={() => {
                    setShowModalOrder(true);
                    setlist(item);
                  }}
                >
                  <Text style={styles.orderText}>Захиалга</Text>
                </TouchableOpacity>
              </Text>

              <View style={styles.bottomLine} />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  itemStyle: {
    padding: 10,
  },
  bottomLine: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 0,
    height: 1,
    backgroundColor: "#E0E0E0", // Same as the borderBottomColor above
  },
  itemSeparatorStyle: {
    height: 0.5,
    width: "100%",
    backgroundColor: "#C8C8C8",
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
    fontSize: 10,
  },
  alignRight: {
    flex: 0.2,
    textAlign: "right",
    paddingRight: 5,
    fontSize: 14,
  },
  orderText: {
    color: "blue",
    fontSize: 13,
    marginRight: 10,
  },
  itemText: {
    fontSize: 13,
    marginRight: 10,
  },
});
