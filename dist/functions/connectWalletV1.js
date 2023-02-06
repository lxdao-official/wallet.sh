import { __awaiter } from "tslib";
import { Core } from "@walletconnect/core";
import WalletConnect from "@walletconnect/client";
import inquirer from "inquirer";
import { getData } from "./storageData.js";
import lightwallet from "eth-lightwallet";
import { getKS } from "./getKS.js";
const core = new Core({
    projectId: "ec307039abe79975829b7c4b9a3c6f1a",
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
                    type: "confirm",
                    name: "session_proposal",
                    message: "recieve session request, approve it?",
                },
            ];
            const asw = yield inquirer.prompt(questions);
            if (asw.session_proposal) {
                // Handle Session Request
                yield connector.approveSession({
                    accounts: [getData("address_active")],
                    chainId: getData("chain_id"), // required
                });
                console.log("approved");
            }
            else {
                connector.rejectSession({
                    message: "OPTIONAL_ERROR_MESSAGE", // optional
                });
            }
        }));
        // Subscribe to call requests
        connector.on("call_request", (error, payload) => __awaiter(this, void 0, void 0, function* () {
            if (error) {
                throw error;
            }
            console.log("call_request", payload);
            const questions = [
                {
                    type: "confirm",
                    name: "call_request",
                    message: "recieve session call_request, approve it?",
                },
            ];
            const asw = yield inquirer.prompt(questions);
            if (asw.call_request) {
                // Handle Call Request
                if (payload.method === "personal_sign") {
                    const { ks, pwDerivedKey } = yield getKS();
                    const sig = lightwallet.signing.concatSig(lightwallet.signing.signMsgHash(ks, pwDerivedKey, payload.params[0], getData("address_active")));
                    console.log("sig", sig);
                    yield connector.approveRequest({
                        id: payload.id,
                        result: sig,
                    });
                    console.log("approved success");
                }
            }
            else {
                yield connector.rejectRequest({
                    id: payload.id,
                    error: {
                        message: "OPTIONAL_ERROR_MESSAGE", // optional
                    },
                });
            }
            /* payload:
          {
            id: 1,
            jsonrpc: '2.0'.
            method: 'eth_sign',
            params: [
              "0xbc28ea04101f03ea7a94c1379bc3ab32e65e62d3",
              "My email is john@doe.com - 1537836206101"
            ]
          }
          */
        }));
        connector.on("disconnect", (error, payload) => {
            if (error) {
                throw error;
            }
            console.log("disconnect", payload);
            // Delete connector
        });
    });
}
