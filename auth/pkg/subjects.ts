import { createSubjects } from "@openauthjs/openauth/subject";
import { array, object, string } from "valibot";

export const subjects = createSubjects({
  user: object({
    username: string(),
    email: string(),
    publicKeys: array(string()),
  }),
});
