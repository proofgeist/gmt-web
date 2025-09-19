"use server";

import { DEFAULT_RELEASE_INBOX } from "@/config/email";
import { authedActionClient } from "@/server/safe-action";
import { runFMScript } from "@/server/services/fms";
import { fmsScripts } from "@/utils/constants";
import {
  sendHoldRemovedEmail,
  sendShipperHoldRequestedEmail,
} from "@/utils/email";
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

    const result = await runFMScript(fmsScripts.requestShipperHold, {
      action: "release",
      gmt_no: parsedInput.gmt_no,
      contact_id: user.contact_id,
    });
    if (result?.code) {
      throw new Error(result.text);
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

export const requestShipperHoldAction = authedActionClient
  .schema(
    z.object({
      gmt_no: z.string(),
      portOfLoading: z.string(),
      portOfDischarge: z.string(),
      vesselName: z.string(),
    })
  )
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx;
    if (!user.email) {
      throw new Error("User not found");
    }

    const result = await runFMScript(fmsScripts.requestShipperHold, {
      action: "request",
      gmt_no: parsedInput.gmt_no,
      contact_id: user.contact_id,
    });
    if (result?.code) {
      throw new Error(result.text);
    }

    console.log("sending email to", DEFAULT_RELEASE_INBOX);
    sendShipperHoldRequestedEmail({
      to: DEFAULT_RELEASE_INBOX,
      bookingNumber: parsedInput.gmt_no,
      portOfLoading: parsedInput.portOfLoading,
      portOfDischarge: parsedInput.portOfDischarge,
      vesselName: parsedInput.vesselName,
    });
    console.log("email sent");
    return result;
  });

export const cancelShipperHoldRequestAction = authedActionClient
  .schema(
    z.object({
      gmt_no: z.string(),
    })
  )
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx;
    if (!user.email) {
      throw new Error("User not found");
    }

    const result = await runFMScript(fmsScripts.requestShipperHold, {
      action: "cancel",
      gmt_no: parsedInput.gmt_no,
      contact_id: user.contact_id,
    });
  });