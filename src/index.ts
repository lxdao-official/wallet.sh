#!/usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";
import figlet from "figlet";
import shell from "shelljs";
import { createNewWallet } from "./functions/createWallet.js";
import { askPassword, askSetPassword } from "./functions/getPassword.js";
import { getData, setData } from "./functions/storageData.js";
import { chooseWallet } from "./functions/chooseWallet.js";
import { getMemoryData } from "./functions/memoryData.js";
import { connectWallet } from "./functions/connectWallet.js";
import { connectWalletV1 } from "./functions/connectWalletV1.js";
import { getNameOfChainId } from "./functions/chainList.js";
import { chooseChain } from "./functions/chooseChain.js";

const init = async () => {
  console.log(
    chalk.green(
      figlet.textSync("Wallet.sh", {
        font: "Larry 3D 2",
        horizontalLayout: "default",
        verticalLayout: "default",
        width: 80,
      })
    )
  );
};

const rootCommands = {
  create_new_wallet: "create new wallet",
  show_wallet_list: "wallet list",
  show_active_wallet: "change active wallet",
  show_active_chain: "change active chain",
  connect_to_WalletConnect: "connect to WalletConnect",
  connect_to_WalletConnect_v1: "connect to WalletConnect(v1)",
};
const askQuestions = () => {
  const address_count = getData("address_count");
  const chain_id = getData("chain_id");

  const questions = [
    {
      type: "list",
      name: "root_cmd",
      message: "What do you want to do?",
      choices: [
        {
          name: `active wallet: ${getData(
            "address_active"
          )} (choose to change)`,
          value: rootCommands.show_active_wallet,
        },
        {
          name: `active chain: ${getNameOfChainId(
            chain_id
          )} (choose to change)`,
          value: rootCommands.show_active_chain,
        },
        // {
        //   name: `connected dapp:${getMemoryData("connected_dapp")}`,
        //   value: rootCommands.show_active_wallet,
        // },
        {
          name: `${rootCommands.create_new_wallet}`,
          value: rootCommands.create_new_wallet,
        },

        {
          name: rootCommands.connect_to_WalletConnect,
          value: rootCommands.connect_to_WalletConnect,
        },
        {
          name: rootCommands.connect_to_WalletConnect_v1,
          value: rootCommands.connect_to_WalletConnect_v1,
        },
        {
          name: rootCommands.show_wallet_list + ` (${address_count})`,
          value: rootCommands.show_wallet_list,
        },
      ],
    },
  ];
  return inquirer.prompt(questions);
};

const root = async () => {
  const answers = await askQuestions();
  const { root_cmd } = answers;

  console.log("answers: ", answers.root_cmd);

  if (root_cmd == rootCommands.create_new_wallet) {
    const address = await createNewWallet();
    setData("address_active", address);
    console.log("change active wallet to: ", address);
    await root();
  } else if (root_cmd == rootCommands.show_wallet_list) {
    const address = await chooseWallet();
    setData("address_active", address);
    console.log("change active wallet to: ", address);
    await root();
  } else if (root_cmd == rootCommands.connect_to_WalletConnect) {
    await connectWallet();
  } else if (root_cmd == rootCommands.connect_to_WalletConnect_v1) {
    try {
      await connectWalletV1();
    } catch (e: any) {
      console.log("ConnectWallet V1 error: ", e.message);
      await root();
    }
  } else if (root_cmd == rootCommands.show_active_chain) {
    const chain_id = await chooseChain();
    setData("chain_id", chain_id);
    console.log("change chain to: ", chain_id);
    await root();
  } else if (root_cmd == rootCommands.show_active_wallet) {
    const address = await chooseWallet();
    setData("address_active", address);
    console.log("change active wallet to: ", address);
    await root();
  } else {
    await root();
  }
};
const run = async () => {
  // show script introduction
  await init();

  const address_count = getData("address_count");

  if (!address_count) {
    await askSetPassword();
    const address = await createNewWallet();
    setData("address_active", address);
  } else {
    await askPassword("Input password to unlock your wallet:");
  }

  const active_chain = getData("chain_id");
  if (!active_chain) {
    setData("chain_id", 1);
  }

  await root();
};

run();
