import { EventEmitter } from "eventemitter3";
import inquirer, { QuestionCollection } from "inquirer";
import { IBaseController } from "./IBaseController";
abstract class BaseController
  extends EventEmitter<"entered" | "exited">
  implements IBaseController
{
  abstract questions(): Promise<QuestionCollection>;
  async enter(): Promise<string> {
    const answers = await inquirer.prompt(await this.questions());
    const { root_cmd } = answers;
    if (root_cmd == "exit") {
      this.exit();
    }
    return root_cmd;
  }
  async exit(): Promise<void> {
    console.log("exit");
    this.emit("exited");
  }
}
export { BaseController };
