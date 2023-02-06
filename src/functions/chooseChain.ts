import inquirer from "inquirer";
import { chainList } from "./chainList.js";
import { getAddressList } from "./getWalletList.js";

export async function chooseChain(): Promise<string> {
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
  const ans = await inquirer.prompt(questions);

  return ans.chain;
}
