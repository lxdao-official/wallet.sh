import { __awaiter } from "tslib";
import { getData, setData } from "./storageData.js";
import { getKS } from "./getKS.js";
export function createNewWallet() {
    return __awaiter(this, void 0, void 0, function* () {
        const { ks, pwDerivedKey } = yield getKS();
        const address_count = getData("address_count");
        // generate five new address/private key pairs
        // the corresponding private keys are also encrypted
        ks.generateNewAddress(pwDerivedKey, 1);
        var addrs = ks.getAddresses();
        setData("address_count", address_count + 1);
        return addrs[address_count];
    });
}
