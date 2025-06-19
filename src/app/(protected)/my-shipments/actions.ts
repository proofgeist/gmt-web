"use server";

import { authedActionClient } from "@/server/safe-action";
import { runFMScript } from "@/server/services/fms";
import { fmsScripts } from "@/utils/constants";

export const releaseShipperHold = authedActionClient
  .schema(fmsScripts.releaseShipperHold.input)
  .action(async ({ parsedInput }) => {
    const result = await runFMScript(
      fmsScripts.releaseShipperHold,
      parsedInput
    );
    return result;
  });
