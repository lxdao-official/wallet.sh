import { Core } from "@walletconnect/core";
import { Web3Wallet } from "@walletconnect/web3wallet";
import inquirer from "inquirer";

const core = new Core({
  projectId: "ec307039abe79975829b7c4b9a3c6f1a",
});

export async function connectWallet() {
  console.log("initing...");
  const web3wallet = await Web3Wallet.init({
    core, // <- pass the shared `core` instance
    metadata: {
      name: "Wallet.sh",
      description: "Wallet.sh",
      url: "Wallet.sh",
      icons: [],
    },
  });
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
  web3wallet.on("session_proposal", async (proposal) => {
    const questions = [
      {
        type: "confirm",
        name: "session_proposal",
        message: "recieve session proposal, approve it?",
      },
    ];
    const asw = await inquirer.prompt(questions);

    if (asw.session_proposal) {
      const methods = [
        "eth_sendTransaction",
        "personal_sign",
        "eth_signTypedData",
      ];
      const namespaces = {
        "eip155:1": {
          accounts: ["*"],
          methods,
          events: [],
        },
      };
      const session = await web3wallet.approveSession({
        id: proposal.id,
        namespaces,
      });
      console.log("approved");
    } else {
      await web3wallet.rejectSession({
        id: proposal.id,
        reason: {
          code: 1,
          message: "Rejected by user",
        },
      });
    }
  });
  await web3wallet.core.pairing.pair({ uri: session_uri });
}
