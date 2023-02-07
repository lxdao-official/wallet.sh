import { BaseController } from "./BaseController.js";
export class SystemController extends BaseController {
  async questions() {
    return [
      {
        type: "list",
        name: "root_cmd",
        message: "What do you want to do?",
        choices: [
          {
            name: "import private key",
            value: "import_private_key",
          },
          {
            name: "export private key",
            value: "export_private_key",
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
