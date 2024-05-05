import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  Button,
  Platform,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import Add from "./CompanyAdd";
import { loadCompany } from "../store/places-actions";
import { useSelector, useDispatch } from "react-redux";
import {
  initDb,
  initDbCompany,
  insertPlace,
  getPlaces,
  insertCompany,
  getCompany,
  deleteCompany,
  initDbOrder,
} from "../helpers/db";
import CompanyInfo from "../components/Company";

const Company = () => {
  const [showModal, setShowModal] = useState(false);
  const [list, setlist] = useState([]);
  const [selectedPrinter, setSelectedPrinter] = React.useState();
  const [cc, setcc] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      fetchCompany();
    }, [])
  );
  useEffect(() => {
    fetchCompany();
  }, []);
  const getMoviesFromApiAsync = async () => {
    try {
      const response = await fetch(
        "https://9xz5rjl8ej.execute-api.us-east-1.amazonaws.com/production/baraa"
      );
      const json = await response.json();
      console.log("json", json);
      return json.movies;
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {}, []);

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

  const print = async () => {
    await Print.printAsync({
      html: createDynamicTable(),
    });
  };

  const deleteData = () => {
    initDbCompany()
      .then((result) => {
        (async () => {
          const result = await deleteCompany();

          dispatch(loadCompany());
        })();
      })
      .catch((err) => console.log("Базыг бэлтгэхэд асуудал гарлаа!", err));
  };

  const dropOrder = () => {
    initDbOrder()
      .then((result) => {
        (async () => {
          const result = await dropOrder();
        })();
      })
      .catch((err) => console.log("Базыг бэлтгэхэд асуудал гарлаа!", err));
  };

  const array = new Array(10).fill("Row");

  const createDynamicTable = () => {
    var table = "";
    for (let i in array) {
      table = table + ` <tr style='border: 1px'><td>${array[i] + i}</td></tr>`;
    }
    const html = `
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
              </head>
              <body style="text-align: center;">
              <Table>${table}</Table>
              </body>
            </html>
            `;
    return html;
  };

  return (
    <View style={styles.container}>
      <Add visible={showModal} cancel={() => setShowModal(false)} />
      <Button title="Бүртгэх" onPress={() => setShowModal(true)} />
      {/* <Button title="Print" onPress={print} /> */}
      <Button title="Data" onPress={fetchCompany} />
      <Button title="Data1" onPress={getMoviesFromApiAsync} />
      {/* <Button title="Delete" onPress={deleteData} /> */}

      {/* <Button title="DropOrder" onPress={dropOrder} /> */}

      <View style={styles.spacer} />
      {cc && (
        <FlatList
          data={cc}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.row}>
              <Text>Компани нэр: {item.c_name}</Text>
              <Text>Хаяг: {item.c_hayag}</Text>
              <Text>Утас: {item.c_utas}</Text>
              <Text>Код: {item.c_code}</Text>
              <Text>Данс: {item.c_dans}</Text>
            </View>
          )}
        />
      )}
      <FlatList
        // keyExtractor={(person) => person.color}
        data={list}
        renderItem={({ item, index }) => (
          <TouchableOpacity>
            <View
              style={{
                backgroundColor: item.color,
                padding: 20,
                marginHorizontal: 10,
              }}
            >
              <Text>
                {index + 1}) {item.c_name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
export default Company;

const styles = StyleSheet.create({
  container: { flex: 1 },
  itemStyle: {
    padding: 10,
  },
  itemSeparatorStyle: {
    height: 0.5,
    width: "100%",
    backgroundColor: "#C8C8C8",
  },
  row: {
    marginTop: 20,
    marginLeft: 20,
  },
});
