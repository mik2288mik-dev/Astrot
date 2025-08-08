export const Monetization = {
  openPremium() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.openPaymentForm) {
      try {
        tg.openPaymentForm({});
      } catch (e) {
        console.error('Payment form error', e);
      }
    }
  },
};
