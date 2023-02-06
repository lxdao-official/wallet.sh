import inquirer from "inquirer";

let password = "";

export function setPassword(p: string) {
  password = p;
}

export async function getPassword() {
  return password;
}

export async function askPassword(messge?: string) {
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

  const answers = await askQuestions();
  const { password } = answers;

  setPassword(password);
  return password;
}
export async function askSetPassword() {
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

  const answers = await askQuestions();
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

  const answersSec = await askQuestionsSec();
  const { password: passwordSec } = answers;

  if (!passwordSec) {
    throw new Error("Password is empty");
  }

  if (password !== passwordSec) {
    throw new Error("Password is not match");
  }

  setPassword(password);
  return password;
}
