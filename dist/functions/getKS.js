import { __awaiter } from "tslib";
import lightwallet from "eth-lightwallet";
import { getRootMnemonic } from "./getRootMnemonic.js";
import { getData } from "./storageData.js";
import { getPassword } from "./getPassword.js";
let globalKS;
export function getKS() {
    return __awaiter(this, void 0, void 0, function* () {
        const password = yield getPassword();
        if (!password)
            throw new Error("password is empty");
        const address_count = getData("address_count");
        return new Promise((resolve, reject) => {
            if (globalKS) {
                return globalKS.keyFromPassword(password, function (err, pwDerivedKey) {
                    if (err)
                        return reject(err);
                    // globalKS.generateNewAddress(pwDerivedKey, address_count);
                    resolve({
                        ks: globalKS,
                        pwDerivedKey,
                    });
                    // Now set ks as transaction_signer in the hooked web3 provider
                    // and you can start using web3 using the keys/addresses in ks!
                });
            }
            const mnemonic = getRootMnemonic();
            if (!mnemonic)
                throw new Error("mnemonic is empty");
            lightwallet.keystore.createVault({
                password: password,
                seedPhrase: mnemonic,
                hdPathString: "m/44'/60'/0'/0",
            }, function (err, ks) {
                if (err)
                    return reject(err);
                else {
                    globalKS = ks;
                    ks.keyFromPassword(password, function (err, pwDerivedKey) {
                        if (err)
                            return reject(err);
                        ks.generateNewAddress(pwDerivedKey, address_count);
                        resolve({
                            ks,
                            pwDerivedKey,
                        });
                        // Now set ks as transaction_signer in the hooked web3 provider
                        // and you can start using web3 using the keys/addresses in ks!
                    });
                }
            });
        });
    });
}
