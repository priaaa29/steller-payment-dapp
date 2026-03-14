// Stellar SDK utilities — using stellar-sdk v11 + freighter-api v1.7
import {
  Horizon,
  Networks,
  TransactionBuilder,
  BASE_FEE,
  Operation,
  Asset,
  Memo,
  Keypair,
} from "@stellar/stellar-sdk";

export const TESTNET_HORIZON = "https://horizon-testnet.stellar.org";
export const TESTNET_NETWORK_PASSPHRASE = Networks.TESTNET;

export const server = new Horizon.Server(TESTNET_HORIZON);

/**
 * Fetch XLM balance for a given public key
 */
export async function fetchBalance(publicKey: string): Promise<string> {
  try {
    const account = await server.loadAccount(publicKey);
    const xlmBalance = account.balances.find(
      (b) => b.asset_type === "native"
    );
    return xlmBalance ? parseFloat(xlmBalance.balance).toFixed(4) : "0.0000";
  } catch (err: unknown) {
    // 404 = account not yet funded on testnet
    if (err && typeof err === "object" && "response" in err) {
      const e = err as { response?: { status?: number } };
      if (e.response?.status === 404) return "0.0000 (unfunded)";
    }
    throw err;
  }
}

/**
 * Send XLM from connected wallet using Freighter (v1.7)
 */
export async function sendXLM(
  fromPublicKey: string,
  toAddress: string,
  amount: string,
  memo?: string
): Promise<{ hash: string; success: boolean }> {
  // Validate destination address
  try {
    Keypair.fromPublicKey(toAddress);
  } catch {
    throw new Error("Invalid destination address");
  }

  const amountNum = parseFloat(amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    throw new Error("Amount must be greater than 0");
  }

  // Load source account sequence number
  const sourceAccount = await server.loadAccount(fromPublicKey);

  // Build the transaction
  const builder = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase: TESTNET_NETWORK_PASSPHRASE,
  });

  builder.addOperation(
    Operation.payment({
      destination: toAddress,
      asset: Asset.native(),
      amount: amountNum.toFixed(7),
    })
  );

  if (memo && memo.trim()) {
    builder.addMemo(Memo.text(memo.trim().slice(0, 28)));
  }

  builder.setTimeout(30);
  const transaction = builder.build();
  const xdr = transaction.toXDR();

  // Sign with Freighter (v1.7 API)
  const freighter = await import("@stellar/freighter-api");
  const signedXdr = await freighter.signTransaction(xdr, {
    network: "TESTNET",
    networkPassphrase: TESTNET_NETWORK_PASSPHRASE,
    accountToSign: fromPublicKey,
  });

  if (!signedXdr || typeof signedXdr !== "string") {
    throw new Error("Transaction signing was cancelled or failed");
  }

  // Submit to Horizon
  const { TransactionBuilder: TB } = await import("@stellar/stellar-sdk");
  const signedTx = TB.fromXDR(signedXdr, TESTNET_NETWORK_PASSPHRASE);
  const result = await server.submitTransaction(signedTx);

  return { hash: result.hash, success: true };
}

/**
 * Fetch recent transactions for an account
 */
export async function fetchRecentTransactions(publicKey: string) {
  try {
    const txs = await server
      .transactions()
      .forAccount(publicKey)
      .order("desc")
      .limit(5)
      .call();

    return txs.records.map((tx) => ({
      hash: tx.hash,
      createdAt: tx.created_at,
      successful: tx.successful,
      feeCharged: tx.fee_charged,
    }));
  } catch {
    return [];
  }
}

/**
 * Fund testnet account via Stellar Friendbot
 */
export async function fundFromFaucet(publicKey: string): Promise<boolean> {
  try {
    const resp = await fetch(
      `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
    );
    return resp.ok;
  } catch {
    return false;
  }
}

export function truncateAddress(address: string, chars = 6): string {
  if (address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}
