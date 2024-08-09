import * as sqlite from "expo-sqlite";
const db = sqlite.openDatabase("mydb.db");

export const initDbBaraa_online = () => {
  return createPromise(
    "CREATE TABLE IF NOT EXISTS baraa_online(id INTEGER PRIMARY KEY NOT NULL, baraa_id INTEGER NOT NULL, ner TEXT NOT NULL, company_id INTEGER, company_name TEXT, count INTEGER NOT NULL, une INTEGER NOT NULL, uldegdel INTEGER NOT NULL, box_count INTEGER );",
    []
  );
};

export const dropOrderN = () => {
  return createPromise("DROP TABLE IF EXISTS order_table", []);
};

export const dropBaraa_online = () => {
  return createPromise("DROP TABLE IF EXISTS baraa_online", []);
};

export const initDbBalance_online = () => {
  return createPromise(
    "CREATE TABLE IF NOT EXISTS balance (id INTEGER PRIMARY KEY NOT NULL, register_date TEXT NOT NULL, order_id INTEGER NOT NULL, baraa_id INTEGER NOT NULL, baraa_ner TEXT NOT NULL, count INTEGER NOT NULL, une INTEGER NOT NULL );",
    []
  );
};

export const insertBalance = (
  register_date,
  order_id,
  baraa_id,
  baraa_ner,
  count,
  une
) => {
  return createPromise(
    "insert into balance (register_date, order_id, baraa_id, baraa_ner, count, une) values (?, ?, ?, ?, ?, ?)",
    [register_date, order_id, baraa_id, baraa_ner, count, une]
  );
};
// export const initDbOrder_online = () => {
//   return createPromise(
//     "CREATE TABLE IF NOT EXISTS orderN (id INTEGER PRIMARY KEY NOT NULL, register_date TEXT , delguur_id INTEGER N, delguur_ner TEXT , cash INTEGER DEFAULT 0, is_approve INTEGER DEFAULT 0, user_id INTEGER, main_company_id INTEGER, is_cash_loan INTEGER);",
//     []
//   );
// };

export const initDbOrder_online = () => {
  return createPromise(
    "CREATE TABLE IF NOT EXISTS order_table (id INTEGER PRIMARY KEY NOT NULL, register_date TEXT, delguur_id INTEGER N, delguur_ner TEXT , cash INTEGER DEFAULT 0, is_approve INTEGER DEFAULT 0, user_id INTEGER, main_company_id INTEGER, is_cash_loan INTEGER);",
    []
  );
};
export const updateOrder = (cash, id) => {
  return createPromise("UPDATE order_table set cash=? where id=?", [cash, id]);
};
export const insertOrder = (
  delguur_id,
  delguur_ner,
  register_date,
  cash,
  is_approve,
  user_id,
  main_company_id,
  is_cash_loan
) => {
  return createPromise(
    "insert into order_table (delguur_id, delguur_ner, register_date, cash, is_approve, user_id, main_company_id, is_cash_loan ) values (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      delguur_id,
      delguur_ner,
      register_date,
      cash,
      is_approve,
      user_id,
      main_company_id,
      is_cash_loan,
    ]
  );
};

export const getBaraa = () => {
  return createPromise("select  * from baraa_online ", []);
};

export const getOrderN = () => {
  return createPromise("select  * from order_table ", []);
};

export const insertBaraa = (
  baraa_id,
  ner,
  count,
  une,
  company_id,
  company_ner,
  uldegdel,
  box_count
) => {
  return createPromise(
    "insert into baraa_online (baraa_id, ner, count, une,company_id, company_name, uldegdel, box_count) values (?, ?, ?, ?, ?, ?, ?, ?)",
    [baraa_id, ner, count, une, company_id, company_ner, uldegdel, box_count]
  );
};
export const deleteBaraa = () => {
  return createPromise("delete from baraa_online", []);
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
