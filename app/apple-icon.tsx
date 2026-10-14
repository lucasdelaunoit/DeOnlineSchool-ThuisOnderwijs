import { ImageResponse } from "next/og";

// Home screen icon: the mark of app/icon.svg on a full square (iOS rounds the corners).

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  // app/icon.svg is drawn on a 64 grid.
  const u = (n: number) => (n * 180) / 64;
  return new ImageResponse(
    (
      <div style={{ position: "relative", display: "flex", width: "100%", height: "100%", background: "#1f3a31" }}>
        <div
          style={{ position: "absolute", left: u(15), top: u(15), width: u(34), height: u(9), borderRadius: u(4.5), background: "#fff" }}
        />
        <div
          style={{ position: "absolute", left: u(27.5), top: u(15), width: u(9), height: u(34), borderRadius: u(4.5), background: "#fff" }}
        />
        <div
          style={{ position: "absolute", left: u(40.5), top: u(40), width: u(9), height: u(9), borderRadius: "50%", background: "#9fcab6" }}
        />
      </div>
    ),
    size,
  );
}
