import { __awaiter } from "tslib";
import inquirer from "inquirer";
import { chainList } from "./chainList.js";
export function chooseChain() {
    return __awaiter(this, void 0, void 0, function* () {
        const list = chainList;
        const questions = [
            {
                type: "list",
                name: "chain",
                message: "Choose active chain?",
                choices: Object.keys(list).map((key) => {
                    return {
                        name: key,
                        value: list[key].chainId,
                    };
                }),
            },
        ];
        const ans = yield inquirer.prompt(questions);
        return ans.chain;
    });
}
