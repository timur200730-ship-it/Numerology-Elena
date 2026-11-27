import { calculateMatrix, formatDate } from "./numerology.js";
import "./styles.css";

const app = document.querySelector("#app");

app.innerHTML = `
  <header class="topbar">
    <div class="brand-mark">Е</div>
    <div class="brand-copy">
      <div class="brand-title">Нумерология</div>
      <div class="brand-subtitle">Елены Осинцевой</div>
    </div>
    <span class="top-pill">АВТОРСКАЯ СИСТЕМА</span>
  </header>
  <main class="page">
    <section class="intro">
      <div class="eyebrow">ПОЗНАЙ СЕБЯ</div>
      <h1>Откройте свой<br><span>уникальный код личности</span></h1>
      <p>Персональный расчёт по материалам авторского курса «Тайны Нумерологии».</p>
    </section>
    <section class="calculator card">
      <div class="section-kicker">НОВЫЙ РАСЧЁТ</div>
      <h2>Данные клиента</h2>
      <form id="calc-form">
        <label for="client-name">Имя клиента</label>
        <input id="client-name" name="clientName" type="text" maxlength="80" autocomplete="name" placeholder="Например, Анна" />
        <label for="birth-date" class="date-label">Дата рождения</label>
        <input id="birth-date" name="birthDate" type="date" min="1900-01-01" required />
        <button class="primary-btn" type="submit">Рассчитать матрицу <span>→</span></button>
        <div id="error" class="error" role="alert"></div>
      </form>
    </section>
    <section id="result" class="result hidden" aria-live="polite"></section>
    <footer>© Елена Осинцева · Курс «Тайны Нумерологии»</footer>
  </main>
`;

const form = document.querySelector("#calc-form");
const dateInput = document.querySelector("#birth-date");
const nameInput = document.querySelector("#client-name");
dateInput.max = new Date().toISOString().slice(0, 10);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const error = document.querySelector("#error");
  const result = document.querySelector("#result");
  error.textContent = "";
  try {
    const data = calculateMatrix(dateInput.value);
    data.clientName = nameInput.value.trim();
    renderResult(data);
  } catch (err) {
    result.classList.add("hidden");
    error.textContent = err.message;
  }
});

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function calculateAge(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const today = new Date();
  let age = today.getFullYear() - year;
  if (today.getMonth() + 1 < month || (today.getMonth() + 1 === month && today.getDate() < day)) age--;
  return age;
}

function renderResult(data) {
  const result = document.querySelector("#result");
  const clientName = data.clientName ? escapeHtml(data.clientName) : "Клиент";
  const matrixHTML = data.layout.flat().map(cell => `
    <div class="matrix-cell">
      <span class="cell-number">${cell.value}</span>
      <span class="cell-label">${cell.digit}</span>
    </div>`).join("");

  const digitRows = Object.entries(data.counts).map(([digit, count]) => `
    <div class="digit-row"><span>Цифра ${digit}</span><b>${count ? digit.repeat(count) : "—"}</b><small>${count} ${count === 1 ? "раз" : count >= 2 && count <= 4 ? "раза" : "раз"}</small></div>
  `).join("");

  result.innerHTML = `
    <article class="report-sheet" id="report-sheet">
      <div class="report-brand">
        <div class="report-brand-mark">Е</div>
        <div><strong>Елена Осинцева</strong><span>Курс «Тайны Нумерологии»</span></div>
      </div>
      <div class="result-heading">
        <div class="section-kicker">ПЕРСОНАЛЬНЫЙ РАСЧЁТ</div>
        <h2>Матрица личности</h2>
        <p class="client-name">${clientName}</p>
        <p class="date-line">${formatDate(data.birthDate)} · ${calculateAge(data.birthDate)} лет</p>
      </div>
      <div class="stats-grid">
        <div class="stat"><span>Конечная цифра</span><strong>${data.reducedFirstNumber}</strong></div>
        <div class="stat"><span>Мужские цифры</span><strong>${data.maleDigits}</strong></div>
        <div class="stat"><span>Женские цифры</span><strong>${data.femaleDigits}</strong></div>
        <div class="stat"><span>Цифр в матрице</span><strong>${data.total}</strong></div>
      </div>
      <div class="card matrix-card">
        <div class="section-kicker">ВАША МАТРИЦА 3 × 3</div>
        <div class="matrix-grid">${matrixHTML}</div>
        <div class="matrix-note">Порядок ячеек: 1–4–7 / 2–5–8 / 3–6–9. Нули не переносятся в матрицу.</div>
      </div>
      <div class="card details-card">
        <div class="section-kicker">ПОШАГОВЫЙ РАСЧЁТ</div>
        <div class="detail-row"><span>Алгоритм по году рождения</span><b>${data.yearRule}</b></div>
        <div class="detail-row"><span>Сумма цифр даты</span><b>${data.firstNumber}</b></div>
        <div class="detail-row"><span>Конечная цифра</span><b>${data.reducedFirstNumber}</b></div>
        <div class="detail-row"><span>Константа</span><b>${data.constant}</b></div>
        <div class="detail-row"><span>Второе расчётное число</span><b>${data.secondNumber}</b></div>
        <div class="detail-row"><span>Последнее число</span><b>${data.finalNumber}</b></div>
        <div class="validation ${data.mandatoryDigitsPresent ? "valid" : "warning"}">
          ${data.mandatoryDigitsPresent
            ? "✓ В матрице присутствуют обязательные цифры 1, 2 и 9."
            : "В матрице отсутствует одна или несколько обязательных цифр 1, 2, 9. Проверьте расчёт по правилам курса."}
        </div>
      </div>
      <div class="card digit-card">
        <div class="section-kicker">КОЛИЧЕСТВО КАЖДОЙ ЦИФРЫ</div>
        <div class="digit-list">${digitRows}</div>
      </div>
      <p class="report-note">Расчёт выполнен по правилам, переданным для авторского курса. Нумерологическая интерпретация является частью авторской системы и не заменяет медицинскую, психологическую, юридическую или финансовую консультацию.</p>
      <div class="report-signature">Елена Осинцева <span>Автор курса «Тайны Нумерологии»</span></div>
    </article>
    <div class="result-actions">
      <button class="secondary-btn" id="print-btn" type="button">Сохранить персональный PDF</button>
      <button class="text-btn" id="reset-btn" type="button">Рассчитать другого клиента</button>
    </div>
  `;
  result.classList.remove("hidden");
  document.querySelector("#print-btn").addEventListener("click", () => window.print());
  document.querySelector("#reset-btn").addEventListener("click", () => {
    result.classList.add("hidden");
    dateInput.value = "";
    nameInput.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  result.scrollIntoView({ behavior: "smooth", block: "start" });
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
}
