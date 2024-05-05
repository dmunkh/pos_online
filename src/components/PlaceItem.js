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
        <Text style={{ color: "black", fontSize: 18 }}>{item.c_name}</Text>
        <Text style={{ color: "#666", fontSize: 16 }}>{item.address}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default PlaceItem;

const styles = StyleSheet.create({});
