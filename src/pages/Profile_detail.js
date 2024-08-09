import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Button,
} from "react-native";
import * as Print from "expo-print";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";
import { TextInput } from "@react-native-material/core";
import MyButton from "./MyButton";
import moment from "moment";

const ModalConfirmDelete = ({ visible, cancel, data, onSelectItem }) => {
  const { orderlist, cash, userInfo, delguur_ner, delguur_utas } =
    useContext(AuthContext);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Adding 1 to month index
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  const [loading, setLoading] = useState(false);
  const [filterdata, setfilterdata] = useState([]);
  const [masterdata, setmasterdata] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setsearch] = useState("");
  const [sumtotal, setsumtotal] = useState(0);
  // console.log(userInfo[0]?.sub_code);
  useEffect(() => {
    sum = 0;
    if (orderlist) {
      for (let i in orderlist) {
        sum += orderlist[i].price * orderlist[i].count;
      }
      setsumtotal(sum);
    }
  }, [orderlist]);
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
  const print = async () => {
    setLoading(true);
    await Print.printAsync({
      html: createDynamicTable(),
    });
    setLoading(false);
  };
  const createDynamicTable = () => {
    var table = "";
    sum = 0;

    for (let i in orderlist) {
      // console.log(orderlist[i].price);
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
  return (
    <Modal visible={visible} style={styles.bottomLine}>
      <SafeAreaView>
        <View style={styles.row}>
          <View style={styles.row1}>
            {/* <TextInput
              value={sumtotal}
              onChangeText={(text) => searchfilter(text)}
              placeholder="Дэлгүүр хайх"
            /> */}
            <Text>Нийт дүн: {Intl.NumberFormat("en-US").format(sumtotal)}</Text>
            <Text>Бэлэн: {Intl.NumberFormat("en-US").format(cash)}</Text>
          </View>
          <View style={styles.row2}>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <Button title="Хэвлэх" onPress={print} />
            )}
          </View>
          <View style={styles.row3}>
            <Button title="Гарах" onPress={cancel} />
          </View>
        </View>

        <View style={styles.list}>
          <FlatList
            data={orderlist}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.row}>
                <Text style={styles.alignLeft}>
                  {parseInt(index) + 1}. {item.baraa_ner}
                </Text>
                <Text style={styles.alignRight}>
                  {item.price} * {item.count} ={" "}
                  {Intl.NumberFormat("en-US").format(item.price * item.count)}{" "}
                </Text>
                <View style={styles.bottomLine} />
              </View>
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
    marginTop: 10,
  },
  row1: {
    flex: 0.4,
    marginRight: 1,
    marginLeft: 5,
  },
  row2: {
    flex: 0.3,
    marginRight: 5,
  },
  row3: {
    flex: 0.3,
    marginRight: 3,
  },
  alignLeft: {
    flex: 0.6,
    textAlign: "left",
    paddingLeft: 5,
    fontSize: 13,
  },
  alignRight: {
    flex: 0.4,
    textAlign: "right",
    paddingRight: 5,
    fontSize: 13,
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
