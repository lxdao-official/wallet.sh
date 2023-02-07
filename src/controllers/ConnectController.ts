import inquirer from "inquirer";
import { getNameOfChainId } from "../functions/chainList.js";
import { getData } from "../functions/storageData.js";
import { BaseController } from "./BaseController.js";
export class ConnectController extends BaseController {
  async questions() {
    return [
      {
        type: "list",
        name: "root_cmd",
        message: "What do you want to do?",
        choices: [
          {
            name: "connect wallet (v1)",
            value: "active_chain",
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

  async process(cmd: string) {}
}
