/**
 * Расчёт матрицы по правилам, переданным Еленой Осинцевой.
 * Матрица: 1 4 7 / 2 5 8 / 3 6 9.
 *
 * 1900–2000: сумма цифр даты; её цифровая сумма;
 * константа 2; вычитание 2 из исходной суммы; цифровая сумма результата.
 *
 * 2001+: сумма цифр даты; её цифровая сумма;
 * константа 19; прибавление 19 к исходной сумме; цифровая сумма результата.
 *
 * Все цифры даты и каждого расчётного числа (включая константу)
 * переносятся в соответствующие ячейки. Нули в ячейки не попадают.
 */

const sumDigits = (n) => String(Math.abs(n)).split("").reduce((s, d) => s + Number(d), 0);
const digits = (n) => String(Math.abs(n)).split("").map(Number);

function parseISODate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) throw new Error("Введите дату рождения.");
  const [year, month, day] = value.split("-").map(Number);
  const d = new Date(Date.UTC(year, month - 1, day));
  if (d.getUTCFullYear() !== year || d.getUTCMonth() !== month - 1 || d.getUTCDate() !== day) {
    throw new Error("Проверьте дату: такого календарного дня не существует.");
  }
  if (year < 1900) throw new Error("Калькулятор принимает даты начиная с 01.01.1900.");
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  if (d.getTime() > today) throw new Error("Дата рождения не может быть в будущем.");
  return { year, month, day };
}

export function calculateMatrix(isoDate) {
  const { year } = parseISODate(isoDate);
  const birthDigits = isoDate.replaceAll("-", "").split("").map(Number);
  const firstNumber = birthDigits.reduce((a, b) => a + b, 0);
  const reducedFirstNumber = sumDigits(firstNumber);
  const constant = year <= 2000 ? 2 : 19;
  const secondNumber = year <= 2000 ? firstNumber - 2 : firstNumber + 19;
  const finalNumber = sumDigits(secondNumber);

  const calculationNumbers = [firstNumber, reducedFirstNumber, constant, secondNumber, finalNumber];
  const allDigits = [...birthDigits, ...calculationNumbers.flatMap(digits)];
  const counts = Object.fromEntries(Array.from({ length: 9 }, (_, i) => [String(i + 1), 0]));
  for (const n of allDigits) if (n !== 0) counts[String(n)] += 1;

  const layout = [["1","4","7"],["2","5","8"],["3","6","9"]].map(row =>
    row.map(key => ({ digit: Number(key), count: counts[key], value: key.repeat(counts[key]) || "—" }))
  );
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const mandatoryDigitsPresent = ["1", "2", "9"].every(k => counts[k] >= 1);

  return {
    birthDate: isoDate,
    yearRule: year <= 2000 ? "1900–2000" : "с 2001 года",
    constant, firstNumber, reducedFirstNumber, secondNumber, finalNumber,
    counts, layout, total, mandatoryDigitsPresent,
    maleDigits: ["2","4","6","8"].reduce((s, k) => s + counts[k], 0),
    femaleDigits: ["1","3","5","7","9"].reduce((s, k) => s + counts[k], 0),
    calculationNumbers
  };
}

export function formatDate(isoDate) {
  const [year, month, day] = isoDate.split("-");
  return `${day}.${month}.${year}`;
}
