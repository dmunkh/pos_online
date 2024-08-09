import React, { useState, useEffect, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { TextInput } from "@react-native-material/core";

import OrderAdd from "./GoodsOrders_local";
import Deposit from "./GoodsDeposit";
import { AuthContext } from "../context/AuthContext";

import {
  initDbBaraa_online,
  getBaraa,
  insertBaraa,
  deleteBaraa,
  getOrderN,
  dropBaraa_online,
} from "../helpers/db_online";
// import BarcodeScanner from "./Barcode";
import _ from "lodash";
import { initDbOrder } from "../helpers/db";
export default function Setting() {
  // const baraa = useSelector((state) => state.data.baraa);
  // const dispatch = useDispatch();
  const {
    userToken,
    baraalist,
    userInfo,
    set_baraa,
    order_id,
    set_baraa_local,
    baraalist_local,
    set_baraa_list_local,
    orders_sum,
    set_orders_sum,
  } = useContext(AuthContext);
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
  const [selected_baraa, setselected_baraa] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://dmunkh.store/api/backend/balance/group?user_id=" +
            userInfo[0].id
        );

        const json = await response.json();
        set_baraa_list_local(json);
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

  const saveOrder = () => {
    initDbBaraa_online()
      .then((result) => {
        (async () => {
          const result = await deleteBaraa();
          // const r1 = await dropBaraa_online();
          Alert.alert("Бүртгэл", "Устгалаа", [
            {
              text: "OK",
            },
          ]);
        })();
      })
      .catch((err) => console.log("Базыг бэлтгэхэд асуудал гарлаа!", err));
    initDbBaraa_online()
      .then((result) => {
        (async () => {
          try {
            for (const item of list) {
              await insertBaraa(
                // item.id,
                item.id,
                item.ner ? item.ner : "-",
                0,
                item.price ? item.price : 0,
                item.company_id,
                item.company_name,
                item.uldegdel ? item.uldegdel : 0,
                item.box_count ? item.box_count : 0
              );
            }
            const result = await getBaraa();
            console.log("Inserted items and retrieved results:", result);
          } catch (error) {
            console.log("Error inserting items:", error);
          }
        })();
      })
      .catch((err) => console.log("Базыг бэлтгэхэд асуудал гарлаа!", err));
  };
  const fetchOrder = () => {
    initDbOrder()
      .then((result) => {
        (async () => {
          const result = await getOrderN();
          console.log("sqlite local", result.rows._array);
          Alert.alert("Бүртгэл", "Амжилттай хадгалагдлаа", [
            {
              text: "OK-" + result && result.rows._array.length + "-",
            },
          ]);
        })();
      })
      .catch((err) => {
        Alert.alert("Бүртгэл", "Амжилттай хадгалагдлаа", [
          {
            text: "ERROR",
            err,
          },
        ]);
      });
  };
  const deleteTable = () => {
    initDbBaraa_online()
      .then((result) => {
        console.log("sqlite local");
        (async () => {
          const r1 = await dropBaraa_online();

          Alert.alert("Бүртгэл", "Амжилттай хадгалагдлаа", [
            {
              text: "OK",
            },
          ]);
        })();
      })
      .catch((err) => {
        Alert.alert("Бүртгэл", "Амжилттай хадгалагдлаа", [
          {
            text: "ERROR",
            err,
          },
        ]);
      });
  };

  const fetchBaraa = () => {
    initDbBaraa_online()
      .then((result) => {
        console.log("sqlite local");
        (async () => {
          const result = await getBaraa();
          console.log("sqlite local", result.rows._array);
          Alert.alert("Бүртгэл", "Амжилттай хадгалагдлаа", [
            {
              text: "OK" + result && result.rows._array.length + "-",
            },
          ]);
          set_baraa_list_local(result.rows._array);
        })();
      })
      .catch((err) => {
        Alert.alert("Бүртгэл", "Амжилттай хадгалагдлаа", [
          {
            text: "ERROR",
            err,
          },
        ]);
      });
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
  useEffect(() => {
    try {
      var total = 0;
      for (const item of baraalist_local) {
        if (item.count > 0) {
          total += item.count * item.une;
        }
      }
      set_orders_sum(total);
    } catch (error) {
      console.log("Error calculating total:", error);
    }
  }, [baraalist_local]);

  const increaseQuantity = (id) => {
    set_baraa_list_local((prevList) => {
      const index = prevList.findIndex((item) => item.id === id);
      if (index !== -1) {
        const newList = [...prevList];
        newList[index] = {
          ...newList[index],
          count: parseInt(newList[index].count) + 1,
        };
        return newList;
      }
      return prevList;
    });
    // set_baraa_list_local((prevList) =>
    //   prevList.map((item) =>
    //     item.id === id ? { ...item, count: item.count + 1 } : item
    //   )
    // );
  };

  const decreaseQuantity = (id) => {
    set_baraa_list_local((prevList) => {
      const index = prevList.findIndex((item) => item.id === id);
      if (index !== -1 && prevList[index].count > 0) {
        const newList = [...prevList];
        newList[index] = { ...newList[index], count: newList[index].count - 1 };
        return newList;
      }
      return prevList;
    });
    // set_baraa_list_local((prevList) =>
    //   prevList.map((item) =>
    //     item.id === id && item.count > 0
    //       ? { ...item, count: item.count - 1 }
    //       : item
    //   )
    // );
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.alignLeft}>
          <TextInput
            value={search}
            onChangeText={(text) => searchfilter(text)}
            placeholder="Бараа хайх"
          />
        </View>
        <View style={styles.alignRight}>
          <Button title="хадгалах" onPress={deleteTable} />
          <Button title="Data" onPress={fetchBaraa} />
          <Button title="Хуулах" onPress={saveOrder} />
        </View>
      </View>

      {/* <BaraaAdd
        item={selectedItem}
        visible={showModal}
        onAddItem={fetchBaraa}
        cancel={() => handleCloseModal(false)}
      /> */}
      <OrderAdd
        visible={showModalOrder}
        cancel={() => setShowModalOrder(false)}
        data={selected_baraa}
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
      {baraalist_local && (
        <FlatList
          data={baraalist_local}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) =>
            order_id !== 0 ? (
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.alignLeft}
                  onPress={() => {
                    console.log("baraa item", item);
                    set_baraa_local(item.baraa_id);
                    setselected_baraa(item.baraa_id);
                    setShowModalOrder(true);
                  }}
                >
                  <Text style={styles.alignLeft}>
                    <Text style={styles.itemText}>
                      {parseInt(index) + 1}. {item?.baraa} {"\n"}
                      <Text style={{ color: "blue", paddingLeft: 30 }}>
                        Үлдэгдэл: {item?.uldegdel} Үнэ:{item?.une}
                        {item?.count > 0 &&
                          "x" + item?.count + "=" + item?.une * item?.count}
                      </Text>
                    </Text>
                  </Text>
                </TouchableOpacity>

                <View style={styles.buttonContainer}>
                  <Button title="-" onPress={() => decreaseQuantity(item.id)} />
                  <Text style={styles.quantityText}>{item.count}</Text>
                  <Button title="+" onPress={() => increaseQuantity(item.id)} />
                </View>

                <View style={styles.bottomLine} />
              </View>
            ) : (
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.alignLeft}
                  onPress={() => {
                    console.log("baraa item", item.id);
                    set_baraa_local(item.baraa_id);
                    setselected_baraa(item.baraa_id);
                    setShowModalOrder(true);
                  }}
                >
                  <Text style={styles.alignLeft}>
                    <Text style={styles.itemText}>
                      {parseInt(index) + 1}. {item?.ner} {"\n"}
                      <Text style={{ color: "blue", paddingLeft: 30 }}>
                        Үлдэгдэл: {item?.uldegdel} Үнэ:{item?.une}
                        {item?.count > 0 &&
                          "x" + item?.count + "=" + item.une * item.count}
                      </Text>
                    </Text>
                  </Text>
                </TouchableOpacity>

                <View style={styles.buttonContainer}>
                  <Button title="-" onPress={() => decreaseQuantity(item.id)} />
                  <Text style={styles.quantityText}>{item.count}</Text>
                  <Button title="+" onPress={() => increaseQuantity(item.id)} />
                </View>

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
  quantityText: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  buttonContainer: {
    flex: 0.3,
    paddingRight: 0,

    textAlign: "right",
    flexDirection: "row",
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
    flex: 0.3,
    textAlign: "right",

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
