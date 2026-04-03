// components/PlatformCard.jsx
import { IconStar } from "./Icons.jsx";

// Per-platform accent colours used for borders, badges, and text highlights
const ACCENT = {
  swiggy:   { bg: "#FFF3EE", border: "#FF5200", text: "#C73D00" },
  zomato:   { bg: "#FFF0F1", border: "#E23744", text: "#B01F2B" },
  blinkit:  { bg: "#FFFBEA", border: "#F8C900", text: "#9A7B00" },
  zepto:    { bg: "#F5EEFF", border: "#7B2FF7", text: "#5A17D6" },
  ola:      { bg: "#EDFAF3", border: "#00A651", text: "#006B34" },
  uber:     { bg: "#F2F2F0", border: "#444444", text: "#222222" },
  rapido:   { bg: "#FFFDE6", border: "#E6C000", text: "#8A7000" },
  namma:    { bg: "#EAF2FF", border: "#0066FF", text: "#003FA6" },
  amazon:   { bg: "#FFF8EE", border: "#FF9900", text: "#B36500" },
  flipkart: { bg: "#EEF4FF", border: "#2874F0", text: "#1556C4" },
  meesho:   { bg: "#F9EEFF", border: "#9B2FAA", text: "#721E80" },
  snapdeal: { bg: "#FFF0F3", border: "#E40046", text: "#AA0034" },
};

export default function PlatformCard({ platform, isCheapest }) {
  const ac = ACCENT[platform.id] || { bg: "#f5f5f5", border: "#888", text: "#333" };

  return (
    <div style={{
      background:   "var(--bg)",
      border:       isCheapest ? `2px solid ${ac.border}` : "1px solid var(--border)",
      borderRadius: "var(--radius-md)",
      padding:      "16px",
      position:     "relative",
      transition:   "border-color .2s, box-shadow .2s",
      boxShadow:    isCheapest ? `0 0 0 4px ${ac.border}18` : "none",
    }}>

      {/* Cheapest badge */}
      {isCheapest && (
        <div style={{
          position:     "absolute",
          top:          -11,
          right:        12,
          background:   ac.bg,
          color:        ac.text,
          border:       `1px solid ${ac.border}`,
          fontSize:     11,
          fontWeight:   600,
          padding:      "2px 10px",
          borderRadius: 99,
          display:      "flex",
          alignItems:   "center",
          gap:          4,
          letterSpacing: ".03em",
        }}>
          <IconStar size={10} /> Cheapest
        </div>
      )}

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: isCheapest ? ac.text : "var(--text-1)" }}>
            {platform.name}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>
            {platform.tagline}
          </div>
        </div>

        {/* Logo placeholder */}
        <div style={{
          width:        36,
          height:       36,
          borderRadius: 8,
          background:   ac.bg,
          border:       `1px solid ${ac.border}30`,
          display:      "flex",
          alignItems:   "center",
          justifyContent: "center",
          color:        ac.text,
          fontWeight:   700,
          fontSize:     12,
          letterSpacing: "-.02em",
          flexShrink:   0,
        }}>
          {platform.name.slice(0, 2).toUpperCase()}
        </div>
      </div>

      {/* Price */}
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
          <span style={{
            fontSize:    26,
            fontWeight:  600,
            letterSpacing: "-.04em",
            fontFamily:  "var(--font-mono)",
            color:       isCheapest ? ac.text : "var(--text-1)",
          }}>
            ₹{platform.total.toLocaleString("en-IN")}
          </span>
          {platform.discount > 0 && (
            <span style={{ fontSize: 12, color: "var(--green)", fontWeight: 500 }}>
              −₹{platform.discount} off
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 5, flexWrap: "wrap" }}>
          {platform.delivery > 0 && (
            <span style={{ fontSize: 11, color: "var(--text-2)" }}>
              + ₹{platform.delivery} delivery
            </span>
          )}
          <span style={{ fontSize: 11, color: "var(--text-3)" }}>
            item ₹{platform.price.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
}

export { ACCENT };
