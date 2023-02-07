import { QuestionCollection } from "inquirer";

export interface IBaseController {
  questions(): Promise<QuestionCollection>;
  enter(): Promise<string>;
  exit(): Promise<void>;
}
