import React, { useState, useEffect, useContext } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Button,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import * as Print from "expo-print";
import StoreList from "./OrderStore_online";
// import Goods from "./GoodsOrders_online";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";

import { useFocusEffect } from "@react-navigation/native";

export default function Setting() {
  const {
    userInfo,
    delguur_ner,
    delguur_id,
    delguur_utas,
    set_cash,
    cash,
    order_id,
    balanceid,
    orderlist,
    set_order_id,
    set_delguur,
    set_order_list,
    set_orders,
  } = useContext(AuthContext);
  const [item, setItem] = useState([]);
  const [cc, setcc] = useState([]);
  const [store, setstore] = useState([]);
  const [ordern, setordern] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalStore, setShowModalStore] = useState(false);
  const [loading_print, setLoading_print] = useState(false);
  // const [cash, setcash] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sumtotal, setsumtotal] = useState("");

  const [text, setText] = useState(0);
  const [selectedPrinter, setSelectedPrinter] = React.useState();
  const [data, setData] = useState([]);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0"); // Adding 1 to month index
  const hour = String(currentDate.getHours()).padStart(2, "0");
  const minute = String(currentDate.getMinutes()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day} ${hour}:${minute}`;

  var sum = 0;

  // useEffect(() => {
  //   console.log("order list loadin......");
  //   const fetchData = async () => {
  //     try {
  //       setIsLoading(true);
  //       const response = await fetch(
  //         "https://dmunkh.store/api/backend/balance/order?order_id=6"
  //       );

  //       const json = await response.json();

  //       setordern(json.response);
  //       // setfilterdata(json.response);
  //       // setmasterdata(json.response);
  //       sum = 0;
  //       if (json.response) {
  //         for (let i in json.response) {
  //           sum += json.response[i].price * json.response[i].count;
  //         }
  //         setsumtotal(sum);
  //       }

  //       setIsLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching order:", error);
  //     }
  //   };

  //   fetchData();
  // }, [balanceid]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     fetchCompany();
  //     fetchStore();
  //     // fetchOrder();
  //   }, [])
  // );
  useEffect(() => {
    sum = 0;
    if (orderlist) {
      for (let i in orderlist) {
        sum += orderlist[i].price * orderlist[i].count;
      }
      setsumtotal(sum);
    }
  }, [orderlist]);

  const saveDist = () => {
    console.log(order_id);
    Alert.alert("Алдаа", `Дэлгүүр сонгоогүй байна {} ?` + order_id, [
      { text: "OK", style: "cancel" },
    ]);
  };

  const confirmDelete = (item) => {
    Alert.alert("Устгах", `'${item.baraa_ner}' барааг хасах уу`, [
      { text: "Үгүй", style: "cancel" },
      { text: "Тийм", onPress: () => handleDelete(item.id) },
    ]);
  };
  const handleItemPress = (item) => {
    Alert.alert(
      "Захиалга дуусгах",
      ` ${delguur_ner} дэлгүүрийн захиалгыг дуусгах уу?`,
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            confirmOrder();
          },
        },
      ]
    );
  };
  const confirmOrder = () => {
    setIsLoading(true);
    const postData = {
      // delguur_id: delguur_id,
      // delguur_ner: delguur_ner,
      cash: parseInt(text),
      is_approve: 0,
      print_date: null,
      is_print: null,
    };

    console.log("try to insert......", postData);
    const response = fetch(
      "https://dmunkh.store/api/backend/orders/" + order_id,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Assuming the server returns JSON data
      })
      .then((data) => {
        console.log("update....", data);
        // onAddItem();
        set_delguur(0, null);
        set_order_id(0);
        set_order_list(0);
        set_orders(
          moment().format("YYYY"),
          moment().format("MM"),
          moment().format("DD")
        );
        setText(0);
        set_cash(0);
        console.log("Response data:", data);
        setIsLoading(false);
        // fetchData(); // Refresh data
        //     setModalVisible(false); // Close modal
        // Handle the response data
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setIsLoading(false);
      });
  };

  const handleDelete = (itemId) => {
    console.log(itemId);
    const response = fetch(
      "https://dmunkh.store//api/backend/balance/" + itemId,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify(postData),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Assuming the server returns JSON data
      })
      .then((data) => {
        console.log("delete....", data);
        set_order_list(order_id);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const deleteOrder = (id) => {
    initDbOrder()
      .then((result) => {
        (async () => {
          const result = await clearOrdern(id);

          fetchOrder();
        })();
      })
      .catch((err) => console.log("Базыг бэлтгэхэд асуудал гарлаа!", err));
  };

  const print = async () => {
    setLoading_print(true);
    await Print.printAsync({
      html: createDynamicTable(),
    });
    setLoading_print(false);
  };
  console.log(orderlist);
  const createDynamicTable = () => {
    var table = "";
    sum = 0;

    for (let i in orderlist) {
      console.log(orderlist[i].price);
      table =
        table +
        ` <tr >
        <td style='width:5%' >${parseInt(i) + 1}.</td>
        <td style='text-align: left'>${
          orderlist[i].baraa_ner
        }</td><td style='text-align: right'>${
          orderlist[i].price
        }</td><td style='text-align: right'>${
          orderlist[i].count
        }</td><td style='text-align: right'>${
          orderlist[i].price * orderlist[i].count
        }</td></tr>`;

      // sum += orderlist[i].une * orderlist[i].too;
    }
    // setsumtotal(sum);
    const html = `
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
              </head>
              <body style="text-align: center;">

              <Table style='width: 100%'>

              <tr><td colspan='5' style='text-align: left'>${
                delguur_ner && delguur_ner
              } </td></tr>

              <tr><td colspan='5' style='padding-top: 2px; text-align: right; border-bottom: 1px dotted #000000'></td></tr>

              <tr><td colspan='5' style='text-align: left; padding-bottom: 20px; border-bottom: 1px dotted #000000'> Огноо: ${formattedDate}, Утас: ${
      delguur_utas && delguur_utas
    }</td></tr>


              <tr><th>№</th><th style='text-align: left'>Барааны нэр</th><th style='text-align: right'>Нэгж үнэ</th><th style='text-align: right'>Тоо ширхэг</th><th style='text-align: right'>Нийт үнэ</th></tr>
              <tr><td colspan='5' style='text-align: right; border-bottom: 1px dotted #000000'></td></tr>
              ${table}
              <tr><td colspan='5' style='text-align: right; border-bottom: 1px dotted #000000'></td></tr>
              <tr ><td colspan='4' style='text-align: right'>Нийт  </td><td style='text-align: right '>${sumtotal}</td><tr>
             
              <tr ><td colspan='4' style='text-align: right'>Бэлэн  </td><td style='text-align: right '>${
                cash === null || cash === "" ? "0" : cash
              }</td><tr>
            
              <tr ><td colspan='4' style='text-align: right'>Зээл </td><td style='text-align: right '>${
                sumtotal - cash
              }</td><tr>              

              <tr><td colspan='5' style='padding-top:20px; text-align: right; border-bottom: 1px dotted #000000'></td></tr>

              <tr ><td colspan='2' style='text-align: left'>Компанийн нэр: </td><td style='text-align: left ' colspan='3'>
              Арвин үр түрүү - Тэнгэрийн хишиг ХХК
              </td><tr>   
              <tr ><td colspan='2' style='text-align: left'>Утас: </td><td style='text-align: left ' colspan='3'>99868090</td><tr>   
              <tr ><td colspan='2' style='text-align: left'>Данс: </td><td style='text-align: left ' colspan='3'>
              Хаан банк 5217205009 , 5090709172 Сарнайцэцэг	
              </td><tr>   
              <tr ><td colspan='2' style='text-align: left'>Регистер: </td><td style='text-align: left ' colspan='3'>3199355</td><tr>   

             <tr><td colspan='5' style='padding-top:20px; text-align: right; border-bottom: 1px dotted #000000'></td></tr>
              <tr ><td colspan='2' style='text-align: left; padding-top:10px'>Хүлээж авсан: </td><td style='text-align: left ' colspan='3'>
              </td><tr>   
              <tr ><td colspan='2' style='text-align: left; padding-top:10px'>Хүлээлгэж өгсөн: </td><td style='text-align: left ' colspan='3'>
              </td><tr>   
              </Table>
              </body>
            </html>
            `;
    return html;
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.row}>
        <View style={styles.row1}>
          {
            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowModalStore(true)}
            >
              <Text style={styles.buttonText}>Дэлгүүр: {delguur_ner}</Text>
            </TouchableOpacity>
          }
        </View>

        <View style={styles.row2}>
          {order_id !== 0 ? (
            loading_print ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <Button
                title="Хэвлэх"
                visible={showModal}
                cancel={() => setShowModalGoods(false)}
                onPress={print}
              />
            )
          ) : (
            ""
          )}
        </View>
        <View style={styles.row3}>
          {order_id !== 0 ? (
            <Button title="Дуусгах" onPress={handleItemPress} />
          ) : (
            ""
          )}
        </View>
      </View>

      <StoreList
        data={data}
        onClose={showModalStore}
        item={item}
        visible={showModalStore}
        cancel={() => setShowModalStore(false)}
      />
      {/* <Goods
        // data={data}
        onClose={showModalGoods}
        onSelectItem={handleSelectItem}
        item={item}
        visible={showModalGoods}
        cancel={() => setShowModalGoods(false)}
      /> */}

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        orderlist && (
          <FlatList
            data={orderlist}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.row}>
                <Text style={styles.alignLeft}>
                  {parseInt(index) + 1} | {item.baraa_ner} - {item.price} *{" "}
                  {item.count} ={" "}
                  {Intl.NumberFormat("en-US").format(item.price * item.count)}{" "}
                  нийт
                </Text>
                <Text style={styles.alignRight}>
                  {" "}
                  <TouchableOpacity onPress={() => confirmDelete(item)}>
                    <Text style={styles.deletetext}>
                      {" "}
                      <Ionicons
                        name="ios-create-outline"
                        size={24}
                        color="blue"
                      />
                      Хасах
                    </Text>
                  </TouchableOpacity>
                </Text>
                <View style={styles.bottomLine} />
              </View>
            )}
          />
        )
      )}
      {/* {order_id !== 0 ? ( */}
      {order_id !== 0 ? (
        <View style={styles.row}>
          <Text style={styles.buttonText}>Бэлэн төлөлт:</Text>
          <TextInput
            keyboardType="numeric"
            value={cash}
            style={styles.input}
            onChangeText={(text) => {
              set_cash(text);
              setText(text);
            }}
          />
        </View>
      ) : (
        ""
      )}
      {order_id !== 0 ? (
        <View style={styles.row}>
          <Text style={styles.totalText}>
            Нийт дүн: {sumtotal && Intl.NumberFormat("en-US").format(sumtotal)}
          </Text>
        </View>
      ) : (
        ""
      )}

      {/* ) : (
        <View>
          <Text>Захиалга үүсгэх </Text>{" "}
        </View>
      )} */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
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
  },
  row2: {
    flex: 0.2,
    marginRight: 5,
  },
  row3: {
    flex: 0.3,
    marginRight: 5,
  },
  alignLeft: {
    flex: 0.8,
    textAlign: "left",
    paddingLeft: 6,
    paddingTop: 6,
    fontSize: 13,
  },
  alignRight: {
    flex: 0.2,
    textAlign: "right",
    paddingRight: 0,
  },
  deletetext: {
    color: "blue",
    fontSize: 12,
    paddingRight: 10,
    paddingLeft: 10,
    marginRight: 10,
  },
  input: {
    flex: 0.8,
    width: 200, // Set the desired width here
    height: 30,
    paddingLeft: 10,
    borderWidth: 1,
  },
  header: {
    flex: 1,
    backgroundColor: "lightblue",
    alignItems: "center",
    justifyContent: "center",
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
  totalText: {
    fontSize: 14,
    textAlign: "center",
    paddingLeft: 10,
    paddingRight: 10,
    fontWeight: "bold",
  },
});
