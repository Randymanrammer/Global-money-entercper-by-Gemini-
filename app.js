/**
 * Global Money Intercepter – app.js
 * Provides currency conversion using static exchange rates (USD base).
 * For live rates, replace RATES with data from an open exchange-rate API.
 */

// Static approximate exchange rates relative to USD
const RATES = {
  USD: { rate: 1,        name: "US Dollar" },
  EUR: { rate: 0.92,     name: "Euro" },
  GBP: { rate: 0.79,     name: "British Pound" },
  JPY: { rate: 149.50,   name: "Japanese Yen" },
  CAD: { rate: 1.36,     name: "Canadian Dollar" },
  AUD: { rate: 1.53,     name: "Australian Dollar" },
  CHF: { rate: 0.90,     name: "Swiss Franc" },
  CNY: { rate: 7.24,     name: "Chinese Yuan" },
  INR: { rate: 83.10,    name: "Indian Rupee" },
  MXN: { rate: 17.15,    name: "Mexican Peso" },
  BRL: { rate: 4.97,     name: "Brazilian Real" },
  ZAR: { rate: 18.63,    name: "South African Rand" },
  NGN: { rate: 1550.00,  name: "Nigerian Naira" },
  KES: { rate: 129.50,   name: "Kenyan Shilling" },
  AED: { rate: 3.67,     name: "UAE Dirham" },
  SGD: { rate: 1.34,     name: "Singapore Dollar" },
  HKD: { rate: 7.82,     name: "Hong Kong Dollar" },
  SEK: { rate: 10.42,    name: "Swedish Krona" },
  NOK: { rate: 10.55,    name: "Norwegian Krone" },
  NZD: { rate: 1.63,     name: "New Zealand Dollar" },
};

const POPULAR = ["EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "INR", "NGN", "AED"];

// ── DOM helpers ──────────────────────────────────────────────────────────────

function populateSelect(selectEl, selectedCode) {
  selectEl.innerHTML = "";
  Object.entries(RATES).forEach(([code, { name }]) => {
    const opt = document.createElement("option");
    opt.value = code;
    opt.textContent = `${code} – ${name}`;
    if (code === selectedCode) opt.selected = true;
    selectEl.appendChild(opt);
  });
}

function renderRates() {
  const list = document.getElementById("rates-list");
  list.innerHTML = "";
  POPULAR.forEach((code) => {
    const { rate, name } = RATES[code];
    const li = document.createElement("li");
    li.innerHTML = `
      <span>
        <span class="currency-code">${code}</span>
        <br />
        <span class="currency-name">${name}</span>
      </span>
      <span class="rate-value">${rate.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span>
    `;
    list.appendChild(li);
  });
}

// ── Conversion logic ─────────────────────────────────────────────────────────

function convert(amount, fromCode, toCode) {
  // Convert through USD as base
  const inUSD = amount / RATES[fromCode].rate;
  return inUSD * RATES[toCode].rate;
}

function formatResult(amount, fromCode, toCode) {
  const result = convert(amount, fromCode, toCode);
  const decimals = result < 1 ? 6 : result < 1000 ? 4 : 2;
  const formatted = result.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  });
  return `${amount.toLocaleString()} ${fromCode} = <strong>${formatted} ${toCode}</strong>`;
}

// ── Event handlers ───────────────────────────────────────────────────────────

function handleConvert() {
  const amount = parseFloat(document.getElementById("amount").value);
  const fromCode = document.getElementById("from-currency").value;
  const toCode = document.getElementById("to-currency").value;
  const resultEl = document.getElementById("result");

  if (isNaN(amount) || amount < 0) {
    resultEl.textContent = "Please enter a valid amount.";
    return;
  }

  resultEl.innerHTML = formatResult(amount, fromCode, toCode);
}

function handleSwap() {
  const fromEl = document.getElementById("from-currency");
  const toEl = document.getElementById("to-currency");
  const tmp = fromEl.value;
  fromEl.value = toEl.value;
  toEl.value = tmp;
  handleConvert();
}

// ── Init ─────────────────────────────────────────────────────────────────────

(function init() {
  const fromEl = document.getElementById("from-currency");
  const toEl = document.getElementById("to-currency");

  populateSelect(fromEl, "USD");
  populateSelect(toEl, "EUR");
  renderRates();

  document.getElementById("convert-btn").addEventListener("click", handleConvert);
  document.getElementById("swap-btn").addEventListener("click", handleSwap);

  // Convert on Enter key in amount field
  document.getElementById("amount").addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleConvert();
  });

  // Auto-convert when selects change
  fromEl.addEventListener("change", handleConvert);
  toEl.addEventListener("change", handleConvert);

  // Initial conversion
  handleConvert();
})();
