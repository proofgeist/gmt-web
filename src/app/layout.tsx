import { theme } from "@/config/theme/mantine-theme";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "mantine-react-table/styles.css";
import "@/config/theme/globals.css";
import "@mantine/carousel/styles.css";
import { type Metadata } from "next";
import QueryProvider from "@/config/query-provider";
import { Analytics } from "@vercel/analytics/next";
export const metadata: Metadata = {
  title: "Global Marine Transportation",
  description:
    "Your trusted Shipping PartnerFor a Connected World Superior customer service and the most competitive shipping rates.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <QueryProvider>
          <MantineProvider defaultColorScheme="light" theme={theme}>
            <Notifications />
            <ModalsProvider>{children}</ModalsProvider>
          </MantineProvider>
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
