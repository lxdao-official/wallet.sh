import { hex2Text } from "./hex2text.js";
import { Core } from "@walletconnect/core";
import { Web3Wallet } from "@walletconnect/web3wallet";
import WalletConnect from "@walletconnect/client";
import inquirer from "inquirer";
import { getData, setData } from "./storageData.js";
import lightwallet from "eth-lightwallet";
import { getKS } from "./getKS.js";
import EventEmitter from "eventemitter3";
//@ts-ignore
const { txutils, signing } = lightwallet;

const core = new Core({
  projectId: "ec307039abe79975829b7c4b9a3c6f1a",
});

export const cw_v1_eventBus = new EventEmitter();

let connector: any;

async function _connectWallet(session_uri: string) {
  return new Promise(async (resolve, reject) => {
    //@ts-ignore
    connector = new WalletConnect.default({
      uri: session_uri,
      // Required
      clientMeta: {
        name: "Wallet.sh",
        description: "Wallet.sh",
        url: "Wallet.sh",
        icons: [],
      },
    });

    // connector.uri = session_uri;
    // connector.connect({
    //   chainId: getData("chain_id"),
    // });
    connector.on("session_update", async (error: any, payload: any) => {
      if (error) {
        reject(error);
      }
      console.log("session_update", payload);

      cw_v1_eventBus.emit("session_update", payload);
    });
    // Subscribe to session requests
    connector.on("session_request", async (error: any, payload: any) => {
      if (error) {
        reject(error);
      }
      console.log("session_request", payload);
      const questions = [
        {
          type: "list",
          name: "session_proposal",
          message: "recieve session request, approve it?",
          choices: ["Approve", "Reject", "Back to home"],
        },
      ];
      const asw = await inquirer.prompt(questions);

      if (asw.session_proposal == "Approve") {
        // Handle Session Request
        await connector.approveSession({
          accounts: [getData("address_active")],
          chainId: getData("chain_id"), // required
        });
        console.log("approved");

        // save session
        setData("active_wc_v1", {
          uri: session_uri,
          dapp: payload.params[0].peerMeta.name,
        });
        cw_v1_eventBus.emit("session_approved", {
          uri: session_uri,
          dapp: payload.params[0].peerMeta.name,
        });
      } else if (asw.session_proposal == "Reject") {
        connector.rejectSession({
          message: "OPTIONAL_ERROR_MESSAGE", // optional
        });
      } else {
        reject("back to home");
      }
    });

    // Subscribe to call requests
    connector.on("call_request", async (error: any, payload: any) => {
      if (error) {
        reject(error);
      }
      console.log("call_request", payload);
      let sign_text = "";
      let signed_result = "";
      const { ks, pwDerivedKey } = await getKS();
      if (payload.method == "personal_sign") {
        sign_text = hex2Text(payload.params[0]);
        console.log(`recieve personal_sign request: ${sign_text}`);
        signed_result = lightwallet.signing.concatSig(
          lightwallet.signing.signMsg(
            ks,
            pwDerivedKey,
            sign_text,
            getData("address_active")
          )
        );
      } else if (payload.method == "eth_sign") {
        sign_text = hex2Text(payload.params[0]);
        console.log(`recieve eth_sign request: ${sign_text}`);

        const txOptions = {
          gasPrice: 10000000000000,
          gasLimit: 3000000,
          value: 10000000,
          nonce: 1,
          data: payload.params[0],
        };
        const address = getData("address_active");
        var contractData = txutils.createContractTx(address, txOptions);
        var signedTx = signing.signTx(
          ks,
          pwDerivedKey,
          contractData.tx,
          address
        );

        console.log("Signed Contract creation TX: " + signedTx);
        console.log("");
        console.log("Contract Address: " + contractData.addr);
        console.log("");
        signed_result = signedTx;
      }
      const questions = [
        {
          type: "list",
          name: "call_request",
          message: `approve it?`,
          choices: ["Approve", "Reject", "Back to home"],
        },
      ];
      const asw = await inquirer.prompt(questions);

      if (asw.call_request == "Approve") {
        // Handle Call Request
        await connector.approveRequest({
          id: payload.id,
          result: signed_result,
        });
        console.log("approved success");
      } else if (asw.call_request == "Reject") {
        await connector.rejectRequest({
          id: payload.id,
          error: {
            message: "OPTIONAL_ERROR_MESSAGE", // optional
          },
        });
      } else {
        reject("back to home");
      }
    });

    connector.on("session_update", (error: any, payload: any) => {
      if (error) {
        reject(error);
      }
      console.log("session_update", payload);
    });
    connector.on("disconnect", (error: any, payload: any) => {
      if (error) {
        reject(error);
      }

      console.log("disconnect", payload);

      reject("disconnected, back to home");
      // Delete connector
    });
  });
}

export async function walletConnectV1Root() {
  const questions = [
    {
      type: "list",
      name: "wc_v1_root",
      message: "walletconnect v1",
      choices: ["connect new dapp", "reconnect wallet", "back to home"],
    },
  ];
  const asw = await inquirer.prompt(questions);

  if (asw.wc_v1_root == "connect new wallet") {
    await connectNewWallet();
  } else if (asw.wc_v1_root == "reconnect wallet") {
    await reconnectWallet();
  } else {
    return;
  }

  await walletConnectV1Root();
}

export async function connectNewWallet() {
  console.log("initing...");
  const questions = [
    {
      type: "input",
      name: "session_uri",
      message: "paste walletconnect session:",
    },
  ];
  const asw = await inquirer.prompt(questions);

  const { session_uri } = asw;

  console.log("connecting...");

  await _connectWallet(session_uri);
  // await waitingOrReturn();
}

export const reconnectWallet = async () => {
  const session_uri = getData("active_wc_v1");
  if (session_uri) {
    await _connectWallet(session_uri);
  }
};

export const getEnterCommand = async () => {
  return {
    value: "connect_to_WalletConnect_v1",
    name: "connect to WalletConnect(v1)",
  };
};
