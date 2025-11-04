import { Section, Img, Text } from "@react-email/components";
import { EMAIL_BASE_URL } from "../config";

export function EmailHeader() {
  return (
    <Section
      style={{
        marginBottom: "30px",
        textAlign: "left",
        backgroundColor: "#171796",
        padding: "12px 20px 12px 20px",
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
        borderBottomLeftRadius: "0",
        borderBottomRightRadius: "0",
      }}
    >
      <table
        style={{
          borderCollapse: "collapse",
          borderSpacing: "0",
        }}
      >
        <tbody>
          <tr>
            <td
              style={{
                verticalAlign: "top",
                padding: "2px",
                paddingRight: "6px",
              }}
            >
              <Img
                src={`${EMAIL_BASE_URL}/gmt-icon.png`}
                alt="GMT"
                width="45"
                height="32"
                style={{ display: "block", borderRadius: "4px" }}
              />
            </td>
            <td style={{ verticalAlign: "top", padding: "2px" }}>
              <Text
                style={{
                  fontFamily: "Arial Black, Arial, sans-serif",
                  fontSize: "20px",
                  fontWeight: "900",
                  lineHeight: "1",
                  margin: "0",
                  padding: "0",
                  color: "#fff",
                }}
              >
                Global Marine
              </Text>
              <Text
                style={{
                  fontFamily: "Arial Black, Arial, sans-serif",
                  fontSize: "8px",
                  fontWeight: "900",
                  lineHeight: "1",
                  margin: "0",
                  padding: "0",
                  marginTop: "1px",
                  color: "#fff",
                }}
              >
                TRANSPORTATION INC.
              </Text>
            </td>
          </tr>
        </tbody>
      </table>
    </Section>
  );
}

