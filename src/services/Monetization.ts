import "../types/telegram";
export const monetizationService = {
  /**
   * Открывает стандартную форму оплаты Telegram Stars.
   * @param starCount количество звёзд для списания
   */
  openPremiumPayment(starCount: number) {
    const tg = window.Telegram?.WebApp;
    if (tg && tg.openPaymentForm) {
      tg.openPaymentForm({ star_count: starCount });
    } else {
      console.warn('Telegram WebApp openPaymentForm unavailable');
    }
  }
};
