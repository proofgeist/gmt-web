import type { CSSProperties } from "react";

export const emailStyles = {
  brandingMy: {
    fontFamily: "Yellowtail, cursive",
    fontSize: "24px",
    fontWeight: 400,
  },

  brandingGMT: {
    fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
    fontSize: "24px",
    fontWeight: 700,
  },

  brandingContainer: {
    textAlign: "center" as const,
    marginBottom: "20px",
  },
  main: {
    backgroundColor: "#ffffff",
    fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  },

  container: {
    backgroundColor: "#ffffff",
    border: "1px solid #eee",
    borderRadius: "5px",
    boxShadow: "0 5px 10px rgba(20,50,70,.2)",
    marginTop: "20px",
    maxWidth: "720px",
    margin: "0 auto",
    padding: "68px 0 68px",
  },

  logo: {
    margin: "0 auto",
  } as CSSProperties,

  tertiary: {
    color: "#171796",
    fontSize: "11px",
    fontWeight: 700,
    fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
    height: "16px",
    letterSpacing: "0",
    lineHeight: "16px",
    margin: "16px 8px 8px 8px",
    textTransform: "uppercase" as const,
    textAlign: "center" as const,
  },

  secondary: {
    color: "#000",
    fontFamily: "HelveticaNeue-Medium,Helvetica,Arial,sans-serif",
    fontSize: "20px",
    fontWeight: 500,
    lineHeight: "24px",
    marginBottom: "24px",
    marginTop: "0",
    textAlign: "center" as const,
    padding: "0 40px",
  },

  paragraph: {
    color: "#444",
    fontSize: "15px",
    fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
    letterSpacing: "0",
    lineHeight: "23px",
    padding: "0 40px",
    margin: "0",
    textAlign: "center" as const,
  },

  button: {
    backgroundColor: "#171796",
    borderRadius: "5px",
    color: "#fff",
    display: "inline-block",
    fontSize: "16px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center" as const,
    padding: "12px 24px",
    margin: "16px 0",
  },
};
