import { __awaiter } from "tslib";
import inquirer from "inquirer";
let password = "";
export function setPassword(p) {
    password = p;
}
export function getPassword() {
    return __awaiter(this, void 0, void 0, function* () {
        return password;
    });
}
export function askPassword(messge) {
    return __awaiter(this, void 0, void 0, function* () {
        const askQuestions = () => {
            const questions = [
                {
                    type: "password",
                    name: "password",
                    message: messge || "Input password",
                },
            ];
            return inquirer.prompt(questions);
        };
        const answers = yield askQuestions();
        const { password } = answers;
        setPassword(password);
        return password;
    });
}
export function askSetPassword() {
    return __awaiter(this, void 0, void 0, function* () {
        const askQuestions = () => {
            const questions = [
                {
                    type: "password",
                    name: "password",
                    message: "Input password:",
                },
            ];
            return inquirer.prompt(questions);
        };
        const answers = yield askQuestions();
        const { password } = answers;
        if (!password) {
            throw new Error("Password is empty");
        }
        const askQuestionsSec = () => {
            const questions = [
                {
                    type: "password",
                    name: "password",
                    message: "Input password again:",
                },
            ];
            return inquirer.prompt(questions);
        };
        const answersSec = yield askQuestionsSec();
        const { password: passwordSec } = answers;
        if (!passwordSec) {
            throw new Error("Password is empty");
        }
        if (password !== passwordSec) {
            throw new Error("Password is not match");
        }
        setPassword(password);
        return password;
    });
}
