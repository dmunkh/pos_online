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
import OrderAdd from "./GoodsOrders";

import DateTimePicker from "@react-native-community/datetimepicker";
import { initDbDeposit, getDeposit } from "../helpers/db";
import { useFocusEffect } from "@react-navigation/native";

export default function Home() {
  const [ordern, setordern] = useState([]);
  const [approve, setapprove] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [list, setlist] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showModalOrder, setShowModalOrder] = useState(false);
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
      fetchDeposit(formattedDate);
    }, [])
  );
  useEffect(() => {
    fetchDeposit(formattedDate);
  }, [selectedDate]);

  const handleDateChange = (event, date) => {
    if (date !== undefined) {
      setSelectedDate(date);
    }
    setShowDatePicker(false);
  };

  const fetchDeposit = (dt) => {
    initDbDeposit()
      .then((result) => {
        (async () => {
          const result = await getDeposit(dt);
          setordern(result.rows._array);
          console.log(result.rows._array);
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
          ordern[i].orlogo
        }</td><td style='text-align: right'>${
          ordern[i].ss
        }</td><td style='text-align: right'>${
          ordern[i].orlogo - ordern[i].ss
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


              <tr><td colspan='6' style='text-align: left; padding-bottom: 20px; border-bottom: 1px dotted #000000'> Огноо: ${formattedDate}  </td></tr>

              <tr><th>№</th><th style='text-align: left'>Барааны нэр</th><th style='text-align: right'>Орлого</th><th style='text-align: right'>Зарлага</th><th style='text-align: right'>Үлдэгдэл</th></tr>
              <tr><td colspan='6' style='text-align: right; border-bottom: 1px dotted #000000'></td></tr>
              ${table}
            
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
              fetchDeposit(formattedDate);
            }}
          />
        </View>
        <View style={styles.row2}>
          <Button title="Хэвлэх" onPress={print} />
        </View>
      </View>
      <OrderAdd
        visible={showModalOrder}
        cancel={() => setShowModalOrder(false)}
        data={list}
      />
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
                {parseInt(index) + 1} | {item.baraa} {item.orlogo} - {item.ss} ={" "}
                {item.orlogo - item.ss} үлдэгдэл
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
    fontSize: 14,
  },
  alignRight: {
    flex: 0.2,
    textAlign: "right",
    paddingRight: 10,
  },
  bottomLine: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 0,
    height: 1,
    backgroundColor: "#E0E0E0", // Same as the borderBottomColor above
  },
  orderText: {
    color: "blue",
    fontSize: 14,
    marginRight: 15,
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
