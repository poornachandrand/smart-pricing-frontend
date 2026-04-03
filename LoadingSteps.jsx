// components/LoadingSteps.jsx
import { IconCheck, Spinner } from "./Icons.jsx";

const STEPS = [
  { id: "extracting",  label: "Extracting item from URL…"       },
  { id: "normalizing", label: "AI is cleaning the item name…"   },
  { id: "comparing",   label: "Fetching platform prices…"       },
];

export default function LoadingSteps({ activeStep }) {
  const activeIdx = STEPS.findIndex(s => s.id === activeStep);

  return (
    <div style={{
      background:    "var(--bg)",
      border:        "1px solid var(--border)",
      borderRadius:  "var(--radius-md)",
      padding:       "20px 24px",
      marginBottom:  "1rem",
    }} className="animate-fade-up">
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".07em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 16 }}>
        Processing
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {STEPS.map((step, i) => {
          const done   = i < activeIdx;
          const active = i === activeIdx;
          const future = i > activeIdx;

          return (
            <div key={step.id} style={{ display: "flex", alignItems: "center", gap: 12, opacity: future ? 0.3 : 1, transition: "opacity .25s" }}>
              {/* Step indicator */}
              <div style={{
                width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: done   ? "var(--green)"   :
                            active ? "var(--text-1)"  : "var(--bg-3)",
                border: done || active ? "none" : "1px solid var(--border-md)",
                color:  done || active ? "var(--bg)"  : "var(--text-3)",
                transition: "background .25s, color .25s",
              }}>
                {done   ? <IconCheck size={12} /> :
                 active ? <Spinner   size={13} /> :
                 <span style={{ fontSize: 11, fontWeight: 600 }}>{i + 1}</span>}
              </div>

              {/* Label */}
              <span style={{
                fontSize: 14,
                fontWeight: active ? 500 : 400,
                color: active ? "var(--text-1)" : "var(--text-2)",
                transition: "color .2s",
              }} className={active ? "animate-pulse" : ""}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
