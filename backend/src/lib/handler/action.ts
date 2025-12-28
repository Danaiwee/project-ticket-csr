import { ZodSchema } from "zod";
import { ValidationError } from "../http-error.js";

interface ActionOptions<T> {
  params: T;
  schema: ZodSchema<T>;
}

async function action<T>({ params, schema }: ActionOptions<T>) {
  const validation = schema.safeParse(params);
  if (!validation.success) {
    throw new ValidationError(validation.error.flatten().fieldErrors);
  }

  return { params: validation.data };
}

export default action;
