import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AuthContext } from "../context/AuthContext";
import _ from "lodash";
import Items from "./Profile_detail";
import CustomButton from "../components/CustomButton";
import moment from "moment";

const ProfileScreen = () => {
  // const [isLoading, setIsLoading] = useState(false);
  const {
    userToken,
    log_out,
    userInfo,
    orders,
    set_order_list,
    set_orders,
    set_cash,
    orders_sum,
    isLoading,
    set_delguur,
  } = useContext(AuthContext);
  const [list, setlist] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [sumtotal, setsumtotal] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, "0"); // Adding 1 to month index
  const day = String(selectedDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  useEffect(() => {
    sum = 0;
    if (orders) {
      for (let i in orders) {
        sum += orders[i].total;
      }
      setsumtotal(sum);
    }
  }, [orders]);
  //   useEffect(() => {
  //     const fetchData = async () => {
  //       try {
  //         setIsLoading(true);
  //         const response = await fetch(
  //           "https://dmunkh.store/api/backend/orders?main_company_id=" +
  //             userInfo[0].main_company_id +
  //             "&user_id=" +
  //             userInfo[0].id
  //         );

  //         const json = await response.json();
  //         setlist(_.orderBy(json.response, ["register_date"], ["desc"]));

  //         setIsLoading(false);
  //       } catch (error) {
  //         console.error("Error fetching balance:", error);
  //       }
  //     };

  //     fetchData();
  //   }, [userInfo]);
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDateChange = (event, date) => {
    if (date !== undefined) {
      try {
        setSelectedDate(date);
        set_orders(
          moment(date).format("YYYY"),
          moment(date).format("MM"),
          moment(date).format("DD")
        );
      } catch (error) {
        setShowDatePicker(false);
        console.log("error fetching order", error);
      }
      // fetchOrder(formattedDate);
      // fetchOrderInfoApprove(formattedDate);
    }
    setShowDatePicker(false);
  };

  return (
    <View style={styles.container}>
      <CustomButton
        style={{ width: 40 }}
        label={"Гарах"}
        onPress={() => {
          log_out();
        }}
      />
      <View style={styles.row}>
        <View style={styles.row1}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.buttonText}>Огноо: {formattedDate}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row2}>
          <Button
            title="Харах"
            onPress={() => {}}
            // onPress={() => {
            //   fetchOrderInfo(formattedDate);
            //   fetchOrder(formattedDate);
            // }}
          />
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
      <Items
        // item={selectedItem}
        visible={showModal}
        onAddItem={() => setShowModal(true)}
        cancel={() => {
          set_order_list(0);
          setShowModal(false);
        }}
      />
      <Text style={styles.underlinedText}>
        Нийт дүн:: {Intl.NumberFormat("en-US").format(sumtotal)}
      </Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.row}>
              <Text style={styles.alignLeft}>
                <TouchableOpacity
                  onPress={() => {
                    console.log("iteeeemm", item.id);
                    set_cash(item.cash);
                    set_order_list(item.id);
                    setShowModal(true);
                    set_delguur(item.delguur_id, item.ner, item.baraa_id);
                  }}
                >
                  <Text style={styles.itemText}>
                    {parseInt(index) + 1}. {item.ner} |{" "}
                    {moment(item.register_date).format("YYYY.MM.DD")} | Бэлэн:{" "}
                    {item.cash}
                  </Text>
                </TouchableOpacity>
              </Text>
              <Text style={styles.alignRight}>
                {Intl.NumberFormat("en-US").format(item.total)}
              </Text>

              <View style={styles.bottomLine} />
            </View>
          )}
        />
      )}
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    backgroundColor: "#A4B0F5",
    padding: 5,
    borderRadius: 2,
    marginBottom: 5,
  },
  bottomLine: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 0,
    height: 1,
    backgroundColor: "#E0E0E0", // Same as the borderBottomColor above
  },
  buttonText: {
    color: "blue",
    fontSize: 14,
    textAlign: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },
  underlinedText: {
    textAlign: "right",
    textDecorationLine: "underline",
    paddingBottom: 5,
    fontSize: 12,
    paddingRight: 10,
    // Add other styles here as needed
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
    flex: 0.4,
    marginRight: 5,
  },
  row3: {
    flex: 0.2,
    marginRight: 5,
  },
  alignLeft: {
    flex: 0.5,
    textAlign: "left",
    paddingLeft: 6,
    fontSize: 12,
  },
  alignRight: {
    flex: 0.5,
    textAlign: "right",
    paddingRight: 0,
    paddingRight: 10,
    fontSize: 12,
  },
  headerRight: {
    flex: 1,
    textAlign: "right",
    paddingTop: 50,
    paddingRight: 10,
    fontSize: 12,
  },
  orderText: {
    color: "blue",
    fontSize: 12,
    marginRight: 10,
  },
  itemText: {
    fontSize: 13,
    marginRight: 10,
  },
});
