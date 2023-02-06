import { __awaiter } from "tslib";
import { hex2Text } from "./hex2text.js";
import { Core } from "@walletconnect/core";
import WalletConnect from "@walletconnect/client";
import inquirer from "inquirer";
import { getData } from "./storageData.js";
import lightwallet from "eth-lightwallet";
import { getKS } from "./getKS.js";
//@ts-ignore
const { txutils, signing } = lightwallet;
const core = new Core({
    projectId: "ec307039abe79975829b7c4b9a3c6f1a",
});
const waitingOrReturn = () => __awaiter(void 0, void 0, void 0, function* () {
    const questions = [
        {
            type: "confirm",
            name: "waiting",
            message: "waiting for response, continue?",
        },
    ];
    const asw = yield inquirer.prompt(questions);
    if (asw.waiting) {
        yield waitingOrReturn();
    }
    else {
        throw new Error("user cancel");
    }
});
export function connectWalletV1() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("initing...");
        const questions = [
            {
                type: "input",
                name: "session_uri",
                message: "paste walletconnect session:",
            },
        ];
        const asw = yield inquirer.prompt(questions);
        const { session_uri } = asw;
        console.log("connecting...");
        yield waitingOrReturn();
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            //@ts-ignore
            const connector = new WalletConnect.default({
                // Required
                uri: session_uri,
                // Required
                clientMeta: {
                    name: "Wallet.sh",
                    description: "Wallet.sh",
                    url: "Wallet.sh",
                    icons: [],
                },
            });
            // Subscribe to session requests
            connector.on("session_request", (error, payload) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    throw error;
                }
                const questions = [
                    {
                        type: "list",
                        name: "session_proposal",
                        message: "recieve session request, approve it?",
                        choices: ["Approve", "Reject", "Back to home"],
                    },
                ];
                const asw = yield inquirer.prompt(questions);
                if (asw.session_proposal == "Approve") {
                    // Handle Session Request
                    yield connector.approveSession({
                        accounts: [getData("address_active")],
                        chainId: getData("chain_id"), // required
                    });
                    console.log("approved");
                }
                else if (asw.session_proposal == "Reject") {
                    connector.rejectSession({
                        message: "OPTIONAL_ERROR_MESSAGE", // optional
                    });
                }
                else {
                    reject("back to home");
                }
            }));
            // Subscribe to call requests
            connector.on("call_request", (error, payload) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    throw error;
                }
                console.log("call_request", payload);
                let sign_text = "";
                let signed_result = "";
                const { ks, pwDerivedKey } = yield getKS();
                if (payload.method == "personal_sign") {
                    sign_text = hex2Text(payload.params[0]);
                    console.log(`recieve personal_sign request: ${sign_text}`);
                    signed_result = lightwallet.signing.concatSig(lightwallet.signing.signMsg(ks, pwDerivedKey, sign_text, getData("address_active")));
                }
                else if (payload.method == "eth_sign") {
                    sign_text = hex2Text(payload.params[0]);
                    console.log(`recieve eth_sign request: ${sign_text}`);
                    const txOptions = {
                        gasPrice: 10000000000000,
                        gasLimit: 3000000,
                        value: 10000000,
                        nonce: 1,
                        data: payload.params[0],
                    };
                    const address = getData("address_active");
                    var contractData = txutils.createContractTx(address, txOptions);
                    var signedTx = signing.signTx(ks, pwDerivedKey, contractData.tx, address);
                    console.log("Signed Contract creation TX: " + signedTx);
                    console.log("");
                    console.log("Contract Address: " + contractData.addr);
                    console.log("");
                    signed_result = signedTx;
                }
                const questions = [
                    {
                        type: "list",
                        name: "call_request",
                        message: `approve it?`,
                        choices: ["Approve", "Reject", "Back to home"],
                    },
                ];
                const asw = yield inquirer.prompt(questions);
                if (asw.call_request == "Approve") {
                    // Handle Call Request
                    yield connector.approveRequest({
                        id: payload.id,
                        result: signed_result,
                    });
                    console.log("approved success");
                }
                else if (asw.call_request == "Reject") {
                    yield connector.rejectRequest({
                        id: payload.id,
                        error: {
                            message: "OPTIONAL_ERROR_MESSAGE", // optional
                        },
                    });
                }
                else {
                    reject("back to home");
                }
            }));
            connector.on("disconnect", (error, payload) => {
                if (error) {
                    throw error;
                }
                console.log("disconnect", payload);
                reject("disconnected, back to home");
                // Delete connector
            });
        }));
    });
}
