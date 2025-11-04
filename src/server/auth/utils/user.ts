import { ContactsLayout } from "@/config/schemas/filemaker/server";
import { usersLayout, webAccessRequestsLayout } from "../db/client";
import { Tusers as _User } from "../db/users";

export type User = Partial<
  Omit<_User, "id" | "password_hash" | "recovery_code" | "emailVerified" | "zCreationTimestamp" | "zCreatedBy" | "zModificationTimestamp" | "zModifiedBy">
> & {
  id: string;
  email: string;
  emailVerified: boolean;
  language_preference?: "en" | "es";
};

import { hashPassword, verifyPasswordHash } from "./password";
import { cookies } from "next/headers";

/**
 * An internal helper function to fetch a user from the database.
 * @param userId - The ID of the user to fetch.
 * @returns The user.
 */
async function fetchUser(userId: string) {
  const { data } = await usersLayout.findOne({
    query: { id: `==${userId}` },
  });
  return data;
}

/**
 * Create a new user in the database.
 * @param email - The email address of the user.
 * @param password - The password of the user.
 * @param contactID - The contact ID of the user.
 * @param language - The language of the user.
 * @param active - Whether the user is active.
 * @param dailyReportOptIn - Whether the user wants to receive daily booking reports via email.
 */
export async function createUser(
  email: string,
  password: string,
  contactID: string,
  language: "en" | "es",
  active: boolean,
  dailyReportOptIn = true
): Promise<User> {
  const password_hash = await hashPassword(password);
  const { recordId } = await usersLayout.create({
    fieldData: {
      email,
      password_hash,
      emailVerified: 1,
      contact_id: contactID,
      active: active ? 1 : 0,
      dailyReportOptIn: dailyReportOptIn ? 1 : 0,
    },
  });
  const fmResult = await usersLayout.get({ recordId });
  const { fieldData } = fmResult.data[0];

  const user: User = {
    id: fieldData.id,
    email,
    emailVerified: true,
    username: "",
    contact_id: contactID,
    preferredLanguage: language,
  };
  return user;
}

/**
 * Create a new user request in the database.
 * @param email - The email address of the user.
 * @param password - The password of the user.
 * @param language - The language of the user.
 * @param firstName - The first name of the user.
 * @param lastName - The last name of the user.
 * @param company - The company of the user.
 * @param phoneNumber - The phone number of the user.
 * @param contactID - The contact ID of the user.
 */
export async function createUserRequest(
  email: string,
  password: string,
  language: "en" | "es",
  firstName: string,
  lastName: string,
  company: string,
  phoneNumber: string,
  contactIDs: string[] = []
): Promise<void> {
  await webAccessRequestsLayout.create({
    fieldData: {
      email,
      password_hash: await hashPassword(password),
      contact_id: contactIDs.join("\r"),
      firstName,
      lastName,
      company,
      phoneNumber,
    },
  });
}

/**
 * Update a user's password in the database.
 * @param userId - The ID of the user to update.
 * @param password - The new password.
 */
export async function updateUserPassword(
  userId: string,
  password: string
): Promise<void> {
  const password_hash = await hashPassword(password);
  const { recordId } = await fetchUser(userId);

  await usersLayout.update({ recordId, fieldData: { password_hash } });
}

/**
 * Update a user's email and set the email as verified.
 * @param userId - The ID of the user to update.
 * @param email - The new email address.
 */
export async function updateUserEmailAndSetEmailAsVerified(
  userId: string,
  email: string
): Promise<void> {
  const { recordId } = await fetchUser(userId);
  await usersLayout.update({
    recordId,
    fieldData: { email, emailVerified: 1 },
  });
}

/**
 * Set a user's email as verified if the email matches the user's email.
 * @param userId - The ID of the user to update.
 * @param email - The email address to check.
 * @returns True if the email was set as verified, false otherwise.
 */
export async function setUserAsEmailVerifiedIfEmailMatches(
  userId: string,
  email: string
): Promise<boolean> {
  try {
    const {
      data: { recordId },
    } = await usersLayout.findOne({
      query: { id: `==${userId}`, email: `==${email}` },
    });
    await usersLayout.update({ recordId, fieldData: { emailVerified: 1 } });
    return true;
  } catch (error) {
    console.error("Error setting user as email verified:", error);
    return false;
  }
}

export async function getUserFromEmail(email: string): Promise<User | null> {
  const fmResult = await usersLayout.maybeFindFirst({
    query: { email: `==${email}` },
  });
  if (fmResult === null) return null;

  const {
    data: { fieldData },
  } = fmResult;

  const user: User = {
    id: fieldData.id,
    email: fieldData.email,
    emailVerified: Boolean(fieldData.emailVerified),
    username: fieldData.username,
  };
  return user;
}

/**
 * Validate a user's email/password combination.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns The user, or null if the login is invalid.
 */
export async function validateLogin(
  email: string,
  password: string
): Promise<User | null> {
  try {
    const {
      data: { fieldData },
    } = await usersLayout.findOne({
      query: { email: `==${email}` },
    });

    const validPassword = await verifyPasswordHash(
      fieldData.password_hash,
      password
    );
    if (!validPassword) {
      return null;
    }
    const user: User = {
      id: fieldData.id,
      email: fieldData.email,
      emailVerified: Boolean(fieldData.emailVerified),
      username: fieldData.username,
      phone_number_mfa: fieldData.phone_number_mfa,
    };
    return user;
  } catch (error) {
    console.error("Error validating login:", error);
    return null;
  }
}

/**
 * Check if an email is available.
 * @param email - The email address to check.
 * @returns True if the email is available, false otherwise.
 */
export async function checkEmailAvailability(email: string): Promise<boolean> {
  const { data } = await usersLayout.find({
    query: { email: `==${email}` },
    ignoreEmptyResult: true,
  });
  return data.length === 0;
}

/**
 * Get the contact ID for a web enabled contact.
 * @param email - The email address of the contact.
 * @returns The contact ID.
 */
export async function getIsContactWebEnabled(email: string): Promise<{
  contactIDs: string[];
  isWebEnabled: boolean;
}> {
  const { data } = await ContactsLayout.find({
    query: { Email1: `==${email}` },
  });
  if (data.length === 0) {
    return {
      contactIDs: [],
      isWebEnabled: false,
    };
  } else if (data.length > 1) {
    const enabled = data.filter((contact) => contact.fieldData.hasWebAccess);
    if (enabled.length === 0)
      return {
        contactIDs: data.map((contact) => contact.fieldData.__kpnID),
        isWebEnabled: false,
      };
    else
      return {
        contactIDs: enabled.map((contact) => contact.fieldData.__kpnID),
        isWebEnabled: true,
      };
  }

  return {
    contactIDs: [data[0].fieldData.__kpnID],
    isWebEnabled: data[0].fieldData.hasWebAccess,
  };
}

/**
 * Get the contact ID for a contact.
 * @param email - The email address of the contact.
 * @returns The contact ID.
 */
export async function getContactIDFromEmail(email: string): Promise<string> {
  const { data } = await ContactsLayout.find({
    query: { Email1: `==${email}` },
  });
  if (data.length === 0) throw new Error("Contact not found");
  else if (data.length > 1) throw new Error("Multiple contacts found");
  return data[0].fieldData.__kpnID;
}

/**
 * Update a user's phone number.
 * @param userId - The ID of the user to update.
 * @param phoneNumber - The new phone number.
 */
export async function updateUserPhoneNumber(
  userId: string,
  phoneNumber: string
): Promise<void> {
  const { recordId } = await fetchUser(userId);
  await usersLayout.update({
    recordId,
    fieldData: { phone_number_mfa: phoneNumber },
  });
}

/**
 * Update a user's preferences.
 * @param userId - The ID of the user to update.
 * @param preferences - The new preferences.
 */
export async function updateUserPreferences(
  userId: string,
  preferences: {
    language: "en" | "es";
  }
): Promise<void> {
  const { recordId } = await fetchUser(userId);
  await usersLayout.update({
    recordId,
    fieldData: { preferredLanguage: preferences.language },
  });
}

export async function getPendingUserId(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("pending_user_id")?.value;
}

export async function deletePendingUserId() {
  const cookieStore = await cookies();
  cookieStore.delete("pending_user_id");
}

export async function setPendingUserId(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set("pending_user_id", userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  });
}

export async function getPendingPhoneNumber(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("pending_phone_number")?.value;
}

export async function deletePendingPhoneNumber() {
  const cookieStore = await cookies();
  cookieStore.delete("pending_phone_number");
}

export async function setPendingPhoneNumber(phoneNumber: string) {
  const cookieStore = await cookies();
  cookieStore.set("pending_phone_number", phoneNumber, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  });
}