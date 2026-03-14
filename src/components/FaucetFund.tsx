import React, { useState } from "react";
import { fundFromFaucet } from "@/lib/stellar";

interface FaucetFundProps {
  publicKey: string;
  onSuccess: () => void;
}

export default function FaucetFund({ publicKey, onSuccess }: FaucetFundProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleFund = async () => {
    setLoading(true);
    setStatus("idle");
    try {
      const ok = await fundFromFaucet(publicKey);
      if (ok) {
        setStatus("success");
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="faucet-wrap">
      <p className="faucet-desc">
        Need testnet XLM? Request 10,000 XLM from Stellar Friendbot instantly.
      </p>

      {status === "success" && (
        <div className="status-success animate-fade-in">
          ✓ Account funded with 10,000 testnet XLM!
        </div>
      )}
      {status === "error" && (
        <div className="status-error animate-fade-in">
          ⚠ Faucet request failed. Account may already be funded.
        </div>
      )}

      <button
        className="btn-faucet"
        onClick={handleFund}
        disabled={loading || status === "success"}
      >
        {loading ? (
          <>
            <span className="spinner" />
            Requesting...
          </>
        ) : (
          <>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M7.5 1v8M4 6l3.5 3.5L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 11v1a1 1 0 001 1h9a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Fund from Friendbot
          </>
        )}
      </button>

      <style jsx>{`
        .faucet-wrap {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .faucet-desc {
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.6;
        }
        .status-success {
          background: var(--success-dim);
          border: 1px solid rgba(0,255,157,0.2);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 12px;
          color: var(--success);
        }
        .status-error {
          background: var(--error-dim);
          border: 1px solid rgba(255,77,109,0.2);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 12px;
          color: var(--error);
        }
        .btn-faucet {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: 1px solid var(--stellar-gold);
          border-radius: 8px;
          color: var(--stellar-gold);
          font-family: var(--font-mono);
          font-size: 13px;
          padding: 10px 16px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-faucet:hover:not(:disabled) {
          background: rgba(245,166,35,0.1);
          box-shadow: 0 0 16px rgba(245,166,35,0.2);
        }
        .btn-faucet:disabled { opacity: 0.5; cursor: not-allowed; }
        .spinner {
          width: 12px; height: 12px;
          border: 2px solid rgba(245,166,35,0.2);
          border-top-color: var(--stellar-gold);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
