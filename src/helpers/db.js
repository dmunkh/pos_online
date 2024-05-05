import * as sqlite from "expo-sqlite";

const db = sqlite.openDatabase("mydb.db");

export const initDb = () => {
  return createPromise(
    "CREATE TABLE IF NOT EXISTS places (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, imageUri TEXT NOT NULL, address TEXT NOT NULL, lat REAL NOT NULL, lng REAL NOT NULL);",
    []
  );
};

export const initDbCompany = () => {
  return createPromise(
    "CREATE TABLE IF NOT EXISTS company (id INTEGER PRIMARY KEY NOT NULL, c_name TEXT NOT NULL, c_hayag TEXT NOT NULL, c_utas TEXT NOT NULL, c_code TEXT NOT NULL, c_dans TEXT NOT NULL);",
    []
  );
};

export const initDbBaraa = () => {
  return createPromise(
    "CREATE TABLE IF NOT EXISTS baraa (id INTEGER PRIMARY KEY NOT NULL, baraa TEXT NOT NULL, une INTEGER NOT NULL);",
    []
  );
};

export const initDbDelguur = () => {
  return createPromise(
    "CREATE TABLE IF NOT EXISTS delguur (id INTEGER PRIMARY KEY NOT NULL, ner TEXT NOT NULL, hayag TEXT NOT NULL, utas TEXT NOT NULL, rd TEXT NOT NULL, dans TEXT NOT NULL, comment TEXT NOT NULL);",
    []
  );
};

export const initDbOrder = () => {
  return createPromise(
    "CREATE TABLE IF NOT EXISTS orderN (id INTEGER PRIMARY KEY NOT NULL, baraa TEXT NOT NULL, une INTEGER NOT NULL, too INTEGER NOT NULL, orderID INTEGER DEFAULT 0, isApprove INTEGER DEFAULT 0);",
    []
  );
};

export const insertOrder = (baraa, une, too) => {
  return createPromise(
    "insert into orderN (baraa, une, too ) values (?, ?, ?)",
    [baraa, une, too]
  );
};

export const initDbDeposit = () => {
  return createPromise(
    "CREATE TABLE IF NOT EXISTS deposit (id INTEGER PRIMARY KEY NOT NULL, dt_deposit TEXT, baraaid INTEGER, baraa TEXT, une INTEGER, orlogo INTEGER);",
    []
  );
};
export const insertDeposit = (baraaid, baraa, une, orlogo, dt) => {
  return createPromise(
    "insert into deposit (baraaid, baraa, une, orlogo , dt_deposit) values (?, ?, ?, ?, ?)",
    [baraaid, baraa, une, orlogo, dt]
  );
};
export const getDeposit = (dt) => {
  return createPromise(
    "select d.baraa ,baraaid as id, dt, dt_deposit ,id, sum(COALESCE(orlogo,0)) AS orlogo, COALESCE(ss,0) AS ss, une from deposit d left outer join (select baraa,   dt, sum(COALESCE(too,0)) as ss from orderinfo f left outer join orderN o on o.orderID=f.id where dt=? group by dt, baraa) s on s.dt=d.dt_deposit and s.baraa=d.baraa   where dt_deposit=? group by d.baraa ,baraaid, dt, dt_deposit ,  ss, une",
    [dt, dt]
  );
};
// export const getDeposit1 = (dt) => {
//   return createPromise(
//     "select   baraa, dt, sum(too) as ss from orderinfo f left outer join orderN o on o.orderID=f.id where dt=? group by dt, baraa",
//     [dt]
//   );
// };
// export const getDeposit = (dt) => {
//   return createPromise("select * from deposit d  where dt_deposit=?", [dt]);
// };
export const initDbOrderInfo = () => {
  return createPromise(
    "CREATE TABLE IF NOT EXISTS orderInfo (id INTEGER PRIMARY KEY NOT NULL, storeid INTEGER NOT NULL, storename TEXT NOT NULL, cash INTEGER DEFAULT 0, sumtotal INTEGER DEFAULT 0, dt TEXT, y INTGER, m INTEGER, d INTEGER, isApprove INTEGER DEFAULT 0);",
    []
  );
};

export const insertOrderInfo = (s_id, s_name, dt, y, m, d) => {
  return createPromise(
    "insert into orderInfo (storeid, storename, cash, sumtotal , dt, y , m , d ) values (?, ?, 0, 0, ?, ?, ?, ?)",
    [s_id, s_name, dt, y, m, d]
  );
};

export const updateBaraa = (baraa, une, id) => {
  return createPromise("UPDATE baraa set baraa=?, une=? where  id=?", [
    baraa,
    une,
    id,
  ]);
};

export const updateStore = (ner, hayag, utas, rd, dans, comment, id) => {
  return createPromise(
    "UPDATE delguur set ner=?, hayag=?, utas=?, rd=?, dans=?, comment=? where  id=?",
    [ner, hayag, utas, rd, dans, comment, id]
  );
};

export const updateOrderInfo = (id, cash, ss) => {
  return createPromise(
    "UPDATE orderInfo set isApprove=1, cash=?, sumtotal=? where isApprove=0 and id=?",
    [cash, ss, id]
  );
};

export const updateOrder = (id) => {
  return createPromise(
    "UPDATE orderN set isApprove=1, orderID=? where isApprove=0",
    [id]
  );
};

export const getOrderInfo = () => {
  return createPromise("select  * from orderInfo where isApprove=0 ", []);
};

export const getOrderInfo1 = () => {
  return createPromise("select  * from orderInfo ", []);
};
export const deleteOrderInfo = () => {
  return createPromise("delete from  orderInfo  where isApprove=0", []);
};
export const insertCompany = (ner, hayag, utas, code, dans) => {
  return createPromise(
    "insert into company (c_name, c_hayag, c_utas, c_code, c_dans) values (?, ?, ?, ?, ?)",
    [ner, hayag, utas, code, dans]
  );
};

export const insertBaraa = (ner, une) => {
  return createPromise("insert into baraa (baraa, une) values (?, ?)", [
    ner,
    une,
  ]);
};

export const getOrderInfoApprove = (dt) => {
  return createPromise(
    "select  * from orderInfo  where dt=? and isApprove=1 order by storename ASC",
    [dt]
  );
};

export const getOrderInfoID = (dt) => {
  return createPromise(
    "select  * from orderInfo  where dt=? and isApprove=1  order by storename ASC",
    [dt, id]
  );
};
export const getOrderID = (id) => {
  return createPromise(
    "select  * from orderN  where  isApprove=1 and orderid=? order by baraa ASC",
    [id]
  );
};

export const getOrderPrintID = (dt, id) => {
  return createPromise(
    "select  orderN.*, storename, cash from orderInfo INNER JOIN orderN on orderInfo.id=orderN.orderID where dt=? and orderid=? order by storename ASC",
    [dt, id]
  );
};

export const getOrderPrint = (dt) => {
  return createPromise(
    "select orderN.id, baraa, COALESCE(cash,0) AS cash, d, dt,  orderInfo.isApprove, m, orderID, storeid, storename,  sumtotal, too, une, y from orderN  INNER JOIN orderInfo on orderInfo.id=orderN.orderID where dt=? order by storename ASC",
    [dt]
  );
};
export const insertDelguur = (ner, hayag, utas, rd, dans, comment) => {
  return createPromise(
    "insert into delguur (ner, hayag, utas, rd, dans, comment) values (?, ?, ?, ?, ?, ?)",
    [ner, hayag, utas, rd, dans, comment]
  );
};
export const deleteCompany = () => {
  return createPromise("delete from company", []);
};

export const getOrder = () => {
  return createPromise("select  * from orderN where isApprove=0", []);
};

export const getOrderSum = () => {
  return createPromise(
    "select sum(too*une) ss from orderN where isApprove=0 ",
    []
  );
};

export const getOrder1 = () => {
  return createPromise("select  * from orderN ", []);
};

export const getCompany = () => {
  return createPromise("select  * from company limit 1", []);
};

export const getBaraa = () => {
  return createPromise(
    "select  id, baraa, cast(une as TEXT) as une from baraa ",
    []
  );
};

export const getStore = () => {
  return createPromise("select  * from delguur order by ner ASC ", []);
};

export const insertPlace = (title, imageUri, address, lat, lng) => {
  return createPromise(
    "insert into places (title, imageUri, address, lat, lng) values (?, ?, ?, ?, ?)",
    [title, imageUri, address, lat, lng]
  );
};

export const getPlaces = () => {
  return createPromise("select * from places", []);
};

export const clearPlaces = () => {
  return createPromise("delete from places", []);
};

export const clearOrdern = (id) => {
  return createPromise("delete from ordern where id=?", [id]);
};

const createPromise = (sql, parameters) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        sql,
        parameters,
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });

  return promise;
};
