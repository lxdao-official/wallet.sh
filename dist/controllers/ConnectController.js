import { __awaiter } from "tslib";
import { BaseController } from "./BaseController.js";
export class ConnectController extends BaseController {
    questions() {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    enter() {
        const _super = Object.create(null, {
            enter: { get: () => super.enter }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const cmd = yield _super.enter.call(this);
            yield this.process(cmd);
            return cmd;
        });
    }
    process(cmd) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
