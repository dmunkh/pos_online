import React, { useEffect, createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import _ from "lodash";
import moment from "moment";
import SQL from "../helpers/db_online";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState("Token");
  const [userInfo, setuserInfo] = useState();
  const [baraa, setbaraa] = useState([]);
  const [baraa_local, setbaraa_local] = useState([]);
  const [baraalist, setBaraalist] = useState([]);
  const [baraalist_local, setBaraalist_local] = useState([]);
  const [cash, setcash] = useState(0);
  const [order_id, setorder_id] = useState(0);
  const [order_id_local, setorder_id_local] = useState(0);
  const [delguur_ner, setdelguur_ner] = useState("");
  const [delguur_id, setdelguur_id] = useState(0);
  const [delguur_utas, setdelguur_utas] = useState("");
  const [approve, setapprove] = useState(0);
  const [balanceid, setbalanceid] = useState(0);
  const [orderlist, setorderlist] = useState([]);
  const [orders, setorders] = useState([]);
  const [orders_sum, setorders_sum] = useState(0);

  const login = (username, password) => {
    setIsLoading(true);
    const fetchBaraa = () => {
      // console.log("order list loading......", id, order_id);
      setIsLoading(true);
      setorderlist(null);
      const fetchData = async () => {
        SQL.initDbBaraa()
          .then((result) => {
            (async () => {
              const result = await getBaraa();
              setcc(result.rows._array);
            })();
          })
          .catch((err) => console.log("Базыг бэлтгэхэд асуудал гарлаа!", err));
      };

      fetchData();

      setIsLoading(false);
    };
    // const fetchBaraa = () => {
    //   SQL.initDbBaraa()
    //     .then((result) => {
    //       (async () => {
    //         const result = await getBaraa();
    //         setcc(result.rows._array);
    //       })();
    //     })
    //     .catch((err) => console.log("Базыг бэлтгэхэд асуудал гарлаа!", err));
    //   fetchBaraa();
    // };
    const fetchData = async () => {
      try {
        const response = await fetch("https://dmunkh.store/api/backend/user");

        const json = await response.json();

        setuserInfo(
          json.response &&
            _.filter(
              json.response,
              (a) => a.login_name === username.toLowerCase()
            )
        );
        // setlist(json);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchData();
    setUserToken("token");
    AsyncStorage.setItem("userToken", "token33");
    setIsLoading(false);
  };

  const set_order_list = (id) => {
    // console.log("order list loading......", id, order_id);
    setIsLoading(true);
    setorderlist(null);
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://dmunkh.store/api/backend/balance/order?order_id=" + id
        );

        const json = await response.json();
        // console.log(json.response);

        setorderlist(_.filter(json.response, (a) => parseInt(a.type_id) === 3));
        // setlist(json);
      } catch (error) {
        console.error("Error fetching orderlist:", error);
      }
    };

    fetchData();

    setIsLoading(false);
  };
  const set_orders = (y, m, d) => {
    console.log(
      "order list loading......",
      userInfo[0].main_company_id,
      userInfo[0].id,
      y,
      m,
      d
    );
    setIsLoading(true);
    setorders(null);
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://dmunkh.store/api/backend/orders?main_company_id=" +
            userInfo[0].main_company_id +
            "&user_id=" +
            userInfo[0].id +
            "&y=" +
            y +
            "&m=" +
            m +
            "&d=" +
            d
        );

        const json = await response.json();
        console.log(json.response);
        // sum = 0;
        // if (json.response) {
        //   for (let i in json.response) {
        //     sum += json.response[i].total;
        //   }
        //   setorders_sum(sum);
        // }
        setorders(json.response);
        // setlist(json);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchData();
    setIsLoading(false);
  };

  const log_out = () => {
    setIsLoading(true);
    setUserToken(null);
    AsyncStorage.removeItem("userToken");
    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userToken = await AsyncStorage.getItem("userToken");
      setUserToken(userToken);
      setIsLoading(false);
    } catch (e) {
      console.log("isLogged in error ${e}");
    }
  };

  useEffect(() => {
    //  console.log("ordersss start");
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://dmunkh.store/api/backend/orders?main_company_id=" +
            userInfo[0].main_company_id +
            "&user_id=" +
            userInfo[0].id +
            "&y=" +
            moment().format("YYYY") +
            "&m=" +
            moment().format("MM") +
            "&d=" +
            moment().format("DD")
        );

        const json = await response.json();
        // console.log(json.response.length);
        setorders(json.response);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching orders:", error);
      }
    };
    fetchData();
  }, [userInfo]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://dmunkh.store/api/backend/baraa?user_id=" + userInfo[0].id
        );

        const json = await response.json();
        // console.log(json.response);
        setBaraalist(json.response);
        // setlist(json);
      } catch (error) {
        console.error("Error fetching baraa:", error);
      }
    };

    fetchData();
  }, [userInfo]);

  useEffect(() => {
    // setorder_id(0);
    // setdelguur_id(0);
    // setdelguur_ner(null);
    isLoggedIn();
  }, []);

  const set_baraa = (id) => {
    setbaraa(_.filter(baraalist, (a) => a.id === id));
  };
  const set_cash = (item) => {
    setcash(item);
  };
  const set_order_id = (id) => {
    // console.log("setting order id--" + id);
    setorder_id(id);
  };
  const set_balance_id = (id) => {
    setbalanceid(id);
  };
  const set_order_id_local = (id) => {
    setorder_id_local(id);
  };
  const set_baraa_list_local = (items) => {
    setBaraalist_local(items);
  };

  const set_baraa_local = (id) => {
    setbaraa_local(_.filter(baraalist_local, (a) => a.baraa_id === id));
  };
  const set_delguur = (id, ner, utas) => {
    // console.log("authContext delguur--", id, ner);
    setdelguur_id(id);
    setdelguur_ner(ner);
    setdelguur_utas(utas);
    // console.log("authContext set delguur--", delguur_id, delguur_ner);
  };
  const set_orders_sum = (items) => {
    setorders_sum(items);
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        log_out,
        isLoading,
        userToken,
        userInfo,
        baraa,
        order_id_local,
        set_baraa,
        set_delguur,
        set_cash,
        set_order_id,
        set_balance_id,
        set_order_list,
        set_orders,
        set_order_id_local,
        set_baraa_list_local,
        set_orders_sum,
        set_baraa_local,
        baraa_local,
        // fetchBaraa,
        // fetchBaraa,
        orders,
        orderlist,
        delguur_id,
        delguur_ner,
        delguur_utas,
        baraalist,
        order_id,
        balanceid,
        orders_sum,
        cash,
        baraalist_local,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
