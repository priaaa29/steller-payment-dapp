import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useWallet } from "@/hooks/useWallet";
import WalletPanel from "@/components/WalletPanel";
import SendPayment from "@/components/SendPayment";
import FaucetFund from "@/components/FaucetFund";
import RecentTransactions from "@/components/RecentTransactions";

type Tab = "send" | "faucet" | "history";

export default function Home() {
  const wallet = useWallet();
  const [activeTab, setActiveTab] = useState<Tab>("send");
  const [txRefresh, setTxRefresh] = useState(0);

  const handleTxSuccess = () => {
    wallet.refreshBalance();
    setTxRefresh((n) => n + 1);
  };

  return (
    <>
      <Head>
        <title>Stellar dApp — White Belt</title>
        <meta name="description" content="Stellar testnet payment dApp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='14' fill='%2300d4ff' opacity='.2'/><path d='M8 16l5 5 11-10' stroke='%2300d4ff' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>" />
      </Head>

      {/* Stars background */}
      <div className="stars" aria-hidden="true">
        {Array.from({ length: 60 }).map((_, i) => (
          <span
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      <div className="page">
        {/* Header */}
        <header className="header">
          <div className="logo">
            <div className="logo-mark">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="13" stroke="var(--accent)" strokeWidth="1.2" />
                <path d="M6 14l5.5 5.5L22 8.5" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div className="logo-name">STELLAR PAY</div>
              <div className="logo-tag">TESTNET · WHITE BELT</div>
            </div>
          </div>

          <div className="header-badge">
            <div className="badge-dot" />
            Stellar Testnet
          </div>
        </header>

        {/* Main content */}
        <main className="main">
          <div className="left-col">
            {/* Wallet card */}
            <section className="section">
              <div className="section-label">WALLET</div>
              <WalletPanel
                publicKey={wallet.publicKey}
                balance={wallet.balance}
                isConnecting={wallet.isConnecting}
                isLoadingBalance={wallet.isLoadingBalance}
                error={wallet.error}
                onConnect={wallet.connect}
                onDisconnect={wallet.disconnect}
                onRefreshBalance={wallet.refreshBalance}
              />
            </section>

            {/* Info panel */}
            <section className="section info-panel">
              <div className="info-row">
                <span className="info-label">NETWORK</span>
                <span className="info-value accent">Stellar Testnet</span>
              </div>
              <div className="info-row">
                <span className="info-label">HORIZON</span>
                <span className="info-value mono small">horizon-testnet.stellar.org</span>
              </div>
              <div className="info-row">
                <span className="info-label">ASSET</span>
                <span className="info-value">XLM (Lumens)</span>
              </div>
              <div className="info-row">
                <span className="info-label">WALLET</span>
                <span className="info-value">Freighter</span>
              </div>
            </section>
          </div>

          <div className="right-col">
            {wallet.publicKey ? (
              <section className="section action-section">
                {/* Tabs */}
                <div className="tabs">
                  {(["send", "faucet", "history"] as Tab[]).map((tab) => (
                    <button
                      key={tab}
                      className={`tab ${activeTab === tab ? "active" : ""}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab === "send" && (
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                          <path d="M1 6.5h11M7 1.5l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      {tab === "faucet" && (
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                          <path d="M6.5 1v6M4 5l2.5 2.5L9 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M1 9v1a1 1 0 001 1h9a1 1 0 001-1V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                      )}
                      {tab === "history" && (
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                          <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4" />
                          <path d="M6.5 4v2.5l2 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                      )}
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div className="tab-content">
                  {activeTab === "send" && (
                    <SendPayment
                      key="send"
                      publicKey={wallet.publicKey}
                      onSuccess={handleTxSuccess}
                    />
                  )}
                  {activeTab === "faucet" && (
                    <FaucetFund
                      key="faucet"
                      publicKey={wallet.publicKey}
                      onSuccess={handleTxSuccess}
                    />
                  )}
                  {activeTab === "history" && (
                    <RecentTransactions
                      key="history"
                      publicKey={wallet.publicKey}
                      refreshTrigger={txRefresh}
                    />
                  )}
                </div>
              </section>
            ) : (
              <section className="section empty-action">
                <div className="empty-illustration">
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="40" r="38" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 3" />
                    <circle cx="40" cy="40" r="25" stroke="var(--border-bright)" strokeWidth="1" strokeDasharray="3 2" />
                    <circle cx="40" cy="40" r="6" fill="var(--accent-dim)" stroke="var(--accent)" strokeWidth="1.5" />
                    {/* Orbit dots */}
                    <circle cx="78" cy="40" r="3" fill="var(--accent)" opacity="0.6" />
                    <circle cx="40" cy="2" r="2.5" fill="var(--stellar-gold)" opacity="0.5" />
                    <circle cx="2" cy="40" r="2" fill="var(--success)" opacity="0.4" />
                    <circle cx="40" cy="78" r="2" fill="var(--accent)" opacity="0.3" />
                  </svg>
                </div>
                <h2 className="empty-title">Connect Your Wallet</h2>
                <p className="empty-desc">
                  Connect your Freighter wallet to send XLM transactions on the Stellar testnet.
                </p>
                <ul className="feature-list">
                  <li><span className="check">✓</span> Send XLM to any address</li>
                  <li><span className="check">✓</span> View your live balance</li>
                  <li><span className="check">✓</span> Fund with testnet faucet</li>
                  <li><span className="check">✓</span> Track transaction history</li>
                </ul>
              </section>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="footer">
          <span>Built on Stellar · Testnet only · Not for real transactions</span>
          <a
            href="https://stellar.org/developers"
            target="_blank"
            rel="noopener noreferrer"
          >
            Stellar Docs →
          </a>
        </footer>
      </div>

      <style jsx>{`
        .stars {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          opacity: 0.3;
          animation: twinkle var(--dur, 3s) ease-in-out infinite;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.7; }
        }

        .page {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          max-width: 960px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 0;
          border-bottom: 1px solid var(--border);
          margin-bottom: 32px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .logo-name {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 800;
          color: var(--text);
          letter-spacing: 0.05em;
        }
        .logo-tag {
          font-size: 9px;
          letter-spacing: 0.15em;
          color: var(--text-dim);
          margin-top: 2px;
        }

        .header-badge {
          display: flex;
          align-items: center;
          gap: 7px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 6px 14px;
          font-size: 11px;
          color: var(--text-muted);
        }
        .badge-dot {
          width: 7px; height: 7px;
          background: var(--stellar-gold);
          border-radius: 50%;
          box-shadow: 0 0 6px var(--stellar-gold);
        }

        .main {
          flex: 1;
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 24px;
          align-items: start;
        }

        .left-col, .right-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .section-label {
          font-size: 9px;
          letter-spacing: 0.15em;
          color: var(--text-dim);
        }

        .info-panel {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px;
          gap: 8px;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 0;
          border-bottom: 1px solid rgba(26,47,80,0.6);
        }
        .info-row:last-child { border-bottom: none; }
        .info-label { font-size: 9px; letter-spacing: 0.1em; color: var(--text-dim); }
        .info-value { font-size: 11px; color: var(--text-muted); }
        .info-value.accent { color: var(--accent); }
        .info-value.mono { font-family: var(--font-mono); }
        .info-value.small { font-size: 10px; }

        .action-section {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
          gap: 20px;
          min-height: 400px;
        }

        .tabs {
          display: flex;
          gap: 4px;
          background: rgba(0,0,0,0.3);
          border-radius: 10px;
          padding: 4px;
        }
        .tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: none;
          border: none;
          border-radius: 7px;
          color: var(--text-dim);
          font-family: var(--font-mono);
          font-size: 12px;
          padding: 9px 12px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .tab:hover { color: var(--text-muted); }
        .tab.active {
          background: var(--bg-card-hover);
          color: var(--accent);
          border: 1px solid var(--border);
        }

        .tab-content { flex: 1; }

        /* Empty state */
        .empty-action {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 48px 32px;
          align-items: center;
          text-align: center;
          min-height: 400px;
          justify-content: center;
        }
        .empty-illustration { margin-bottom: 8px; }
        .empty-title {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 8px;
        }
        .empty-desc {
          font-size: 12px;
          color: var(--text-muted);
          max-width: 260px;
          line-height: 1.7;
          margin-bottom: 24px;
        }
        .feature-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: left;
        }
        .feature-list li {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--text-muted);
        }
        .check { color: var(--success); font-size: 11px; }

        .footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 0;
          margin-top: 32px;
          border-top: 1px solid var(--border);
          font-size: 10px;
          color: var(--text-dim);
        }
        .footer a {
          color: var(--accent);
          text-decoration: none;
        }
        .footer a:hover { text-decoration: underline; }

        @media (max-width: 700px) {
          .main { grid-template-columns: 1fr; }
          .header { padding: 16px 0; margin-bottom: 20px; }
        }
      `}</style>
    </>
  );
}
