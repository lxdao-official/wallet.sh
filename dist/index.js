#!/usr/bin/env node
import { __awaiter } from "tslib";
import chalk from "chalk";
import figlet from "figlet";
import { createNewWallet } from "./functions/createWallet.js";
import { askPassword, askSetPassword } from "./functions/getPassword.js";
import { getData, setData } from "./functions/storageData.js";
import { RootController } from "./controllers/RootController.js";
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(chalk.green(figlet.textSync("Wallet.sh", {
        font: "Larry 3D 2",
        horizontalLayout: "default",
        verticalLayout: "default",
        width: 80,
    })));
});
const rootController = new RootController();
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    // show script introduction
    yield init();
    // check if wallet is created
    const address_count = getData("address_count");
    if (!address_count) {
        yield askSetPassword();
        const address = yield createNewWallet();
        setData("address_active", address);
    }
    else {
        yield askPassword("Input password to unlock your wallet:");
    }
    // check if chain is set
    const active_chain = getData("chain_id");
    if (!active_chain) {
        setData("chain_id", 1);
    }
    // enter root controller
    yield rootController.enter();
});
run();
