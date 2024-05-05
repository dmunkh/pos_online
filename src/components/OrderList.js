import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

const PlaceItem = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        paddingVertical: 5,
        paddingHorizontal: 10,
      }}
    >
      <View
        style={{
          marginLeft: 10,
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Text style={{ color: "black", fontSize: 10 }}>
          {item.baraa} - {item.une} - {item.too}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default PlaceItem;

const styles = StyleSheet.create({});
