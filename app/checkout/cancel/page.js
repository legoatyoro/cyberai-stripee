"use client";

export default function CancelPage() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0c10,#131720,#0d1117)", color: "#c9d1d9", fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ maxWidth: 520, width: "100%", background: "#161b22", borderRadius: 16, border: "1px solid #d29922", padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>{"\u21a9\ufe0f"}</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#d29922", marginBottom: 8 }}>Paiement annule</h1>
        <p style={{ color: "#8b949e", fontSize: 16, marginBottom: 24 }}>Pas de souci ! Aucun montant n a ete debite.</p>
        <div style={{ background: "#0d1117", borderRadius: 12, padding: 24, marginBottom: 24, textAlign: "left" }}>
          <h3 style={{ color: "#58a6ff", marginBottom: 12 }}>Vos vulnerabilites restent ouvertes</h3>
          <p style={{ color: "#8b949e", fontSize: 14, lineHeight: 1.6 }}>Les failles detectees sur votre site sont toujours exploitables. Vous pouvez revenir a tout moment pour les corriger.</p>
        </div>
        <button onClick={() => window.history.back()} style={{ width: "100%", padding: "14px 32px", borderRadius: 10, border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer", background: "linear-gradient(135deg,#6f42c1,#8957e5)", color: "#fff" }}>Retour aux corrections</button>
      </div>
    </div>
  );
}
