import React, { useState, useEffect, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { TextInput } from "@react-native-material/core";
import BaraaList from "../components/BaraaItem";
import BaraaAdd from "./GoodsAdd";
import OrderAdd from "./GoodsOrders_online";
import Deposit from "./GoodsDeposit";
import { AuthContext } from "../context/AuthContext";
import { useSelector, useDispatch } from "react-redux";
// import { getBaraa, initDbBaraa } from "../helpers/db";
import MyButton from "./MyButton";
// import { loadBaraa } from "../store/places-actions";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
// import BarcodeScanner from "./Barcode";
import _ from "lodash";
export default function Setting() {
  // const baraa = useSelector((state) => state.data.baraa);
  // const dispatch = useDispatch();
  const { userToken, baraalist, userInfo, set_baraa, order_id } =
    useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [showModalOrder, setShowModalOrder] = useState(false);
  const [showModalDeposit, setShowModalDeposit] = useState(false);
  const [list, setList] = useState([]);
  const [cc, setcc] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filterdata, setfilterdata] = useState([]);
  const [masterdata, setmasterdata] = useState([]);
  const [search, setsearch] = useState("");
  const [refresh, setrefresh] = useState(0);
  const [showModalStore, setShowModalStore] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://dmunkh.store/api/backend/balance/group?user_id=" +
            userInfo[0].id
        );

        const json = await response.json();
        setList(_.orderBy(json, ["ner"]));
        setfilterdata(json);
        setmasterdata(json);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchData();
  }, [refresh]);

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
  const searchfilter = (text) => {
    if (text) {
      const newData = masterdata.filter((item) => {
        const itemData = item.ner ? item.ner.toUpperCase() : "".toUpperCase();
        const textData = text.toUpperCase();

        return itemData.indexOf(textData) > -1;
      });
      setList(newData);
      setsearch(text);
    } else {
      setList(masterdata);
      setsearch(text);
    }
  };

  const incrementCount = (id) => {
    setList((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, count: item.count + 1 } : item
      )
    );
  };

  const decrementCount = (id) => {
    setList((prevList) =>
      prevList.map((item) =>
        item.id === id && item.count > 0
          ? { ...item, count: item.count - 1 }
          : item
      )
    );
  };
  return (
    <View style={styles.container}>
      {/* <View style={styles.row}>
          <View style={styles.row1}>
            <Button title="Бүртгэх" onPress={() => setShowModal(true)} />
          </View>
          <View style={styles.row1}>
            <Button title="Data" onPress={fetchBaraa} />
          </View>
        </View> */}
      <View style={styles.row}>
        <View style={styles.alignLeft}>
          <TextInput
            // style={{ height: 10, borderWidth: 1, borderColor: "gray" }}
            value={search}
            onChangeText={(text) => searchfilter(text)}
            placeholder="Бараа хайх"
          />
        </View>
        <View style={styles.alignRight}>
          {/* <Text>order_id - {order_id}</Text> */}
          {/* <View style={styles.container}>
            <BarcodeScanner />
          </View> */}
          <Button title="Шалгах" onPress={() => setrefresh(refresh + 1)} />
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

      {/* <BarcodeScanner
        // data={data}
        onClose={showModalStore}
        // item={item}
        visible={showModalStore}
        cancel={() => setShowModalStore(false)}
      /> */}
      {list && (
        <FlatList
          data={list}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) =>
            order_id !== 0 ? (
              <TouchableOpacity
                onPress={() => {
                  console.log("baraa item", item.id);
                  set_baraa(item.id);
                  setShowModalOrder(true);
                }}
              >
                <View style={styles.row}>
                  <Text style={styles.alignLeft}>
                    <Text style={styles.itemText}>
                      {parseInt(index) + 1}. {item.ner} |
                      <Text style={{ color: "blue", fontWeight: "bold" }}>
                        Үлдэгдэл: {item.uldegdel}
                      </Text>
                    </Text>
                  </Text>

                  <Text style={styles.alignRight}>
                    <Text style={styles.orderText}>
                      <Ionicons
                        name="ios-create-outline"
                        size={24}
                        color="blue"
                      />
                      Захиалга
                    </Text>
                  </Text>

                  <View style={styles.bottomLine} />
                </View>
              </TouchableOpacity>
            ) : (
              <View style={styles.row}>
                <Text style={styles.alignLeft}>
                  <Text style={styles.itemText}>
                    {" "}
                    {parseInt(index) + 1}. {item.ner} |{" "}
                    <Text style={{ color: "blue", fontWeight: "bold" }}>
                      Үлдэгдэл: {item.uldegdel}
                    </Text>
                  </Text>
                </Text>

                <Text style={styles.alignRight}></Text>

                <View style={styles.bottomLine} />
              </View>
            )
          }
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
    flex: 0.7,
    textAlign: "left",
    paddingLeft: 6,
    fontSize: 10,
  },
  alignRight: {
    flex: 0.3,
    textAlign: "right",
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 12,
  },
  orderText: {
    color: "blue",
    fontSize: 13,
    marginRight: 10,
  },
  itemText: {
    fontSize: 14,
    marginRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
});
