import { __awaiter } from "tslib";
import { Core } from "@walletconnect/core";
import { Web3Wallet } from "@walletconnect/web3wallet";
import inquirer from "inquirer";
const core = new Core({
    projectId: "ec307039abe79975829b7c4b9a3c6f1a",
});
export function connectWallet() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("initing...");
        const web3wallet = yield Web3Wallet.init({
            core,
            metadata: {
                name: "Wallet.sh",
                description: "Wallet.sh",
                url: "Wallet.sh",
                icons: [],
            },
        });
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
        web3wallet.on("session_proposal", (proposal) => __awaiter(this, void 0, void 0, function* () {
            const questions = [
                {
                    type: "confirm",
                    name: "session_proposal",
                    message: "recieve session proposal, approve it?",
                },
            ];
            const asw = yield inquirer.prompt(questions);
            if (asw.session_proposal) {
                const methods = [
                    "eth_sendTransaction",
                    "personal_sign",
                    "eth_signTypedData",
                ];
                const namespaces = {
                    "eip155:1": {
                        accounts: ["*"],
                        methods,
                        events: [],
                    },
                };
                const session = yield web3wallet.approveSession({
                    id: proposal.id,
                    namespaces,
                });
                console.log("approved");
            }
            else {
                yield web3wallet.rejectSession({
                    id: proposal.id,
                    reason: {
                        code: 1,
                        message: "Rejected by user",
                    },
                });
            }
        }));
        yield web3wallet.core.pairing.pair({ uri: session_uri });
    });
}
