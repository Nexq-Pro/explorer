# bb84 explorer

Source recovered from [explorer.bb84.sh](https://explorer.bb84.sh). There is no public GitHub repo for this site. The production build was a Vite bundle with source maps disabled, so this is the unminified application, not the original variable names.

| File | What it is |
| --- | --- |
| `index.html` | Page shell from the live site |
| `src/main.js` | Explorer application: Solana RPC reads, account decoding, search, and views |
| `src/styles.css` | Styles from the live site |
| `public/bb84-logo-96.png` | Logo |

```bash
npm install
npm run dev
```

Opens at http://localhost:5174. It reads Solana devnet directly. Public RPC endpoints rate-limit with HTTP 429; the page falls back to the snapshot bundled in `src/main.js`.
