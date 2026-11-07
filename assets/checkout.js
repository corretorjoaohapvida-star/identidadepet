window.PetCheckout = Object.freeze({
  provider: 'cakto',
  productId: '0974d446-09ce-488c-8b15-85d096b61539',
  offerId: 'dseki83',
  amount: 1990,
  currency: 'BRL',
  url: 'https://pay.cakto.com.br/dseki83',
  buildUrl() {
    const url = new URL(this.url);
    const incoming = new URLSearchParams(window.location.search);
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'src', 'sck']) {
      let value = incoming.get(key);
      try { value = value || sessionStorage.getItem(key); } catch {}
      if (value) url.searchParams.set(key, value);
    }
    return url.href;
  }
});
