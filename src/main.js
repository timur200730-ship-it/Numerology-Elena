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
      <p>Рассчитайте матрицу по дате рождения и познакомьтесь с её структурой.</p>
    </section>
    <section class="calculator card">
      <div class="section-kicker">ВАШ РАСЧЁТ</div>
      <h2>Дата рождения</h2>
      <form id="calc-form">
        <label for="birth-date">Укажите дату рождения</label>
        <input id="birth-date" name="birthDate" type="date" min="1900-01-01" required />
        <button class="primary-btn" type="submit">Рассчитать матрицу <span>→</span></button>
        <div id="error" class="error" role="alert"></div>
      </form>
    </section>
    <section id="result" class="result hidden" aria-live="polite"></section>
    <footer>© Елена Осинцева · Авторская методика нумерологии</footer>
  </main>
`;

const form = document.querySelector("#calc-form");
const dateInput = document.querySelector("#birth-date");
dateInput.max = new Date().toISOString().slice(0, 10);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const error = document.querySelector("#error");
  const result = document.querySelector("#result");
  error.textContent = "";
  try {
    const data = calculateMatrix(dateInput.value);
    renderResult(data);
  } catch (err) {
    result.classList.add("hidden");
    error.textContent = err.message;
  }
});

function renderResult(data) {
  const result = document.querySelector("#result");
  const matrixHTML = data.layout.flat().map(cell => `
    <div class="matrix-cell">
      <span class="cell-number">${cell.value}</span>
      <span class="cell-label">${cell.digit}</span>
    </div>`).join("");

  result.innerHTML = `
    <div class="result-heading">
      <div class="section-kicker">ВАШ РЕЗУЛЬТАТ</div>
      <h2>Матрица личности</h2>
      <p class="date-line">${formatDate(data.birthDate)}</p>
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
      <div class="matrix-note">Каждая цифра занимает свою ячейку. Нули не переносятся в матрицу.</div>
    </div>
    <div class="card details-card">
      <div class="section-kicker">ПРОВЕРКА РАСЧЁТА</div>
      <div class="detail-row"><span>Правило по году рождения</span><b>${data.yearRule}</b></div>
      <div class="detail-row"><span>Первое число</span><b>${data.firstNumber}</b></div>
      <div class="detail-row"><span>Конечная цифра</span><b>${data.reducedFirstNumber}</b></div>
      <div class="detail-row"><span>Константа</span><b>${data.constant}</b></div>
      <div class="detail-row"><span>Второе число</span><b>${data.secondNumber}</b></div>
      <div class="detail-row"><span>Сумма цифр второго числа</span><b>${data.finalNumber}</b></div>
      <div class="validation ${data.mandatoryDigitsPresent ? "valid" : "warning"}">
        ${data.mandatoryDigitsPresent
          ? "✓ В матрице присутствуют обязательные цифры 1, 2 и 9."
          : "Внимание: в матрице отсутствует одна или несколько обязательных цифр 1, 2, 9. Требуется сверка с методикой."}
      </div>
    </div>
    <div class="result-actions">
      <button class="secondary-btn" id="print-btn" type="button">Сохранить / распечатать PDF</button>
      <button class="text-btn" id="reset-btn" type="button">Новый расчёт</button>
    </div>
    <p class="disclaimer">Это предварительный расчёт матрицы. Подробные трактовки и остальные показатели будут добавлены после подтверждения соответствующих правил Еленой.</p>
  `;
  result.classList.remove("hidden");
  document.querySelector("#print-btn").addEventListener("click", () => window.print());
  document.querySelector("#reset-btn").addEventListener("click", () => {
    result.classList.add("hidden");
    dateInput.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  result.scrollIntoView({ behavior: "smooth", block: "start" });
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
}
