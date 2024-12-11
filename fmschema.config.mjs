/** @type {import("@proofgeist/fmdapi/dist/utils/typegen/types.d.ts").GenerateSchemaOptions} */
export const config = {
  clientSuffix: "Layout",
  schemas: [
    { layout: "Bookings", schemaName: "Bookings", valueLists: "allowEmpty" },
  ],
  clearOldFiles: true,
  path: "./src/config/schemas/filemaker",
};
