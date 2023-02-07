import { __awaiter } from "tslib";
import { getNameOfChainId } from "../functions/chainList.js";
import { chooseChain } from "../functions/chooseChain.js";
import { getData, setData } from "../functions/storageData.js";
import { BaseController } from "./BaseController.js";
export class ChainController extends BaseController {
    questions() {
        return __awaiter(this, void 0, void 0, function* () {
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
        return __awaiter(this, void 0, void 0, function* () {
            switch (cmd) {
                case "active_chain":
                    yield this.activeChain();
                    break;
                // case "add_new_chain":
                //     await this.addNewChain();
                //     break;
                case "chain_list":
                    yield this.activeChain();
                    break;
                default:
                    break;
            }
        });
    }
    activeChain() {
        return __awaiter(this, void 0, void 0, function* () {
            const chain_id = yield chooseChain();
            setData("chain_id", chain_id);
            yield this.enter();
            return chain_id;
        });
    }
    getActiveChain() {
        const chain_id = getData("chain_id");
        return {
            chainId: chain_id,
            chainName: getNameOfChainId(chain_id),
        };
    }
}
