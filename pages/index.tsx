import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
// const axios = require("axios").default;
const axios = require("axios");
import { List, ListItem } from "@chakra-ui/react";
import getMempoolTransactionList from "../pages/api/get_mempool_transaction_list"

type Transaction = {
  txID: string;
  numOfSeconds: number;
};

const options = {
  method: 'GET',
  url: 'https://api.trongrid.io/wallet/gettransactionlistfrompending',
  headers: {accept: 'application/json', }
};
    
const Home: NextPage = () => {
  const [transactionList, setTransactionList] = useState<Transaction[]>([]);
  let listItems: JSX.Element[] = [];
  async function GetTransactions(transactionList: Transaction[]) {
    await axios
      // .get("/api/get_mempool_transaction_list")
      .request(options)
      .then(function (response: any) {
        const tempTransactions: Transaction[] = [];
        for (let i = 0; i < response.data.data.txId.length; i++) {
          const txID = response.data.data.txId[i].toString().trim();
          if (transactionList.some((t) => t.txID == txID)) {
            tempTransactions.push({
              txID: txID,
              numOfSeconds:
                transactionList.find((t) => t.txID == txID)!.numOfSeconds + 1,
            });
          } else {
            tempTransactions.push({ txID: txID, numOfSeconds: 1 });
          }
        }
        tempTransactions.sort((a, b) => {
          return b.numOfSeconds - a.numOfSeconds;
        });

        setTransactionList(tempTransactions);
      })
      .catch(function (error: { response: any }) {
        // handle error
        console.log(error.response);
      });
  }

  useEffect(() => {
    console.log(transactionList)
    setTimeout(() => {
      GetTransactions(transactionList);
    }, 500);
  }, [transactionList]);

  if (transactionList != null) {
    listItems = transactionList.map((t) => {
      return (
        <ListItem key={t.txID}>
          {t.numOfSeconds >= 1 ? t.numOfSeconds : "  "}&emsp;{t.txID}
        </ListItem>
      );
    });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>TRON Mempool Explorer</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <div className={styles.titleTron}>TRON</div> Mempool Explorer
        </h1>
        <h2>Transactions: {listItems.length}</h2>
        <List>{listItems}</List>
      </main>
    </div>
  );
};

export default Home;
