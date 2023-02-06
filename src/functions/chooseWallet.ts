import inquirer from "inquirer";
import { getAddressList } from "./getWalletList.js";

export async function chooseWallet(): Promise<string> {
  const list = await getAddressList();
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
  const ans = await inquirer.prompt(questions);

  return ans.address;
}
