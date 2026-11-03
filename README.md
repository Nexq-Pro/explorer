# bb84 explorer

On-chain explorer for bb84 on Solana devnet. It reads QPU job receipts, quantum-seeded randomness, Falcon-512 accounts, and circuit checks straight from the chain.

Live at [explorer.bb84.live](https://explorer.bb84.live). Source: [github.com/BB84-Live/explorer](https://github.com/BB84-Live/explorer).

## What it shows

| Section | Program | Address |
| --- | --- | --- |
| QPU receipts | `qproof` | `6pxqWGoxSRBwmL6GJie9BD43HGe3ybFu9xmJQ24TvcXB` |
| Random values | `qentropy` | `FZXp8BVcsPZcE6ZP4wCYouMsupGEGKSZFwNfzNaoiQmm` |
| Falcon accounts | `qpt` (blueshift) | `E4cwdChwHz3bqfeLUdJcRnPSsgKBEz7mwov1qCHgEmsK` |
| Falcon accounts | `qpt` (FN-DSA) | `BfcVJr4WTEJyZfDZ1LtnnmqCiDsVBiHtxiLM7KesoFqG` |
| Circuit checks | `qsim` | `6sHufVFfaMwxPuDKxBuV8qZqNot8bJNgtFKhZKXHdhSw` |

Search covers addresses, transactions, job ids, and slots. Views are Overview, Falcon accounts, QPU receipts, Random values, and Transactions.

## Run locally

```bash
npm install
npm run dev
```

Opens at http://localhost:5174.

```bash
npm run build
npm run preview
```

The page talks to Solana devnet over public JSON-RPC (`https://api.devnet.solana.com`, with a public fallback). Those endpoints often answer HTTP 429. When that happens, the page uses the snapshot bundled in `src/main.js`.
