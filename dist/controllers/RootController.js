import { __awaiter } from "tslib";
import { WalletController } from "./WalletController.js";
import { ChainController } from "./ChainController.js";
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
class RootController extends BaseController {
    questions() {
        return __awaiter(this, void 0, void 0, function* () {
            return [
                {
                    type: "list",
                    name: "root_cmd",
                    message: "What do you want to do?",
                    choices: [
                        {
                            name: `wallet manage (${yield this.walletController.getWalletCount()})`,
                            value: "wallet_manage",
                        },
                        {
                            name: `chain manage (${this.chainController.getActiveChain().chainName})`,
                            value: "chain_manage",
                        },
                        {
                            name: "dapps manage",
                            value: "dapps_manage",
                        },
                        {
                            name: "about us",
                            value: "about_us",
                        },
                    ],
                },
            ];
        });
    }
    constructor() {
        super();
        this.walletController = new WalletController();
        this.chainController = new ChainController();
        this.connectController = new ConnectController();
        this.walletController.on("exited", () => {
            this.enter();
        });
        this.chainController.on("exited", () => {
            this.enter();
        });
        this.connectController.on("exited", () => {
            this.enter();
        });
    }
    enter() {
        const _super = Object.create(null, {
            enter: { get: () => super.enter }
        });
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`active wallet : `.yellow, `${this.walletController.getActiveWalletAddress()}`.green.bold);
            console.log(`active chain  : `.yellow, `${this.chainController.getActiveChain().chainName}`.blue.bold);
            const cmd = yield _super.enter.call(this);
            this.process(cmd);
            return cmd;
        });
    }
    process(cmd) {
        return __awaiter(this, void 0, void 0, function* () {
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
                case "about_us":
                    console.log(`============================================

${"https://lxdao.io".rainbow.underline.bold}
---------------------
${"LXDAO".rainbow.bold} is an ${"R&D".blue.bold}-focused DAO in Web3. 
Our misson: Bringing together buidlers to buidl and maintain "${"LX".blue.bold}" (Valuable) projects for Web3, in a sustainable manner

============================================`);
                    yield this.enter();
                    break;
                default:
                    break;
            }
        });
    }
}
export { RootController };
