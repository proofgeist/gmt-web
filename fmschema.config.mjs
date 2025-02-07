/** @type {import("@proofgeist/fmdapi/dist/utils/typegen/types.d.ts").GenerateSchemaOptions} */
export const config = [
  {
    clientSuffix: "Layout",
    schemas: [
      {
        layout: "api.Bookings",
        schemaName: "Bookings",
        valueLists: "allowEmpty",
      },
      {
        layout: "api.Contacts",
        schemaName: "Contacts",
        valueLists: "allowEmpty",
      },
      {
        layout: "api.Inquiries",
        schemaName: "Inquiries",
        valueLists: "allowEmpty",
      },
    ],
    clearOldFiles: true,
    path: "./src/config/schemas/filemaker",
  },
  {
    clientSuffix: "Layout",
    schemas: [
      {
        layout: "proofkit_auth_sessions",
        schemaName: "sessions",
        strictNumbers: true,
      },
      {
        layout: "proofkit_auth_users",
        schemaName: "users",
        strictNumbers: true,
      },
      {
        layout: "proofkit_auth_email_verification",
        schemaName: "emailVerification",
        strictNumbers: true,
      },
      {
        layout: "proofkit_auth_password_reset",
        schemaName: "passwordReset",
        strictNumbers: true,
      },
    ],
    clearOldFiles: true,
    useZod: false,
    path: "./src/server/auth/db",
  },
];
