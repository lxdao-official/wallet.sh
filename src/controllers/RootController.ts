import { WalletController } from "./WalletController.js";
import { IBaseController } from "./IBaseController.js";
import { ChainController } from "./ChainController.js";
import inquirer from "inquirer";
import { BaseController } from "./BaseController.js";
import { ConnectController } from "./ConnectController.js";
const rootCommands = {
  create_new_wallet: "create new wallet",
  show_wallet_list: "wallet list",
  show_active_wallet: "change active wallet",
  show_active_chain: "change active chain",
  connect_to_WalletConnect: "connect to WalletConnect",
  connect_to_WalletConnect_v1: "connect to WalletConnect(v1)",
};

import "colors";
import { SystemController } from "./SystemController.js";

class RootController extends BaseController implements IBaseController {
  walletController = new WalletController();
  chainController = new ChainController();
  connectController = new ConnectController();
  systemController = new SystemController();
  async questions() {
    return [
      {
        type: "list",
        name: "root_cmd",
        message: "What do you want to do?",
        choices: [
          {
            name: `wallet manage (${await this.walletController.getWalletCount()})`,
            value: "wallet_manage",
          },
          {
            name: `chain manage (${
              this.chainController.getActiveChain().chainName
            })`,
            value: "chain_manage",
          },
          {
            name: "dapps manage",
            value: "dapps_manage",
          },
          {
            name: "system manage",
            value: "system_manage",
          },
          {
            name: "about us",
            value: "about_us",
          },
        ],
      },
    ];
  }

  constructor() {
    super();
    this.walletController.on("exited", () => {
      this.enter();
    });
    this.chainController.on("exited", () => {
      this.enter();
    });
    this.connectController.on("exited", () => {
      this.enter();
    });
    this.systemController.on("exited", () => {
      this.enter();
    });
  }

  async enter() {
    console.log(
      `active wallet : `.yellow,
      `${this.walletController.getActiveWalletAddress()}`.green.bold
    );
    console.log(
      `active chain  : `.yellow,
      `${this.chainController.getActiveChain().chainName}`.blue.bold
    );
    const cmd = await super.enter();
    this.process(cmd);
    return cmd;
  }

  async process(cmd: string) {
    switch (cmd) {
      case "wallet_manage":
        this.walletController.enter();
        break;
      case "chain_manage":
        this.chainController.enter();
        break;
      case "dapps_manage":
        this.connectController.enter();
        break;
      case "system_manage":
        this.systemController.enter();
        break;
      case "about_us":
        console.log(
          `============================================

${"https://lxdao.io".rainbow.underline.bold}
---------------------
${"LXDAO".rainbow.bold} is an ${"R&D".blue.bold}-focused DAO in Web3. 
Our misson: Bringing together buidlers to buidl and maintain "${
            "LX".blue.bold
          }" (Valuable) projects for Web3, in a sustainable manner

============================================`
        );
        await this.enter();
        break;
      default:
        break;
    }
  }
}

export { RootController };
