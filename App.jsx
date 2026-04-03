// App.jsx — SmartPriceCompare
// Orchestrates: URL input → /api/extract → AI normalise → /api/compare → results

import { useState, useRef } from "react";
import { extractItem, comparePrices } from "./utils/api.js";
import { normalizeItemName }           from "./utils/claudeApi.js";
import LoadingSteps                    from "./components/LoadingSteps.jsx";
import PlatformCard                    from "./components/PlatformCard.jsx";
import PriceChart                      from "./components/PriceChart.jsx";
import {
  IconSearch, IconLink, IconAlert, IconTag, IconStar, Spinner,
} from "./components/Icons.jsx";

// ── Example links shown below the input ──────────────────────────────────────
const EXAMPLES = [
  { label: "Food",    url: "https://www.swiggy.com/restaurant/butter-chicken-masala-biryani-menu/123456"  },
  { label: "Grocery", url: "https://blinkit.com/prn/india-gate-basmati-rice-5kg/prid/78901"               },
  { label: "Ride",    url: "https://www.olacabs.com/book-cab-bangalore-to-airport-terminal-2"              },
  { label: "Product", url: "https://www.amazon.in/dp/B09G3HHH7S/noise-smartwatch-colorfitpro"             },
];

const TYPE_LABEL = { food: "Food & Grocery", ride: "Ride Booking", product: "Product" };

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── Styles shared across sub-sections ────────────────────────────────────────
const card = {
  background:   "var(--bg)",
  border:       "1px solid var(--border)",
  borderRadius: "var(--radius-md)",
  padding:      "20px 24px",
  marginBottom: "1rem",
};

const sectionLabel = {
  fontSize:      11,
  fontWeight:    600,
  letterSpacing: ".07em",
  textTransform: "uppercase",
  color:         "var(--text-3)",
  marginBottom:  12,
};

// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [url,     setUrl]     = useState("");
  const [loading, setLoading] = useState(false);
  const [step,    setStep]    = useState("");   // "extracting" | "normalizing" | "comparing"
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState("");
  const inputRef              = useRef(null);

  // ── Core flow ──────────────────────────────────────────────────────────────
  const handleCompare = async () => {
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Please paste a product or food link to compare prices.");
      inputRef.current?.focus();
      return;
    }

    setError("");
    setResult(null);
    setLoading(true);

    try {
      // Step 1 — Extract raw info from URL via backend
      setStep("extracting");
      await sleep(400);
      const { rawName, type, basePrice } = await extractItem(trimmed);

      // Step 2 — AI normalisation via Claude API (client-side)
      setStep("normalizing");
      const itemName = await normalizeItemName(rawName, trimmed);

      // Step 3 — Compare prices across platforms via backend
      setStep("comparing");
      await sleep(300);
      const { platforms, cheapestId, maxSavings } = await comparePrices(itemName, type, basePrice);

      setResult({ itemName, type, basePrice, platforms, cheapestId, maxSavings });
    } catch (err) {
      setError(err.message || "Something went wrong. Please check the URL and try again.");
    } finally {
      setLoading(false);
      setStep("");
    }
  };

  const handleKeyDown = e => {
    if (e.key === "Enter") handleCompare();
  };

  const handleExampleClick = (exUrl) => {
    setUrl(exUrl);
    setError("");
    setResult(null);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{
      maxWidth:  740,
      margin:    "0 auto",
      padding:   "clamp(1.5rem, 5vw, 3rem) 1rem 3rem",
      fontFamily: "var(--font-main)",
    }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: "var(--text-1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--bg)", flexShrink: 0,
          }}>
            <IconTag size={16} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-.04em", margin: 0 }}>
            SmartPriceCompare
          </h1>
        </div>
        <p style={{ fontSize: 14, color: "var(--text-2)", paddingLeft: 44, lineHeight: 1.5 }}>
          Paste any food, grocery, ride or product link to compare prices across
          Swiggy, Zomato, Blinkit, Zepto, Ola, Uber, Amazon, Flipkart and more.
        </p>
      </header>

      {/* ── Input card ─────────────────────────────────────────────────────── */}
      <div style={card}>
        <p style={sectionLabel}>Product or food link</p>

        {/* URL input + button row */}
        <div style={{ display: "flex", gap: 10, alignItems: "stretch", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200, position: "relative", display: "flex", alignItems: "center" }}>
            <span style={{ position: "absolute", left: 12, color: "var(--text-3)", pointerEvents: "none", display: "flex", alignItems: "center" }}>
              <IconLink size={15} />
            </span>
            <input
              ref={inputRef}
              value={url}
              onChange={e => { setUrl(e.target.value); setError(""); }}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="https://www.swiggy.com/... or any product URL"
              style={{
                width:        "100%",
                padding:      "11px 14px 11px 36px",
                fontSize:     14,
                background:   "var(--bg-2)",
                border:       "1px solid var(--border-md)",
                borderRadius: "var(--radius-sm)",
                color:        "var(--text-1)",
                outline:      "none",
                fontFamily:   "var(--font-main)",
                transition:   "border-color .15s",
              }}
              onFocus={e  => (e.target.style.borderColor = "var(--text-2)")}
              onBlur={e   => (e.target.style.borderColor = "var(--border-md)")}
            />
          </div>

          <button
            onClick={handleCompare}
            disabled={loading}
            style={{
              display:      "flex",
              alignItems:   "center",
              gap:          8,
              padding:      "11px 22px",
              background:   loading ? "var(--bg-3)" : "var(--text-1)",
              color:        loading ? "var(--text-3)" : "var(--bg)",
              border:       "none",
              borderRadius: "var(--radius-sm)",
              fontSize:     14,
              fontWeight:   600,
              cursor:       loading ? "not-allowed" : "pointer",
              whiteSpace:   "nowrap",
              transition:   "opacity .15s, background .15s",
              fontFamily:   "var(--font-main)",
            }}
          >
            {loading ? <Spinner size={15} /> : <IconSearch size={15} />}
            {loading ? "Comparing…" : "Compare Prices"}
          </button>
        </div>

        {/* Example quick-fill buttons */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
          <span style={{ fontSize: 12, color: "var(--text-3)", alignSelf: "center", marginRight: 2 }}>Try:</span>
          {EXAMPLES.map(ex => (
            <button
              key={ex.label}
              onClick={() => handleExampleClick(ex.url)}
              disabled={loading}
              style={{
                background:   "var(--bg-3)",
                border:       "1px solid var(--border)",
                borderRadius: 99,
                padding:      "3px 12px",
                fontSize:     12,
                color:        "var(--text-2)",
                cursor:       "pointer",
                fontFamily:   "var(--font-main)",
                transition:   "background .12s",
              }}
              onMouseEnter={e => (e.target.style.background = "var(--bg-2)")}
              onMouseLeave={e => (e.target.style.background = "var(--bg-3)")}
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Error banner ───────────────────────────────────────────────────── */}
      {error && (
        <div
          className="animate-fade-up"
          style={{
            display:      "flex",
            alignItems:   "center",
            gap:          8,
            background:   "var(--red-bg)",
            border:       "1px solid var(--red)",
            borderRadius: "var(--radius-sm)",
            color:        "var(--red)",
            padding:      "10px 14px",
            fontSize:     14,
            marginBottom: "1rem",
          }}
        >
          <IconAlert size={15} />
          {error}
        </div>
      )}

      {/* ── Loading steps ──────────────────────────────────────────────────── */}
      {loading && <LoadingSteps activeStep={step} />}

      {/* ── Results ────────────────────────────────────────────────────────── */}
      {result && (
        <div className="animate-fade-up">

          {/* Item summary row */}
          <div style={{
            ...card,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            flexWrap:       "wrap",
            gap:            12,
          }}>
            <div>
              <p style={sectionLabel}>Detected item</p>
              <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-.03em", margin: 0 }}>
                {result.itemName}
              </h2>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Badge text={TYPE_LABEL[result.type]} />
              <Badge text={`Base ~₹${result.basePrice}`} mono />
            </div>
          </div>

          {/* Cheapest platform highlight */}
          <CheapestBanner
            platforms={result.platforms}
            cheapestId={result.cheapestId}
            maxSavings={result.maxSavings}
          />

          {/* Platform cards grid */}
          <div style={{
            display:               "grid",
            gridTemplateColumns:   "repeat(auto-fill, minmax(160px, 1fr))",
            gap:                   12,
            marginBottom:          "1rem",
          }}>
            {[...result.platforms]
              .sort((a, b) => a.total - b.total)
              .map(p => (
                <PlatformCard
                  key={p.id}
                  platform={p}
                  isCheapest={p.id === result.cheapestId}
                />
              ))}
          </div>

          {/* Bar chart */}
          <PriceChart platforms={result.platforms} cheapestId={result.cheapestId} />

          {/* Savings summary row */}
          <SavingsSummary platforms={result.platforms} cheapestId={result.cheapestId} />

          {/* Disclaimer */}
          <p style={{ fontSize: 12, color: "var(--text-3)", textAlign: "center", marginTop: "1.5rem", lineHeight: 1.6 }}>
            Prices are simulated for demonstration purposes. Real-time data
            requires live partner API integration (see backend comments).
          </p>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Badge({ text, mono = false }) {
  return (
    <span style={{
      background:   "var(--bg-2)",
      border:       "1px solid var(--border)",
      borderRadius: 99,
      padding:      "4px 12px",
      fontSize:     12,
      fontWeight:   500,
      color:        "var(--text-2)",
      fontFamily:   mono ? "var(--font-mono)" : "var(--font-main)",
      whiteSpace:   "nowrap",
    }}>
      {text}
    </span>
  );
}

function CheapestBanner({ platforms, cheapestId, maxSavings }) {
  const cheap = platforms.find(p => p.id === cheapestId);
  if (!cheap) return null;

  const ACCENT_MAP = {
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

  const ac = ACCENT_MAP[cheap.id] || { bg: "var(--green-bg)", border: "var(--green)", text: "var(--green)" };

  return (
    <div style={{
      background:   ac.bg,
      border:       `1px solid ${ac.border}55`,
      borderRadius: "var(--radius-sm)",
      padding:      "12px 16px",
      marginBottom: "1rem",
      display:      "flex",
      alignItems:   "center",
      gap:          10,
      flexWrap:     "wrap",
    }}>
      <IconStar size={12} style={{ color: ac.text, flexShrink: 0 }} />
      <span style={{ color: ac.text, fontWeight: 600, fontSize: 14 }}>
        Best price on {cheap.name}
      </span>
      <span style={{ color: ac.text, fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 17, letterSpacing: "-.03em" }}>
        ₹{cheap.total.toLocaleString("en-IN")}
      </span>
      {maxSavings > 0 && (
        <span style={{ marginLeft: "auto", color: ac.text, opacity: .75, fontSize: 13 }}>
          Save up to ₹{maxSavings.toLocaleString("en-IN")} vs most expensive
        </span>
      )}
    </div>
  );
}

function SavingsSummary({ platforms, cheapestId }) {
  const cheapest    = platforms.find(p => p.id === cheapestId);
  const mostExpensive = [...platforms].sort((a, b) => b.total - a.total)[0];
  if (!cheapest || cheapest.id === mostExpensive.id) return null;

  const saving = mostExpensive.total - cheapest.total;
  const pct    = Math.round((saving / mostExpensive.total) * 100);

  return (
    <div style={{
      display:             "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
      gap:                 10,
      marginBottom:        "1rem",
    }}>
      {[
        { label: "Cheapest platform",  value: cheapest.name,               sub: `₹${cheapest.total}` },
        { label: "Most expensive",     value: mostExpensive.name,           sub: `₹${mostExpensive.total}` },
        { label: "Max savings",        value: `₹${saving.toLocaleString("en-IN")}`, sub: `${pct}% cheaper` },
      ].map(stat => (
        <div key={stat.label} style={{
          background:   "var(--bg-2)",
          borderRadius: "var(--radius-sm)",
          padding:      "12px 16px",
        }}>
          <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 4 }}>
            {stat.label}
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-.02em", color: "var(--text-1)" }}>
            {stat.value}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 2 }}>
            {stat.sub}
          </div>
        </div>
      ))}
    </div>
  );
}
