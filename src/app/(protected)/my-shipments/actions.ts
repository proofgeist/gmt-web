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
    const { user } = ctx;
    if (!user.email) {
      throw new Error("User not found");
    }

    const result = await runFMScript(fmsScripts.releaseShipperHold, {
      gmt_no: parsedInput.gmt_no,
      contact_id: user.contact_id,
    });
    if (result?.error?.code) {
      throw new Error(result.error.text);
    }


    sendHoldRemovedEmail({
      to: user.email,
      bookingNumber: parsedInput.gmt_no,
      portOfLoading: parsedInput.portOfLoading,
      portOfDischarge: parsedInput.portOfDischarge,
      vesselName: parsedInput.vesselName,
      holdRemovedAt: parsedInput.holdRemovedAt,
    });
    return result;
  });
