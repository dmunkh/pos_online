import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  Text,
  View,
  Button,
  TouchableOpacity,
} from "react-native";
import * as Print from "expo-print";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getOrderInfoApprove, getOrderPrint, initDbOrder } from "../helpers/db";
import { useFocusEffect } from "@react-navigation/native";

export default function Home() {
  const [ordern, setordern] = useState([]);
  const [approve, setapprove] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [cash, setcash] = useState(null);
  const currentDate = new Date();
  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, "0"); // Adding 1 to month index
  const day = String(selectedDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  let sum = 0;
  let sumcash = 0;

  useFocusEffect(
    React.useCallback(() => {
      fetchOrder(formattedDate);
      fetchOrderInfoApprove(formattedDate);
    }, [])
  );

  useEffect(() => {
    fetchOrder(formattedDate);
    fetchOrderInfoApprove(formattedDate);
  }, [formattedDate]);

  const handleDateChange = (event, date) => {
    if (date !== undefined) {
      setSelectedDate(date);
    }
    setShowDatePicker(false);
  };

  const fetchOrder = (dt) => {
    initDbOrder()
      .then((result) => {
        (async () => {
          const result = await getOrderPrint(dt);

          if (result.rows._array.length !== 0) {
            setordern(result.rows._array);
          } else {
            setordern([]);
          }
          console.log(result.rows._array);
          sumcash = 0;
        })();
      })
      .catch((err) => console.log("Базыг бэлтгэхэд асуудал гарлаа!", err));
  };

  const fetchOrderInfoApprove = (dt) => {
    initDbOrder()
      .then((result) => {
        (async () => {
          const result = await getOrderInfoApprove(dt);
          if (result.rows._array.length !== 0) {
            setapprove(result.rows._array);
          } else {
            setapprove([]);
          }

          sum = 0;
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
        <td style='text-align: left'>${ordern[i].storename}</td>
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
    const html = `
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
              </head>
              <body style="text-align: center;">

              <Table style='width: 100%'>

              <tr><td colspan='6' style='padding-top: 2px; text-align: right; border-bottom: 1px dotted #000000'></td></tr>

              <tr><td colspan='6' style='text-align: left; padding-bottom: 20px; border-bottom: 1px dotted #000000'> Огноо: ${formattedDate}  </td></tr>

              <tr><th>№</th><th style='text-align: left'>Дэлгүүр</th><th style='text-align: left'>Барааны нэр</th><th style='text-align: right'>Нэгж үнэ</th><th style='text-align: right'>Тоо ширхэг</th><th style='text-align: right'>Нийт үнэ</th></tr>
              <tr><td colspan='6' style='text-align: right; border-bottom: 1px dotted #000000'></td></tr>
              ${table}
              <tr><td colspan='6' style='text-align: right; border-bottom: 1px dotted #000000'></td></tr>
              <tr ><td colspan='5' style='text-align: right'>Нийт  </td><td style='text-align: right '>${sum}</td><tr>
              </Table>
              </body>
            </html>
            `;
    return html;
  };

  const printSum = async () => {
    await Print.printAsync({
      html: createDynamicTableApprove(),
    });
  };

  const createDynamicTableApprove = () => {
    var table = "";
    sum = 0;
    sumcash = 0;
    for (let i in approve) {
      table =
        table +
        ` <tr >
        <td style='width:5%' >${parseInt(i) + 1}.</td>        
        <td style='text-align: left'>${approve[i].storename}</td>
        <td style='text-align: right'>${approve[i].sumtotal}</td>
        <td style='text-align: right'>${
          approve[i].cash === null ||
          approve[i].cash === 0 ||
          approve[i].cash === ""
            ? 0
            : approve[i].cash
        }</td><td style='text-align: right'>${
          approve[i].sumtotal - approve[i].cash
        }</td></tr>`;

      sum += approve[i].sumtotal;
      sumcash +=
        approve[i].cash === null ||
        approve[i].cash === 0 ||
        approve[i].cash === ""
          ? 0
          : approve[i].cash;
    }
    const html = `
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
              </head>
              <body style="text-align: center;">

              <Table style='width: 100%'>

              <tr><td colspan='5' style='padding-top: 2px; text-align: right; border-bottom: 1px dotted #000000'></td></tr>

              <tr><td colspan='5' style='text-align: left; padding-bottom: 20px; border-bottom: 1px dotted #000000'> Огноо: ${formattedDate}  </td></tr>

              <tr><th>№</th><th style='text-align: left'>Дэлгүүр нэр: </th><th style='text-align: right'>Нийт</th><th style='text-align: right'>Бэлэн</th><th style='text-align: right'>Үлдэгдэл</th></tr>
              <tr><td colspan='5' style='text-align: right; border-bottom: 1px dotted #000000'></td></tr>
              ${table}
              <tr><td colspan='5' style='text-align: right; border-bottom: 1px dotted #000000'></td></tr>
              <tr ><td colspan='2' style='text-align: right'>  </td><td style='text-align: right '>${sum}</td><td style='text-align: right '>${sumcash}</td><td style='text-align: right '>${
      sum - sumcash
    }</td><tr>
              </Table>
              </body>
            </html>
            `;
    return html;
  };
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.row1}>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={styles.button}>Огноо: {formattedDate}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row2}>
          <Button
            title="Харах"
            onPress={() => {
              fetchOrder(formattedDate);
              fetchOrderInfoApprove(formattedDate);
            }}
          />
        </View>
        {/* <View style={styles.row2}>
          <Button title="Хэвлэх" onPress={print} />
        </View> */}
      </View>

      <View style={styles.row}>
        <View style={styles.row4}>
          <Button title="Хэвлэх" onPress={print} />
        </View>
        <View style={styles.row5}>
          <Button title="Хэвлэх нэгдсэн" onPress={printSum} />
        </View>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {ordern && (
        <FlatList
          data={ordern}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.row}>
              <Text style={styles.alignLeft}>
                {parseInt(index) + 1} | {item.dt} -{item.m}-{item.d} |{" "}
                {item.storename} | {item.baraa} - {item.une} * {item.too} ={" "}
                {item.une * item.too} нийт
              </Text>
              <View style={styles.bottomLine} />
            </View>
            // <TouchableOpacity onPress={() => confirmDelete(item)}>
            //   {" "}
            //   <Text>{item.baraa}</Text>
            // </TouchableOpacity>
          )}
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
    flex: 0.6,
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
});
