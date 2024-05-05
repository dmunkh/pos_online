import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  SafeAreaView,
  FlatList,
  TextInput,
} from "react-native";
import MyButton from "./MyButton";

import { loadPlaces } from "../store/places-actions";
import PlaceItem from "../components/PlaceItem";
import { initDb, insertPlace, getPlaces, clearPlaces } from "../helpers/db";
import { useSelector, useDispatch } from "react-redux";

const ModalConfirmDelete = ({ visible, cancel, deleteItem, item }) => {
  // const places = useSelector((state) => state.data.places);
  // const dispatch = useDispatch();

  // React.useEffect(() => {
  //   dispatch(loadPlaces());
  // }, [dispatch]);

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextInput
          // value={place}
          // onChangeText={(text) => setPlace(text)}
          style={{
            marginBottom: 15,
            borderBottomColor: "#ccc",
            borderBottomWidth: 1,
            paddingHorizontal: 2,
            paddingVertical: 4,
          }}
        />
        <TextInput
          // value={place}
          // onChangeText={(text) => setPlace(text)}
          style={{
            marginBottom: 15,
            borderBottomColor: "#ccc",
            borderBottomWidth: 1,
            paddingHorizontal: 2,
            paddingVertical: 4,
          }}
        />
        {/* {places && (
          <FlatList
            data={places}
            keyExtractor={(item) => item.id.toString()}
            renderItem={(data) => <PlaceItem item={data.item} />}
          />
        )} */}
        <Text style={{ fontSize: 16 }}>
          <Text style={{ color: "red" }}>{item}</Text> бичлэгийг устгахад
          итгэлтэй байна уу?
        </Text>
        <View
          style={{
            flexDirection: "row",
            marginTop: 20,
            width: "90%",
            justifyContent: "space-around",
          }}
        >
          <MyButton style={css.button} title="Хаах" onPress={cancel} />
          <MyButton style={css.button} title="Устга" onPress={deleteItem} />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default ModalConfirmDelete;

const css = StyleSheet.create({ button: { width: "40%" } });
