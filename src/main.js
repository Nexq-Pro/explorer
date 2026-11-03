(function () {
  let e = document.createElement(`link`).relList;
  if (e && e.supports && e.supports(`modulepreload`)) {
    return;
  }
  for (let e of document.querySelectorAll(`link[rel="modulepreload"]`)) {
    n(e);
  }
  new MutationObserver(e => {
    for (let t of e) {
      if (t.type === `childList`) {
        for (let e of t.addedNodes) {
          if (e.tagName === `LINK` && e.rel === `modulepreload`) {
            n(e);
          }
        }
      }
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function t(e) {
    let t = {};
    if (e.integrity) {
      t.integrity = e.integrity;
    }
    if (e.referrerPolicy) {
      t.referrerPolicy = e.referrerPolicy;
    }
    t.credentials = e.crossOrigin === `use-credentials` ? `include` : e.crossOrigin === `anonymous` ? `omit` : `same-origin`;
    return t;
  }
  function n(e) {
    if (e.ep) {
      return;
    }
    e.ep = true;
    let n = t(e);
    fetch(e.href, n);
  }
})();
var e = `123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz`;
function t(t) {
  let n = 0n;
  for (let e of t) {
    n = n * 256n + BigInt(e);
  }
  let r = ``;
  while (n > 0n) {
    r = e[Number(n % 58n)] + r;
    n /= 58n;
  }
  for (let e of t) {
    if (e !== 0) {
      break;
    }
    r = `1${r}`;
  }
  return r;
}
function n(t) {
  let n = 0n;
  for (let r of t) {
    let t = e.indexOf(r);
    if (t < 0) {
      throw Error(`invalid base58 character ${r}`);
    }
    n = n * 58n + BigInt(t);
  }
  let r = [];
  while (n > 0n) {
    r.unshift(Number(n % 256n));
    n /= 256n;
  }
  for (let e of t) {
    if (e !== `1`) {
      break;
    }
    r.unshift(0);
  }
  return Uint8Array.from(r);
}
var r = e => Uint8Array.from(atob(e), e => e.charCodeAt(0));
var i = e => Array.from(e, e => e.toString(16).padStart(2, `0`)).join(``);
var a = (e, t) => e.length === t.length && e.every((e, n) => e === t[n]);
async function o(e) {
  let t = await crypto.subtle.digest(`SHA-256`, new TextEncoder().encode(e));
  return i(new Uint8Array(t));
}
var s = class {
  constructor(e, t = 0) {
    this.b = e;
    this.o = t;
    this.v = new DataView(e.buffer, e.byteOffset, e.byteLength);
  }
  bytes(e) {
    let t = this.b.subarray(this.o, this.o + e);
    this.o += e;
    return t;
  }
  key() {
    return t(this.bytes(32));
  }
  u8() {
    return this.b[this.o++];
  }
  u32() {
    let e = this.v.getUint32(this.o, true);
    this.o += 4;
    return e;
  }
  u64() {
    let e = this.v.getBigUint64(this.o, true);
    this.o += 8;
    return e;
  }
  i64() {
    let e = this.v.getBigInt64(this.o, true);
    this.o += 8;
    return e;
  }
  str() {
    return new TextDecoder().decode(this.bytes(this.u32()));
  }
};
var c = [`LocalSimulator`, `CloudEmulator`, `Qpu`];
var l = `11111111111111111111111111111111`;
var u = [`TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`, `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb`];
var d = [`MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr`, `Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo`];
function f(e, t) {
  let n = new DataView(t.buffer, t.byteOffset, t.byteLength);
  if (e === l && t.length === 12 && n.getUint32(0, true) === 2) {
    return {
      kind: `sol`,
      lamports: Number(n.getBigUint64(4, true))
    };
  } else if (u.includes(e) && t[0] === 3 && t.length === 9) {
    return {
      kind: `token`,
      amount: n.getBigUint64(1, true).toString()
    };
  } else if (u.includes(e) && t[0] === 12 && t.length === 10) {
    return {
      kind: `token`,
      amount: n.getBigUint64(1, true).toString(),
      decimals: t[9]
    };
  } else if (d.includes(e)) {
    return {
      kind: `memo`,
      text: new TextDecoder().decode(t)
    };
  } else {
    return {
      kind: `other`,
      program: e
    };
  }
}
var p = [`Open`, `Sampled`, `Finalized`, `Slashed`];
function ee(e) {
  let t = new s(e, 8);
  return {
    jobIdHash: i(t.bytes(32)),
    source: c[t.u8()] ?? `Unknown`,
    backend: t.str(),
    circuitHash: i(t.bytes(32)),
    resultHash: i(t.bytes(32)),
    shots: t.u32(),
    relayer: t.key(),
    index: Number(t.u64()),
    slot: Number(t.u64()),
    timestamp: Number(t.i64())
  };
}
function te(e) {
  let t = new s(e, 8);
  return {
    provider: t.key(),
    id: t.u64().toString(),
    receipt: t.key(),
    commit: i(t.bytes(32)),
    seed: i(t.bytes(32)),
    slotHash: i(t.bytes(32)),
    sampledSlot: Number(t.u64()),
    value: i(t.bytes(32)),
    endAt: Number(t.u64()),
    revealBy: Number(t.u64()),
    samplesLeft: Number(t.u64()),
    round: Number(t.u64()),
    status: p[t.u8()] ?? `Unknown`
  };
}
function ne(e, t) {
  let n = new s(e, 8);
  let r = n.key();
  let i = Number(n.u64());
  n.bytes(t);
  return {
    owner: r,
    index: i,
    keyBytes: t,
    receipt: n.key(),
    registeredSlot: Number(n.u64()),
    qday: n.u8() === 1,
    nonce: Number(n.u64())
  };
}
function m(e) {
  if (typeof e == `function`) {
    return e;
  }
  let t = [e].flat();
  let n = 0;
  let r = 0;
  let i = (e, t) => e === 429 || [429, -32029, -32005].includes(t?.code) || /too many requests|rate limit/i.test(t?.message ?? ``);
  async function a(e, a) {
    for (let o = 0;; o++) {
      let s = t[r];
      let c = null;
      let l = null;
      try {
        c = await fetch(s, {
          method: `POST`,
          headers: {
            "content-type": `application/json`
          },
          body: JSON.stringify({
            jsonrpc: `2.0`,
            id: ++n,
            method: e,
            params: a
          })
        });
        l = c.status === 429 ? null : await c.json();
      } catch (n) {
        if (o >= t.length * 6) {
          throw Error(`${e}: ${n.message}`);
        }
      }
      if (l && !i(c.status, l.error)) {
        if (l.error) {
          throw Error(`${e}: ${l.error.message}`);
        }
        return l.result;
      }
      if (o >= t.length * 6) {
        throw Error(`${e}: RPC rate limit`);
      }
      r = (r + 1) % t.length;
      if (r === 0) {
        await new Promise(e => setTimeout(e, Math.min(2 ** Math.floor(o / t.length) * 1000, 10000)));
      }
    }
  }
  a.endpoint = () => t[r];
  return a;
}
async function h(e, n, i) {
  return (await e(`getProgramAccounts`, [n, {
    encoding: `base64`,
    filters: [{
      memcmp: {
        offset: 0,
        bytes: t(Uint8Array.from(i))
      }
    }]
  }])).map(({
    pubkey: e,
    account: t
  }) => ({
    pubkey: e,
    lamports: t.lamports,
    data: r(t.data[0])
  }));
}
function g(e, t, r, i) {
  let o = e.programs.find(e => e.address === t);
  if (!o) {
    return null;
  }
  let l = n(r);
  let u = o.instructions.find(e => a(Uint8Array.from(e.discriminator), l.subarray(0, 8)));
  let d = {
    program: o.key,
    programName: o.label,
    name: u?.name ?? `unknown`
  };
  let p = new s(l, 8);
  if (d.name === `withdraw_pq`) {
    d.amount = Number(p.u64());
    d.signatureBytes = p.u32();
    d.entry = i[0];
    d.destination = i[1];
  } else if (d.name === `withdraw`) {
    d.amount = Number(p.u64());
  } else if (d.name === `execute_pq` || d.name === `execute`) {
    let e = d.name === `execute_pq` ? 0 : 1;
    if (d.name === `execute_pq`) {
      d.signatureBytes = p.u32();
      p.bytes(d.signatureBytes);
      d.expiresAtSlot = Number(p.u64());
    }
    d.entry = i[e];
    d.wallet = i[e + 1];
    let t = t => t === 0 ? d.wallet : i[e + 1 + t];
    d.calls = [];
    for (let e = p.u32(); e > 0; e--) {
      let e = t(p.u8());
      p.bytes(p.u32() * 3);
      d.calls.push(f(e, p.bytes(p.u32())));
    }
  } else if (d.name === `register`) {
    d.keyBytes = p.u32();
    d.entry = i[2];
  } else if ((d.name === `simulate` || d.name === `simulate_receipt`) && o.key === `qsim`) {
    if (d.name === `simulate_receipt`) {
      d.receipt = i[0];
    }
    d.numQubits = p.u8();
    d.circuitBytes = p.bytes(p.u32()).length;
    let e = 0;
    let t = p.u32();
    for (let n = 0; n < t; n++) {
      p.u32();
      e += p.u32();
    }
    d.outcomes = t;
    d.shots = e;
  } else if (d.name === `record_job`) {
    p.bytes(32);
    d.source = c[p.u8()];
    d.backend = p.str();
  }
  return d;
}
async function _(e, t, n) {
  let a = await e(`getTransaction`, [n, {
    encoding: `json`,
    maxSupportedTransactionVersion: 0,
    commitment: `confirmed`
  }]);
  if (!a) {
    return null;
  }
  let o = [...a.transaction.message.accountKeys, ...(a.meta.loadedAddresses?.writable ?? []), ...(a.meta.loadedAddresses?.readonly ?? [])];
  let c = a.transaction.message.instructions.map(e => g(t, o[e.programIdIndex], e.data, e.accounts.map(e => o[e]))).filter(Boolean);
  let l = a.meta.returnData;
  let u = c.findLast(e => e.program === `qsim` && [`simulate`, `simulate_receipt`, `score`].includes(e.name));
  if (l && u && l.programId === t.programs.find(e => e.key === `qsim`)?.address) {
    let e = new s(r(l.data[0]));
    u.score = {
      numQubits: e.u8(),
      shots: Number(e.u64()),
      outcomes: e.u32(),
      fidelity: e.u32() / 1000000,
      tvd: e.u32() / 1000000,
      xeb: Number(e.i64()) / 1000000,
      circuitHash: i(e.bytes(32))
    };
  }
  return {
    signature: n,
    slot: a.slot,
    blockTime: a.blockTime,
    ok: !a.meta.err,
    error: a.meta.err ? JSON.stringify(a.meta.err) : null,
    computeUnits: a.meta.computeUnitsConsumed ?? null,
    fee: a.meta.fee,
    accounts: o,
    instructions: c,
    logs: (a.meta.logMessages ?? []).filter(e => e.startsWith(`Program log:`)).map(e => e.slice(13))
  };
}
async function re(e, t, n, r, i = new Map(), a = () => {}) {
  let o = [];
  for (let t of n) {
    for (let n of await e(`getSignaturesForAddress`, [t.address, {
      limit: r
    }])) {
      if (!o.some(e => e.signature === n.signature)) {
        o.push(n);
      }
    }
  }
  o.sort((e, t) => t.slot - e.slot);
  let s = o.filter(e => !i.has(e.signature));
  let c = 0;
  let l = [];
  for (let n of o) {
    let r = i.get(n.signature);
    if (!r) {
      a(`transactions (${++c}/${s.length})`);
      if (c > 1) {
        await new Promise(e => setTimeout(e, 150));
      }
      try {
        r = await _(e, t, n.signature);
      } catch {
        r = null;
      }
      if (r) {
        i.set(n.signature, r);
      }
    }
    if (r) {
      l.push({
        ...r,
        blockTime: r.blockTime ?? n.blockTime
      });
    }
  }
  return l;
}
async function ie(e, t, n, r) {
  let i = [];
  let a = (e, t, n) => i.push({
    label: e,
    ok: t,
    detail: n
  });
  let s = n.find(e => e.address === t.receipt);
  a(`QPU receipt exists on-chain`, !!s, t.receipt);
  if (s) {
    a(`Receipt is labelled as real hardware (Qpu)`, s.source === `Qpu`, `${s.source} on ${s.backend}`);
    a(`Receipt job hash = sha256("${t.jobId}")`, s.jobIdHash === (await o(t.jobId)), `IBM job ${t.jobId}`);
  }
  let c = await e(`getTransaction`, [t.memoSignature, {
    encoding: `json`,
    maxSupportedTransactionVersion: 0
  }]);
  a(`Challenge memo is on-chain`, (c?.meta?.logMessages?.find(e => e.includes(`nexq challenge v1`)) ?? ``).includes(t.challenge), `slot ${c?.slot ?? `?`}`);
  if (c && s) {
    a(`Challenge was posted before the QPU result`, c.slot < s.slot, `memo slot ${c.slot} < receipt slot ${s.slot}`);
  }
  let l = r.find(e => e.address === t.var);
  a(`Random value is finalized on-chain`, l?.status === `Finalized`, l ? `status ${l.status}` : `not found`);
  if (l) {
    a(`On-chain value matches the published value`, l.value === t.value, l.value);
  }
  if (l) {
    a(`Value links to the QPU receipt`, l.receipt === t.receipt, l.receipt);
  }
  return {
    ...t,
    checks: i
  };
}
async function v(e, t, {
  activityLimit: n = 25,
  known: r = new Map(),
  onProgress: i = () => {}
} = {}) {
  let a = m(t);
  let s = await a(`getSlot`, [{
    commitment: `confirmed`
  }]);
  let c = [];
  for (let t of e.programs) {
    let e = await a(`getAccountInfo`, [t.address, {
      encoding: `base64`,
      dataSlice: {
        offset: 0,
        length: 0
      }
    }]);
    c.push({
      key: t.key,
      label: t.label,
      address: t.address,
      role: t.role,
      deployed: !!e?.value?.executable
    });
  }
  let l = e => c.find(t => t.key === e)?.deployed;
  let u = t => e.programs.find(e => e.key === t);
  i(`QPU receipts`);
  let d = l(`qproof`) ? (await h(a, u(`qproof`).address, u(`qproof`).accounts.Receipt)).map(e => ({
    address: e.pubkey,
    ...ee(e.data)
  })).sort((e, t) => e.index - t.index) : [];
  let f = {};
  for (let t of e.knownRuns) {
    f[await o(t.jobId)] = t.jobId;
  }
  for (let e of d) {
    e.publicJobId = f[e.jobIdHash] ?? null;
  }
  i(`randomness`);
  let p = l(`qentropy`) ? (await h(a, u(`qentropy`).address, u(`qentropy`).accounts.Var)).map(e => ({
    address: e.pubkey,
    ...te(e.data)
  })).sort((e, t) => t.endAt - e.endAt) : [];
  i(`Falcon vaults`);
  let g = [];
  for (let t of e.programs.filter(e => e.entryKeyBytes && l(e.key))) {
    for (let e of await h(a, t.address, t.accounts.Entry)) {
      let n = (e.data.length + 128) * 6960;
      g.push({
        address: e.pubkey,
        program: t.key,
        build: t.label,
        lamports: e.lamports,
        rentLamports: n,
        ...ne(e.data, t.entryKeyBytes)
      });
    }
  }
  for (let e of g) {
    e.receiptSource = d.find(t => t.address === e.receipt)?.source ?? null;
  }
  i(`transactions`);
  let _ = await re(a, e, e.programs.filter(e => l(e.key)), n, r, i);
  for (let e of g) {
    e.wallet = _.flatMap(e => e.instructions).find(t => t.wallet && t.entry === e.address)?.wallet ?? null;
    if (e.wallet) {
      e.walletLamports = (await a(`getBalance`, [e.wallet, {
        commitment: `confirmed`
      }])).value;
    }
  }
  i(`Run 1 evidence`);
  let v = [];
  for (let t of e.knownRuns.filter(t => t.cluster === e.cluster)) {
    v.push(await ie(a, t, d, p));
  }
  return {
    cluster: e.cluster,
    rpcUrl: a.endpoint?.() ?? t,
    fetchedAt: new Date().toISOString(),
    slot: s,
    programs: c,
    receipts: d,
    vars: p,
    entries: g,
    activity: _,
    runs: v
  };
}
async function ae(e, t, n) {
  return _(m(t), e, n);
}
async function oe(e, t, n = 10) {
  let r = m(e);
  let i = await r(`getAccountInfo`, [t, {
    encoding: `base64`,
    dataSlice: {
      offset: 0,
      length: 0
    },
    commitment: `confirmed`
  }]);
  let a = await r(`getSignaturesForAddress`, [t, {
    limit: n
  }]);
  return {
    exists: !!i.value,
    lamports: i.value?.lamports ?? 0,
    owner: i.value?.owner ?? null,
    executable: i.value?.executable ?? false,
    space: i.value?.space ?? null,
    signatures: a.map(e => ({
      signature: e.signature,
      slot: e.slot,
      blockTime: e.blockTime,
      ok: !e.err
    }))
  };
}
var y = {
  cluster: `devnet`,
  rpcUrl: `https://api.devnet.solana.com`,
  rpcUrls: [`https://api.devnet.solana.com`, `https://solana-devnet.api.onfinality.io/public`],
  programs: [{
    key: `qproof`,
    label: `qproof`,
    role: `QPU job receipts`,
    address: `6pxqWGoxSRBwmL6GJie9BD43HGe3ybFu9xmJQ24TvcXB`,
    instructions: [{
      name: `initialize`,
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237]
    }, {
      name: `record_job`,
      discriminator: [54, 124, 168, 158, 236, 237, 107, 206]
    }, {
      name: `set_relayer`,
      discriminator: [23, 243, 33, 88, 110, 84, 196, 37]
    }],
    accounts: {
      Config: [155, 12, 170, 224, 30, 250, 204, 130],
      Receipt: [39, 154, 73, 106, 80, 102, 145, 153]
    }
  }, {
    key: `qentropy`,
    label: `qentropy`,
    role: `Quantum-seeded randomness`,
    address: `FZXp8BVcsPZcE6ZP4wCYouMsupGEGKSZFwNfzNaoiQmm`,
    instructions: [{
      name: `close`,
      discriminator: [98, 165, 201, 177, 108, 65, 206, 96]
    }, {
      name: `next`,
      discriminator: [160, 255, 16, 151, 56, 49, 120, 129]
    }, {
      name: `open`,
      discriminator: [228, 220, 155, 71, 199, 189, 60, 45]
    }, {
      name: `register_provider`,
      discriminator: [254, 209, 54, 184, 46, 197, 109, 78]
    }, {
      name: `reveal`,
      discriminator: [9, 35, 59, 190, 167, 249, 76, 115]
    }, {
      name: `sample`,
      discriminator: [70, 65, 102, 239, 199, 157, 60, 198]
    }, {
      name: `slash`,
      discriminator: [204, 141, 18, 161, 8, 177, 92, 142]
    }, {
      name: `withdraw_stake`,
      discriminator: [153, 8, 22, 138, 105, 176, 87, 66]
    }],
    accounts: {
      Provider: [164, 180, 71, 17, 75, 216, 80, 195],
      Var: [4, 174, 222, 231, 71, 11, 251, 211]
    }
  }, {
    key: `qpt_blueshift`,
    label: `qpt · blueshift`,
    role: `Falcon-512 accounts (blueshift verifier)`,
    address: `E4cwdChwHz3bqfeLUdJcRnPSsgKBEz7mwov1qCHgEmsK`,
    entryKeyBytes: 1024,
    instructions: [{
      name: `enable_qday`,
      discriminator: [17, 254, 26, 118, 48, 238, 103, 236]
    }, {
      name: `execute`,
      discriminator: [130, 221, 242, 154, 13, 193, 189, 29]
    }, {
      name: `execute_pq`,
      discriminator: [146, 150, 9, 102, 57, 220, 226, 112]
    }, {
      name: `initialize`,
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237]
    }, {
      name: `register`,
      discriminator: [211, 124, 67, 15, 211, 194, 178, 240]
    }, {
      name: `withdraw`,
      discriminator: [183, 18, 70, 156, 148, 109, 161, 34]
    }, {
      name: `withdraw_pq`,
      discriminator: [46, 171, 255, 196, 111, 231, 131, 25]
    }],
    accounts: {
      Entry: [63, 18, 152, 113, 215, 246, 221, 250],
      Table: [34, 100, 138, 97, 236, 129, 230, 112]
    }
  }, {
    key: `qpt`,
    label: `qpt · fn-dsa`,
    role: `Falcon-512 accounts (FN-DSA draft verifier)`,
    address: `BfcVJr4WTEJyZfDZ1LtnnmqCiDsVBiHtxiLM7KesoFqG`,
    entryKeyBytes: 897,
    instructions: [{
      name: `enable_qday`,
      discriminator: [17, 254, 26, 118, 48, 238, 103, 236]
    }, {
      name: `execute`,
      discriminator: [130, 221, 242, 154, 13, 193, 189, 29]
    }, {
      name: `execute_pq`,
      discriminator: [146, 150, 9, 102, 57, 220, 226, 112]
    }, {
      name: `initialize`,
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237]
    }, {
      name: `register`,
      discriminator: [211, 124, 67, 15, 211, 194, 178, 240]
    }, {
      name: `withdraw`,
      discriminator: [183, 18, 70, 156, 148, 109, 161, 34]
    }, {
      name: `withdraw_pq`,
      discriminator: [46, 171, 255, 196, 111, 231, 131, 25]
    }],
    accounts: {
      Entry: [63, 18, 152, 113, 215, 246, 221, 250],
      Table: [34, 100, 138, 97, 236, 129, 230, 112]
    }
  }, {
    key: `qsim`,
    label: `qsim`,
    role: `Quantum circuits simulated on-chain: scores QPU results`,
    address: `6sHufVFfaMwxPuDKxBuV8qZqNot8bJNgtFKhZKXHdhSw`,
    instructions: [{
      name: `apply`,
      discriminator: [248, 243, 145, 24, 105, 50, 162, 225]
    }, {
      name: `apply_range`,
      discriminator: [72, 246, 240, 85, 207, 78, 163, 254]
    }, {
      name: `init_state`,
      discriminator: [124, 213, 73, 136, 80, 37, 141, 54]
    }, {
      name: `score`,
      discriminator: [142, 67, 127, 112, 219, 69, 13, 225]
    }, {
      name: `simulate`,
      discriminator: [99, 95, 51, 28, 40, 8, 111, 87]
    }, {
      name: `simulate_receipt`,
      discriminator: [138, 191, 127, 215, 180, 187, 213, 201]
    }],
    accounts: {}
  }],
  knownRuns: [{
    name: `Run 1`,
    cluster: `devnet`,
    provider: `IBM Quantum`,
    device: `ibm_fez`,
    jobId: `dbfroe8m94ac738u7e20`,
    receipt: `AAGMznL9PRwMUfnkWzUpEL71vkUvCnfF5CptoVtBFW5K`,
    var: `6Gd8Yf7UnM3RxPkknAfNtMm9D3qTSsWmxSfrY6Yy7dcU`,
    value: `f801dfe388b484ef19d175423515e09bf5eae06e20132b1eed0d70ed49308858`,
    challenge: `d2fd4c1f4cd396ff723a99ba1f55ee7d38da28b0444932c40de7bc4494cd9cfc`,
    memoSignature: `43FqAcNXSWiVsaE9mk3nVqp3vSMEAm6uuvCUorPWtZ2zAdwZSWbehRM9qETpZGGfhB9kMdBniymr6XVHnTL6hfFT`,
    qubits: 16,
    shots: 256,
    bits: 4096,
    observed: 0.621337890625,
    expected: 0.6296710043493754,
    date: `2026-10-26`
  }]
};
var b = {
  cluster: `devnet`,
  rpcUrl: `Alchemy`,
  fetchedAt: `2026-10-28T18:15:02.377Z`,
  slot: 516141664,
  programs: [{
    key: `qproof`,
    label: `qproof`,
    address: `6pxqWGoxSRBwmL6GJie9BD43HGe3ybFu9xmJQ24TvcXB`,
    role: `QPU job receipts`,
    deployed: true
  }, {
    key: `qentropy`,
    label: `qentropy`,
    address: `FZXp8BVcsPZcE6ZP4wCYouMsupGEGKSZFwNfzNaoiQmm`,
    role: `Quantum-seeded randomness`,
    deployed: true
  }, {
    key: `qpt_blueshift`,
    label: `qpt · blueshift`,
    address: `E4cwdChwHz3bqfeLUdJcRnPSsgKBEz7mwov1qCHgEmsK`,
    role: `Falcon-512 accounts (blueshift verifier)`,
    deployed: true
  }, {
    key: `qpt`,
    label: `qpt · fn-dsa`,
    address: `BfcVJr4WTEJyZfDZ1LtnnmqCiDsVBiHtxiLM7KesoFqG`,
    role: `Falcon-512 accounts (FN-DSA draft verifier)`,
    deployed: true
  }, {
    key: `qsim`,
    label: `qsim`,
    address: `6sHufVFfaMwxPuDKxBuV8qZqNot8bJNgtFKhZKXHdhSw`,
    role: `Quantum circuits simulated on-chain: scores QPU results`,
    deployed: true
  }],
  receipts: [{
    address: `F1cHfSgG4W6JtCu77qsDnhAsKVR5SizoHZxbFcoNPsS6`,
    jobIdHash: `58e0b4de11d00ef192517735a8cb259db21dd2356e5016c1c0103beb513b4e8a`,
    source: `LocalSimulator`,
    backend: `perceval:slos`,
    circuitHash: `380ef0f1182224e0b0f2297191c93b96c0b6b6d1b06c071be20fe83cda385043`,
    resultHash: `de183a116a6b5376fb33beaec77ed323f08495f397ce02379e3849319c455894`,
    shots: 4096,
    relayer: `5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`,
    index: 0,
    slot: 515059356,
    timestamp: 1792952594,
    publicJobId: null
  }, {
    address: `2kmGNbfghfBxs5LQmhyuTQeHEgfdy5LtcyttcPKvk5Dz`,
    jobIdHash: `5a9c3441a91d94f5745162bbf07ca99f6d1e19d25abaacfea49a796c2adba7bc`,
    source: `LocalSimulator`,
    backend: `perceval:slos`,
    circuitHash: `ead47c9492100584447a62c3210d1ecd5a7afdb74f3b3df60572e5d5ce9eec8e`,
    resultHash: `80fa894cfadf1373f8b884a1c84f76111cdfd697bc8b054533ccb16d5917b49d`,
    shots: 4096,
    relayer: `5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`,
    index: 1,
    slot: 515407376,
    timestamp: 1793035944,
    publicJobId: null
  }, {
    address: `F5DijW6T9v1vbWWnL9TKSkd2fw1Uw4gtHbxND5daKCjz`,
    jobIdHash: `99be9cce480b922375ee68bffbebeea5c3bf1ec94de1960948cd9cb7d71931e6`,
    source: `LocalSimulator`,
    backend: `qiskit:statevector`,
    circuitHash: `a6e3ae7ac4df352cbcd67cb7df719d94d0771ac26f8b05726d7779b098b5bb8a`,
    resultHash: `8bdde700eac69019b3e60b184c378ba5a69ad299db536a29fbe13b5ef8c50783`,
    shots: 256,
    relayer: `5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`,
    index: 2,
    slot: 515446238,
    timestamp: 1793045211,
    publicJobId: null
  }, {
    address: `AAGMznL9PRwMUfnkWzUpEL71vkUvCnfF5CptoVtBFW5K`,
    jobIdHash: `4ef6b699a5f825394ceb7fa8f294faef8800c90e4d245306d6082d51d374a167`,
    source: `Qpu`,
    backend: `ibm:ibm_fez`,
    circuitHash: `882df8185482312c75fc24f6a582dbc0d8bc5f510efee2b90552b2cb07b0ad50`,
    resultHash: `fb6f5646571910f37cdab3b647c2b9fdb2e43e36e9f472c45435000963119007`,
    shots: 256,
    relayer: `5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`,
    index: 3,
    slot: 515465616,
    timestamp: 1793049839,
    publicJobId: `dbfroe8m94ac738u7e20`
  }, {
    address: `5PTXUkAS79gMdduNKW64i4oL9bs5BqPtnJCdyivYA9e8`,
    jobIdHash: `6c96648ca5623fba929d7943f907cb55ddafb9f86c56d7615a4c753ae1c02803`,
    source: `LocalSimulator`,
    backend: `qiskit:statevector`,
    circuitHash: `c0e4c5dda46fa36660ecf5fc712ae2bfb3f6c017a00894ed3756be3d1b5c8a5e`,
    resultHash: `487c55eb19771248c3a108e1ba39e6ea4715b35e150024a5409af11beb77d999`,
    shots: 256,
    relayer: `5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`,
    index: 4,
    slot: 515565255,
    timestamp: 1793073628,
    publicJobId: null
  }, {
    address: `drPoQGVC7CAEZdJ63VYqmqvH5cxRje9dvQufAuTzkGo`,
    jobIdHash: `3a70993d53b7e24449cbee21f19183efbca26080aa4d67740df9e1f300aebd57`,
    source: `LocalSimulator`,
    backend: `qiskit:statevector`,
    circuitHash: `c0e4c5dda46fa36660ecf5fc712ae2bfb3f6c017a00894ed3756be3d1b5c8a5e`,
    resultHash: `7534911e368c71cdce2b894b9cf50a46c904591042a60fda32f668d6d7bfa790`,
    shots: 256,
    relayer: `5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`,
    index: 5,
    slot: 515568314,
    timestamp: 1793074357,
    publicJobId: null
  }, {
    address: `5LBExjr1NvBP8wzA9XBZc3cZsrQuiKKYhaSAntg8KPCn`,
    jobIdHash: `5ddd818d9ac2efd6d98c580612cb20532a15fae8c5b717e1afd588bf082cb8fb`,
    source: `Qpu`,
    backend: `braket:Cepheus-1-108Q`,
    circuitHash: `cac36fb6fc57b1c88e5271d846ff2a4f219baa4c4af593831b3bee756209c8a1`,
    resultHash: `687b1ec0f843cfefb75c11856c7ab023c32571badb45a6433947afea579febaa`,
    shots: 1024,
    relayer: `5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`,
    index: 6,
    slot: 515814400,
    timestamp: 1793133145,
    publicJobId: null
  }],
  vars: [{
    address: `6Gd8Yf7UnM3RxPkknAfNtMm9D3qTSsWmxSfrY6Yy7dcU`,
    provider: `HzJgKKS8W5B51NKcrj8jvermJSiV3ByDrPkZQYFikN3C`,
    id: `1793049840812`,
    receipt: `AAGMznL9PRwMUfnkWzUpEL71vkUvCnfF5CptoVtBFW5K`,
    commit: `c6b5968eab1ef74b51ab2b7210a7f92f89cc35bf1426cd834001e384ba5d526d`,
    seed: `7a41ea76be73015aa4e61737e1671388e758e2e0ac6c9249978688554ee3ff8c`,
    slotHash: `57701febd265905e49a9a82dabb783aa31c2cdbacd488ff5ba20b6d782940eba`,
    sampledSlot: 515465646,
    value: `f801dfe388b484ef19d175423515e09bf5eae06e20132b1eed0d70ed49308858`,
    endAt: 515465646,
    revealBy: 515465809,
    samplesLeft: 15,
    round: 0,
    status: `Finalized`
  }, {
    address: `F7GYKL8jDwvAxZvxehfWpS9wJ3SwWVkfaFkKLJT1abHD`,
    provider: `HzJgKKS8W5B51NKcrj8jvermJSiV3ByDrPkZQYFikN3C`,
    id: `1793045212492`,
    receipt: `F5DijW6T9v1vbWWnL9TKSkd2fw1Uw4gtHbxND5daKCjz`,
    commit: `0b8070a2c7a4bb4ab7ea1cb0bdca297c0232a5af0b6a8b8f778eda6d12d20d26`,
    seed: `cdf5b93c74f5c10d7c129d7060db9bf658ae89a0f8ffc6cfc8aa1e9c0fc079de`,
    slotHash: `11189a1a49cf46b56410f8b20d13daae226beba9fbe50def4320aba0d9033da0`,
    sampledSlot: 515446269,
    value: `88625cf55ae25f699eb423b089dd374c89ae7cf918a29069a1c3792375e802f1`,
    endAt: 515446269,
    revealBy: 515446430,
    samplesLeft: 15,
    round: 0,
    status: `Finalized`
  }, {
    address: `2RKjymQd6tuuypri98M8b9kVX7zfyPGg5QGV4uSTTmMs`,
    provider: `HzJgKKS8W5B51NKcrj8jvermJSiV3ByDrPkZQYFikN3C`,
    id: `1793035945650`,
    receipt: `2kmGNbfghfBxs5LQmhyuTQeHEgfdy5LtcyttcPKvk5Dz`,
    commit: `982dcf449c53b3d60a40d00c7ee1f0b503433b7caaab741b4da8e9d60c61ffe7`,
    seed: `00d3e686c26f06b358e011f050ff37e02d79d5391219896b2dac6f521ca436ec`,
    slotHash: `3a57407ac0931d3cfa877930779d8ddebe495234467eb876358d054d429de586`,
    sampledSlot: 515407406,
    value: `a577cd95beb3df1cd2372aa797ba42cb2ae41034d2380091a5a8dbef16cc519c`,
    endAt: 515407406,
    revealBy: 515407569,
    samplesLeft: 15,
    round: 0,
    status: `Finalized`
  }, {
    address: `EqNJ8RmYRbcCky7B2FEMNmNmfHQnnDJvGExU9vgM5hQ2`,
    provider: `HzJgKKS8W5B51NKcrj8jvermJSiV3ByDrPkZQYFikN3C`,
    id: `1792952595890`,
    receipt: `F1cHfSgG4W6JtCu77qsDnhAsKVR5SizoHZxbFcoNPsS6`,
    commit: `788edc88a3e0155df9b31dd1c28637681693b83a971734f895ac80757d39071c`,
    seed: `f9913522123a98a8ef0edbb56fff8cd45f361950957c9ebb28be70a1ad6b5d51`,
    slotHash: `61c2f3542afc0d652acfd841a787add434ab09d9e63f5981b5dac43ee4f8d66a`,
    sampledSlot: 515059395,
    value: `52123bec739e900ec41407e2b5241734170294f89e2df1f142475021ac879d81`,
    endAt: 515059395,
    revealBy: 515059557,
    samplesLeft: 15,
    round: 0,
    status: `Finalized`
  }],
  entries: [{
    address: `3Wp61ty5oWDDUkkgP9541Sdi9JFikYjC6LgvEQoDWmrS`,
    program: `qpt_blueshift`,
    build: `qpt · blueshift`,
    lamports: 46350000,
    rentLamports: 8700000,
    owner: `E9wWoP6iC6GJNBUa4jKCgi6EHK3QnG8WJQmR9WGvWwNc`,
    index: 0,
    keyBytes: 1024,
    receipt: `drPoQGVC7CAEZdJ63VYqmqvH5cxRje9dvQufAuTzkGo`,
    registeredSlot: 515568338,
    qday: true,
    nonce: 4,
    receiptSource: `LocalSimulator`,
    wallet: `EhEQCn2UtJk1Z4cvEeucaPrNJkbH8gLKNVPzrUNgA9AE`,
    walletLamports: 95000000
  }, {
    address: `9WcG2Jhk9ddz99mFKUMmthnF9zSkYB33HqGGKcykfTEL`,
    program: `qpt`,
    build: `qpt · fn-dsa`,
    lamports: 55704840,
    rentLamports: 7816080,
    owner: `CVhpRKjJyXCppfsgYL58iTJnNMBwtNXJ8TAKgvVzV3tn`,
    index: 0,
    keyBytes: 897,
    receipt: `5PTXUkAS79gMdduNKW64i4oL9bs5BqPtnJCdyivYA9e8`,
    registeredSlot: 515565304,
    qday: true,
    nonce: 1,
    receiptSource: `LocalSimulator`,
    wallet: null
  }],
  activity: [{
    signature: `ynsk9TXEjpnakshxc6DhzvE5ZB3eVy6aAVGu8jpHSgEsNy4hW6RqwM9a2bRab1QAnM5EMuvDp1V8C18rAGtcZWk`,
    slot: 515815560,
    blockTime: 1793133425,
    ok: true,
    error: null,
    computeUnits: 26398,
    fee: 5000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `5LBExjr1NvBP8wzA9XBZc3cZsrQuiKKYhaSAntg8KPCn`, `6sHufVFfaMwxPuDKxBuV8qZqNot8bJNgtFKhZKXHdhSw`, `ComputeBudget111111111111111111111111111111`],
    instructions: [{
      program: `qsim`,
      programName: `qsim`,
      name: `simulate_receipt`,
      receipt: `5LBExjr1NvBP8wzA9XBZc3cZsrQuiKKYhaSAntg8KPCn`,
      numQubits: 5,
      circuitBytes: 14,
      outcomes: 27,
      shots: 1024,
      score: {
        numQubits: 5,
        shots: 1024,
        outcomes: 27,
        fidelity: 0.698824,
        tvd: 0.300781,
        xeb: 10.1875,
        circuitHash: `cac36fb6fc57b1c88e5271d846ff2a4f219baa4c4af593831b3bee756209c8a1`
      }
    }],
    logs: [`Instruction: SimulateReceipt`, `qsim: counts match qproof receipt #6 (Qpu, braket:Cepheus-1-108Q)`, `qsim 5 qubits, 1024 shots: fidelity 698824 ppm, tvd 300781 ppm, xeb 10187500 ppm`]
  }, {
    signature: `3x47EsoAkjigC7WmNvK8RuFL6DN3VvFsqqzrc5aGx4oDnjkqEC4DZHs2dki6R3t2iVD87pY1cwmsGaF5eGTmh6u8`,
    slot: 515815479,
    blockTime: 1793133405,
    ok: true,
    error: null,
    computeUnits: 2670,
    fee: 5027,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `6sHufVFfaMwxPuDKxBuV8qZqNot8bJNgtFKhZKXHdhSw`, `CJ9FHTQyPLtZF5yHqNnPB1brkEUgSqmueE9gSXBK7KuY`, `Fa7duuD1HT8znK9SxUQv2rBhNnAEshX1SDrjjZG97D2a`, `BPFLoaderUpgradeab1e11111111111111111111111`, `ComputeBudget111111111111111111111111111111`, `SysvarC1ock11111111111111111111111111111111`, `SysvarRent111111111111111111111111111111111`],
    instructions: [],
    logs: []
  }, {
    signature: `5qnFBmmG8BecBUm5HPkSxyCREk2EnxJfLf6BDHr3aa88EmABMobHezLcF9sdduVRZFEvRH8yJeqMWcKu5Adozfmj`,
    slot: 515815457,
    blockTime: 1793133400,
    ok: true,
    error: null,
    computeUnits: 5340,
    fee: 10054,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `CJ9FHTQyPLtZF5yHqNnPB1brkEUgSqmueE9gSXBK7KuY`, `6sHufVFfaMwxPuDKxBuV8qZqNot8bJNgtFKhZKXHdhSw`, `Fa7duuD1HT8znK9SxUQv2rBhNnAEshX1SDrjjZG97D2a`, `11111111111111111111111111111111`, `BPFLoaderUpgradeab1e11111111111111111111111`, `ComputeBudget111111111111111111111111111111`],
    instructions: [],
    logs: []
  }, {
    signature: `38sF6yUgwdYicYiZUL5CVSirDEv6WWKcAUtDFYwC1NrenrSpnCMjbUw5jMMhCqJpK3yrHizgL57TaHHX5H3GQ2zo`,
    slot: 515814408,
    blockTime: 1793133147,
    ok: true,
    error: null,
    computeUnits: 19001,
    fee: 5000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `6sHufVFfaMwxPuDKxBuV8qZqNot8bJNgtFKhZKXHdhSw`, `ComputeBudget111111111111111111111111111111`],
    instructions: [{
      program: `qsim`,
      programName: `qsim`,
      name: `simulate`,
      numQubits: 5,
      circuitBytes: 14,
      outcomes: 27,
      shots: 1024,
      score: {
        numQubits: 5,
        shots: 1024,
        outcomes: 27,
        fidelity: 0.698824,
        tvd: 0.300781,
        xeb: 10.1875,
        circuitHash: `cac36fb6fc57b1c88e5271d846ff2a4f219baa4c4af593831b3bee756209c8a1`
      }
    }],
    logs: [`Instruction: Simulate`, `qsim 5 qubits, 1024 shots: fidelity 698824 ppm, tvd 300781 ppm, xeb 10187500 ppm`]
  }, {
    signature: `4M4zaKqRsVvvHfHETcNUHHUAsYNX93TwHea8H9dDVsH2s2C6taV6giLubjQgbogB4S32prw7MNWaU7hJTCFGUMMA`,
    slot: 515814400,
    blockTime: 1793133146,
    ok: true,
    error: null,
    computeUnits: 14748,
    fee: 5000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `5LBExjr1NvBP8wzA9XBZc3cZsrQuiKKYhaSAntg8KPCn`, `CCNMB5dw7DKqDGQ5J83bQggEXcKVxQx6uHXxeSQUNJVS`, `11111111111111111111111111111111`, `6pxqWGoxSRBwmL6GJie9BD43HGe3ybFu9xmJQ24TvcXB`],
    instructions: [{
      program: `qproof`,
      programName: `qproof`,
      name: `record_job`,
      source: `Qpu`,
      backend: `braket:Cepheus-1-108Q`
    }],
    logs: [`Instruction: RecordJob`, `qproof receipt #6 source Qpu backend braket:Cepheus-1-108Q shots 1024`]
  }, {
    signature: `46WF1Q2rJwBneWPJpVDvMdj8vjhTqv2eYSw3yA8B681LJs2qHHkBAk2pEnxKpHDwGh6tK3gzGKsty1TN6hJmSNBG`,
    slot: 515812341,
    blockTime: 1793132653,
    ok: true,
    error: null,
    computeUnits: 21686,
    fee: 5000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `6sHufVFfaMwxPuDKxBuV8qZqNot8bJNgtFKhZKXHdhSw`, `ComputeBudget111111111111111111111111111111`],
    instructions: [{
      program: `qsim`,
      programName: `qsim`,
      name: `simulate`,
      numQubits: 5,
      circuitBytes: 14,
      outcomes: 32,
      shots: 1024,
      score: {
        numQubits: 5,
        shots: 1024,
        outcomes: 32,
        fidelity: 0.071205,
        tvd: 0.928711,
        xeb: 0.140625,
        circuitHash: `cac36fb6fc57b1c88e5271d846ff2a4f219baa4c4af593831b3bee756209c8a1`
      }
    }],
    logs: [`Instruction: Simulate`, `qsim 5 qubits, 1024 shots: fidelity 71205 ppm, tvd 928711 ppm, xeb 140625 ppm`]
  }, {
    signature: `3HaMRvScF6iE6h2k8H3FzxS29SmUGMnQxAAxqT6zbzogggebE22NFvN3McVhqhPMVZxV61ZkB57vinaMP6Ko1VfT`,
    slot: 515812296,
    blockTime: 1793132642,
    ok: true,
    error: null,
    computeUnits: 2670,
    fee: 5027,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `6sHufVFfaMwxPuDKxBuV8qZqNot8bJNgtFKhZKXHdhSw`, `FMJCnCi1U9m8H5SNi2oypQoqxjVnHr22g6pGn9EFkJev`, `Fa7duuD1HT8znK9SxUQv2rBhNnAEshX1SDrjjZG97D2a`, `BPFLoaderUpgradeab1e11111111111111111111111`, `ComputeBudget111111111111111111111111111111`, `SysvarC1ock11111111111111111111111111111111`, `SysvarRent111111111111111111111111111111111`],
    instructions: [],
    logs: []
  }, {
    signature: `4BM25rsWFJWVR2XWGo9CFFyKN19JzJk3SRkENJ98SA3ZQ33HXmvDtfU2WRUzLd3vdHzE8SJL86F5wdBegbMnho5N`,
    slot: 515812274,
    blockTime: 1793132637,
    ok: true,
    error: null,
    computeUnits: 5340,
    fee: 10054,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `FMJCnCi1U9m8H5SNi2oypQoqxjVnHr22g6pGn9EFkJev`, `6sHufVFfaMwxPuDKxBuV8qZqNot8bJNgtFKhZKXHdhSw`, `Fa7duuD1HT8znK9SxUQv2rBhNnAEshX1SDrjjZG97D2a`, `11111111111111111111111111111111`, `BPFLoaderUpgradeab1e11111111111111111111111`, `ComputeBudget111111111111111111111111111111`],
    instructions: [],
    logs: []
  }, {
    signature: `2S9vbgvfuedvcnEL28Hq7JGViaHoe6CBfLrJYtpZGHoPiKFt3MTciZAdkkaDTzuZQa7GMmLmA1ychBnBMnfVEzrg`,
    slot: 515811254,
    blockTime: 1793132393,
    ok: true,
    error: null,
    computeUnits: 21883,
    fee: 5000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `6sHufVFfaMwxPuDKxBuV8qZqNot8bJNgtFKhZKXHdhSw`, `ComputeBudget111111111111111111111111111111`],
    instructions: [{
      program: `qsim`,
      programName: `qsim`,
      name: `simulate`,
      numQubits: 5,
      circuitBytes: 14,
      outcomes: 32,
      shots: 1024,
      score: {
        numQubits: 5,
        shots: 1024,
        outcomes: 32,
        fidelity: 0.071205,
        tvd: 0.928711,
        xeb: 0.140625,
        circuitHash: `cac36fb6fc57b1c88e5271d846ff2a4f219baa4c4af593831b3bee756209c8a1`
      }
    }],
    logs: [`Instruction: Simulate`, `qsim 5 qubits, 1024 shots: fidelity 71205 ppm, tvd 928711 ppm, xeb 140625 ppm`]
  }, {
    signature: `2oeV9yhzmd5RBgAshXfUDAVw92LR2cwjed5RrqD3Vjg3K4MoAtiiTBfsxATfe5EZDdL6HPNjZ9cEvMqvmJgw8c5a`,
    slot: 515811246,
    blockTime: 1793132391,
    ok: true,
    error: null,
    computeUnits: 14508,
    fee: 5000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `6sHufVFfaMwxPuDKxBuV8qZqNot8bJNgtFKhZKXHdhSw`, `ComputeBudget111111111111111111111111111111`],
    instructions: [{
      program: `qsim`,
      programName: `qsim`,
      name: `simulate`,
      numQubits: 5,
      circuitBytes: 14,
      outcomes: 17,
      shots: 1024,
      score: {
        numQubits: 5,
        shots: 1024,
        outcomes: 17,
        fidelity: 0.894505,
        tvd: 0.105469,
        xeb: 13.3125,
        circuitHash: `cac36fb6fc57b1c88e5271d846ff2a4f219baa4c4af593831b3bee756209c8a1`
      }
    }],
    logs: [`Instruction: Simulate`, `qsim 5 qubits, 1024 shots: fidelity 894505 ppm, tvd 105469 ppm, xeb 13312500 ppm`]
  }, {
    signature: `2qEHw3LPtqqULGyks3YkVAKC338RiQfJ3ehwzdYY5UxVbQTRuaNXhEwh36TpvWbJmfEoYgYU7YkVRqzXeyg578P6`,
    slot: 515811238,
    blockTime: 1793132389,
    ok: true,
    error: null,
    computeUnits: 7754,
    fee: 5000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `6sHufVFfaMwxPuDKxBuV8qZqNot8bJNgtFKhZKXHdhSw`, `ComputeBudget111111111111111111111111111111`],
    instructions: [{
      program: `qsim`,
      programName: `qsim`,
      name: `simulate`,
      numQubits: 5,
      circuitBytes: 14,
      outcomes: 2,
      shots: 1024,
      score: {
        numQubits: 5,
        shots: 1024,
        outcomes: 2,
        fidelity: 0.999966,
        tvd: 0.005859,
        xeb: 15,
        circuitHash: `cac36fb6fc57b1c88e5271d846ff2a4f219baa4c4af593831b3bee756209c8a1`
      }
    }],
    logs: [`Instruction: Simulate`, `qsim 5 qubits, 1024 shots: fidelity 999966 ppm, tvd 5859 ppm, xeb 15000000 ppm`]
  }, {
    signature: `5De3THb9qnyigSJEYNLv5q41aCXeqWtnf3H5MvXTS7NtCDFSYhCr2Qiwo1DGny7MVxMYQB8BN8PmUwtiYTL9vCDT`,
    slot: 515811017,
    blockTime: 1793132336,
    ok: true,
    error: null,
    computeUnits: 2970,
    fee: 10030,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `6sHufVFfaMwxPuDKxBuV8qZqNot8bJNgtFKhZKXHdhSw`, `6N6tA3eT5QUmTZEH575t81xxChJbrWdZRYe4e7PPZvYd`, `Fa7duuD1HT8znK9SxUQv2rBhNnAEshX1SDrjjZG97D2a`, `11111111111111111111111111111111`, `BPFLoaderUpgradeab1e11111111111111111111111`, `ComputeBudget111111111111111111111111111111`, `SysvarC1ock11111111111111111111111111111111`, `SysvarRent111111111111111111111111111111111`],
    instructions: [],
    logs: []
  }, {
    signature: `3BsBMzUaveqAhG4aVeZUAaKVfJfqEU9JQgFTExAMArDtd3iWZngSe1knpLKcGkThS5VeiKML15xbAJ4mPX4hCtnK`,
    slot: 515786785,
    blockTime: 1793126542,
    ok: true,
    error: null,
    computeUnits: 304119,
    fee: 5000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `3Wp61ty5oWDDUkkgP9541Sdi9JFikYjC6LgvEQoDWmrS`, `4GjtPCQ8fnyLLuiFC1eo1LbS7HeXqtFX78v5zjqqXDVK`, `C1m36sg6eJPRFohDmm8DG79HKjQpVatYNpBCJpMNfsHk`, `EhEQCn2UtJk1Z4cvEeucaPrNJkbH8gLKNVPzrUNgA9AE`, `ComputeBudget111111111111111111111111111111`, `E4cwdChwHz3bqfeLUdJcRnPSsgKBEz7mwov1qCHgEmsK`, `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`],
    instructions: [{
      program: `qpt_blueshift`,
      programName: `qpt · blueshift`,
      name: `execute_pq`,
      signatureBytes: 666,
      expiresAtSlot: 515786931,
      entry: `3Wp61ty5oWDDUkkgP9541Sdi9JFikYjC6LgvEQoDWmrS`,
      wallet: `EhEQCn2UtJk1Z4cvEeucaPrNJkbH8gLKNVPzrUNgA9AE`,
      calls: [{
        kind: `token`,
        amount: `250000000`
      }]
    }],
    logs: [`Instruction: ExecutePq`, `qpt entry #0: ran 1 instruction(s) (Falcon)`]
  }, {
    signature: `622MZL9xdKrsoAU19fZpX5ZATMsGRn6uf65ujZr7UpLSVwpvUJpSv9Anz5TB9F9B29yo81uM582owrbAJvgTX8Rn`,
    slot: 515786577,
    blockTime: 1793126491,
    ok: true,
    error: null,
    computeUnits: 335007,
    fee: 5000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `3Wp61ty5oWDDUkkgP9541Sdi9JFikYjC6LgvEQoDWmrS`, `EhEQCn2UtJk1Z4cvEeucaPrNJkbH8gLKNVPzrUNgA9AE`, `11111111111111111111111111111111`, `ComputeBudget111111111111111111111111111111`, `E4cwdChwHz3bqfeLUdJcRnPSsgKBEz7mwov1qCHgEmsK`, `MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr`],
    instructions: [{
      program: `qpt_blueshift`,
      programName: `qpt · blueshift`,
      name: `execute_pq`,
      signatureBytes: 666,
      expiresAtSlot: 515786723,
      entry: `3Wp61ty5oWDDUkkgP9541Sdi9JFikYjC6LgvEQoDWmrS`,
      wallet: `EhEQCn2UtJk1Z4cvEeucaPrNJkbH8gLKNVPzrUNgA9AE`,
      calls: [{
        kind: `sol`,
        lamports: 5000000
      }, {
        kind: `memo`,
        text: `nexq: paid by a Falcon-512 smart account`
      }]
    }],
    logs: [`Instruction: ExecutePq`, `Signed by EhEQCn2UtJk1Z4cvEeucaPrNJkbH8gLKNVPzrUNgA9AE`, `Memo (len 40): "nexq: paid by a Falcon-512 smart account"`, `qpt entry #0: ran 2 instruction(s) (Falcon)`]
  }, {
    signature: `5wi34BrxK4apMMM8sj4Kqh7aBDqnjeJdoRnenNuE9iDexMDbnuk3Q48uify1JKS353oa2iXaXMx2MAjZUiSbqrd3`,
    slot: 515786181,
    blockTime: 1793126396,
    ok: true,
    error: null,
    computeUnits: 2670,
    fee: 5027,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `AA1sDp2a9fydXz4byxApSuge2xbetiqtQczGpr7Y3yYB`, `AUqTmxjBEfwRf1WW9UAUGS8BKHtqS1JvnXfQoAcWCDis`, `BfcVJr4WTEJyZfDZ1LtnnmqCiDsVBiHtxiLM7KesoFqG`, `BPFLoaderUpgradeab1e11111111111111111111111`, `ComputeBudget111111111111111111111111111111`, `SysvarC1ock11111111111111111111111111111111`, `SysvarRent111111111111111111111111111111111`],
    instructions: [],
    logs: []
  }, {
    signature: `4RiJp8QCjjsNcEsvF5XdXx2R8di1K39T5RSxMujamY8X2gvktZZ31ngdJ9eqAPdEvz5fPCtURitcfEskX6MTQmNV`,
    slot: 515786157,
    blockTime: 1793126390,
    ok: true,
    error: null,
    computeUnits: 5340,
    fee: 10054,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `AA1sDp2a9fydXz4byxApSuge2xbetiqtQczGpr7Y3yYB`, `AUqTmxjBEfwRf1WW9UAUGS8BKHtqS1JvnXfQoAcWCDis`, `BfcVJr4WTEJyZfDZ1LtnnmqCiDsVBiHtxiLM7KesoFqG`, `11111111111111111111111111111111`, `BPFLoaderUpgradeab1e11111111111111111111111`, `ComputeBudget111111111111111111111111111111`],
    instructions: [],
    logs: []
  }, {
    signature: `4P5NKU6XFALuvhDb65LJ1ph6Y6yoJtmCQG6ab1qKpVTKhH4Gu4FoQBjZvHaUUpr46iT3U8JgTpdkhatECa2NnUiw`,
    slot: 515786119,
    blockTime: 1793126381,
    ok: true,
    error: null,
    computeUnits: 2670,
    fee: 5027,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `E4cwdChwHz3bqfeLUdJcRnPSsgKBEz7mwov1qCHgEmsK`, `FEgN9mDUsP7VzuWFFteYRLCts6tSpBmggxdFrhpSJhe1`, `GGUaP4ru2dpm8Mw331UYGPKEzdYZXmfgipL3WbAANCRy`, `BPFLoaderUpgradeab1e11111111111111111111111`, `ComputeBudget111111111111111111111111111111`, `SysvarC1ock11111111111111111111111111111111`, `SysvarRent111111111111111111111111111111111`],
    instructions: [],
    logs: []
  }, {
    signature: `62qT46T8yARCqH5K28bNUYghEbiCg5zhuWnnvVrugL1EvTVqdS62rHEE4Lna4KioW65G6cs6iTBgtf7b1LgUPqmP`,
    slot: 515786051,
    blockTime: 1793126365,
    ok: true,
    error: null,
    computeUnits: 5340,
    fee: 10054,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `GGUaP4ru2dpm8Mw331UYGPKEzdYZXmfgipL3WbAANCRy`, `E4cwdChwHz3bqfeLUdJcRnPSsgKBEz7mwov1qCHgEmsK`, `FEgN9mDUsP7VzuWFFteYRLCts6tSpBmggxdFrhpSJhe1`, `11111111111111111111111111111111`, `BPFLoaderUpgradeab1e11111111111111111111111`, `ComputeBudget111111111111111111111111111111`],
    instructions: [],
    logs: []
  }, {
    signature: `2LMH6LcjVrjyz7gxaHY7JtyCPPTdXMDXGrxhSRMT2ZwUrwgT3YSeMXkE1wsioe17EAJaNyitd8QcXrhgrWaQ2W9q`,
    slot: 515568940,
    blockTime: 1793074508,
    ok: true,
    error: null,
    computeUnits: 298426,
    fee: 5000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `3Wp61ty5oWDDUkkgP9541Sdi9JFikYjC6LgvEQoDWmrS`, `ComputeBudget111111111111111111111111111111`, `E4cwdChwHz3bqfeLUdJcRnPSsgKBEz7mwov1qCHgEmsK`],
    instructions: [{
      program: `qpt_blueshift`,
      programName: `qpt · blueshift`,
      name: `withdraw_pq`,
      amount: 10000000,
      signatureBytes: 666,
      entry: `3Wp61ty5oWDDUkkgP9541Sdi9JFikYjC6LgvEQoDWmrS`,
      destination: `5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`
    }],
    logs: [`Instruction: WithdrawPq`, `qpt entry #0: Falcon withdrawal of 10000000 lamports`]
  }, {
    signature: `51VbsRdx3hWUjSepxWe3cyVcnzfT5JzrxRrzzfBLcsBFihpkgobWEqE3fiphZK3hcYBd6SEqJAqH1XrYb2TbPwdv`,
    slot: 515568895,
    blockTime: 1793074497,
    ok: true,
    error: null,
    computeUnits: 2670,
    fee: 5027,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `517MrNBL4fFgyVaRrffKSdzF94BxudjPQApNYwj656D3`, `E4cwdChwHz3bqfeLUdJcRnPSsgKBEz7mwov1qCHgEmsK`, `FEgN9mDUsP7VzuWFFteYRLCts6tSpBmggxdFrhpSJhe1`, `BPFLoaderUpgradeab1e11111111111111111111111`, `ComputeBudget111111111111111111111111111111`, `SysvarC1ock11111111111111111111111111111111`, `SysvarRent111111111111111111111111111111111`],
    instructions: [],
    logs: []
  }, {
    signature: `5qdsneZLMngJAktxcJjmGQwmzW2RizzS1WRasUTRrYTp1pxgoxw5mNkFrzYBVXtSJVJCttPqHEeTTBkYvB3VxtB8`,
    slot: 515568373,
    blockTime: 1793074372,
    ok: true,
    error: null,
    computeUnits: 308863,
    fee: 5000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `3Wp61ty5oWDDUkkgP9541Sdi9JFikYjC6LgvEQoDWmrS`, `ComputeBudget111111111111111111111111111111`, `E4cwdChwHz3bqfeLUdJcRnPSsgKBEz7mwov1qCHgEmsK`],
    instructions: [{
      program: `qpt_blueshift`,
      programName: `qpt · blueshift`,
      name: `withdraw_pq`,
      amount: 40000000,
      signatureBytes: 666,
      entry: `3Wp61ty5oWDDUkkgP9541Sdi9JFikYjC6LgvEQoDWmrS`,
      destination: `5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`
    }],
    logs: [`Instruction: WithdrawPq`, `qpt entry #0: Falcon withdrawal of 40000000 lamports`]
  }, {
    signature: `8wZSCuuL82gPA94Tc9HrBvFMsd29ZZUL1jiNWtnxo8TfbaL2tHqaHgWDxxQWoa2BzdBjYmNu6MzQU1YbTWabi2D`,
    slot: 515568362,
    blockTime: 1793074369,
    ok: true,
    error: null,
    computeUnits: 4211,
    fee: 10000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `E9wWoP6iC6GJNBUa4jKCgi6EHK3QnG8WJQmR9WGvWwNc`, `3Wp61ty5oWDDUkkgP9541Sdi9JFikYjC6LgvEQoDWmrS`, `E4cwdChwHz3bqfeLUdJcRnPSsgKBEz7mwov1qCHgEmsK`],
    instructions: [{
      program: `qpt_blueshift`,
      programName: `qpt · blueshift`,
      name: `enable_qday`
    }],
    logs: [`Instruction: EnableQday`, `qpt entry #0: Q-Day mode on`]
  }, {
    signature: `3mxuT5dksb6gqBFJtxQE8P1muptvi2nbyr19vzwNa2yJ2YujCY3DP7V8sgB5KJLEEvjFvkMNQztwDaQXfwzqA3hc`,
    slot: 515568354,
    blockTime: 1793074367,
    ok: true,
    error: null,
    computeUnits: 4384,
    fee: 5000,
    accounts: [`E9wWoP6iC6GJNBUa4jKCgi6EHK3QnG8WJQmR9WGvWwNc`, `3Wp61ty5oWDDUkkgP9541Sdi9JFikYjC6LgvEQoDWmrS`, `E4cwdChwHz3bqfeLUdJcRnPSsgKBEz7mwov1qCHgEmsK`],
    instructions: [{
      program: `qpt_blueshift`,
      programName: `qpt · blueshift`,
      name: `withdraw`,
      amount: 10000000
    }],
    logs: [`Instruction: Withdraw`]
  }, {
    signature: `4xUK7ySUDwiKDXVnRJnR4EKJY79uWEa163N4eWok6ydkhaVeqP3X8J5NRNKqcbcoxtmt6z4CmpJcg9R2AEjSxiK3`,
    slot: 515568338,
    blockTime: 1793074363,
    ok: true,
    error: null,
    computeUnits: 63234,
    fee: 5000,
    accounts: [`E9wWoP6iC6GJNBUa4jKCgi6EHK3QnG8WJQmR9WGvWwNc`, `3GWMeSVXTNJfi6WKkRCWEobpXGqNqRNF9LDGpTAMvjnh`, `3Wp61ty5oWDDUkkgP9541Sdi9JFikYjC6LgvEQoDWmrS`, `11111111111111111111111111111111`, `drPoQGVC7CAEZdJ63VYqmqvH5cxRje9dvQufAuTzkGo`, `E4cwdChwHz3bqfeLUdJcRnPSsgKBEz7mwov1qCHgEmsK`],
    instructions: [{
      program: `qpt_blueshift`,
      programName: `qpt · blueshift`,
      name: `register`,
      keyBytes: 897,
      entry: `3Wp61ty5oWDDUkkgP9541Sdi9JFikYjC6LgvEQoDWmrS`
    }],
    logs: [`Instruction: Register`, `qpt entry #0 registered at slot 515568338`]
  }, {
    signature: `VkXFf2ydSVAsb4cDU1vh65LJBxmgU8tRtaEuGyJcpMwEsqW3Z8CKjknLfGUmGAZA5Gs6YW7L5mRdUdfhznFGerT`,
    slot: 515568330,
    blockTime: 1793074361,
    ok: true,
    error: null,
    computeUnits: 7387,
    fee: 5000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `3GWMeSVXTNJfi6WKkRCWEobpXGqNqRNF9LDGpTAMvjnh`, `11111111111111111111111111111111`, `E4cwdChwHz3bqfeLUdJcRnPSsgKBEz7mwov1qCHgEmsK`],
    instructions: [{
      program: `qpt_blueshift`,
      programName: `qpt · blueshift`,
      name: `initialize`
    }],
    logs: [`Instruction: Initialize`]
  }, {
    signature: `Tk4Pd1v7GjShe3CTotA1D49TwkvSmaT7zk3XyHKAaEMN9Z2fRQBws4FMwyAPxZwZ6zKMBo1gMPnxrKay2LarP5o`,
    slot: 515568314,
    blockTime: 1793074358,
    ok: true,
    error: null,
    computeUnits: 13305,
    fee: 5000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `CCNMB5dw7DKqDGQ5J83bQggEXcKVxQx6uHXxeSQUNJVS`, `drPoQGVC7CAEZdJ63VYqmqvH5cxRje9dvQufAuTzkGo`, `11111111111111111111111111111111`, `6pxqWGoxSRBwmL6GJie9BD43HGe3ybFu9xmJQ24TvcXB`],
    instructions: [{
      program: `qproof`,
      programName: `qproof`,
      name: `record_job`,
      source: `LocalSimulator`,
      backend: `qiskit:statevector`
    }],
    logs: [`Instruction: RecordJob`, `qproof receipt #5 source LocalSimulator backend qiskit:statevector shots 256`]
  }, {
    signature: `2RgChY49yPM7ch94APrZx67Qxe1BfEs921jbTgTRzP15uvnw7iRLjncJYvbHpJUR1x2ohFc3SUG4SyJUewPrzWFQ`,
    slot: 515568255,
    blockTime: 1793074344,
    ok: true,
    error: null,
    computeUnits: 2970,
    fee: 10030,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `E4cwdChwHz3bqfeLUdJcRnPSsgKBEz7mwov1qCHgEmsK`, `4e5eH7C21SLytmKUyxg9m9ST6zP2vGsqSbyZ6nVw9FhD`, `FEgN9mDUsP7VzuWFFteYRLCts6tSpBmggxdFrhpSJhe1`, `11111111111111111111111111111111`, `BPFLoaderUpgradeab1e11111111111111111111111`, `ComputeBudget111111111111111111111111111111`, `SysvarC1ock11111111111111111111111111111111`, `SysvarRent111111111111111111111111111111111`],
    instructions: [],
    logs: []
  }, {
    signature: `3EJwJRGVmfdFE3cbCea9aMsR3GBtVuaVq7qNgYZ6TZe6FsfeGz24w1EtPUK53YVuHyQ9AX8LVfx7a26yxhnJyyCu`,
    slot: 515565339,
    blockTime: 1793073648,
    ok: true,
    error: null,
    computeUnits: 673282,
    fee: 5000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `9WcG2Jhk9ddz99mFKUMmthnF9zSkYB33HqGGKcykfTEL`, `BfcVJr4WTEJyZfDZ1LtnnmqCiDsVBiHtxiLM7KesoFqG`, `ComputeBudget111111111111111111111111111111`],
    instructions: [{
      program: `qpt`,
      programName: `qpt · fn-dsa`,
      name: `withdraw_pq`,
      amount: 40000000,
      signatureBytes: 666,
      entry: `9WcG2Jhk9ddz99mFKUMmthnF9zSkYB33HqGGKcykfTEL`,
      destination: `5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`
    }],
    logs: [`Instruction: WithdrawPq`, `qpt entry #0: Falcon withdrawal of 40000000 lamports`]
  }, {
    signature: `2ZUj7kPR6G9aHgvaxa6E7B3fhFK9W1ZYJVK7tUWdAB65BEtkYJgZHRqEmZo4PbAyfeh6tN7gKuqy34CNjUPSZsTG`,
    slot: 515565328,
    blockTime: 1793073646,
    ok: true,
    error: null,
    computeUnits: 4194,
    fee: 10000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `CVhpRKjJyXCppfsgYL58iTJnNMBwtNXJ8TAKgvVzV3tn`, `9WcG2Jhk9ddz99mFKUMmthnF9zSkYB33HqGGKcykfTEL`, `BfcVJr4WTEJyZfDZ1LtnnmqCiDsVBiHtxiLM7KesoFqG`],
    instructions: [{
      program: `qpt`,
      programName: `qpt · fn-dsa`,
      name: `enable_qday`
    }],
    logs: [`Instruction: EnableQday`, `qpt entry #0: Q-Day mode on`]
  }, {
    signature: `59McifqDVRx43A17W2xKwQWPq3VKpxfEYkcXXJGSaLXmcTdwhyQemu9tVMnec4mJHSL53TeAwNP2JbkwmMUtTCnc`,
    slot: 515565320,
    blockTime: 1793073644,
    ok: true,
    error: null,
    computeUnits: 4368,
    fee: 5000,
    accounts: [`CVhpRKjJyXCppfsgYL58iTJnNMBwtNXJ8TAKgvVzV3tn`, `9WcG2Jhk9ddz99mFKUMmthnF9zSkYB33HqGGKcykfTEL`, `BfcVJr4WTEJyZfDZ1LtnnmqCiDsVBiHtxiLM7KesoFqG`],
    instructions: [{
      program: `qpt`,
      programName: `qpt · fn-dsa`,
      name: `withdraw`,
      amount: 10000000
    }],
    logs: [`Instruction: Withdraw`]
  }, {
    signature: `2QqGXqc4PxVGJ2hJVnaVfE7tef8KugupTaCXLyPTKE6Gs9vXXJPGP7J85vgTMUiBqKw8XBzwiRzuFYDueDPtAT3J`,
    slot: 515565304,
    blockTime: 1793073640,
    ok: true,
    error: null,
    computeUnits: 122937,
    fee: 5000,
    accounts: [`CVhpRKjJyXCppfsgYL58iTJnNMBwtNXJ8TAKgvVzV3tn`, `7Z29YurtmRTM45KMn2pEv8B3CJmfYPozSbgCv1pdnLzN`, `9WcG2Jhk9ddz99mFKUMmthnF9zSkYB33HqGGKcykfTEL`, `11111111111111111111111111111111`, `5PTXUkAS79gMdduNKW64i4oL9bs5BqPtnJCdyivYA9e8`, `BfcVJr4WTEJyZfDZ1LtnnmqCiDsVBiHtxiLM7KesoFqG`],
    instructions: [{
      program: `qpt`,
      programName: `qpt · fn-dsa`,
      name: `register`,
      keyBytes: 897,
      entry: `9WcG2Jhk9ddz99mFKUMmthnF9zSkYB33HqGGKcykfTEL`
    }],
    logs: [`Instruction: Register`, `qpt entry #0 registered at slot 515565304`]
  }, {
    signature: `2T1XnVbL6AGQ1ACENgeb3hZfzzTZjCSJEn25GLDL1wPw124pqs42n6xTL7FFPewsbiZMfTe6p5WTFY6HuyQD2GtK`,
    slot: 515565296,
    blockTime: 1793073638,
    ok: true,
    error: null,
    computeUnits: 8880,
    fee: 5000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `7Z29YurtmRTM45KMn2pEv8B3CJmfYPozSbgCv1pdnLzN`, `11111111111111111111111111111111`, `BfcVJr4WTEJyZfDZ1LtnnmqCiDsVBiHtxiLM7KesoFqG`],
    instructions: [{
      program: `qpt`,
      programName: `qpt · fn-dsa`,
      name: `initialize`
    }],
    logs: [`Instruction: Initialize`]
  }, {
    signature: `52Lf625Mf3pVVkr5X19fDcTcgZ7aZmehvLXv6EcxBZjUqv92cPT7FGZeMJLizW6jpKcDPfcx2fpUdxMh35svZhDb`,
    slot: 515565255,
    blockTime: 1793073628,
    ok: true,
    error: null,
    computeUnits: 11805,
    fee: 5000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `5PTXUkAS79gMdduNKW64i4oL9bs5BqPtnJCdyivYA9e8`, `CCNMB5dw7DKqDGQ5J83bQggEXcKVxQx6uHXxeSQUNJVS`, `11111111111111111111111111111111`, `6pxqWGoxSRBwmL6GJie9BD43HGe3ybFu9xmJQ24TvcXB`],
    instructions: [{
      program: `qproof`,
      programName: `qproof`,
      name: `record_job`,
      source: `LocalSimulator`,
      backend: `qiskit:statevector`
    }],
    logs: [`Instruction: RecordJob`, `qproof receipt #4 source LocalSimulator backend qiskit:statevector shots 256`]
  }, {
    signature: `2YEdPv2f4K7SwYMCKsUtmwSBjwTnUKgLSqvKMCpdS11XxuT2fGKFY4CoLxPDW7PFAT9sF2h8Ju7oN45LiSYfM2hu`,
    slot: 515565160,
    blockTime: 1793073606,
    ok: true,
    error: null,
    computeUnits: 2970,
    fee: 10030,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `BfcVJr4WTEJyZfDZ1LtnnmqCiDsVBiHtxiLM7KesoFqG`, `AUqTmxjBEfwRf1WW9UAUGS8BKHtqS1JvnXfQoAcWCDis`, `HgFnXcoR9vMFTqnfwYAoqR9scYgzxUoPTnoEyF8HW33X`, `11111111111111111111111111111111`, `BPFLoaderUpgradeab1e11111111111111111111111`, `ComputeBudget111111111111111111111111111111`, `SysvarC1ock11111111111111111111111111111111`, `SysvarRent111111111111111111111111111111111`],
    instructions: [],
    logs: []
  }, {
    signature: `5XBW7ZaDvNyewcurhfmDrJZ7VBM1ebKeBVmESgKVEcLTEtkSDF7Xfk45x6LcjZy7QkvLq8Bn5329B9JyWzdfCdCa`,
    slot: 515465662,
    blockTime: 1793049851,
    ok: true,
    error: null,
    computeUnits: 4719,
    fee: 5000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `6Gd8Yf7UnM3RxPkknAfNtMm9D3qTSsWmxSfrY6Yy7dcU`, `HzJgKKS8W5B51NKcrj8jvermJSiV3ByDrPkZQYFikN3C`, `FZXp8BVcsPZcE6ZP4wCYouMsupGEGKSZFwNfzNaoiQmm`],
    instructions: [{
      program: `qentropy`,
      programName: `qentropy`,
      name: `reveal`
    }],
    logs: [`Instruction: Reveal`, `qentropy var 1793049840812 round 0 finalized`]
  }, {
    signature: `2b9bL26ku4ku7VUpMc9b4a3Rn4hJpqAfiPYSGFmgaKoUMvTqwq8RWDFWSqrgw1LegLU3AyWvMm9Uoc9oaYT3aXTi`,
    slot: 515465659,
    blockTime: 1793049850,
    ok: true,
    error: null,
    computeUnits: 4009,
    fee: 5000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `6Gd8Yf7UnM3RxPkknAfNtMm9D3qTSsWmxSfrY6Yy7dcU`, `FZXp8BVcsPZcE6ZP4wCYouMsupGEGKSZFwNfzNaoiQmm`, `SysvarS1otHashes111111111111111111111111111`],
    instructions: [{
      program: `qentropy`,
      programName: `qentropy`,
      name: `sample`
    }],
    logs: [`Instruction: Sample`, `qentropy var 1793049840812 sampled slot 515465646`]
  }, {
    signature: `2HfYRFVdrMpLfPY4Vb5xBesdUib7FFgSMTNSKJRJhFXZkmkFpcR3PaH4MCCJhLyDBiWNPnCxevkMiLZPSbdvWoAq`,
    slot: 515465620,
    blockTime: 1793049841,
    ok: true,
    error: null,
    computeUnits: 21597,
    fee: 5000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `6Gd8Yf7UnM3RxPkknAfNtMm9D3qTSsWmxSfrY6Yy7dcU`, `HzJgKKS8W5B51NKcrj8jvermJSiV3ByDrPkZQYFikN3C`, `11111111111111111111111111111111`, `AAGMznL9PRwMUfnkWzUpEL71vkUvCnfF5CptoVtBFW5K`, `FZXp8BVcsPZcE6ZP4wCYouMsupGEGKSZFwNfzNaoiQmm`],
    instructions: [{
      program: `qentropy`,
      programName: `qentropy`,
      name: `open`
    }],
    logs: [`Instruction: Open`, `qentropy var 1793049840812 opened, end slot 515465646, 16 samples, receipt AAGMznL9PRwMUfnkWzUpEL71vkUvCnfF5CptoVtBFW5K`]
  }, {
    signature: `389gHTUkmVz6eecutBt7GKECqvaFiFuAwCxeT87i4Si3nUV8f7Jm93EEYvJtaWdRYYA97Nf8nHMUq76jvCb8aCwg`,
    slot: 515465616,
    blockTime: 1793049840,
    ok: true,
    error: null,
    computeUnits: 14825,
    fee: 5000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `AAGMznL9PRwMUfnkWzUpEL71vkUvCnfF5CptoVtBFW5K`, `CCNMB5dw7DKqDGQ5J83bQggEXcKVxQx6uHXxeSQUNJVS`, `11111111111111111111111111111111`, `6pxqWGoxSRBwmL6GJie9BD43HGe3ybFu9xmJQ24TvcXB`],
    instructions: [{
      program: `qproof`,
      programName: `qproof`,
      name: `record_job`,
      source: `Qpu`,
      backend: `ibm:ibm_fez`
    }],
    logs: [`Instruction: RecordJob`, `qproof receipt #3 source Qpu backend ibm:ibm_fez shots 256`]
  }, {
    signature: `txZ4KJERQK7QoDDXWfuRaqpnr2o7WzjJiBpsM1euuho7vquxWDDLAp2m1dU6HK45eTUxfpTkb6sCwznjobQFPt4`,
    slot: 515446284,
    blockTime: 1793045222,
    ok: true,
    error: null,
    computeUnits: 4719,
    fee: 5000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `F7GYKL8jDwvAxZvxehfWpS9wJ3SwWVkfaFkKLJT1abHD`, `HzJgKKS8W5B51NKcrj8jvermJSiV3ByDrPkZQYFikN3C`, `FZXp8BVcsPZcE6ZP4wCYouMsupGEGKSZFwNfzNaoiQmm`],
    instructions: [{
      program: `qentropy`,
      programName: `qentropy`,
      name: `reveal`
    }],
    logs: [`Instruction: Reveal`, `qentropy var 1793045212492 round 0 finalized`]
  }, {
    signature: `5ySnMwuRSQsrgVMmvtFjJ6JaPvvPLVfZ41QXrxDfyYbLuvfiE2AiNBZ7zSmpo7zvfcYqkXVPVUaiZEnkv8NQHZrb`,
    slot: 515446280,
    blockTime: 1793045222,
    ok: true,
    error: null,
    computeUnits: 3983,
    fee: 5000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `F7GYKL8jDwvAxZvxehfWpS9wJ3SwWVkfaFkKLJT1abHD`, `FZXp8BVcsPZcE6ZP4wCYouMsupGEGKSZFwNfzNaoiQmm`, `SysvarS1otHashes111111111111111111111111111`],
    instructions: [{
      program: `qentropy`,
      programName: `qentropy`,
      name: `sample`
    }],
    logs: [`Instruction: Sample`, `qentropy var 1793045212492 sampled slot 515446269`]
  }, {
    signature: `2p3NEsScaebVFkxpE6AG6pbJzVAZWMpqwAGQCbr9VUGFqwFSmrhva5bBjNoDnjKSYCb57oTzfZY166QsyhZDFYMy`,
    slot: 515446242,
    blockTime: 1793045212,
    ok: true,
    error: null,
    computeUnits: 18531,
    fee: 5000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `F7GYKL8jDwvAxZvxehfWpS9wJ3SwWVkfaFkKLJT1abHD`, `HzJgKKS8W5B51NKcrj8jvermJSiV3ByDrPkZQYFikN3C`, `11111111111111111111111111111111`, `F5DijW6T9v1vbWWnL9TKSkd2fw1Uw4gtHbxND5daKCjz`, `FZXp8BVcsPZcE6ZP4wCYouMsupGEGKSZFwNfzNaoiQmm`],
    instructions: [{
      program: `qentropy`,
      programName: `qentropy`,
      name: `open`
    }],
    logs: [`Instruction: Open`, `qentropy var 1793045212492 opened, end slot 515446269, 16 samples, receipt F5DijW6T9v1vbWWnL9TKSkd2fw1Uw4gtHbxND5daKCjz`]
  }, {
    signature: `nXb5GHrHyP9eM84MByRy6h6J1kZiejUMvgT4RCvQwkJwUBKzin469K5r93zDFZhiCZr7JeDGuiNvtYQQRsa49Rw`,
    slot: 515446238,
    blockTime: 1793045211,
    ok: true,
    error: null,
    computeUnits: 11805,
    fee: 5000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `CCNMB5dw7DKqDGQ5J83bQggEXcKVxQx6uHXxeSQUNJVS`, `F5DijW6T9v1vbWWnL9TKSkd2fw1Uw4gtHbxND5daKCjz`, `11111111111111111111111111111111`, `6pxqWGoxSRBwmL6GJie9BD43HGe3ybFu9xmJQ24TvcXB`],
    instructions: [{
      program: `qproof`,
      programName: `qproof`,
      name: `record_job`,
      source: `LocalSimulator`,
      backend: `qiskit:statevector`
    }],
    logs: [`Instruction: RecordJob`, `qproof receipt #2 source LocalSimulator backend qiskit:statevector shots 256`]
  }, {
    signature: `3jiSkbs3x4DFv4VHieAfkSpMAg8gEWzY4S8H5gLFasZnpnBsxifcXAJNSECP7T5YCPRWYxTQGgaNQcyyVcPDFyHY`,
    slot: 515407422,
    blockTime: 1793035955,
    ok: true,
    error: null,
    computeUnits: 4719,
    fee: 5000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `2RKjymQd6tuuypri98M8b9kVX7zfyPGg5QGV4uSTTmMs`, `HzJgKKS8W5B51NKcrj8jvermJSiV3ByDrPkZQYFikN3C`, `FZXp8BVcsPZcE6ZP4wCYouMsupGEGKSZFwNfzNaoiQmm`],
    instructions: [{
      program: `qentropy`,
      programName: `qentropy`,
      name: `reveal`
    }],
    logs: [`Instruction: Reveal`, `qentropy var 1793035945650 round 0 finalized`]
  }, {
    signature: `YWwkfpynDDqXEakZmB5UWufdrN8Zt9D278QNePzTnp8X1zrEEahQEJ7SBPTjwRcFnFGkcphu3WmHqbgFbSyRma6`,
    slot: 515407419,
    blockTime: 1793035955,
    ok: true,
    error: null,
    computeUnits: 4009,
    fee: 5000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `2RKjymQd6tuuypri98M8b9kVX7zfyPGg5QGV4uSTTmMs`, `FZXp8BVcsPZcE6ZP4wCYouMsupGEGKSZFwNfzNaoiQmm`, `SysvarS1otHashes111111111111111111111111111`],
    instructions: [{
      program: `qentropy`,
      programName: `qentropy`,
      name: `sample`
    }],
    logs: [`Instruction: Sample`, `qentropy var 1793035945650 sampled slot 515407406`]
  }, {
    signature: `3t8Dn1NEdXUNoMqizptjZqXN86ag755J4zpAMb2MA7C8YzKNgkB24ucQVXNmukFVnfcHFWJzbXY7FNoYwF5H5rxB`,
    slot: 515407380,
    blockTime: 1793035945,
    ok: true,
    error: null,
    computeUnits: 20125,
    fee: 5000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `2RKjymQd6tuuypri98M8b9kVX7zfyPGg5QGV4uSTTmMs`, `HzJgKKS8W5B51NKcrj8jvermJSiV3ByDrPkZQYFikN3C`, `11111111111111111111111111111111`, `2kmGNbfghfBxs5LQmhyuTQeHEgfdy5LtcyttcPKvk5Dz`, `FZXp8BVcsPZcE6ZP4wCYouMsupGEGKSZFwNfzNaoiQmm`],
    instructions: [{
      program: `qentropy`,
      programName: `qentropy`,
      name: `open`
    }],
    logs: [`Instruction: Open`, `qentropy var 1793035945650 opened, end slot 515407406, 16 samples, receipt 2kmGNbfghfBxs5LQmhyuTQeHEgfdy5LtcyttcPKvk5Dz`]
  }, {
    signature: `4sizto5uL8rxD6WvRZy64ifnqy4XTVZWGPEEBPYSdY8B6GDkmqMVsamM35wah5uvHcfHvDVMCadGLL2yGyfSrsVu`,
    slot: 515407376,
    blockTime: 1793035945,
    ok: true,
    error: null,
    computeUnits: 11853,
    fee: 5000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `2kmGNbfghfBxs5LQmhyuTQeHEgfdy5LtcyttcPKvk5Dz`, `CCNMB5dw7DKqDGQ5J83bQggEXcKVxQx6uHXxeSQUNJVS`, `11111111111111111111111111111111`, `6pxqWGoxSRBwmL6GJie9BD43HGe3ybFu9xmJQ24TvcXB`],
    instructions: [{
      program: `qproof`,
      programName: `qproof`,
      name: `record_job`,
      source: `LocalSimulator`,
      backend: `perceval:slos`
    }],
    logs: [`Instruction: RecordJob`, `qproof receipt #1 source LocalSimulator backend perceval:slos shots 4096`]
  }, {
    signature: `3s2pn3g7bZjPw7VXV5j1dJHoC3dW6hKrxEkMho9Yw83UN34LSnPBRy2tcTaJgRMCgG35XVUqSUZLozBaZw1rhYq4`,
    slot: 515059410,
    blockTime: 1792952608,
    ok: true,
    error: null,
    computeUnits: 4719,
    fee: 5000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `EqNJ8RmYRbcCky7B2FEMNmNmfHQnnDJvGExU9vgM5hQ2`, `HzJgKKS8W5B51NKcrj8jvermJSiV3ByDrPkZQYFikN3C`, `FZXp8BVcsPZcE6ZP4wCYouMsupGEGKSZFwNfzNaoiQmm`],
    instructions: [{
      program: `qentropy`,
      programName: `qentropy`,
      name: `reveal`
    }],
    logs: [`Instruction: Reveal`, `qentropy var 1792952595890 round 0 finalized`]
  }, {
    signature: `5x4xsKrxQivYWWszTfyCBoZSQLZBpVsQjV1XZUUtRMxVunr6ADghGtqGL2Zg9vLe3FCWrvctnj6oDmqGnQCpe8n9`,
    slot: 515059407,
    blockTime: 1792952607,
    ok: true,
    error: null,
    computeUnits: 3996,
    fee: 5000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `EqNJ8RmYRbcCky7B2FEMNmNmfHQnnDJvGExU9vgM5hQ2`, `FZXp8BVcsPZcE6ZP4wCYouMsupGEGKSZFwNfzNaoiQmm`, `SysvarS1otHashes111111111111111111111111111`],
    instructions: [{
      program: `qentropy`,
      programName: `qentropy`,
      name: `sample`
    }],
    logs: [`Instruction: Sample`, `qentropy var 1792952595890 sampled slot 515059395`]
  }, {
    signature: `3t9Qp6ZA1uQKUkFeXY2SccSYJxWoJpzfvcvtjH19AvRi78tGZGe3Au4ouRU2GLa4GNqsr3bWjxf6miNP5U1wbRUa`,
    slot: 515059369,
    blockTime: 1792952598,
    ok: true,
    error: null,
    computeUnits: 21625,
    fee: 5000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `EqNJ8RmYRbcCky7B2FEMNmNmfHQnnDJvGExU9vgM5hQ2`, `HzJgKKS8W5B51NKcrj8jvermJSiV3ByDrPkZQYFikN3C`, `11111111111111111111111111111111`, `F1cHfSgG4W6JtCu77qsDnhAsKVR5SizoHZxbFcoNPsS6`, `FZXp8BVcsPZcE6ZP4wCYouMsupGEGKSZFwNfzNaoiQmm`],
    instructions: [{
      program: `qentropy`,
      programName: `qentropy`,
      name: `open`
    }],
    logs: [`Instruction: Open`, `qentropy var 1792952595890 opened, end slot 515059395, 16 samples, receipt F1cHfSgG4W6JtCu77qsDnhAsKVR5SizoHZxbFcoNPsS6`]
  }, {
    signature: `5ceZnuXzn8JPvaT9D27gu3FXJisXAuiytDiwQtSakjGFwjNuaEsqdGWsuCAnUKYirDDha4AJqzfDcWoVGo8aZJPr`,
    slot: 515059356,
    blockTime: 1792952595,
    ok: true,
    error: null,
    computeUnits: 11852,
    fee: 5000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `CCNMB5dw7DKqDGQ5J83bQggEXcKVxQx6uHXxeSQUNJVS`, `F1cHfSgG4W6JtCu77qsDnhAsKVR5SizoHZxbFcoNPsS6`, `11111111111111111111111111111111`, `6pxqWGoxSRBwmL6GJie9BD43HGe3ybFu9xmJQ24TvcXB`],
    instructions: [{
      program: `qproof`,
      programName: `qproof`,
      name: `record_job`,
      source: `LocalSimulator`,
      backend: `perceval:slos`
    }],
    logs: [`Instruction: RecordJob`, `qproof receipt #0 source LocalSimulator backend perceval:slos shots 4096`]
  }, {
    signature: `65aD4h9b2kqa2MbQ1gsG9VL1eTy3xaSAwvh6R4Ev3zk44nZuN6BBpBJiTr8WT69zGs4VSoiDYUPzcmJ5V3eLYbxh`,
    slot: 515059352,
    blockTime: 1792952594,
    ok: true,
    error: null,
    computeUnits: 8262,
    fee: 5000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `HzJgKKS8W5B51NKcrj8jvermJSiV3ByDrPkZQYFikN3C`, `11111111111111111111111111111111`, `FZXp8BVcsPZcE6ZP4wCYouMsupGEGKSZFwNfzNaoiQmm`],
    instructions: [{
      program: `qentropy`,
      programName: `qentropy`,
      name: `register_provider`
    }],
    logs: [`Instruction: RegisterProvider`, `qentropy provider registered with 100000000 lamports staked`]
  }, {
    signature: `mTSUDBKwcyPy1s48fBF3Ahp1nqcpibBfdmPMwMS2r5Ltw48KPusqCp3ypf7e6fEQv9b2UhzCERpp5sZGKDn3Vik`,
    slot: 515059348,
    blockTime: 1792952593,
    ok: true,
    error: null,
    computeUnits: 12877,
    fee: 5000,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `CCNMB5dw7DKqDGQ5J83bQggEXcKVxQx6uHXxeSQUNJVS`, `11111111111111111111111111111111`, `6pxqWGoxSRBwmL6GJie9BD43HGe3ybFu9xmJQ24TvcXB`],
    instructions: [{
      program: `qproof`,
      programName: `qproof`,
      name: `initialize`
    }],
    logs: [`Instruction: Initialize`, `qproof initialized, relayer 5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`]
  }, {
    signature: `3t21xZPuENMHv5hSZxniGAP4sGuJjKSb1w579xpgor8YhbCEAuhpJjgvkMjXLdERCHWpfqBYVF1oMMZbJYw7BubN`,
    slot: 515055244,
    blockTime: 1792951615,
    ok: true,
    error: null,
    computeUnits: 2970,
    fee: 10030,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `FZXp8BVcsPZcE6ZP4wCYouMsupGEGKSZFwNfzNaoiQmm`, `8Sx7U7LX8HYc1joYXKahpwbfLAEhjNnSYMYr8a9y3Coy`, `EEKcM4EQfrYP4TgR1AHn1Q25qzXKMGx6cwu32dLDsGzW`, `11111111111111111111111111111111`, `BPFLoaderUpgradeab1e11111111111111111111111`, `ComputeBudget111111111111111111111111111111`, `SysvarC1ock11111111111111111111111111111111`, `SysvarRent111111111111111111111111111111111`],
    instructions: [],
    logs: []
  }, {
    signature: `3hxHJDQKCu4Ez3Y43izLWqRuQbeU8tWvcP7Jd251eGi9NUKDSAKKNKRzZDiFzyjQtmZ3HogpnqeHFZTWWfeWHH2d`,
    slot: 515055141,
    blockTime: 1792951591,
    ok: true,
    error: null,
    computeUnits: 2970,
    fee: 10030,
    accounts: [`5soiqmkr4CZgzXujgiC1kvQZgtsqvp6offopioZJ2PoG`, `6pxqWGoxSRBwmL6GJie9BD43HGe3ybFu9xmJQ24TvcXB`, `2VLtHKCywYPKCwuVrCaknUDbTRUnTry7fFTEcidheVK7`, `EYVL8zqssS3ddXGV1pZngv6in7r5vMinvV613ZqFWUGv`, `11111111111111111111111111111111`, `BPFLoaderUpgradeab1e11111111111111111111111`, `ComputeBudget111111111111111111111111111111`, `SysvarC1ock11111111111111111111111111111111`, `SysvarRent111111111111111111111111111111111`],
    instructions: [],
    logs: []
  }],
  runs: [{
    name: `Run 1`,
    cluster: `devnet`,
    provider: `IBM Quantum`,
    device: `ibm_fez`,
    jobId: `dbfroe8m94ac738u7e20`,
    receipt: `AAGMznL9PRwMUfnkWzUpEL71vkUvCnfF5CptoVtBFW5K`,
    var: `6Gd8Yf7UnM3RxPkknAfNtMm9D3qTSsWmxSfrY6Yy7dcU`,
    value: `f801dfe388b484ef19d175423515e09bf5eae06e20132b1eed0d70ed49308858`,
    challenge: `d2fd4c1f4cd396ff723a99ba1f55ee7d38da28b0444932c40de7bc4494cd9cfc`,
    memoSignature: `43FqAcNXSWiVsaE9mk3nVqp3vSMEAm6uuvCUorPWtZ2zAdwZSWbehRM9qETpZGGfhB9kMdBniymr6XVHnTL6hfFT`,
    qubits: 16,
    shots: 256,
    bits: 4096,
    observed: 0.621337890625,
    expected: 0.6296710043493754,
    date: `2026-10-26`,
    checks: [{
      label: `QPU receipt exists on-chain`,
      ok: true,
      detail: `AAGMznL9PRwMUfnkWzUpEL71vkUvCnfF5CptoVtBFW5K`
    }, {
      label: `Receipt is labelled as real hardware (Qpu)`,
      ok: true,
      detail: `Qpu on ibm:ibm_fez`
    }, {
      label: `Receipt job hash = sha256("dbfroe8m94ac738u7e20")`,
      ok: true,
      detail: `IBM job dbfroe8m94ac738u7e20`
    }, {
      label: `Challenge memo is on-chain`,
      ok: true,
      detail: `slot 515454620`
    }, {
      label: `Challenge was posted before the QPU result`,
      ok: true,
      detail: `memo slot 515454620 < receipt slot 515465616`
    }, {
      label: `Random value is finalized on-chain`,
      ok: true,
      detail: `status Finalized`
    }, {
      label: `On-chain value matches the published value`,
      ok: true,
      detail: `f801dfe388b484ef19d175423515e09bf5eae06e20132b1eed0d70ed49308858`
    }, {
      label: `Value links to the QPU receipt`,
      ok: true,
      detail: `AAGMznL9PRwMUfnkWzUpEL71vkUvCnfF5CptoVtBFW5K`
    }]
  }]
};
var x = [{
  id: `overview`,
  title: `Overview`
}, {
  id: `accounts`,
  title: `Falcon accounts`
}, {
  id: `receipts`,
  title: `QPU receipts`
}, {
  id: `randomness`,
  title: `Random values`
}, {
  id: `transactions`,
  title: `Transactions`
}];
var S = {
  vaults: `accounts`,
  lookup: `search`
};
var se = [{
  id: `all`,
  title: `All`
}, {
  id: `falcon`,
  title: `Falcon-signed`
}, {
  id: `quantum`,
  title: `Quantum jobs`
}, {
  id: `randomness`,
  title: `Randomness`
}, {
  id: `qsim`,
  title: `Circuit checks`
}];
var C = {
  data: null,
  mode: `loading`,
  reason: ``,
  progress: ``,
  txFilter: `all`,
  search: null,
  ...w()
};
function w() {
  let e = decodeURIComponent(location.hash.slice(1));
  if (e.startsWith(`search:`)) {
    return {
      view: `search`,
      query: e.slice(7).trim()
    };
  } else if (S[e]) {
    return {
      view: S[e],
      query: ``
    };
  } else {
    return {
      view: x.some(t => t.id === e) ? e : `overview`,
      query: ``
    };
  }
}
var T = e => `#search:${encodeURIComponent(e)}`;
var E = e => String(e ?? ``).replace(/[&<>"']/g, e => ({
  "&": `&amp;`,
  "<": `&lt;`,
  ">": `&gt;`,
  "\"": `&quot;`,
  "'": `&#39;`
})[e]);
var D = (e, t = 6) => e && e.length > t * 2 + 1 ? `${e.slice(0, t)}…${e.slice(-t)}` : e ?? ``;
var O = e => e == null ? `–` : Number(e).toLocaleString(`en-US`);
var k = e => `${(e / 1000000000).toLocaleString(`en-US`, {
  maximumFractionDigits: 4
})} SOL`;
var A = e => e ? `${new Date(e * 1000).toISOString().replace(`T`, ` `).slice(0, 16)} UTC` : `–`;
var ce = () => y.cluster === `mainnet-beta` ? `` : `?cluster=${y.cluster}`;
var j = (e, t) => `<a class="addr" href="${T(e)}" title="${E(e)}">${E(t ?? D(e, 8))}</a>`;
var M = (e, t) => `<a class="addr" href="${T(e)}" title="${E(e)}">${E(t ?? D(e))}</a>`;
var N = (e, t) => `<a class="ex-external" href="https://explorer.solana.com/${e}/${E(t)}${ce()}" target="_blank" rel="noopener">Solana Explorer ↗</a>`;
var P = (e, t, n) => `<span class="nexq-badge ${e}"${n ? ` title="${E(n)}"` : ``}>${E(t)}</span>`;
var F = e => e === `Qpu` ? P(`badge-qpu`, `Real QPU`) : e ? P(`badge-sim`, e === `CloudEmulator` ? `Cloud emulator` : `Simulator`) : P(`badge-sim`, `No receipt`);
var I = {
  withdraw_pq: `Falcon-512 withdrawal`,
  execute_pq: `Falcon-512 smart-account call`,
  execute: `Ed25519 smart-account call`,
  register: `Falcon key registered`,
  enable_qday: `Q-Day mode switched on`,
  withdraw: `Ed25519 withdrawal`,
  initialize: `Falcon table created`,
  "qproof.record_job": `Quantum job recorded`,
  "qproof.initialize": `Receipt registry created`,
  "qproof.set_relayer": `Relayer changed`,
  "qentropy.open": `Random value committed`,
  "qentropy.sample": `Slot hash sampled`,
  "qentropy.reveal": `Random value revealed`,
  "qentropy.next": `Next value committed`,
  "qentropy.slash": `Provider slashed`,
  "qentropy.register_provider": `Provider staked`,
  "qentropy.close": `Value closed`,
  "qentropy.withdraw_stake": `Stake withdrawn`,
  "qsim.simulate": `Quantum circuit simulated on-chain`,
  "qsim.simulate_receipt": `QPU result checked against its receipt and scored on-chain`,
  "qsim.score": `Quantum result scored on-chain`,
  "qsim.init_state": `Quantum state account created`,
  "qsim.apply": `Gates applied on-chain`,
  "qsim.apply_range": `Part of a gate applied on-chain`
};
var L = [`withdraw_pq`, `execute_pq`];
var R = e => e.program === `qpt` || e.program === `qpt_blueshift`;
function le(e) {
  if (e.kind === `sol`) {
    return `send ${k(e.lamports)}`;
  } else if (e.kind === `token`) {
    return `SPL token transfer (${Number(e.amount).toLocaleString(`en-US`)} units)`;
  } else if (e.kind === `memo`) {
    return `memo “${e.text.length > 60 ? `${e.text.slice(0, 60)}…` : e.text}”`;
  } else {
    return `call ${D(e.program)}`;
  }
}
function z(e) {
  let t = (R(e) ? I[e.name] : I[`${e.program}.${e.name}`]) ?? `${e.programName} ${e.name}`;
  if (e.name === `withdraw_pq`) {
    return `${t}: ${k(e.amount)}, ${e.signatureBytes}-byte signature checked on-chain`;
  }
  if (e.name === `withdraw`) {
    return `${t}: ${k(e.amount)}`;
  }
  if (e.calls) {
    return `${t}: ${e.calls.map(le).join(` + `)}${e.signatureBytes ? `, ${e.signatureBytes}-byte signature checked on-chain` : ``}`;
  }
  if (e.name === `register` && R(e)) {
    return `${t}: ${e.keyBytes}-byte public key`;
  }
  if (e.program === `qsim` && e.score) {
    let n = e.score;
    return `${t}: ${n.numQubits} qubits, ${O(n.shots)} shots scored · fidelity ${n.fidelity.toFixed(3)}, XEB ${n.xeb.toFixed(2)}`;
  }
  if (e.program === `qsim` && e.name.startsWith(`simulate`)) {
    return `${t}: ${e.numQubits} qubits, ${O(e.shots)} shots`;
  } else if (e.name === `record_job`) {
    return `${t}: ${e.source === `Qpu` ? `real QPU` : e.source === `CloudEmulator` ? `cloud emulator` : `simulator`}, ${e.backend}`;
  } else {
    return t;
  }
}
var ue = e => {
  if (R(e)) {
    return `${P(`badge-sim`, e.program === `qpt_blueshift` ? `blueshift` : `fn-dsa`)} `;
  }
  if (e.program === `qsim` && e.score) {
    let t = e.score.fidelity;
    return `${t >= 0.8 ? P(`badge-ok`, `Matches circuit`) : t >= 0.5 ? P(`badge-sim`, `Weak match`) : P(`badge-bad`, `Doesn't match`)} `;
  }
  return ``;
};
var B = `nexq-explorer-tx-v2:${y.cluster}`;
var V = new Map();
for (let e of b?.activity ?? []) {
  V.set(e.signature, e);
}
try {
  for (let e of JSON.parse(localStorage.getItem(B) ?? `[]`)) {
    V.set(e.signature, e);
  }
} catch {}
function de(e) {
  try {
    localStorage.setItem(B, JSON.stringify(e.slice(0, 200)));
  } catch {}
}
var H = m(y.rpcUrls ?? [y.rpcUrl]);
var U = () => new URL(H.endpoint()).host;
var W = e => e.activity.filter(e => e.ok && e.instructions.some(e => L.includes(e.name)));
function fe(e) {
  let t = e ? {
    accounts: e.entries.length,
    receipts: e.receipts.length,
    randomness: e.vars.length,
    transactions: e.activity.filter(e => e.instructions.length).length
  } : {};
  document.getElementById(`nav`).innerHTML = x.map(e => `<a href="#${e.id}" ${e.id === C.view ? `aria-current="page"` : ``}>${e.title}${t[e.id] == null ? `` : `<span class="count">${t[e.id]}</span>`}</a>`).join(``);
}
function G() {
  let e = C.data;
  let t;
  t = C.mode === `live` ? `<span class="nexq-badge nexq-badge--success ex-live" title="Read through ${E(U())}"><i></i>Live · slot ${O(e.slot)}</span>` : C.loading ? `<span class="nexq-badge nexq-badge--neutral">${E(C.progress ? `Reading ${C.progress}…` : `Connecting…`)}</span>` : C.mode === `snapshot` ? `<span class="nexq-badge nexq-badge--neutral" title="${E(C.reason)}">Snapshot · slot ${O(e.slot)}</span>` : `<span class="nexq-badge nexq-badge--neutral">Offline</span>`;
  document.getElementById(`status`).innerHTML = `${t}<button type="button" class="nexq-button nexq-button--secondary" id="refresh" aria-label="Refresh from Solana" ${C.loading ? `disabled` : ``}>
    <svg class="ex-refresh-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/></svg><span class="ex-refresh-text">Refresh</span></button>`;
  document.getElementById(`refresh`).onclick = () => De();
}
function K(e, t, n, r = ``) {
  return `<div class="ex-section-head"><div><span class="nexq-eyebrow">${E(e)}</span><h2>${E(t)}</h2>${n ? `<p>${n}</p>` : ``}</div>${r}</div>`;
}
var q = (e, t, n = ``) => `<td data-label="${E(e)}"${n ? ` class="${n}"` : ``}>${t}</td>`;
function J(e) {
  return `<div class="nexq-table-wrap"><table class="nexq-table ex-stack"><thead><tr><th>Program</th><th>What it does</th><th>Address</th><th>Status</th></tr></thead><tbody>
    ${e.map(e => `<tr>${q(`Program`, `<strong style="font-weight:500">${E(e.label)}</strong>`, `lead`)}${q(`Does`, E(e.role))}
      ${q(`Address`, M(e.address, e.address))}${q(`Status`, e.deployed ? P(`badge-ok`, `Deployed`) : P(`badge-bad`, `Not deployed`))}</tr>`).join(``)}
  </tbody></table></div>`;
}
function Y(e, t = `Transactions from the nexq programs will appear here.`) {
  if (e.length) {
    return `<div class="nexq-table-wrap"><table class="nexq-table ex-stack"><thead><tr><th>Result</th><th>What happened</th><th class="r">Compute units</th><th>Time</th><th>Transaction</th></tr></thead><tbody>
    ${e.map(e => `<tr>${q(`Result`, e.ok ? P(`badge-ok`, `OK`) : P(`badge-bad`, `Failed`, e.error))}
      ${q(`What happened`, e.instructions.length ? e.instructions.map(t => `<div>${L.includes(t.name) && e.ok ? `${P(`badge-falcon`, `Falcon`)} ` : ``}${ue(t)}${E(z(t))}</div>`).join(``) : `<span class="muted">No nexq program instruction</span>`, `wrap`)}
      ${q(`Compute units`, O(e.computeUnits), `r num`)}${q(`Time`, A(e.blockTime), `num`)}${q(`Transaction`, j(e.signature))}</tr>`).join(``)}
  </tbody></table></div>`;
  } else {
    return `<div class="nexq-empty"><h3>No transactions here yet</h3><p>${E(t)}</p></div>`;
  }
}
function X(e) {
  return `<div class="nexq-table-wrap"><table class="nexq-table ex-stack"><thead><tr><th>#</th><th>Source</th><th>Machine</th><th class="r">Shots</th><th>Job</th><th>Result hash</th><th class="r">Slot</th><th>Recorded</th></tr></thead><tbody>
    ${e.map(e => `<tr>${q(`Receipt`, `${M(e.address, `#${e.index}`)}`, `lead`)}${q(`Source`, F(e.source))}${q(`Machine`, `<span class="mono">${E(e.backend)}</span>`)}
      ${q(`Shots`, O(e.shots), `r num`)}
      ${q(`Job`, e.publicJobId ? `<span class="mono">${E(e.publicJobId)}</span>` : `<span class="mono muted" title="sha256 of the private job id">${E(D(e.jobIdHash, 6))}</span>`)}
      ${q(`Result hash`, `<span class="mono" title="${E(e.resultHash)}">${E(D(e.resultHash, 6))}</span>`)}
      ${q(`Slot`, O(e.slot), `r num`)}${q(`Recorded`, A(e.timestamp), `num`)}</tr>`).join(``)}
  </tbody></table></div>`;
}
function pe(e, t) {
  let n = t => e.receipts.find(e => e.address === t);
  return `<div class="nexq-table-wrap"><table class="nexq-table ex-stack"><thead><tr><th>Status</th><th>Seeded by</th><th>Value</th><th class="r">Sampled slot</th><th class="r">Values left</th><th>Account</th></tr></thead><tbody>
    ${t.map(e => `<tr>${q(`Status`, P(e.status === `Finalized` ? `badge-ok` : e.status === `Slashed` ? `badge-bad` : `badge-sim`, e.status))}
      ${q(`Seeded by`, `${F(n(e.receipt)?.source)} ${M(e.receipt, n(e.receipt)?.backend ?? D(e.receipt))}`)}
      ${q(`Value`, e.status === `Finalized` ? `<span class="mono" title="${E(e.value)}">${E(D(e.value, 10))}</span>` : `–`)}
      ${q(`Sampled slot`, e.sampledSlot ? O(e.sampledSlot) : `–`, `r num`)}${q(`Values left`, O(e.samplesLeft), `r num`)}${q(`Account`, M(e.address))}</tr>`).join(``)}
  </tbody></table></div>`;
}
function Z(e, t, n = ``) {
  let r = e.activity.filter(e => e.ok && e.instructions.some(e => L.includes(e.name) && e.entry === t.address));
  let i = Math.max(0, t.lamports - (t.rentLamports ?? 0));
  return `<article class="nexq-panel">
    <div class="ex-card-head"><h3>Account #${t.index} · ${E(t.build.replace(`qpt · `, ``))} verifier</h3>
      ${t.qday ? P(`badge-falcon`, `Q-Day mode on`) : P(`badge-sim`, `Ed25519 still allowed`)}</div>
    ${n ? `<p class="muted" style="font-size:13px;margin-bottom:6px">${n}</p>` : ``}
    <dl class="ex-rows">
      <div class="nexq-data-row"><dt>Account</dt><dd>${M(t.address)}</dd></div>
      <div class="nexq-data-row"><dt>Owner</dt><dd>${M(t.owner)}</dd></div>
      ${t.wallet ? `<div class="nexq-data-row"><dt>Smart wallet</dt><dd>${M(t.wallet)} <span class="num">${k(t.walletLamports ?? 0)}</span></dd></div>` : ``}
      <div class="nexq-data-row"><dt>Vault balance</dt><dd class="num">${k(i)} <span class="muted">+ ${k(t.rentLamports ?? 0)} rent</span></dd></div>
      <div class="nexq-data-row"><dt>Falcon-512 key</dt><dd class="num">${O(t.keyBytes)} bytes${t.keyBytes === 1024 ? ` (prepared form)` : ``}</dd></div>
      <div class="nexq-data-row"><dt>Registered</dt><dd class="num">slot ${O(t.registeredSlot)}</dd></div>
      <div class="nexq-data-row"><dt>Key seeded by</dt><dd>${F(t.receiptSource)} ${M(t.receipt)}</dd></div>
      <div class="nexq-data-row"><dt>Falcon signatures used</dt><dd class="num">${O(t.nonce)}${r[0]?.computeUnits ? ` <span class="muted">· latest ${O(r[0].computeUnits)} CU</span>` : ``}</dd></div>
    </dl>
    ${r.length ? `<p class="ex-card-foot">Latest Falcon-signed transaction: ${j(r[0].signature)}</p>` : ``}
  </article>`;
}
function me(e) {
  let t = e.receipts.filter(e => e.source === `Qpu`).length;
  let n = W(e);
  let r = n.map(e => e.computeUnits).filter(Boolean);
  let i = e.entries.filter(e => e.qday).length;
  return `<section class="ex-intro">
    <span class="nexq-eyebrow">Solana ${E(e.cluster)} · quantum and post-quantum activity</span>
    <h1>Quantum jobs, on-chain.<span>Falcon-signed on Solana.</span></h1>
    <p class="ex-lead"><strong>Every quantum computer job, quantum-seeded random value and Falcon-512 post-quantum account</strong> that the nexq programs have put on Solana, read straight from the chain.</p>
  </section>
  <section class="ex-stats" aria-label="Summary">
    <div class="nexq-stat"><span class="nexq-eyebrow">QPU receipts</span><span class="nexq-stat-value num">${O(e.receipts.length)}</span>
      <span class="nexq-stat-meta">${P(`badge-qpu`, `${t} real QPU`)} ${P(`badge-sim`, `${e.receipts.length - t} simulator`)}</span></div>
    <div class="nexq-stat"><span class="nexq-eyebrow">Falcon accounts</span><span class="nexq-stat-value num">${O(e.entries.length)}</span>
      <span class="nexq-stat-meta">${i} in Q-Day mode: only Falcon signatures move funds</span></div>
    <div class="nexq-stat"><span class="nexq-eyebrow">Falcon-signed transactions</span><span class="nexq-stat-value num">${O(n.length)}</span>
      <span class="nexq-stat-meta">among the latest ${O(e.activity.length)} program transactions</span></div>
    <div class="nexq-stat"><span class="nexq-eyebrow">Cheapest Falcon check</span><span class="nexq-stat-value num">${r.length ? O(Math.min(...r)) : `–`}</span>
      <span class="nexq-stat-meta">compute units, of 1,400,000 per transaction</span></div>
  </section>`;
}
function he(e) {
  let t = e.checks.filter(e => e.ok).length;
  let n = e => `${(e * 100).toFixed(1)}%`;
  return `<article class="nexq-panel ex-run">
    <div class="ex-grid-2">
      <div style="display:grid;gap:16px;align-content:start;min-width:0">
        <div class="ex-run-head">${P(`badge-qpu`, `Real QPU`)} ${P(t === e.checks.length ? `badge-ok` : `badge-bad`, `${t}/${e.checks.length} checks pass on-chain`)} ${P(`badge-sim`, e.date)}</div>
        <h3>${E(e.name)}: ${E(e.provider)} ${E(e.device)} to Solana</h3>
        <p class="muted" style="font-size:13px">A public challenge went on Solana first. It set the rotation angle of every qubit, so the share of 1s was predictable before the run. The QPU result, its receipt and the final random value then landed on-chain.</p>
        <dl class="ex-rows">
          <div class="nexq-data-row"><dt>IBM job</dt><dd><a class="addr" href="${T(e.jobId)}">${E(e.jobId)}</a></dd></div>
          <div class="nexq-data-row"><dt>Measured</dt><dd class="num">${O(e.qubits)} qubits × ${O(e.shots)} shots = ${O(e.bits)} bits</dd></div>
          <div class="nexq-data-row"><dt>Receipt</dt><dd>${M(e.receipt)}</dd></div>
          <div class="nexq-data-row"><dt>Challenge memo</dt><dd>${j(e.memoSignature)}</dd></div>
          <div class="nexq-data-row"><dt>Random value</dt><dd class="mono">${E(D(e.value, 12))}</dd></div>
        </dl>
        <div class="ex-bars" role="img" aria-label="Share of 1s: predicted ${n(e.expected)}, measured ${n(e.observed)}; a fair coin gives 50%">
          <span class="nexq-eyebrow">Share of 1s · line marks a fair coin (50%)</span>
          <div class="ex-bar"><span>Predicted</span><div class="ex-track"><span style="width:${(e.expected * 100).toFixed(2)}%;background:#9fbcd6"></span><i></i></div><span class="num">${n(e.expected)}</span></div>
          <div class="ex-bar"><span>${E(e.device)}</span><div class="ex-track"><span style="width:${(e.observed * 100).toFixed(2)}%;background:var(--nexq-blue)"></span><i></i></div><span class="num">${n(e.observed)}</span></div>
        </div>
      </div>
      <div style="display:grid;gap:14px;align-content:start;min-width:0">
        <span class="nexq-eyebrow">Checked against the chain${C.mode === `live` ? ` just now` : ` when the snapshot was taken`}</span>
        <ul class="ex-checks">${e.checks.map(e => `<li><span class="ex-mark ${e.ok ? `ok` : `bad`}" aria-label="${e.ok ? `pass` : `fail`}">${e.ok ? `✓` : `✕`}</span><span>${E(e.label)}<small>${E(e.detail)}</small></span></li>`).join(``)}</ul>
      </div>
    </div>
  </article>`;
}
function ge(e) {
  let t = e.activity.filter(e => e.instructions.length).slice(0, 6);
  return `${me(e)}
    ${e.runs.length ? `<section class="ex-section">${K(`Evidence`, `Run 1: a real quantum computer, recorded on Solana`, `Re-checked against the chain on every load. Receipts prove what was recorded and when, not that a machine was quantum.`)}${e.runs.map(he).join(``)}</section>` : ``}
    <section class="ex-section">${K(`Latest`, `Recent transactions`, ``, `<a class="nexq-text-link" href="#transactions">All transactions</a>`)}${Y(t)}</section>
    <section class="ex-section">${K(`Programs`, `The nexq programs on Solana`, ``)}${J(e.programs)}</section>`;
}
function _e(e) {
  let t = e.entries.length ? `<div class="ex-cards">${e.entries.map(t => Z(e, t)).join(``)}</div>` : `<div class="nexq-empty"><h3>No Falcon accounts yet</h3><p>Accounts appear here once a Falcon-512 key is registered.</p></div>`;
  let n = e.entries.length && e.entries.every(e => e.receiptSource !== `Qpu`);
  return `<section class="ex-section">${K(`Post-quantum custody`, `Falcon accounts`, `Each account stores a Falcon-512 public key, the slot it was registered in, and the receipt of the job that seeded it. Its smart wallet can run any Solana instruction: SOL and token transfers, memos, other programs. With Q-Day mode on, the owner's normal Ed25519 key can no longer move funds; only a Falcon-512 signature, checked by the program, can.`)}
    ${t}
    ${n ? `<div class="nexq-alert"><div class="nexq-alert-body"><strong>Simulator-seeded demo keys</strong><span>These keys were seeded from local simulator bits, and their receipts say so. Security comes from Falcon-512; the quantum source records where a key's randomness came from.</span></div></div>` : ``}
  </section>`;
}
function ve(e) {
  let t = e.receipts.length ? X([...e.receipts].reverse()) : `<div class="nexq-empty"><h3>No quantum jobs recorded yet</h3><p>Receipts appear here when the relayer records a job.</p></div>`;
  return `<section class="ex-section">${K(`qproof`, `QPU receipts`, `One receipt per quantum job: which machine, how many shots, and hashes of the circuit and the results. The source is part of the record, so a simulator run can't pass as hardware. Private job ids appear only as hashes.`)}${t}</section>`;
}
function ye(e) {
  let t = e.vars.length ? pe(e, e.vars) : `<div class="nexq-empty"><h3>No random values yet</h3><p>Values appear here once a provider commits one.</p></div>`;
  return `<section class="ex-section">${K(`qentropy`, `Quantum-seeded random values`, `The provider commits to a hash chain seeded from quantum bits, Solana samples a slot hash nobody could predict, and the revealed value is sha256(seed ‖ slot hash). Any program can read it.`)}${t}</section>`;
}
function be(e) {
  let t = e.activity.filter(e => e.instructions.length);
  let n = {
    all: () => true,
    falcon: e => e.instructions.some(e => L.includes(e.name)),
    quantum: e => e.instructions.some(e => e.program === `qproof`),
    randomness: e => e.instructions.some(e => e.program === `qentropy`),
    qsim: e => e.instructions.some(e => e.program === `qsim`)
  }[C.txFilter];
  return `<section class="ex-section">${K(`Activity`, `Transactions`, `Latest transactions for each program, newest first. A successful Falcon transaction means the program checked the 666-byte Falcon-512 signature itself; a bad signature fails the whole transaction.`, `<fieldset class="nexq-fieldset ex-filter"><legend class="nexq-sr-only">Show</legend><div class="nexq-segmented">
    ${se.map(e => `<label class="nexq-segment"><input type="radio" name="tx-filter" id="tx-filter-${e.id}" value="${e.id}" ${e.id === C.txFilter ? `checked` : ``}><span>${e.title}</span></label>`).join(``)}
  </div></fieldset>`)}
    ${Y(t.filter(n))}</section>`;
}
var xe = /^[1-9A-HJ-NP-Za-km-z]+$/;
function Se(e) {
  if (/^\d{1,12}$/.test(e)) {
    return `slot`;
  } else if (xe.test(e) && e.length >= 80 && e.length <= 90) {
    return `signature`;
  } else if (xe.test(e) && e.length >= 32 && e.length <= 44) {
    return `address`;
  } else {
    return `text`;
  }
}
async function Q(e) {
  let t = C.data;
  let n = Se(e);
  let r = {
    q: e,
    kind: n,
    loading: true,
    groups: [],
    account: null,
    accountError: null
  };
  C.search = r;
  $();
  let i = (e, t, n, i = ``) => r.groups.push({
    title: e,
    html: t,
    count: n,
    note: i
  });
  let a = t.activity;
  if (n === `signature`) {
    let t = a.find(t => t.signature === e) ?? V.get(e);
    if (!t && C.mode === `live`) {
      try {
        t = await ae(y, H, e);
      } catch (e) {
        r.accountError = e.message;
      }
    }
    if (t) {
      i(`Transaction`, `${Y([t])}
        ${t.logs?.length ? `<div class="nexq-code ex-logs"><span class="nexq-eyebrow">Program logs</span><pre>${t.logs.map(E).join(`
`)}</pre></div>` : ``}`, 1);
    }
  }
  if (n === `address`) {
    let n = t.programs.filter(t => t.address === e);
    if (n.length) {
      i(`Program`, J(n), n.length);
    }
    for (let n of t.entries) {
      let r = n.address === e ? `` : n.owner === e ? `This address owns the Falcon account below.` : n.wallet === e ? `This address is the smart wallet of the Falcon account below. It holds funds and signs the account's calls.` : n.receipt === e ? `This QPU receipt seeded the Falcon key of the account below.` : null;
      if (r != null) {
        i(n.address === e ? `Falcon account` : `Linked Falcon account`, Z(t, n, r), 1);
      }
    }
    let o = t.receipts.filter(t => t.address === e);
    if (o.length) {
      i(`QPU receipt`, X(o), o.length);
    }
    let s = t.vars.filter(t => t.address === e || t.receipt === e);
    if (s.length) {
      i(s.some(t => t.address === e) ? `Random value` : `Random values seeded by this receipt`, pe(t, s), s.length);
    }
    let c = a.filter(t => t.accounts?.includes(e) || t.instructions.some(t => [t.entry, t.wallet, t.destination].includes(e)));
    if (c.length) {
      i(`nexq transactions involving this address`, Y(c), c.length);
    }
    if (C.mode === `live`) {
      try {
        r.account = await oe(H, e);
      } catch (e) {
        r.accountError = e.message;
      }
    }
  }
  if (n === `slot`) {
    let n = Number(e);
    let r = a.filter(e => e.slot === n);
    if (r.length) {
      i(`Transactions in slot ${O(n)}`, Y(r), r.length);
    }
    let o = t.receipts.filter(e => e.slot === n);
    if (o.length) {
      i(`QPU receipts recorded in slot ${O(n)}`, X(o), o.length);
    }
    let s = t.entries.filter(e => e.registeredSlot === n);
    for (let e of s) {
      i(`Falcon account registered in slot ${O(n)}`, Z(t, e), 1);
    }
  }
  if (n === `text` || n === `slot`) {
    let n = await o(e);
    let r = t.receipts.filter(e => e.jobIdHash === n);
    if (r.length) {
      i(`QPU receipt for this job id`, X(r), r.length);
    }
  }
  if (n === `text` && e.length >= 3) {
    let n = e.toLowerCase();
    let r = t.receipts.filter(t => t.backend.toLowerCase().includes(n) || t.address.includes(e) || t.source === `Qpu` && `real qpu hardware`.includes(n));
    if (r.length) {
      i(`Matching QPU receipts`, X(r), r.length);
    }
    let o = a.filter(t => t.instructions.length && (t.signature.includes(e) || t.instructions.some(e => z(e).toLowerCase().includes(n))));
    if (o.length) {
      i(`Matching transactions`, Y(o.slice(0, 25)), o.length, o.length > 25 ? `Showing the first 25.` : ``);
    }
    let s = t.entries.filter(t => [t.address, t.owner, t.wallet ?? ``, t.receipt].some(t => t.includes(e)));
    for (let e of s) {
      i(`Matching Falcon account`, Z(t, e), 1);
    }
  }
  r.loading = false;
  if (C.search === r) {
    $();
  }
}
function Ce(e) {
  let t = C.search;
  if (!C.query) {
    return `<section class="ex-section">${K(`Search`, `Search the nexq programs`, `Type into the search bar at the top, or try one of these.`)}${Ee(e)}</section>`;
  }
  if (!t || t.q !== C.query) {
    return `<section class="ex-section"><p class="muted">Searching…</p></section>`;
  }
  let n = t.kind === `signature` ? N(`tx`, t.q) : t.kind === `address` ? N(`address`, t.q) : t.kind === `slot` ? N(`block`, t.q) : ``;
  let r = {
    signature: `Transaction signature`,
    address: `Address`,
    slot: `Slot`,
    text: `Search`
  }[t.kind];
  let i = `<div class="ex-section-head"><div><span class="nexq-eyebrow">${E(r)}</span>
    <h2 class="mono" style="font-size:clamp(15px,2.2vw,22px);letter-spacing:-.01em;overflow-wrap:anywhere">${E(t.q)}</h2></div>${n}</div>`;
  let a = t.account ? `<div class="nexq-panel"><dl class="ex-rows">
      <div class="nexq-data-row"><dt>On Solana</dt><dd>${t.account.exists ? P(`badge-ok`, `Account exists`) : P(`badge-sim`, `No account at this address`)}</dd></div>
      ${t.account.exists ? `<div class="nexq-data-row"><dt>Balance</dt><dd class="num">${k(t.account.lamports)}</dd></div>
      <div class="nexq-data-row"><dt>Owned by</dt><dd>${E(e.programs.find(e => e.address === t.account.owner)?.label ?? Te(t.account.owner))} ${M(t.account.owner)}</dd></div>
      <div class="nexq-data-row"><dt>Data</dt><dd class="num">${t.account.executable ? `Program (executable)` : `${O(t.account.space ?? 0)} bytes`}</dd></div>` : ``}
      <div class="nexq-data-row"><dt>Latest transactions</dt><dd>${t.account.signatures.length ? `` : `none`}</dd></div>
    </dl>${t.account.signatures.length ? `<ul class="ex-siglist">${t.account.signatures.map(e => `<li>${e.ok ? `` : `${P(`badge-bad`, `Failed`)} `}${j(e.signature)}<span class="muted num">${A(e.blockTime)}</span></li>`).join(``)}</ul>` : ``}</div>` : ``;
  let o = t.groups.map(e => `<div class="ex-result-group"><h3>${E(e.title)}${e.count > 1 ? `<span class="count">${e.count}</span>` : ``}</h3>${e.html}${e.note ? `<p class="muted" style="font-size:12px">${E(e.note)}</p>` : ``}</div>`).join(``);
  let s = ``;
  if (!t.loading && !t.groups.length && !t.account) {
    s = `<div class="nexq-empty"><h3>Nothing from the nexq programs matches</h3>
      <p>${t.kind === `signature` || t.kind === `address` ? `${C.mode === `live` ? `Solana has no record of it on ${E(y.cluster)}.` : `It isn't in the snapshot, and Solana can't be reached right now.`} Check the value, or open it on Solana Explorer.` : `Try a full address, a transaction signature, a QPU job id, a slot number, or words like memo, token or ibm_fez.`}</p></div>${Ee(e)}`;
  }
  let c = t.account ? `<div class="ex-result-group"><h3>Account on Solana</h3>${a}</div>` : ``;
  return `<section class="ex-section">${i}
    ${t.loading ? `<div class="nexq-progress-field"><span class="muted">Searching${C.mode === `live` ? ` Solana` : ` the snapshot`}…</span><div class="nexq-progress nexq-progress--indeterminate"><span></span></div></div>` : ``}
    ${o}${c}${s}
    ${t.accountError ? `<div class="nexq-alert nexq-alert--warning"><div class="nexq-alert-body"><strong>Live lookup failed</strong><span>${E(t.accountError)}. Results above come from the data already loaded.</span></div></div>` : ``}
  </section>`;
}
var we = {
  "11111111111111111111111111111111": `System Program`,
  TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA: `SPL Token`,
  TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb: `Token-2022`,
  BPFLoaderUpgradeab1e11111111111111111111111: `BPF Upgradeable Loader`
};
var Te = e => we[e] ?? ``;
function Ee(e) {
  let t = e.entries[0];
  let n = W(e)[0];
  return `<div class="ex-hints">${[t && [t.address, `A Falcon account`], t?.wallet && [t.wallet, `A smart wallet`], n && [n.signature, `A Falcon-signed transaction`], e.runs[0] && [e.runs[0].jobId, `The Run 1 IBM job id`], [`ibm_fez`, `A quantum computer`], [`memo`, `Transactions with a memo`]].filter(Boolean).map(([e, t]) => `<a class="nexq-badge nexq-badge--neutral" href="${T(e)}">${E(t)}</a>`).join(``)}</div>`;
}
function $() {
  let e = C.data;
  fe(e);
  G();
  let t = document.getElementById(`search-input`);
  if (document.activeElement !== t) {
    t.value = C.view === `search` ? C.query : ``;
  }
  let n = document.getElementById(`body`);
  if (!e) {
    n.innerHTML = C.mode === `error` ? `<div class="nexq-alert nexq-alert--error"><div class="nexq-alert-body"><strong>Couldn't read Solana</strong><span>${E(C.reason)} Check your connection and press Refresh.</span></div></div>` : `<div class="nexq-progress-field"><span class="muted">Reading ${E(C.progress || `Solana devnet`)}…</span><div class="nexq-progress nexq-progress--indeterminate"><span></span></div></div>`;
    return;
  }
  let r = {
    overview: ge,
    accounts: _e,
    receipts: ve,
    randomness: ye,
    transactions: be,
    search: Ce
  }[C.view];
  n.innerHTML = r(e);
  document.getElementById(`footnote`).textContent = C.mode === `live` ? `Read live through ${U()} at slot ${O(e.slot)}. Experimental software on devnet, not audited.` : `Snapshot of Solana ${e.cluster} at slot ${O(e.slot)}, taken ${e.fetchedAt.slice(0, 16).replace(`T`, ` `)} UTC. Experimental software on devnet, not audited.`;
  for (let e of document.querySelectorAll(`input[name="tx-filter"]`)) {
    e.onchange = () => {
      C.txFilter = e.value;
      $();
      document.getElementById(`tx-filter-${e.value}`)?.focus();
    };
  }
}
async function De() {
  C.loading = true;
  if (!C.data) {
    C.mode = `loading`;
  }
  C.progress = ``;
  $();
  try {
    let e = await v(y, H, {
      known: V,
      onProgress: e => {
        C.progress = e;
        G();
      }
    });
    de(e.activity);
    C.data = e;
    C.mode = `live`;
  } catch (e) {
    if (b) {
      C.data = C.data ?? b;
      C.mode = `snapshot`;
      C.reason = `Live read failed (${e.message}); showing the snapshot.`;
    } else if (!C.data) {
      C.mode = `error`;
      C.reason = e.message;
    }
  }
  C.loading = false;
  $();
  if (C.view === `search` && C.query && C.data) {
    Q(C.query);
  }
}
function Oe() {
  Object.assign(C, w());
  $();
  scrollTo({
    top: 0
  });
  if (C.view === `search` && C.query && C.data) {
    Q(C.query);
  }
}
document.getElementById(`search-form`).addEventListener(`submit`, e => {
  e.preventDefault();
  let t = document.getElementById(`search-input`);
  let n = t.value.trim();
  if (n) {
    t.blur();
    if (location.hash === T(n)) {
      Oe();
    } else {
      location.hash = T(n);
    }
  }
});
addEventListener(`keydown`, e => {
  let t = document.getElementById(`search-input`);
  if (e.key === `/` && !e.metaKey && !e.ctrlKey && ![`INPUT`, `TEXTAREA`, `SELECT`].includes(document.activeElement?.tagName)) {
    e.preventDefault();
    t.focus();
    t.select();
  } else if (e.key === `Escape` && document.activeElement === t) {
    t.blur();
  }
});
addEventListener(`hashchange`, Oe);
if (b) {
  C.data = b;
  C.mode = `snapshot`;
  C.reason = `Showing the snapshot while reading Solana live.`;
}
$();
if (C.view === `search` && C.query && C.data) {
  Q(C.query);
}
De();