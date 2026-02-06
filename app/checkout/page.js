"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

const SEVERITY_COLORS = { critical: "#ff0040", high: "#ff4444", medium: "#ffa500", low: "#4ecdc4" };
const VULN_INFO = {
  sqli: { name: "SQL Injection", price: "149", severity: "critical", icon: "\ud83d\udc89" },
  xss: { name: "Cross-Site Scripting", price: "99", severity: "high", icon: "\ud83d\udd34" },
  csrf: { name: "CSRF Protection", price: "49", severity: "medium", icon: "\ud83d\udd04" },
  header_sec: { name: "Security Headers", price: "49", severity: "medium", icon: "\ud83d\udee1\ufe0f" },
  rce: { name: "Remote Code Execution", price: "149", severity: "critical", icon: "\ud83d\udc80" },
  auth_bypass: { name: "Auth Bypass", price: "149", severity: "critical", icon: "\ud83d\udeaa" },
  ssrf: { name: "SSRF Protection", price: "99", severity: "high", icon: "\ud83c\udf10" },
  lfi: { name: "Local File Inclusion", price: "99", severity: "high", icon: "\ud83d\udcc1" },
  idor: { name: "IDOR Protection", price: "99", severity: "high", icon: "\ud83d\udd13" },
  info_leak: { name: "Information Leak", price: "19", severity: "low", icon: "\ud83d\udccb" },
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const sessionId = searchParams.get("session");
  const vulnType = searchParams.get("type");
  const target = searchParams.get("target");
  const isBundle = !vulnType || vulnType === "bundle";
  const types = (searchParams.get("types") || "").split(",").filter(Boolean);
  const info = VULN_INFO[vulnType];

  async function handleCheckout() {
    setLoading(true); setError(null);
    try {
      const body = isBundle ? { vulnType: "bundle", sessionId, target, types } : { vulnType, sessionId, target };
      const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (data.url) window.location.href = data.url;
    } catch (err) { setError(err.message); setLoading(false); }
  }

  return (
    <div style={{ maxWidth: 520, width: "100%", background: "#161b22", borderRadius: 16, border: "1px solid #30363d", padding: 40, textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>{"\ud83d\udee1\ufe0f"}</div>
      <h1 style={{ fontSize: 24, fontWeight: 800, background: "linear-gradient(135deg,#58a6ff,#bc8cff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 8 }}>CyberAI Fix</h1>
      <p style={{ color: "#8b949e", marginBottom: 24 }}>Correction professionnelle de vulnerabilite</p>
      {target && <div style={{ background: "#0d1117", borderRadius: 8, padding: "10px 16px", marginBottom: 20, fontSize: 14, color: "#58a6ff" }}>Cible : <strong>{target}</strong></div>}
      {!isBundle && info && (
        <div style={{ background: "#0d1117", borderRadius: 12, padding: 24, marginBottom: 24, borderLeft: "4px solid " + SEVERITY_COLORS[info.severity], textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><span style={{ fontSize: 24, marginRight: 10 }}>{info.icon}</span><strong style={{ fontSize: 16 }}>{info.name}</strong></div>
            <span style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: SEVERITY_COLORS[info.severity] + "22", color: SEVERITY_COLORS[info.severity] }}>{info.severity.toUpperCase()}</span>
          </div>
          <div style={{ marginTop: 16, fontSize: 32, fontWeight: 800, color: "#f0f6fc" }}>{info.price} EUR</div>
          <p style={{ color: "#8b949e", fontSize: 13, marginTop: 8 }}>Code de correction complet + documentation + support</p>
        </div>
      )}
      {isBundle && types.length > 0 && (
        <div style={{ background: "#0d1117", borderRadius: 12, padding: 24, marginBottom: 24, border: "1px solid #8957e5", textAlign: "left" }}>
          <h3 style={{ color: "#bc8cff", marginBottom: 12 }}>Pack Complet</h3>
          {types.map(t => { const i = VULN_INFO[t]; return i ? <div key={t} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #21262d" }}><span>{i.icon} {i.name}</span><span style={{ color: "#8b949e" }}>{i.price} EUR</span></div> : null; })}
          <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#2ea043", fontWeight: 700 }}>{types.length >= 3 ? "-20%" : types.length >= 2 ? "-10%" : ""}</span>
            <span style={{ fontSize: 28, fontWeight: 800, color: "#f0f6fc" }}>{Math.round(types.reduce((s, t) => s + parseInt(VULN_INFO[t]?.price || 0), 0) * (types.length >= 3 ? 0.8 : types.length >= 2 ? 0.9 : 1))} EUR</span>
          </div>
        </div>
      )}
      {error && <div style={{ background: "rgba(248,81,73,0.1)", border: "1px solid #f85149", borderRadius: 8, padding: 12, marginBottom: 16, color: "#f85149", fontSize: 14 }}>Erreur: {error}</div>}
      <button onClick={handleCheckout} disabled={loading} style={{ width: "100%", padding: "16px 32px", borderRadius: 10, border: "none", fontWeight: 700, fontSize: 16, cursor: loading ? "wait" : "pointer", background: loading ? "#21262d" : "linear-gradient(135deg,#238636,#2ea043)", color: "#fff" }}>
        {loading ? "Redirection vers Stripe..." : "Payer de maniere securisee"}
      </button>
      <div style={{ marginTop: 20, color: "#484f58", fontSize: 12 }}>
        <div>Paiement securise par Stripe</div>
        <div>Vos donnees bancaires ne transitent jamais par nos serveurs</div>
        <div>Correction livree par email apres paiement</div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0c10,#131720,#0d1117)", color: "#c9d1d9", fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <Suspense fallback={<div style={{ color: "#8b949e" }}>Chargement...</div>}>
        <CheckoutContent />
      </Suspense>
    </div>
  );
}
