/**
 * Generated by @proofkit/typegen package
 * https://proofkit.dev/docs/typegen
 * DO NOT EDIT THIS FILE DIRECTLY. Changes may be overritten
 */
import { z } from "zod/v3";

// @generated
// prettier-ignore
/* eslint-disable */
export const ZInbox = z.object({
        "scriptName": z.string(),
        "CreationTimestamp": z.string(),
        "inboxPayload": z.string(),
        "scriptResult": z.string(),
    });

export type TInbox = z.infer<typeof ZInbox>;
