import { useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import Home from "./src/pages/HomeScreen";
// import Print from "./src/pages/PrintStore";
// import Store from "./src/pages/StoreScreen";
// import Goods from "./src/pages/GoodsScreen";
// import Company from "./src/pages/CompanyInfo";
// import Order from "./src/pages/OrderScreen";
// import Deposit from "./src/pages/DepositScreen";
// import LoginScreen from "./src/pages/LoginScreen";
import { AuthContext, AuthProvider } from "./src/context/AuthContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import AppNav from "./src/navigation/AppNav";
// import AppNav from "./src/navigation/AppNav";
// import AuthStack from "./src/navigation/AuthStack";
// import { createStore, combineReducers, applyMiddleware } from "redux";
// import { Provider } from "react-redux";
// import ReduxThunk from "redux-thunk";
// import placesReducer from "./src/store/places-reducer";
// import { Ionicons } from "@expo/vector-icons"; // For icons

const Tab = createBottomTabNavigator();

// const rootReducer = combineReducers({
//   data: placesReducer,
// });
// const store = createStore(rootReducer, applyMiddleware(ReduxThunk));
const Stack = createNativeStackNavigator();
function App() {
  // const { login } = useContext(AuthContext);
  return (
    // <Provider store={store}>
    <AuthProvider>
      <AppNav />
      {/* <NavigationContainer> */}
      {/* <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Onboarding" component={LoginScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator> */}
      {/* {userToken} */}
      {/* <LoginScreen /> */}
      {/* <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;

              if (route.name === "Хэвлэх" || route.name === "Хэвлэх/Д/") {
                iconName = "ios-home";
              } else if (route.name === "Дэлгүүр") {
                iconName = "ios-list";
              } else if (route.name === "Бараа") {
                iconName = "ios-list";
              } else if (route.name === "Захиалга") {
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
          <Tab.Screen name="Хэвлэх/Д/" component={Print} />
          <Tab.Screen name="Хэвлэх" component={Home} />
          <Tab.Screen name="Дэлгүүр" component={Store} />
          <Tab.Screen name="Бараа" component={Goods} />
          <Tab.Screen name="Орлого" component={Deposit} />
          <Tab.Screen name="Захиалга" component={Order} />
          <Tab.Screen name="Компани" component={Company} />
        </Tab.Navigator> */}
      {/* </NavigationContainer> */}
    </AuthProvider>

    // </Provider>
  );
}
export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
