// components/PriceChart.jsx
// Horizontal bar chart comparing platform totals.
import { ACCENT } from "./PlatformCard.jsx";

export default function PriceChart({ platforms, cheapestId }) {
  const sorted = [...platforms].sort((a, b) => a.total - b.total);
  const max    = Math.max(...sorted.map(p => p.total));

  return (
    <div style={{
      background:   "var(--bg)",
      border:       "1px solid var(--border)",
      borderRadius: "var(--radius-md)",
      padding:      "16px 20px",
      marginBottom: "1rem",
    }}>
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".07em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 14 }}>
        Price comparison
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sorted.map(p => {
          const ac     = ACCENT[p.id] || { border: "#888", text: "#333" };
          const cheap  = p.id === cheapestId;
          const widthPct = Math.round((p.total / max) * 100);

          return (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* Label */}
              <div style={{ width: 78, fontSize: 13, color: cheap ? ac.text : "var(--text-2)", textAlign: "right", flexShrink: 0, fontWeight: cheap ? 500 : 400 }}>
                {p.name}
              </div>

              {/* Bar track */}
              <div style={{ flex: 1, height: 28, background: "var(--bg-3)", borderRadius: 4, overflow: "hidden" }}>
                <div
                  className="animate-bar"
                  style={{
                    width:        `${widthPct}%`,
                    height:       "100%",
                    background:   cheap ? ac.border : "var(--border-md)",
                    borderRadius: 4,
                    transition:   "width .6s cubic-bezier(.4,0,.2,1)",
                  }}
                />
              </div>

              {/* Value */}
              <div style={{
                width:       62,
                fontSize:    13,
                fontWeight:  600,
                textAlign:   "right",
                flexShrink:  0,
                color:       cheap ? ac.text : "var(--text-1)",
                fontFamily:  "var(--font-mono)",
              }}>
                ₹{p.total.toLocaleString("en-IN")}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
