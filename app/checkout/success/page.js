"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const stripeSessionId = searchParams.get("session_id");
  return (
    <div style={{ maxWidth: 520, width: "100%", background: "#161b22", borderRadius: 16, border: "1px solid #238636", padding: 40, textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>OK</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: "#2ea043", marginBottom: 8 }}>Paiement reussi !</h1>
      <p style={{ color: "#8b949e", fontSize: 16, marginBottom: 24 }}>Merci pour votre confiance. Votre correction est en cours de preparation.</p>
      <div style={{ background: "#0d1117", borderRadius: 12, padding: 24, marginBottom: 24, textAlign: "left" }}>
        <h3 style={{ color: "#58a6ff", marginBottom: 12 }}>Prochaines etapes</h3>
        <div style={{ color: "#c9d1d9", lineHeight: 2, fontSize: 14 }}>
          <div>1. Notre equipe analyse votre rapport de scan</div>
          <div>2. Code de correction personnalise genere</div>
          <div>3. Livraison par email sous 24h</div>
          <div>4. Support inclus pour l implementation</div>
        </div>
      </div>
      {stripeSessionId && <div style={{ background: "#0d1117", borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 12, color: "#484f58" }}>Reference : {stripeSessionId.substring(0, 20)}...</div>}
      <p style={{ color: "#484f58", fontSize: 13 }}>Un email de confirmation a ete envoye.</p>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0c10,#131720,#0d1117)", color: "#c9d1d9", fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <Suspense fallback={<div style={{ color: "#8b949e" }}>Chargement...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
