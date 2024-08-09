import React, { useContext, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../context/AuthContext";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

// import LoginSVG from "../assets/images/misc/login.svg";
// import GoogleSVG from "../assets/images/misc/google.svg";
// import FacebookSVG from "../assets/images/misc/facebook.svg";
// import TwitterSVG from "../assets/images/misc/twitter.svg";

import CustomButton from "../components/CustomButton";
import InputField from "../components/InputField";

const LoginScreen = ({ navigation }) => {
  const { login, userToken } = useContext(AuthContext);
  const [user, setuser] = useState();
  const [password, setpassword] = useState();
  console.log(user, password);
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <View style={{ paddingHorizontal: 25 }}>
        <View style={{ alignItems: "center" }}></View>

        <Text
          style={{
            fontSize: 28,
            fontWeight: "500",
            color: "#333",
            marginBottom: 30,
          }}
        >
          {/* {userToken} */}
        </Text>

        <InputField
          label={"Нэвтрэх нэр"}
          icon={
            <MaterialIcons
              name="alternate-email"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
          }
          keyboardType="email-address"
          value={user}
          onChangeText={(text) => setuser(text)}
        />

        <InputField
          label={"Нууц"}
          icon={
            <Ionicons
              name="ios-lock-closed-outline"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
          }
          value={password}
          onChangeText={(text) => setpassword(text)}
          inputType="password"
          //   fieldButtonLabel={"Forgot?"}
          //   fieldButtonFunction={() => {}}
        />

        <CustomButton
          label={"Нэвтрэх"}
          onPress={() => {
            login(user, password);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
