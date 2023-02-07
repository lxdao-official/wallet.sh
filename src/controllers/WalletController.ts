import inquirer from "inquirer";
import { chooseWallet } from "../functions/chooseWallet.js";
import { createNewWallet } from "../functions/createWallet.js";
import { getAddressList } from "../functions/getWalletList.js";
import { getData, setData } from "../functions/storageData.js";
import { BaseController } from "./BaseController.js";
class WalletController extends BaseController {
  async questions() {
    return [
      {
        type: "list",
        name: "root_cmd",
        message: "What do you want to do?",
        choices: [
          {
            name: "active wallet: " + this.getActiveWalletAddress() || "none",
            value: "active_wallet",
          },
          {
            name: "create new wallet",
            value: "create_new_wallet",
          },
          {
            name: `wallet list (${await this.getWalletCount()})`,
            value: "wallet_list",
          },
          {
            name: "back",
            value: "exit",
          },
        ],
      },
    ];
  }

  async enter() {
    const cmd = await super.enter();
    await this.process(cmd);
    return cmd;
  }

  async process(cmd: string) {
    switch (cmd) {
      case "active_wallet":
        await this.activeWallet();
        break;
      case "create_new_wallet":
        await this.createNewWallet();
        break;
      case "wallet_list":
        await this.walletList();
        break;
      default:
        break;
    }
  }

  async createNewWallet() {
    const address = await createNewWallet();
    setData("address_active", address);
    await this.enter();
    return address;
  }

  async activeWallet() {
    const activeWallet = await chooseWallet();
    setData("address_active", activeWallet);
    await this.enter();
    return activeWallet;
  }

  async walletList() {
    const walletList = await chooseWallet();
    setData("address_active", walletList);
    await this.enter();
    return walletList;
  }

  getActiveWalletAddress() {
    return getData("address_active");
  }
  async getWalletCount() {
    const addresses = await getAddressList();
    return addresses.length;
  }
}

export { WalletController };
