/**
 * Форматирует дату в российском формате
 */
export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('ru-RU');
}

/**
 * Форматирует число с заданным количеством десятичных знаков
 */
export function formatNumber(num: number, decimals: number = 2): string {
  return num.toFixed(decimals);
}

/**
 * Форматирует дозу в читаемом виде
 */
export function formatDose(dose: number): string {
  return `${formatNumber(dose, 3)} мГр`;
}

/**
 * Форматирует коллективную дозу
 */
export function formatCollectiveDose(dose: number): string {
  return `${formatNumber(dose, 2)} чел·мГр`;
}
