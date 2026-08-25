const atomicMasses = {
  H: 1.008, He: 4.0026, Li: 6.94, Be: 9.0122, B: 10.81, C: 12.011,
  N: 14.007, O: 15.999, F: 18.998, Ne: 20.18, Na: 22.99, Mg: 24.305,
  Al: 26.982, Si: 28.085, P: 30.974, S: 32.06, Cl: 35.45, Ar: 39.948,
  K: 39.098, Ca: 40.078, Sc: 44.956, Ti: 47.867, V: 50.942, Cr: 51.996,
  Mn: 54.938, Fe: 55.845, Co: 58.933, Ni: 58.693, Cu: 63.546, Zn: 65.38,
  Ga: 69.723, Ge: 72.63, As: 74.922, Se: 78.971, Br: 79.904, Kr: 83.798,
  Rb: 85.468, Sr: 87.62, Y: 88.906, Zr: 91.224, Nb: 92.906, Mo: 95.95,
  Tc: 98, Ru: 101.07, Rh: 102.91, Pd: 106.42, Ag: 107.87, Cd: 112.41,
  In: 114.82, Sn: 118.71, Sb: 121.76, Te: 127.6, I: 126.9, Xe: 131.29,
  Cs: 132.91, Ba: 137.33, La: 138.91, Ce: 140.12, Pr: 140.91, Nd: 144.24,
  Pm: 145, Sm: 150.36, Eu: 151.96, Gd: 157.25, Tb: 158.93, Dy: 162.5,
  Ho: 164.93, Er: 167.26, Tm: 168.93, Yb: 173.05, Lu: 174.97, Hf: 178.49,
  Ta: 180.95, W: 183.84, Re: 186.21, Os: 190.23, Ir: 192.22, Pt: 195.08,
  Au: 196.97, Hg: 200.59, Tl: 204.38, Pb: 207.2, Bi: 208.98, Po: 209,
  At: 210, Rn: 222, Fr: 223, Ra: 226, Ac: 227, Th: 232.04, Pa: 231.04,
  U: 238.03, Np: 237, Pu: 244, Am: 243, Cm: 247, Bk: 247, Cf: 251,
  Es: 252, Fm: 257, Md: 258, No: 259, Lr: 262, Rf: 267, Db: 270,
  Sg: 271, Bh: 270, Hs: 277, Mt: 278, Ds: 281, Rg: 282, Cn: 285,
  Nh: 286, Fl: 289, Mc: 290, Lv: 293, Ts: 294, Og: 294
};

const countSelect = document.getElementById("element-count");
const inputsContainer = document.getElementById("element-inputs");
const resultValue = document.getElementById("result-value");
const errorMessage = document.getElementById("error-message");
const form = document.getElementById("mole-form");
const resetButton = document.getElementById("reset-button");
const themeToggle = document.getElementById("theme-toggle");

function buildInputs() {
  const count = Number(countSelect.value);
  inputsContainer.innerHTML = "";

  for (let i = 0; i < count; i += 1) {
    const row = document.createElement("div");
    row.className = "element-row";

    row.innerHTML = `
      <div class="input-block">
        <label for="element-symbol-${i}">Element ${i + 1}</label>
        <input id="element-symbol-${i}" name="element-symbol-${i}" type="text" maxlength="2" placeholder="e.g. H" autocomplete="off" />
      </div>
      <div class="input-block">
        <label for="element-amount-${i}">Atoms</label>
        <input id="element-amount-${i}" name="element-amount-${i}" type="number" min="1" step="1" value="1" />
      </div>
    `;

    inputsContainer.appendChild(row);
  }
}

function formatNumber(value) {
  if (Number.isInteger(value)) {
    return value.toLocaleString();
  }

  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3
  });
}

function clearError() {
  errorMessage.textContent = "";
}

function setError(message) {
  errorMessage.textContent = message;
}

function calculateMolarMass() {
  clearError();

  const count = Number(countSelect.value);
  let totalMass = 0;

  for (let i = 0; i < count; i += 1) {
    const symbolInput = document.getElementById(`element-symbol-${i}`);
    const amountInput = document.getElementById(`element-amount-${i}`);

    const symbol = (symbolInput.value || "").trim();
    const amount = Number(amountInput.value);

    if (!symbol) {
      setError(`Please enter an element symbol for element ${i + 1}.`);
      return;
    }

    const normalizedSymbol = symbol.charAt(0).toUpperCase() + symbol.slice(1).toLowerCase();
    if (!(normalizedSymbol in atomicMasses)) {
      setError(`"${symbol}" is not a valid element symbol.`);
      return;
    }

    if (!Number.isInteger(amount) || amount < 1) {
      setError(`Atoms for "${normalizedSymbol}" must be a whole number greater than zero.`);
      return;
    }

    totalMass += atomicMasses[normalizedSymbol] * amount;
  }

  const shouldRound = document.getElementById("round-whole").checked;
  const finalMass = shouldRound ? Math.round(totalMass) : totalMass;

  resultValue.textContent = `${formatNumber(finalMass)} g/mol`;
}

function resetCalculator() {
  countSelect.value = "1";
  document.getElementById("round-whole").checked = false;
  buildInputs();
  resultValue.textContent = "0 g/mol";
  clearError();
}

countSelect.addEventListener("change", () => {
  buildInputs();
  calculateMolarMass();
});

form.addEventListener("input", () => {
  calculateMolarMass();
});

form.addEventListener("change", () => {
  calculateMolarMass();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  calculateMolarMass();
});

resetButton.addEventListener("click", resetCalculator);

const savedTheme = localStorage.getItem("mole-calculator-theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
  themeToggle.textContent = "🌙";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  themeToggle.textContent = isDark ? "🌙" : "☀️";
  localStorage.setItem("mole-calculator-theme", isDark ? "dark" : "light");
});

buildInputs();
calculateMolarMass();
