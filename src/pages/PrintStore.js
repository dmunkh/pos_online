import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";

import {
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Text,
  View,
  Button,
  TouchableOpacity,
} from "react-native";
import * as Print from "expo-print";
import DateTimePicker from "@react-native-community/datetimepicker";
import Add from "../pages/PrintStoreAdd";
import {
  getOrderPrint,
  initDbOrder,
  initDbDelguur,
  getStore,
  getOrderInfoApprove,
  getOrderID,
  getOrderPrintID,
  initDbCompany,
  getCompany,
  initDbOrderInfo,
} from "../helpers/db";
import axios from "axios";
import OrderList from "./PrintOrderInfo";
import { useFocusEffect } from "@react-navigation/native";

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [ordern, setordern] = useState([]);
  const [list, setlist] = useState([]);
  const [cc, setcc] = useState([]);
  const [item, setItem] = useState([]);
  const [data, setData] = useState([]);
  const [showModalStore, setShowModalStore] = useState(false);
  const [approve, setapprove] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cash, setcash] = useState(null);
  const currentDate = new Date();
  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, "0"); // Adding 1 to month index
  const day = String(selectedDate.getDate()).padStart(2, "0");
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const formattedDate = `${year}-${month}-${day}`;
  const [sumtotal, setsumtotal] = useState("");

  let sum = 0;
  let sumcash = 0;

  useFocusEffect(
    React.useCallback(() => {
      fetchOrderInfo(formattedDate);
      fetchOrder(formattedDate);
      fetchCompany();
    }, [])
  );
  const getMoviesFromApiAsync = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://9xz5rjl8ej.execute-api.us-east-1.amazonaws.com/production/balance"
      );
      const json = await response.json();
      console.log("json", json);
      setlist(json);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchOrderInfo(formattedDate);
    fetchOrder(formattedDate);
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://9xz5rjl8ej.execute-api.us-east-1.amazonaws.com/production/balance"
        );
        const json = await response.json();
        setlist(json);
        console.log("errorrrrrr");
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchData();
  }, [formattedDate]);

  // useEffect(() => {
  //   fetchOrder(formattedDate);
  // }, [selectedItem]);

  // useEffect(() => {
  //   fetchCompany();
  //   fetchOrder(formattedDate);
  //   //console.log(selectedItem);
  //   // fetchOrderID(selectedItem);
  // }, [selectedItem]);

  const handleDateChange = (event, date) => {
    if (date !== undefined) {
      setSelectedDate(date);
      // fetchOrder(formattedDate);
      // fetchOrderInfoApprove(formattedDate);
    }
    setShowDatePicker(false);
  };

  const fetchCompany = () => {
    initDbCompany()
      .then((result) => {
        (async () => {
          const result = await getCompany();
          setcc(result.rows._array);
        })();
      })
      .catch((err) => console.log("Базыг бэлтгэхэд асуудал гарлаа!", err));
  };

  const fetchOrderInfo = (dt) => {
    initDbOrderInfo()
      .then((result) => {
        (async () => {
          const result = await getOrderInfoApprove(dt);

          if (result.rows._array.length !== 0) {
            setordern(result.rows._array);
          } else {
            setordern([]);
          }
          console.log(result.rows._array);
        })();
      })
      .catch((err) => console.log("Базыг бэлтгэхэд асуудал гарлаа!", err));
  };

  const fetchOrderID = (id) => {
    initDbOrder()
      .then((result) => {
        (async () => {
          const result = await getOrderID(id);
          setData(result.rows._array);
          // sumcash = 0;
        })();
      })
      .catch((err) => console.log("Базыг бэлтгэхэд асуудал гарлаа!", err));
  };

  const fetchOrder = (dt) => {
    initDbOrder()
      .then((result) => {
        (async () => {
          const result = await getOrderPrint(dt);
          if (result.rows._array.length !== 0) {
            setData(result.rows._array);
          } else {
            setData([]);
          }

          // sumcash = 0;
        })();
      })
      .catch((err) => console.log("Базыг бэлтгэхэд асуудал гарлаа!", err));
  };

  const print = async (item) => {
    await Print.printAsync({
      html: createDynamicTable(item),
    });
  };

  const createDynamicTable = (item) => {
    var table = "";
    sum = 0;
    let list = [];

    for (let i in data.filter((a) => a.orderID === item.id)) {
      table =
        table +
        ` <tr >
        <td style='width:5%' >${parseInt(i) + 1}.</td>
        <td style='text-align: left'>${
          data.filter((a) => a.orderID === item.id)[i].baraa
        }</td><td style='text-align: right'>${
          data.filter((a) => a.orderID === item.id)[i].une
        }</td><td style='text-align: right'>${
          data.filter((a) => a.orderID === item.id)[i].too
        }</td><td style='text-align: right'>${
          data.filter((a) => a.orderID === item.id)[i].une *
          data.filter((a) => a.orderID === item.id)[i].too
        }</td></tr>`;
      sum +=
        data.filter((a) => a.orderID === item.id)[i].une *
        data.filter((a) => a.orderID === item.id)[i].too;
    }

    const html = `
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
              </head>
              <body style="text-align: center;">

              <Table style='width: 100%'>
              <tr><td colspan='6' style='text-align: left; padding-bottom: 20px; border-bottom: 1px dotted #000000'>  ${
                item.storename
              }  </td></tr>
              <tr><td colspan='6' style='text-align: left; padding-bottom: 20px; border-bottom: 1px dotted #000000'> Огноо: ${
                item.dt
              }  </td></tr>

              <tr><th>№</th><th style='text-align: left'>Барааны нэр</th><th style='text-align: right'>Нэгж үнэ</th><th style='text-align: right'>Тоо ширхэг</th><th style='text-align: right'>Нийт үнэ</th></tr>
              <tr><td colspan='5' style='text-align: right; border-bottom: 1px dotted #000000'></td></tr>
              ${table}
              <tr><td colspan='5' style='text-align: right; border-bottom: 1px dotted #000000'></td></tr>
              <tr ><td colspan='4' style='text-align: right'>Нийт  </td><td style='text-align: right '>${
                item.sumtotal
              }</td><tr>
              <tr ><td colspan='4' style='text-align: right'>Бэлэн  </td><td style='text-align: right '>${
                item.cash === null || item.cash === "" || item.cash === 0
                  ? 0
                  : item.cash
              }</td><tr>
            
              <tr ><td colspan='4' style='text-align: right'>Үлдэгдэл </td><td style='text-align: right '>${
                item.sumtotal -
                (item.cash === null || item.cash === "" || item.cash === 0
                  ? 0
                  : item.cash)
              }</td><tr>              

              <tr><td colspan='5' style='padding-top:50px; text-align: right; border-bottom: 1px dotted #000000'></td></tr>

              <tr ><td colspan='2' style='text-align: left'>Компанийн нэр: </td><td colspan='3' style='text-align: left '>${
                cc && cc[0].c_name
              }</td><tr>   
              <tr ><td colspan='2' style='text-align: left'>Утас: </td><td style='text-align: left' colspan='3' >${
                cc && cc[0].c_utas
              }</td><tr>   
              <tr ><td colspan='2' style='text-align: left'>Данс: </td><td style='text-align: left' colspan='3' >${
                cc && cc[0].c_dans
              }</td><tr>   
              <tr ><td colspan='2' style='text-align: left'>Код: </td><td style='text-align: left' colspan='3' >${
                cc && cc[0].c_code
              }</td><tr>   
              </Table>
              </body>
            </html>
            `;
    return html;
  };
  const handleItemAdded = () => {
    // This function will be called when an item is successfully added
    // You can use it to refresh the list
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://9xz5rjl8ej.execute-api.us-east-1.amazonaws.com/production/balance"
        );
        const json = await response.json();
        setlist(json);
        console.log("errorrrrrr");
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchData();
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);

    closeModal();
  };

  const handleRowClick = (item) => {
    fetchCompany();
    setSelectedItem(item);
    setModalVisible(true);
    // fetchOrderID(item.id);

    print(item);
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
      <Add
        item={selectedItem}
        visible={showModal}
        onAddItem={handleItemAdded}
        cancel={() => handleCloseModal(false)}
      />
      <View style={styles.row}>
        <View style={styles.row1}>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={styles.button}>Огноо: {formattedDate}</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Button
            title="Харах"
            onPress={getMoviesFromApiAsync}
            // onPress={() => {
            //   fetchOrderInfo(formattedDate);
            //   fetchOrder(formattedDate);
            // }}
          />
        </View>
        <View>
          <Button
            title="Нэмэх"
            visible={showModal}
            cancel={() => setShowModal(false)}
            onPress={() => setShowModal(true)}
            // onPress={() => {
            //   fetchOrderInfo(formattedDate);
            //   fetchOrder(formattedDate);
            // }}
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.row1}>
          {/* <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setShowModalStore(true);
              fetchOrderInfo(formattedDate);
            }}
          >
            <Text style={styles.buttonText}>
              Дэлгүүр: {selectedItem && selectedItem.storename}
            </Text>
          </TouchableOpacity> */}
        </View>
      </View>
      <View>
        <Text>List</Text>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.row}>
              <TouchableOpacity
                onPress={() => {
                  handleRowClick(item);
                }}
              >
                <Text style={styles.alignLeft}>
                  {parseInt(index) + 1} | {item.id} | {item.company_name} |{" "}
                  {item.une} -{" "}
                </Text>
              </TouchableOpacity>
              <View style={styles.bottomLine} />
            </View>
          )}
        />
      )}

      {ordern && (
        <FlatList
          data={ordern}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.row}>
              <TouchableOpacity
                onPress={() => {
                  handleRowClick(item);
                }}
              >
                <Text style={styles.alignLeft}>
                  {parseInt(index) + 1} | {item.m}-{item.d} | {item.storename} |{" "}
                  {item.sumtotal} -{" "}
                  {item.cash === null || item.cash === 0 || item.cash === ""
                    ? 0
                    : item.cash}{" "}
                  ={" "}
                  {
                    item.sumtotal - parseInt(item.cash)
                    // (item.cash === null || item.cash === 0 || item.cash
                    //   ? 0
                    //   : parseInt(item.cash))
                  }{" "}
                  үлдэгдэл
                </Text>
              </TouchableOpacity>
              <View style={styles.bottomLine} />
            </View>
          )}
        />
      )}
      {/* <View style={styles.row}>
        <View style={styles.row4}>
          <Button title="Хэвлэх" onPress={print} />
        </View>
      </View> */}
      {/* <OrderList
        data={data}
        onClose={showModalStore}
        onSelectItem={handleSelectItem}
        item={item}
        visible={showModalStore}
        cancel={() => setShowModalStore(false)}
      /> */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  alignLeft: {
    flex: 0.8,
    textAlign: "left",
    paddingLeft: 6,
    fontSize: 12,
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
    flex: 0.7,
    marginRight: 5,
    marginLeft: 10,
  },
  row2: {
    flex: 0.2,
    marginRight: 5,
  },
  row3: {
    flex: 0.2,
    marginRight: 5,
  },
  row4: {
    flex: 0.5,
    marginLeft: 5,
  },
  row5: {
    flex: 0.5,
    marginLeft: 5,
    marginRight: 5,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  selectedDate: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#A4B0F5",
    padding: 5,
    borderRadius: 2,
    marginBottom: 5,
  },
  buttonText: {
    color: "blue",
    fontSize: 14,
    textAlign: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },
});
