
  /**
  * Generated by @proofgeist/fmdapi package
  * https://github.com/proofgeist/fmdapi
  * DO NOT EDIT THIS FILE DIRECTLY. Changes may be overritten
  */
  import { DataApi, OttoAdapter, type OttoAPIKey } from "@proofgeist/fmdapi";
  import { type TBookings, ZBookings } from "../Bookings";

  // @generated
  // prettier-ignore
  /* eslint-disable */
  if (!process.env.FM_DATABASE) throw new Error("Missing env var: FM_DATABASE")
  if (!process.env.FM_SERVER) throw new Error("Missing env var: FM_SERVER")
  if (!process.env.OTTO_API_KEY) throw new Error("Missing env var: OTTO_API_KEY")

  export const client = DataApi<any, TBookings>({
      adapter: new OttoAdapter({
          auth: { apiKey: process.env.OTTO_API_KEY as OttoAPIKey },
          db: process.env.FM_DATABASE,
          server: process.env.FM_SERVER,
      }),
      layout: "api.Bookings",
      zodValidators: { fieldData: ZBookings },
  });
