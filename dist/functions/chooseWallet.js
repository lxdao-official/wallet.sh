import { __awaiter } from "tslib";
import inquirer from "inquirer";
import { getAddressList } from "./getWalletList.js";
export function chooseWallet() {
    return __awaiter(this, void 0, void 0, function* () {
        const list = yield getAddressList();
        const questions = [
            {
                type: "list",
                name: "address",
                message: "Choose address?",
                choices: list.map((item) => {
                    return {
                        name: item,
                        value: item,
                    };
                }),
            },
        ];
        const ans = yield inquirer.prompt(questions);
        return ans.address;
    });
}
