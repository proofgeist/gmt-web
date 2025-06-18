import { z } from "zod";

export const InboxScriptName = "Run Script from Inbox";
export const errorObject = z.object({
  error: z.object({
    code: z.number().refine((val) => val === 0, {
      message: "FM Script Error",
    }),
    environment: z.object({
      fileName: z.string(),
      layoutName: z.string(),
      scriptName: z.string(),
      scriptParameter: z.string(),
      systemPlatform: z.string(),
      systemVersion: z.string(),
    }),
    lineNumber: z.number(),
    scriptName: z.string(),
    scriptStep: z.string(),
    text: z.string(),
  }),
});

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
