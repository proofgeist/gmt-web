"use server";

import { authedActionClient } from "@/server/safe-action";
import { runFMScript } from "@/server/services/fms";
import { fmsScripts } from "@/utils/constants";
import { sendHoldRemovedEmail } from "@/utils/email";
import { z } from "zod";

export const releaseShipperHoldAction = authedActionClient
  .schema(
    z.object({
      gmt_no: z.string(),
      portOfLoading: z.string(),
      portOfDischarge: z.string(),
      vesselName: z.string(),
      holdRemovedAt: z.string(),
    })
  )
  .action(async ({ parsedInput, ctx }) => {
    const result = await runFMScript(fmsScripts.releaseShipperHold, {
      gmt_no: parsedInput.gmt_no,
    });
    if (result?.error?.code) {
      throw new Error(result.error.text);
    }

    const { user } = ctx;
    if (!user.email || !user.username) {
      throw new Error("User not found");
    }

    sendHoldRemovedEmail({
      to: user.email,
      firstName: user.username,
      bookingNumber: parsedInput.gmt_no,
      portOfLoading: parsedInput.portOfLoading,
      portOfDischarge: parsedInput.portOfDischarge,
      vesselName: parsedInput.vesselName,
      holdRemovedAt: parsedInput.holdRemovedAt,
    });
    return result;
  });
