import { __awaiter } from "tslib";
import { EventEmitter } from "eventemitter3";
import inquirer from "inquirer";
class BaseController extends EventEmitter {
    enter() {
        return __awaiter(this, void 0, void 0, function* () {
            const answers = yield inquirer.prompt(yield this.questions());
            const { root_cmd } = answers;
            if (root_cmd == "exit") {
                this.exit();
            }
            return root_cmd;
        });
    }
    exit() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("exit");
            this.emit("exited");
        });
    }
}
export { BaseController };
