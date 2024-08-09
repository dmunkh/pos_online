import React, { useState, useEffect, useContext } from "react";
import { Text, View, StyleSheet, Button, Alert } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { BarCodeScanner } from "expo-barcode-scanner";

const BarcodeScanner = () => {
  const { baraa } = useContext(AuthContext);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState(null);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setBarcodeData(data);
    // alert(
    //   `baraa ${baraa[0].baraa_id} Bar code with type ${type} and data ${data} has been scanned!`
    // );
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  const save = (item) => {
    const postData = {
      baraa_ner: baraa[0].baraa_ner,
      company_ner: baraa[0].company_ner,
      company_id: baraa[0].company_id,
      une: baraa[0].une,
      box_count: baraa[0].box_count,
      unit: baraa[0].unit,
      bar_code: barcodeData,
    };
    console.log("INSERTING ORDER........", baraa[0]?.id, postData);

    const response = fetch(
      "https://dmunkh.store//api/backend/baraa/" + baraa[0].id,
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
        // setIsSaveLoading(true);
        setScanned(false);
        setBarcodeData(null);
        Alert.alert("Бүртгэл", "Амжилттай хадгалагдлаа", [
          {
            text: "OK",
          },
        ]);

        // setIsSaveLoading(false);
        // onAddItem();
      })
      .catch((error) => {
        // setIsSaveLoading(false);
        console.error("There was a problem with the fetch operation:", error);
      });
    console.log("return", response.data);
  };

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {/* <Button title={"Шалгах"} onPress={() => save()} /> */}

      {scanned &&
        Alert.alert(
          "Бүртгэл",
          baraa[0]?.baraa_ner +
            " | баркод - " +
            barcodeData +
            " байна. Хадгалах уу",
          [
            {
              text: "No",
              style: "cancel",
              onPress: () => {
                setBarcodeData(null);
                setScanned(false);
              },
            },
            {
              text: "YES",
              onPress: () => {
                save();
              },
            },
          ]
        )}
      {barcodeData && (
        <View style={styles.barcodeContainer}>
          <Text style={styles.barcodeText}>Barcode Data: {barcodeData}</Text>
        </View>
      )}
    </View>
  );
};
export default BarcodeScanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  barcodeContainer: {
    padding: 10,
    backgroundColor: "#FFF",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  barcodeText: {
    fontSize: 18,
    color: "#000",
  },
});
