import { z } from "zod";

export const InboxScriptName = "Run Script from Inbox";
export const errorObject = z
  .object({
    code: z
      .number()
      .refine((val) => val === 0, {
        message: "FM Script Error",
      })
      .optional(),
    environment: z
      .object({
        fileName: z.string().optional(),
        layoutName: z.string().optional(),
        scriptName: z.string().optional(),
        scriptParameter: z.string().optional(),
        systemPlatform: z.string().optional(),
        systemVersion: z.string().optional(),
      })
      .optional(),
    lineNumber: z.number().optional(),
    scriptName: z.string().optional(),
    scriptStep: z.string().optional(),
    text: z.string().optional(),
  })
  .optional();

export type FMScript<
  TInput extends z.ZodTypeAny,
  TOutput extends z.ZodTypeAny,
> = {
  name: string;
  input: TInput;
  output: TOutput;
};

export const fmsScripts = {
  requestShipperHold: {
    name: "Shipper Hold Request",
    input: z.object({
      action: z.enum(["release", "request", "cancel"]),
      gmt_no: z.string(),
      contact_id: z.string(),
    }),
    output: errorObject,
  },
  downloadBookingConfirmation: {
    name: "Download Booking Confirmation",
    input: z.object({
      gmt_no: z.string(),
    }),
    output: z.object({
      url: z.union([errorObject, z.string().url()]),
    }),
  },
};
