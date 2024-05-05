import React, { useState, useEffect } from "react";
import {
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
import StoreList from "./OrderStore";
import {
  initDbCompany,
  getCompany,
  getOrder,
  initDbOrder,
  initDbDelguur,
  getStore,
  clearOrdern,
  getOrderInfo,
  initDbOrderInfo,
  updateOrder,
  updateOrderInfo,
  deleteOrderInfo,
  insertOrderInfo,
} from "../helpers/db";
import { useFocusEffect } from "@react-navigation/native";

export default function Setting() {
  const [item, setItem] = useState([]);
  const [cc, setcc] = useState([]);
  const [store, setstore] = useState([]);
  const [ordern, setordern] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showModalStore, setShowModalStore] = useState(false);
  const [cash, setcash] = useState("0");

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sumtotal, setsumtotal] = useState("");

  const [text, setText] = useState("");
  const [selectedPrinter, setSelectedPrinter] = React.useState();
  const [data, setData] = useState([]);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Adding 1 to month index
  const day = String(currentDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  var sum = 0;

  useFocusEffect(
    React.useCallback(() => {
      fetchCompany();
      fetchStore();
      fetchOrder();
    }, [])
  );
  useEffect(() => {
    sum = 0;
    if (ordern) {
      for (let i in ordern) {
        sum += ordern[i].une * ordern[i].too;
      }
      setsumtotal(sum);
    }
  }, [ordern]);

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

  const fetchStore = () => {
    initDbDelguur()
      .then((result) => {
        (async () => {
          const result = await getStore();
          setData(result.rows._array);
        })();
      })
      .catch((err) => console.log("Базыг бэлтгэхэд асуудал гарлаа!", err));
  };

  const fetchOrder = () => {
    initDbOrder()
      .then((result) => {
        (async () => {
          const result = await getOrder();

          setordern(result.rows._array);
        })();
      })
      .catch((err) => console.log("Базыг бэлтгэхэд асуудал гарлаа!", err));
  };

  const saveDist = () => {
    console.log("savedist", cash, sum, sumtotal);
    if (sum === "0" && sum === null) {
      Alert.alert("Алдаа", `Хэвлээгүй байна`, [
        { text: "OK", style: "cancel" },
      ]);
    } else {
      initDbOrderInfo()
        .then((result) => {
          (async () => {
            const result = await getOrderInfo();
            const up1 = await updateOrderInfo(
              result.rows._array[0].id,
              cash === null || cash === "" ? 0 : cash,
              sumtotal
            );
            const up2 = await updateOrder(result.rows._array[0].id);

            setSelectedItem(null);
            setcash(null);
            fetchOrder();
          })();
        })
        .catch((err) => console.log("Базыг бэлтгэхэд асуудал гарлаа!", err));
    }
  };

  const fetchOrderInfo = () => {
    initDbOrderInfo()
      .then((result) => {
        (async () => {
          const result = await getOrderInfo();
          //setordern(result.rows._array);
        })();
      })
      .catch((err) => console.log("Базыг бэлтгэхэд асуудал гарлаа!", err));
  };

  const confirmDelete = (item) => {
    Alert.alert("Устгах", `'${item.baraa}' барааг хасах уу`, [
      { text: "Үгүй", style: "cancel" },
      { text: "Тийм", onPress: () => handleDelete(item.id) },
    ]);
  };

  const confirmOrder = () => {
    if (selectedItem === null) {
      Alert.alert("Алдаа", `Дэлгүүр сонгоогүй байна ?`, [
        { text: "OK", style: "cancel" },
      ]);
    } else {
      Alert.alert("Захиалга", `Захиалгыг дуусгах уу?`, [
        { text: "Үгүй", style: "cancel" },
        { text: "Тийм", onPress: () => saveDist() },
      ]);
    }
  };

  const handleDelete = (itemId) => {
    deleteOrder(itemId);
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
    await Print.printAsync({
      html: createDynamicTable(),
    });
  };

  const createDynamicTable = () => {
    var table = "";
    sum = 0;

    for (let i in ordern) {
      table =
        table +
        ` <tr >
        <td style='width:5%' >${parseInt(i) + 1}.</td>
        <td style='text-align: left'>${
          ordern[i].baraa
        }</td><td style='text-align: right'>${
          ordern[i].une
        }</td><td style='text-align: right'>${
          ordern[i].too
        }</td><td style='text-align: right'>${
          ordern[i].une * ordern[i].too
        }</td></tr>`;

      sum += ordern[i].une * ordern[i].too;
    }
    setsumtotal(sum);
    const html = `
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
              </head>
              <body style="text-align: center;">

              <Table style='width: 100%'>

              <tr><td colspan='5' style='text-align: left'>${
                selectedItem && selectedItem.ner
              } </td></tr>

              <tr><td colspan='5' style='padding-top: 2px; text-align: right; border-bottom: 1px dotted #000000'></td></tr>

              <tr><td colspan='5' style='text-align: left; padding-bottom: 20px; border-bottom: 1px dotted #000000'> Огноо: ${formattedDate}, Утас: ${
      selectedItem && selectedItem.utas
    }</td></tr>


              <tr><th>№</th><th style='text-align: left'>Барааны нэр</th><th style='text-align: right'>Нэгж үнэ</th><th style='text-align: right'>Тоо ширхэг</th><th style='text-align: right'>Нийт үнэ</th></tr>
              <tr><td colspan='5' style='text-align: right; border-bottom: 1px dotted #000000'></td></tr>
              ${table}
              <tr><td colspan='5' style='text-align: right; border-bottom: 1px dotted #000000'></td></tr>
              <tr ><td colspan='4' style='text-align: right'>Нийт  </td><td style='text-align: right '>${sum}</td><tr>
             
              <tr ><td colspan='4' style='text-align: right'>Бэлэн  </td><td style='text-align: right '>${
                cash === null || cash === "" ? "0" : cash
              }</td><tr>
            
              <tr ><td colspan='4' style='text-align: right'>Зээл </td><td style='text-align: right '>${
                sum - cash
              }</td><tr>              

              <tr><td colspan='5' style='padding-top:20px; text-align: right; border-bottom: 1px dotted #000000'></td></tr>

              <tr ><td colspan='2' style='text-align: left'>Компанийн нэр: </td><td style='text-align: left ' colspan='3'>${
                cc && cc[0].c_name
              }</td><tr>   
              <tr ><td colspan='2' style='text-align: left'>Утас: </td><td style='text-align: left ' colspan='3'>${
                cc && cc[0].c_utas
              }</td><tr>   
              <tr ><td colspan='2' style='text-align: left'>Данс: </td><td style='text-align: left ' colspan='3'>${
                cc && cc[0].c_dans
              }</td><tr>   
              <tr ><td colspan='2' style='text-align: left'>Регистер: </td><td style='text-align: left ' colspan='3'>${
                cc && cc[0].c_code
              }</td><tr>   

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

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    initDbOrderInfo()
      .then((result) => {
        (async () => {
          const del = await deleteOrderInfo();
          const r1 = await insertOrderInfo(
            item.id,
            item.ner,
            formattedDate,
            year,
            month,
            day
          );
        })();
      })
      .catch((err) => console.log("Базыг бэлтгэхэд асуудал гарлаа!", err));
    closeModal();
  };
  const save = () => {};
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.row}>
        <View style={styles.row1}>
          {
            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowModalStore(true)}
            >
              <Text style={styles.buttonText}>
                Дэлгүүр: {selectedItem && selectedItem.ner}
              </Text>
            </TouchableOpacity>
          }
        </View>
        <View style={styles.row2}>
          <Button
            title="Хэвлэх"
            visible={showModal}
            cancel={() => setShowModal(false)}
            onPress={print}
          />
        </View>
        <View style={styles.row3}>
          <Button title="Түгээх" onPress={confirmOrder} />
        </View>
      </View>

      <StoreList
        data={data}
        onClose={showModalStore}
        onSelectItem={handleSelectItem}
        item={item}
        visible={showModalStore}
        cancel={() => setShowModalStore(false)}
      />

      {ordern && (
        <FlatList
          data={ordern}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.row}>
              <Text style={styles.alignLeft}>
                {parseInt(index) + 1} | {item.baraa} - {item.une} * {item.too} ={" "}
                {item.une * item.too} нийт
              </Text>
              <Text style={styles.alignRight}>
                {" "}
                <TouchableOpacity onPress={() => confirmDelete(item)}>
                  <Text style={styles.deletetext}>Устгах</Text>
                </TouchableOpacity>
              </Text>
              <View style={styles.bottomLine} />
            </View>
          )}
        />
      )}
      <View style={styles.row}>
        <Text style={styles.buttonText}>Бэлэн төлөлт:</Text>
        <TextInput
          keyboardType="numeric"
          value={cash}
          style={styles.input}
          onChangeText={(text) => setcash(text)}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.totalText}>Нийт дүн: {sumtotal && sumtotal}</Text>
      </View>
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
    flex: 0.6,
    marginRight: 5,
  },
  row2: {
    flex: 0.2,
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
    fontSize: 11,
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
