import inquirer from "inquirer";
import lightwallet from "eth-lightwallet";
import { getRootMnemonic } from "./getRootMnemonic.js";
import { getData, setData } from "./storageData.js";
import { getPassword } from "./getPassword.js";
import { getKS } from "./getKS.js";

export async function getAddressList(): Promise<string[]> {
  const { ks, pwDerivedKey } = await getKS();
  const address_count = getData("address_count");
  // generate five new address/private key pairs
  // the corresponding private keys are also encrypted
  // ks.generateNewAddress(pwDerivedKey, address_count);
  var addrs = ks.getAddresses();
  return addrs;
}
