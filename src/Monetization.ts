export class WebApp {
  static tg = window.Telegram.WebApp;
  static openPremium() {
    this.tg.openPaymentForm({
      title: 'Премиум-подписка',
      description: 'Эксклюзивные гороскопы и функции',
      currency: 'RUB',
      prices: [{ label: 'Месяц', amount: 49900 }]
    });
  }
}
