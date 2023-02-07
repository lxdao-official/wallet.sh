import { __awaiter } from "tslib";
import { chooseWallet } from "../functions/chooseWallet.js";
import { createNewWallet } from "../functions/createWallet.js";
import { getAddressList } from "../functions/getWalletList.js";
import { getData, setData } from "../functions/storageData.js";
import { BaseController } from "./BaseController.js";
class WalletController extends BaseController {
    questions() {
        return __awaiter(this, void 0, void 0, function* () {
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
                            name: `wallet list (${yield this.getWalletCount()})`,
                            value: "wallet_list",
                        },
                        {
                            name: "back",
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
                case "active_wallet":
                    yield this.activeWallet();
                    break;
                case "create_new_wallet":
                    yield this.createNewWallet();
                    break;
                case "wallet_list":
                    yield this.walletList();
                    break;
                default:
                    break;
            }
        });
    }
    createNewWallet() {
        return __awaiter(this, void 0, void 0, function* () {
            const address = yield createNewWallet();
            setData("address_active", address);
            yield this.enter();
            return address;
        });
    }
    activeWallet() {
        return __awaiter(this, void 0, void 0, function* () {
            const activeWallet = yield chooseWallet();
            setData("address_active", activeWallet);
            yield this.enter();
            return activeWallet;
        });
    }
    walletList() {
        return __awaiter(this, void 0, void 0, function* () {
            const walletList = yield chooseWallet();
            setData("address_active", walletList);
            yield this.enter();
            return walletList;
        });
    }
    getActiveWalletAddress() {
        return getData("address_active");
    }
    getWalletCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const addresses = yield getAddressList();
            return addresses.length;
        });
    }
}
export { WalletController };
