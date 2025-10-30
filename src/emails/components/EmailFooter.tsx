import { Text, Link } from "@react-email/components";
import { emailStyles } from "../styles";
import { env } from "@/config/env";

const BASE_URL =
  env.NODE_ENV === "production" ? "https://www.mygmt.com" : "http://localhost:3000";

interface EmailFooterProps {
  unsubscribeToken?: string;
  customText?: React.ReactNode;
}

export function EmailFooter({ unsubscribeToken, customText }: EmailFooterProps) {
  const tableStyles = {
    link: {
      color: "#171796",
      textDecoration: "none",
    },
  };

  return (
    <td
      style={{
        padding: "20px 40px",
        verticalAlign: "bottom",
        borderTop: "1px solid #eee",
        textAlign: "center",
      }}
    >
      <Text
        style={{
          ...emailStyles.paragraph,
          fontSize: "12px",
          color: "#888",
          padding: "0",
        }}
      >
        {customText ? (
          customText
        ) : unsubscribeToken ? (
          <>
            Don&apos;t want to receive these daily reports?{" "}
            <Link
              href={`${BASE_URL}/api/reports/unsubscribe?token=${unsubscribeToken}`}
              style={tableStyles.link}
            >
              Unsubscribe
            </Link>
          </>
        ) : (
          <>
            Questions? Visit{" "}
            <Link href={BASE_URL} style={tableStyles.link}>
              MyGMT.com
            </Link>{" "}
            or contact us.
          </>
        )}
      </Text>
    </td>
  );
}

