import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") || "范遥的博客";
  const excerpt = searchParams.get("excerpt") || "";
  const category = searchParams.get("category") || "";
  const date = searchParams.get("date") || "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "0",
          fontFamily: "sans-serif",
        }}
      >
        {/* Main card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            margin: "40px",
            padding: "50px",
            borderRadius: "20px",
            background: "rgba(255, 255, 255, 0.95)",
            flex: 1,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          }}
        >
          {/* Top: category & date */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            {category && (
              <div
                style={{
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  color: "white",
                  padding: "6px 18px",
                  borderRadius: "20px",
                  fontSize: "22px",
                  fontWeight: 600,
                }}
              >
                {category}
              </div>
            )}
            {date && (
              <div style={{ color: "#94a3b8", fontSize: "22px" }}>{date}</div>
            )}
          </div>

          {/* Middle: title & excerpt */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div
              style={{
                fontSize: title.length > 20 ? "48px" : "56px",
                fontWeight: 800,
                color: "#1e293b",
                lineHeight: 1.3,
                letterSpacing: "-0.02em",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {title}
            </div>
            {excerpt && (
              <div
                style={{
                  fontSize: "24px",
                  color: "#64748b",
                  lineHeight: 1.5,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {excerpt}
              </div>
            )}
          </div>

          {/* Bottom: author info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "22px",
                  fontWeight: 700,
                }}
              >
                范
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{ fontSize: "22px", fontWeight: 700, color: "#1e293b" }}
                >
                  范遥
                </div>
                <div style={{ fontSize: "16px", color: "#94a3b8" }}>
                  小胖和小臭的空间
                </div>
              </div>
            </div>
            <div
              style={{
                fontSize: "18px",
                color: "#94a3b8",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
              fanyao.com
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
