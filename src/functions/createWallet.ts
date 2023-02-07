import inquirer from "inquirer";
import lightwallet from "eth-lightwallet";
import { getRootMnemonic } from "./getRootMnemonic.js";
import { getData, setData } from "./storageData.js";
import { getPassword } from "./getPassword.js";
import { getKS } from "./getKS.js";

export async function createNewWallet(): Promise<string> {
  const { ks, pwDerivedKey } = await getKS();
  const address_count = getData("address_count");
  // generate five new address/private key pairs
  // the corresponding private keys are also encrypted
  ks.generateNewAddress(pwDerivedKey, 1);
  var addrs = ks.getAddresses();

  setData("address_count", address_count + 1);
  return addrs[address_count];
}
