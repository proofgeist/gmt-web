import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendVerificationCode(phoneNumber: string) {
  try {
    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verifications.create({
        to: phoneNumber,
        channel: "sms",
      });

    return { success: true };
  } catch {
    throw new Error("Failed to send verification code");
  }
}

export async function verifyCode(phoneNumber: string, code: string) {
  try {
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verificationChecks.create({
        to: phoneNumber,
        code,
      });

    return {
      success: true,
      verified: verification.status === "approved",
    };
  } catch {
    throw new Error("Failed to verify code");
  }
}
