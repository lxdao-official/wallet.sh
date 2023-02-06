import { __awaiter } from "tslib";
import { getData } from "./storageData.js";
import { getKS } from "./getKS.js";
export function getAddressList() {
    return __awaiter(this, void 0, void 0, function* () {
        const { ks, pwDerivedKey } = yield getKS();
        const address_count = getData("address_count");
        // generate five new address/private key pairs
        // the corresponding private keys are also encrypted
        ks.generateNewAddress(pwDerivedKey, address_count);
        var addrs = ks.getAddresses();
        return addrs;
    });
}
