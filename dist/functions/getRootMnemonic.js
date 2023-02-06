import lightwallet from "eth-lightwallet";
import fs from "fs";
export function getRootMnemonic() {
    try {
        const local = fs.readFileSync("mnemonic.txt", "utf8");
        if (local) {
            return local;
        }
    }
    catch (e) {
        const mnemonic = lightwallet.keystore.generateRandomSeed();
        fs.writeFileSync("mnemonic.txt", mnemonic);
        console.log("please save this mnemonic yourself: " + mnemonic);
        return mnemonic;
    }
}
