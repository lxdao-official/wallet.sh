import { getNameOfChainId } from "../functions/chainList.js";
import { chooseChain } from "../functions/chooseChain.js";
import { getData, setData } from "../functions/storageData.js";
import { BaseController } from "./BaseController.js";
export class ChainController extends BaseController {
  async questions() {
    return [
      {
        type: "list",
        name: "root_cmd",
        message: "What do you want to do?",
        choices: [
          {
            name: "active chain: " + this.getActiveChain().chainName || "none",
            value: "active_chain",
          },
          //   {
          //     name: "add new chain",
          //     value: "add_new_chain",
          //   },
          {
            name: "chain list",
            value: "chain_list",
          },
          {
            name: "exit",
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
      case "active_chain":
        await this.activeChain();
        break;
      // case "add_new_chain":
      //     await this.addNewChain();
      //     break;
      case "chain_list":
        await this.activeChain();
        break;
      default:
        break;
    }
  }

  async activeChain() {
    const chain_id = await chooseChain();
    setData("chain_id", chain_id);
    await this.enter();
    return chain_id;
  }

  getActiveChain(): {
    chainId: string;
    chainName: string;
  } {
    const chain_id = getData("chain_id");

    return {
      chainId: chain_id,
      chainName: getNameOfChainId(chain_id),
    };
  }
}
