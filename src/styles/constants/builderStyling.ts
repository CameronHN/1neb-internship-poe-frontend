import type { CSSProperties } from "react";

export const loadingContainerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  flexDirection: "column",
  gap: "16px",
};

export const errorContainerStyle: CSSProperties = {
  padding: "40px",
  textAlign: "center",
};

export const sectionStackStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

export const cardHeaderActionsStyle: CSSProperties = {
  display: "flex",
  gap: "8px",
};

export const cardPreviewStyle: CSSProperties = { padding: "16px" };

export const gridLayoutStyle = (gap: string): CSSProperties => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap,
});

export const stackLayoutStyle = (gap: string): CSSProperties => ({
  display: "flex",
  flexDirection: "column",
  gap,
});

export const itemRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "first baseline",
  gap: "4px",
};

export const borderedItemStyle: CSSProperties = {
  border: "1px solid #e1e1e1",
  borderRadius: "8px",
  padding: "12px",
};

export const itemHeadingStyle: CSSProperties = { fontWeight: "600" };

export const summaryTextStyle: CSSProperties = {
  fontSize: "13px",
  lineHeight: "1.4",
};

export const basicInfoGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: "12px",
  fontSize: "14px",
};

export const responsibilityListStyle: CSSProperties = {
  margin: 0,
  paddingLeft: "20px",
};

export const responsibilityItemStyle: CSSProperties = {
  marginBottom: "4px",
  fontSize: "12px",
  position: "relative",
};

export const responsibilityBulletStyle: CSSProperties = {
  position: "absolute",
  left: "-12px",
};

export const messageBarStyle: CSSProperties = {
  marginBottom: "24px",
  marginTop: "24px",
};

export const centeredSectionStyle: CSSProperties = {
  marginTop: "32px",
  textAlign: "center",
};

export const generateButtonStyle: CSSProperties = { padding: "12px 32px" };

export const saveNameContainerStyle: CSSProperties = {
  marginTop: "16px",
  maxWidth: "20vw",
  margin: "16px auto 0",
};
