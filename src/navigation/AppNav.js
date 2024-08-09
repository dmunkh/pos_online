import { View, Text } from "react-native";
import React, { useContext } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import Print from "./src/pages/PrintStore";
import LoginScreen from "../pages/LoginScreen";
import Company from "../pages/CompanyInfo";
import BarScreen from "../pages/GoodsScreenBarcode_online";
import Goods from "../pages/GoodsScreen_online";
import Goods_local from "../pages/GoodsScreen_local";
import Store from "../pages/StoreScreen_online";
import Profile from "../pages/Profile";
import Order from "../pages/OrderScreen_online";
import OrderLocal from "../pages/OrderScreen_local";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../context/AuthContext";
import { ActivityIndicator } from "@react-native-material/core";

// import AuthStack from "./AuthStack";
// import AppStack from "./AppStack";
const Tab = createBottomTabNavigator();
const AppNav = () => {
  const { userToken, isLoading, userInfo } = useContext(AuthContext);
  if (isLoading) {
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size={"large"} />
    </View>;
  }
  return (
    <NavigationContainer>
      {userToken === null ? (
        <LoginScreen />
      ) : (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;

              if (route.name === "Жагсаалт" || route.name === "Хэвлэх/Д/") {
                iconName = "ios-home";
              } else if (route.name === "Дэлгүүр") {
                iconName = "ios-list";
              } else if (route.name === "Бараа") {
                iconName = "ios-list";
              } else if (route.name === "Бараа-1") {
                iconName = "ios-list";
              } else if (route.name === "Barcode") {
                iconName = "ios-list";
              } else if (route.name === "Захиалга") {
                iconName = "ios-list";
              } else if (route.name === "Захиалга-1") {
                iconName = "ios-list";
              } else if (route.name === "Компани") {
                iconName = "ios-settings";
              } else if (route.name === "Орлого") {
                iconName = "ios-list";
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name={"Жагсаалт"} component={Profile} />
          <Tab.Screen name={"Barcode"} component={BarScreen} />
          <Tab.Screen name="Бараа" component={Goods} />
          <Tab.Screen name="Бараа-1" component={Goods_local} />
          <Tab.Screen name="Дэлгүүр" component={Store} />
          <Tab.Screen name="Захиалга" component={Order} />
          <Tab.Screen name="Захиалга-1" component={OrderLocal} />

          {/* <Tab.Screen name="Хэвлэх" component={Home} />
     
      <Tab.Screen name="Бараа" component={Goods} />
      <Tab.Screen name="Орлого" component={Deposit} />
     
      <Tab.Screen name="Компани" component={Company} /> */}
        </Tab.Navigator>
      )}
      {/* <AuthStack /> */}
    </NavigationContainer>
  );
};

export default AppNav;
