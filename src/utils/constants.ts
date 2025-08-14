import { z } from "zod";

export const InboxScriptName = "Run Script from Inbox";
export const errorObject = z.object({
  error: z.object({
    code: z.number().refine((val) => val === 0, {
      message: "FM Script Error",
    }).optional(),
    environment: z.object({
      fileName: z.string().optional(),
      layoutName: z.string().optional(),
      scriptName: z.string().optional(),
      scriptParameter: z.string().optional(),
      systemPlatform: z.string().optional(),
      systemVersion: z.string().optional(),
    }).optional(),
    lineNumber: z.number().optional(),
    scriptName: z.string().optional(),
    scriptStep: z.string().optional(),
    text: z.string().optional(),
  }),
}).optional();

export type FMScript<
  TInput extends z.ZodTypeAny,
  TOutput extends z.ZodTypeAny,
> = {
  name: string;
  input: TInput;
  output: TOutput;
};

export const fmsScripts: {
  releaseShipperHold: FMScript<
    z.ZodObject<{ gmt_no: z.ZodString }>,
    typeof errorObject
  >;
} = {
  releaseShipperHold: {
    name: "Release Shipper Hold",
    input: z.object({
      gmt_no: z.string(),
    }),
    output: errorObject,
  },
};
