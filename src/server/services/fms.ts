import { InboxScriptName } from "@/utils/constants";
import { InboxLayout } from "@/config/schemas/filemaker/server";
import type { FMScript } from "@/utils/constants";
import { z } from "zod";

export async function runFMScript<TInput, TOutput>(
  script: FMScript<z.ZodType<TInput>, z.ZodType<TOutput>>,
  input: TInput
): Promise<TOutput> {
  script.input.parse(input);

  const { scriptResult } = await InboxLayout.create({
    fieldData: {
      inboxPayload: JSON.stringify(input),
      scriptName: script.name,
    },
    script: InboxScriptName,
  });

  if (scriptResult === null || scriptResult === undefined) {
    throw new Error(`Script "${script.name}" returned no result.`);
  }

  let parsedResult: unknown;
  try {
    parsedResult = JSON.parse(scriptResult);
  } catch {
    parsedResult = scriptResult;
  }

  const validation = script.output.safeParse(parsedResult);
  if (!validation.success) {
    throw new Error(
      `Script "${script.name}" output validation failed: ${validation.error.message}`
    );
  }

  return validation.data;
}
