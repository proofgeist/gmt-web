import { Container, Body, Html, Head } from "@react-email/components";
import { emailStyles } from "../styles";
import { EmailHeader } from "./EmailHeader";
import { EmailFooter } from "./EmailFooter";

interface EmailLayoutProps {
  children: React.ReactNode;
  unsubscribeToken?: string;
  footerCustomText?: React.ReactNode;
  fullHeight?: boolean;
}

export function EmailLayout({
  children,
  unsubscribeToken,
  footerCustomText,
  fullHeight = true,
}: EmailLayoutProps) {
  if (fullHeight) {
    return (
      <Html>
        <Head />
        <Body style={emailStyles.main}>
          <Container style={emailStyles.container}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                height: "100%",
              }}
              cellPadding="0"
              cellSpacing="0"
            >
              <tbody>
                <tr>
                  <td
                    style={{
                      padding: "0",
                      verticalAlign: "top",
                    }}
                  >
                    <EmailHeader />
                    <div style={{ padding: "0 40px 40px 40px" }}>
                      {children}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      height: "100px",
                      lineHeight: "100px",
                      fontSize: "1px",
                    }}
                  >
                    &nbsp;
                  </td>
                </tr>
                <tr>
                  <EmailFooter
                    unsubscribeToken={unsubscribeToken}
                    customText={footerCustomText}
                  />
                </tr>
              </tbody>
            </table>
          </Container>
        </Body>
      </Html>
    );
  }

  // Simple layout without full-height table structure
  return (
    <Html>
      <Head />
      <Body style={emailStyles.main}>
        <Container style={emailStyles.container}>
          <EmailHeader />
          <div style={{ padding: "0 40px 40px 40px" }}>
            {children}
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <EmailFooter
                  unsubscribeToken={unsubscribeToken}
                  customText={footerCustomText}
                />
              </tr>
            </tbody>
          </table>
        </Container>
      </Body>
    </Html>
  );
}

