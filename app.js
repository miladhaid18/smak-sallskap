(() => {
  "use strict";

  const CART_KEY = "smak-sallskap-cart-v1";
  const FREE_DELIVERY_LIMIT = 500;
  const DELIVERY_FEE = 39;

  const CATEGORY_MAP = new Map(CATEGORIES.map((category) => [category.id, category]));
  const MENU_MAP = new Map(MENU.map((item) => [item.id, item]));
  const krFormatter = new Intl.NumberFormat("sv-SE");

  const ICONS = {
    star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5z"></path></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"></path></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.2 4.2L19 7"></path></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.6 8.5h10.8l-.8 10.1a2 2 0 0 1-2 1.9H9.4a2 2 0 0 1-2-1.9L6.6 8.5Z"></path><path d="M9.2 8.5V7a2.8 2.8 0 0 1 5.6 0v1.5"></path></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4 4"></path></svg>'
  };

  const els = {
    header: document.querySelector(".site-header"),
    navToggle: document.getElementById("nav-toggle"),
    mainNav: document.getElementById("main-nav"),
    openCart: document.getElementById("open-cart"),
    cartCount: document.getElementById("cart-count"),
    grid: document.getElementById("dish-grid"),
    tabs: document.getElementById("category-tabs"),
    search: document.getElementById("menu-search"),
    searchClear: document.getElementById("search-clear"),
    resultCount: document.getElementById("result-count"),
    emptyState: document.getElementById("empty-state"),
    resetFilters: document.getElementById("reset-filters"),
    cartDialog: document.getElementById("cart-dialog"),
    cartItems: document.getElementById("cart-items"),
    cartSubtotal: document.getElementById("cart-subtotal"),
    cartShip: document.getElementById("cart-ship"),
    checkoutBtn: document.getElementById("checkout-btn"),
    clearCart: document.getElementById("clear-cart"),
    dishDialog: document.getElementById("dish-dialog"),
    toastStack: document.getElementById("toast-stack"),
    checkoutDialog: document.getElementById("checkout-dialog"),
    checkoutForm: document.getElementById("checkout-form"),
    checkoutItems: document.getElementById("checkout-items"),
    sumSubtotal: document.getElementById("sum-subtotal"),
    sumDelivery: document.getElementById("sum-delivery"),
    sumTotal: document.getElementById("sum-total"),
    payBtn: document.getElementById("pay-btn"),
    deliveryFields: document.getElementById("delivery-fields"),
    confirmDialog: document.getElementById("confirm-dialog"),
    confirmText: document.getElementById("confirm-text"),
    confirmOrderNo: document.getElementById("confirm-order-no"),
    confirmTime: document.getElementById("confirm-time"),
    confirmMethod: document.getElementById("confirm-method"),
    confirmPay: document.getElementById("confirm-pay"),
    confirmTotal: document.getElementById("confirm-total"),
    confirmClose: document.getElementById("confirm-close"),
    year: document.getElementById("year")
  };

  let currentDish = null;
  let detailQty = 1;

  const state = {
    category: "alla",
    query: "",
    cart: loadCart()
  };

  init();

  function init() {
    renderTabs();
    renderMenu();
    renderCart();
    updateCartBadge(false);
    updatePaymentUI(activePayment());
    updateFulfillmentUI();
    bindFallbacks(document);
    initHeader();
    initReveal();
    bindMenuControls();
    bindCart();
    bindCheckout();
    bindDialogs();
    els.year.textContent = String(new Date().getFullYear());
  }

  function loadCart() {
    try {
      const raw = window.localStorage.getItem(CART_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((entry) => entry && MENU_MAP.has(entry.id))
        .map((entry) => ({
          id: entry.id,
          qty: Math.min(99, Math.max(1, Math.round(Number(entry.qty) || 1)))
        }));
    } catch (error) {
      return [];
    }
  }

  function saveCart() {
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(state.cart));
    } catch (error) {
      return;
    }
  }

  function formatKr(value) {
    return `${krFormatter.format(value)} kr`;
  }

  function formatRating(value) {
    return value.toFixed(1).replace(".", ",");
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => {
      const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      };
      return map[character];
    });
  }

  function categoryLabel(id) {
    const category = CATEGORY_MAP.get(id);
    return category ? category.singular : "";
  }

  function dietClass(tag) {
    if (tag === "Vegetarisk" || tag === "Vegansk") return "diet-veg";
    if (tag === "Glutenfri") return "diet-gf";
    if (tag === "Stark") return "diet-hot";
    if (tag === "18+") return "diet-age";
    return "";
  }

  function imageUrl(item) {
    return `images/${item.id}.jpg`;
  }

  function placeholderImage(name) {
    const palettes = [
      { bg1: "#efe2cd", bg2: "#dcc5a4", ink: "#5b452f", accent: "#b34524" },
      { bg1: "#e3e7d7", bg2: "#c9d1b9", ink: "#3f4c35", accent: "#7c8f63" },
      { bg1: "#f2dfd3", bg2: "#e4c2ad", ink: "#5f3c2c", accent: "#b34524" },
      { bg1: "#e8e1d2", bg2: "#d4c9b3", ink: "#4c4334", accent: "#9a7b45" }
    ];
    const cleaned = String(name || "Smak & Sällskap")
      .replace(/[^\p{L}\s]/gu, " ")
      .trim();
    const words = cleaned.split(/\s+/).filter(Boolean);
    const initials = (words.slice(0, 2).map((word) => word[0]).join("") || "S").toUpperCase();
    const palette = palettes[cleaned.length % palettes.length];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${palette.bg1}"/><stop offset="1" stop-color="${palette.bg2}"/></linearGradient></defs><rect width="800" height="600" fill="url(#g)"/><circle cx="640" cy="110" r="180" fill="${palette.accent}" opacity=".12"/><circle cx="120" cy="510" r="150" fill="${palette.ink}" opacity=".08"/><circle cx="400" cy="290" r="142" fill="none" stroke="${palette.accent}" stroke-opacity=".35" stroke-width="2"/><circle cx="400" cy="290" r="112" fill="#fffaf2" opacity=".55"/><text x="400" y="325" text-anchor="middle" font-family="Georgia, serif" font-size="92" fill="${palette.ink}">${initials}</text><text x="400" y="405" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" letter-spacing="5" fill="${palette.ink}" opacity=".65">SMAK &amp; SÄLLSKAP</text></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  function bindFallbacks(root = document) {
    root.querySelectorAll("img[data-fallback]").forEach((img) => {
      if (img.dataset.fallbackBound === "1") return;
      img.dataset.fallbackBound = "1";
      const applyFallback = () => {
        const source = img.getAttribute("src") || "";
        if (!source.startsWith("data:image/svg")) {
          img.src = placeholderImage(img.dataset.fallbackName || "Smak & Sällskap");
        }
      };
      img.addEventListener("error", applyFallback, { once: true });
      if (img.complete && img.naturalWidth === 0) applyFallback();
    });
  }

  function renderTabs() {
    const counts = MENU.reduce((result, item) => {
      result[item.category] = (result[item.category] || 0) + 1;
      return result;
    }, {});
    const tabs = [
      { id: "alla", label: "Allt", count: MENU.length },
      ...CATEGORIES.map((category) => ({
        id: category.id,
        label: category.label,
        count: counts[category.id] || 0
      }))
    ];
    els.tabs.innerHTML = tabs
      .map(
        (tab) => `<button class="tab ${state.category === tab.id ? "is-active" : ""}" type="button" data-category="${tab.id}" aria-pressed="${state.category === tab.id}">${escapeHtml(tab.label)}<span class="tab-count">${tab.count}</span></button>`
      )
      .join("");
  }

  function renderMenu() {
    els.grid.innerHTML = MENU.map((item) => {
      const badge = item.badge
        ? `<span class="badge ${item.badge === "Nyhet" ? "badge-new" : "badge-popular"}">${escapeHtml(item.badge)}</span>`
        : "";
      const tags = item.tags
        .slice(0, 2)
        .map((tag) => `<span class="diet-tag ${dietClass(tag)}">${escapeHtml(tag)}</span>`)
        .join("");
      return `<article class="dish-card" data-id="${item.id}" tabindex="0" role="button" aria-label="Visa ${escapeHtml(item.name)}">
        <div class="dish-media">
          <img src="${imageUrl(item)}" alt="" width="640" height="480" loading="lazy" data-fallback data-fallback-name="${escapeHtml(item.name)}">
          ${badge}
          <span class="price-chip">${formatKr(item.price)}</span>
        </div>
        <div class="dish-body">
          <div class="dish-meta">
            <span class="dish-cat">${escapeHtml(categoryLabel(item.category))}</span>
            <span class="rating">${ICONS.star}${formatRating(item.rating)}</span>
          </div>
          <h3 class="dish-name">${escapeHtml(item.name)}</h3>
          <p class="dish-short">${escapeHtml(item.short)}</p>
          <div class="dish-foot">
            <div class="diet-list">${tags}</div>
            <button class="add-btn" type="button" data-add="${item.id}" aria-label="Lägg ${escapeHtml(item.name)} i varukorgen" title="Lägg i varukorgen">${ICONS.plus}</button>
          </div>
        </div>
      </article>`;
    }).join("");
    bindFallbacks(els.grid);
    applyFilters();
  }

  function applyFilters() {
    const query = state.query.trim().toLowerCase();
    let visible = 0;

    els.grid.querySelectorAll(".dish-card").forEach((card) => {
      const item = MENU_MAP.get(card.dataset.id);
      if (!item) return;
      const matchesCategory = state.category === "alla" || item.category === state.category;
      const haystack = `${item.name} ${item.short} ${item.description} ${item.ingredients.join(" ")} ${item.tags.join(" ")} ${categoryLabel(item.category)}`.toLowerCase();
      const matchesQuery = !query || haystack.includes(query);
      const show = matchesCategory && matchesQuery;
      card.hidden = !show;
      if (show) visible += 1;
    });

    els.emptyState.hidden = visible !== 0;
    els.searchClear.hidden = state.query.length === 0;

    if (query) {
      els.resultCount.textContent =
        visible === 0
          ? "Inga träffar – prova ett annat sökord"
          : `${visible} ${visible === 1 ? "träff" : "träffar"} för “${state.query.trim()}”`;
      return;
    }

    if (state.category !== "alla") {
      const category = CATEGORY_MAP.get(state.category);
      els.resultCount.textContent = `${visible} ${visible === 1 ? "rätt" : "rätter"} i ${category.label.toLowerCase()}`;
      return;
    }

    els.resultCount.textContent = `${visible} rätter på menyn`;
  }

  function setCategory(category, scroll) {
    state.category = category;
    renderTabs();
    applyFilters();
    if (scroll) scrollToMenu();
  }

  function bindMenuControls() {
    els.tabs.addEventListener("click", (event) => {
      const tab = event.target.closest("[data-category]");
      if (!tab) return;
      setCategory(tab.dataset.category, false);
    });

    els.search.addEventListener("input", () => {
      state.query = els.search.value;
      applyFilters();
    });

    els.search.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && state.query) {
        state.query = "";
        els.search.value = "";
        applyFilters();
      }
    });

    els.searchClear.addEventListener("click", () => {
      state.query = "";
      els.search.value = "";
      applyFilters();
      els.search.focus();
    });

    els.resetFilters.addEventListener("click", () => {
      state.query = "";
      els.search.value = "";
      setCategory("alla", false);
    });

    document.querySelectorAll("[data-jump]").forEach((button) => {
      button.addEventListener("click", () => setCategory(button.dataset.jump, true));
    });

    els.grid.addEventListener("click", (event) => {
      const addButton = event.target.closest("[data-add]");
      if (addButton) {
        addToCart(addButton.dataset.add, 1);
        return;
      }
      const card = event.target.closest(".dish-card");
      if (card) openDish(card.dataset.id);
    });

    els.grid.addEventListener("keydown", (event) => {
      if (event.target.closest("button")) return;
      const card = event.target.closest(".dish-card");
      if (!card) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openDish(card.dataset.id);
      }
    });
  }

  function openDish(id) {
    const item = MENU_MAP.get(id);
    if (!item) return;
    currentDish = item;
    detailQty = 1;

    const badge = item.badge
      ? `<span class="badge ${item.badge === "Nyhet" ? "badge-new" : "badge-popular"}">${escapeHtml(item.badge)}</span>`
      : "";
    const ingredients = item.ingredients.map((ingredient) => `<li>${escapeHtml(ingredient)}</li>`).join("");
    const allergens = item.allergens.length
      ? item.allergens.map((allergen) => `<span class="allergen-chip">${escapeHtml(allergen)}</span>`).join("")
      : '<p class="no-allergens">Inga angivna allergener. Fråga oss om du är osäker.</p>';
    const tags = item.tags
      .map((tag) => `<span class="diet-tag ${dietClass(tag)}">${escapeHtml(tag)}</span>`)
      .join("");

    els.dishDialog.innerHTML = `<div class="dish-dialog-grid">
      <div class="dish-dialog-media">
        <img src="${imageUrl(item)}" alt="${escapeHtml(item.name)}" width="1000" height="800" data-fallback data-fallback-name="${escapeHtml(item.name)}">
        ${badge}
      </div>
      <div class="dish-dialog-body">
        <button class="dialog-close" type="button" data-close-dialog aria-label="Stäng">${ICONS.close}</button>
        <p class="eyebrow">${escapeHtml(categoryLabel(item.category))}</p>
        <h2 id="dish-dialog-title">${escapeHtml(item.name)}</h2>
        <div class="detail-meta">
          <span class="rating">${ICONS.star}${formatRating(item.rating)}</span>
          <span class="meta-dot"></span>
          <span>${item.ingredients.length} råvaror</span>
        </div>
        <p class="dialog-desc">${escapeHtml(item.description)}</p>
        ${tags ? `<div class="detail-diet">${tags}</div>` : ""}
        <div class="dialog-block">
          <h3>Det här ingår</h3>
          <ul class="ingredient-list">${ingredients}</ul>
        </div>
        <div class="dialog-block">
          <h3>Allergener</h3>
          <div class="allergen-list">${allergens}</div>
        </div>
        <div class="dialog-buy">
          <div class="qty-control" aria-label="Antal">
            <button type="button" data-qty-step="-1" aria-label="Minska antal">−</button>
            <span class="qty-value">1</span>
            <button type="button" data-qty-step="1" aria-label="Öka antal">+</button>
          </div>
          <button class="btn btn-primary detail-add" type="button" data-add-detail="${item.id}">
            <span>Lägg i varukorgen</span>
            <span class="detail-add-price">${formatKr(item.price)}</span>
          </button>
        </div>
        <p class="dialog-note">Allergier eller särskilda önskemål? Ring oss på 040–123 45 67 så hjälper vi dig.</p>
      </div>
    </div>`;

    els.dishDialog.showModal();
    bindFallbacks(els.dishDialog);
  }

  function updateDetailQty() {
    const value = els.dishDialog.querySelector(".qty-value");
    if (value) value.textContent = String(detailQty);
    const price = els.dishDialog.querySelector(".detail-add-price");
    if (price && currentDish) price.textContent = formatKr(currentDish.price * detailQty);
  }

  function getCartEntries() {
    return state.cart
      .map((entry) => ({ ...entry, item: MENU_MAP.get(entry.id) }))
      .filter((entry) => entry.item);
  }

  function getSubtotal() {
    return state.cart.reduce((sum, entry) => {
      const item = MENU_MAP.get(entry.id);
      return item ? sum + item.price * entry.qty : sum;
    }, 0);
  }

  function cartItemMarkup(entry) {
    const item = entry.item;
    return `<li class="cart-item">
      <div class="cart-thumb">
        <img src="${imageUrl(item)}" alt="" width="160" height="160" loading="lazy" data-fallback data-fallback-name="${escapeHtml(item.name)}">
      </div>
      <div class="cart-item-main">
        <div class="cart-item-top">
          <h4>${escapeHtml(item.name)}</h4>
          <span class="cart-line-price">${formatKr(item.price * entry.qty)}</span>
        </div>
        <p class="cart-item-meta">${escapeHtml(categoryLabel(item.category))} · ${formatKr(item.price)} / st</p>
        <div class="cart-item-actions">
          <div class="qty-control qty-small" aria-label="Antal ${escapeHtml(item.name)}">
            <button type="button" data-cart-dec="${item.id}" aria-label="Minska antal">−</button>
            <span>${entry.qty}</span>
            <button type="button" data-cart-inc="${item.id}" aria-label="Öka antal">+</button>
          </div>
          <button class="remove-btn" type="button" data-cart-remove="${item.id}">Ta bort</button>
        </div>
      </div>
    </li>`;
  }

  function emptyCartMarkup() {
    return `<div class="cart-empty">
      <span class="cart-empty-icon" aria-hidden="true">${ICONS.bag}</span>
      <h3>Varukorgen är tom</h3>
      <p>Bläddra i menyn och lägg till något gott – vi värmer redan ugnen.</p>
      <button class="btn btn-dark" type="button" data-cart-explore>Utforska menyn</button>
    </div>`;
  }

  function renderCart() {
    const entries = getCartEntries();

    if (!entries.length) {
      els.cartItems.innerHTML = emptyCartMarkup();
      els.cartSubtotal.textContent = formatKr(0);
      els.cartShip.textContent = "";
      els.cartShip.hidden = true;
      els.cartShip.classList.remove("is-free");
      els.checkoutBtn.disabled = true;
      els.clearCart.hidden = true;
      return;
    }

    els.cartItems.innerHTML = `<ul class="cart-list">${entries.map(cartItemMarkup).join("")}</ul>`;
    const subtotal = getSubtotal();
    els.cartSubtotal.textContent = formatKr(subtotal);
    els.cartShip.hidden = false;

    if (subtotal >= FREE_DELIVERY_LIMIT) {
      els.cartShip.textContent = "Fri leverans vid hemleverans är aktiverad.";
      els.cartShip.classList.add("is-free");
    } else {
      els.cartShip.textContent = `Lägg till ${formatKr(FREE_DELIVERY_LIMIT - subtotal)} för fri leverans vid hemleverans.`;
      els.cartShip.classList.remove("is-free");
    }

    els.checkoutBtn.disabled = false;
    els.clearCart.hidden = false;
    bindFallbacks(els.cartItems);
  }

  function updateCartBadge(animate) {
    const count = state.cart.reduce((sum, entry) => sum + entry.qty, 0);
    els.cartCount.textContent = String(count);
    if (animate) {
      els.cartCount.classList.remove("bump");
      void els.cartCount.offsetWidth;
      els.cartCount.classList.add("bump");
    }
  }

  function addToCart(id, qty = 1) {
    const item = MENU_MAP.get(id);
    if (!item) return;
    const safeQty = Math.min(99, Math.max(1, Math.round(Number(qty) || 1)));
    const existing = state.cart.find((entry) => entry.id === id);
    if (existing) {
      existing.qty = Math.min(99, existing.qty + safeQty);
    } else {
      state.cart.push({ id, qty: safeQty });
    }
    saveCart();
    renderCart();
    updateCartBadge(true);
    showToast(`${item.name} lades i varukorgen.`);
  }

  function changeCartQty(id, delta) {
    const entry = state.cart.find((line) => line.id === id);
    if (!entry) return;
    entry.qty += delta;
    if (entry.qty <= 0) {
      state.cart = state.cart.filter((line) => line.id !== id);
    } else {
      entry.qty = Math.min(99, entry.qty);
    }
    saveCart();
    renderCart();
    updateCartBadge(false);
  }

  function openCart() {
    renderCart();
    els.cartDialog.showModal();
  }

  function bindCart() {
    els.openCart.addEventListener("click", openCart);
    els.checkoutBtn.addEventListener("click", openCheckout);

    els.clearCart.addEventListener("click", () => {
      if (!state.cart.length) return;
      state.cart = [];
      saveCart();
      renderCart();
      updateCartBadge(true);
      showToast("Varukorgen är tömd.");
    });

    els.cartItems.addEventListener("click", (event) => {
      const increase = event.target.closest("[data-cart-inc]");
      if (increase) {
        changeCartQty(increase.dataset.cartInc, 1);
        return;
      }
      const decrease = event.target.closest("[data-cart-dec]");
      if (decrease) {
        changeCartQty(decrease.dataset.cartDec, -1);
        return;
      }
      const remove = event.target.closest("[data-cart-remove]");
      if (remove) {
        changeCartQty(remove.dataset.cartRemove, -99);
        return;
      }
      const explore = event.target.closest("[data-cart-explore]");
      if (explore) {
        els.cartDialog.close();
        scrollToMenu();
      }
    });

    els.dishDialog.addEventListener("click", (event) => {
      if (event.target === els.dishDialog) {
        els.dishDialog.close();
        return;
      }
      const qtyButton = event.target.closest("[data-qty-step]");
      if (qtyButton) {
        detailQty = Math.min(20, Math.max(1, detailQty + Number(qtyButton.dataset.qtyStep)));
        updateDetailQty();
        return;
      }
      const addButton = event.target.closest("[data-add-detail]");
      if (addButton && currentDish) {
        const id = currentDish.id;
        const qty = detailQty;
        els.dishDialog.close();
        addToCart(id, qty);
      }
    });
  }

  function activePayment() {
    const checked = els.checkoutForm.querySelector('input[name="payment"]:checked');
    return checked ? checked.value : "swish";
  }

  function activeFulfillment() {
    const checked = els.checkoutForm.querySelector('input[name="fulfillment"]:checked');
    return checked ? checked.value : "hamta";
  }

  function updateFulfillmentUI() {
    const isDelivery = activeFulfillment() === "leverans";
    els.deliveryFields.hidden = !isDelivery;
    els.deliveryFields.querySelectorAll("input").forEach((input) => {
      input.disabled = !isDelivery;
      input.required = isDelivery;
    });
    updateTotals();
  }

  function updateTotals() {
    const subtotal = getSubtotal();
    const isDelivery = activeFulfillment() === "leverans";
    const fee = isDelivery ? (subtotal >= FREE_DELIVERY_LIMIT ? 0 : DELIVERY_FEE) : 0;
    els.sumSubtotal.textContent = formatKr(subtotal);
    els.sumDelivery.textContent = isDelivery && fee === 0 ? "Fri" : formatKr(fee);
    els.sumTotal.textContent = formatKr(subtotal + fee);
  }

  function updatePaymentUI(method) {
    els.checkoutForm.querySelectorAll(".pay-panel").forEach((panel) => {
      const isActive = panel.dataset.panel === method;
      panel.hidden = !isActive;
      panel.querySelectorAll("input, select, textarea").forEach((input) => {
        input.disabled = !isActive;
      });
    });

    if (method === "kort") {
      els.payBtn.textContent = "Betala med kort";
    } else if (method === "faktura") {
      els.payBtn.textContent = "Slutför med faktura";
    } else {
      els.payBtn.textContent = "Betala med Swish";
    }
  }

  function renderCheckoutSummary() {
    const entries = getCartEntries();
    els.checkoutItems.innerHTML = entries
      .map(
        (entry) => `<div class="checkout-item">
          <span><span class="co-qty">${entry.qty}×</span>${escapeHtml(entry.item.name)}</span>
          <span>${formatKr(entry.item.price * entry.qty)}</span>
        </div>`
      )
      .join("");
    updateTotals();
  }

  function openCheckout() {
    if (!state.cart.length) {
      showToast("Lägg till något i varukorgen först.");
      return;
    }
    if (els.cartDialog.open) els.cartDialog.close();
    renderCheckoutSummary();
    updateFulfillmentUI();
    updatePaymentUI(activePayment());
    ["card-number", "card-expiry", "card-cvc", "invoice-ssn"].forEach((id) => {
      const input = document.getElementById(id);
      if (input) input.setCustomValidity("");
    });
    els.checkoutDialog.showModal();
  }

  function luhnCheck(value) {
    let sum = 0;
    let double = false;
    for (let index = value.length - 1; index >= 0; index -= 1) {
      let digit = Number(value[index]);
      if (double) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      double = !double;
    }
    return sum % 10 === 0;
  }

  function validateCardFields() {
    const numberInput = document.getElementById("card-number");
    const expiryInput = document.getElementById("card-expiry");
    const cvcInput = document.getElementById("card-cvc");
    [numberInput, expiryInput, cvcInput].forEach((input) => input.setCustomValidity(""));

    const digits = numberInput.value.replace(/\s/g, "");
    if (!/^\d{13,19}$/.test(digits) || !luhnCheck(digits)) {
      numberInput.setCustomValidity("Kortnumret verkar vara ogiltigt. Kontrollera och försök igen.");
      numberInput.reportValidity();
      return false;
    }

    const match = expiryInput.value.match(/^(\d{2})\/(\d{2})$/);
    if (match) {
      const month = Number(match[1]);
      const year = 2000 + Number(match[2]);
      const expiryDate = new Date(year, month, 1);
      if (expiryDate <= new Date()) {
        expiryInput.setCustomValidity("Kortet verkar ha gått ut. Ange ett giltigt datum.");
        expiryInput.reportValidity();
        return false;
      }
    }

    if (!/^\d{3,4}$/.test(cvcInput.value)) {
      cvcInput.setCustomValidity("Ange en giltig CVC (3–4 siffror).");
      cvcInput.reportValidity();
      return false;
    }

    return true;
  }

  function collectOrder() {
    const subtotal = getSubtotal();
    const mode = activeFulfillment();
    const method = activePayment();
    const fee = mode === "leverans" ? (subtotal >= FREE_DELIVERY_LIMIT ? 0 : DELIVERY_FEE) : 0;
    const timeSelect = document.getElementById("co-time");
    const timeOption = timeSelect.selectedOptions[0];
    const address = mode === "leverans"
      ? [
          document.getElementById("co-address").value.trim(),
          [
            document.getElementById("co-zip").value.trim(),
            document.getElementById("co-city").value.trim()
          ]
            .filter(Boolean)
            .join(" ")
        ]
          .filter(Boolean)
          .join(", ")
      : "";

    return {
      method,
      mode,
      total: subtotal + fee,
      email: document.getElementById("co-email").value.trim(),
      phone: document.getElementById("co-phone").value.trim(),
      swishPhone: document.getElementById("swish-phone").value.trim(),
      invoiceEmail: document.getElementById("invoice-email").value.trim(),
      address,
      timeLabel: timeOption ? timeOption.textContent.trim() : "Så snart som möjligt",
      orderNumber: `SS-${Math.floor(100000 + Math.random() * 900000)}`
    };
  }

  function handleCheckoutSubmit(event) {
    event.preventDefault();
    const method = activePayment();

    if (method === "kort" && !validateCardFields()) return;

    if (method === "faktura") {
      const ssnInput = document.getElementById("invoice-ssn");
      ssnInput.setCustomValidity("");
      if (!/^\d{6,8}[-+]?\d{4}$/.test(ssnInput.value.trim())) {
        ssnInput.setCustomValidity("Ange ett giltigt personnummer, till exempel 900101-1234.");
        ssnInput.reportValidity();
        return;
      }
    }

    if (!state.cart.length) {
      showToast("Varukorgen är tom – lägg till något gott först.");
      return;
    }

    submitOrder();
  }

  function submitOrder() {
    const originalLabel = els.payBtn.textContent;
    els.payBtn.disabled = true;
    els.payBtn.classList.add("is-loading");
    els.payBtn.textContent = "Behandlar beställning...";

    window.setTimeout(() => {
      const order = collectOrder();
      els.payBtn.disabled = false;
      els.payBtn.classList.remove("is-loading");
      els.payBtn.textContent = originalLabel;
      completeOrder(order);
    }, 1500);
  }

  function completeOrder(order) {
    const methodLabels = {
      swish: "Swish",
      kort: "Betalkort",
      faktura: "Faktura"
    };
    const messages = {
      swish: `En betalningsbegäran är skickad till ${order.swishPhone}. Din order förbereds så snart betalningen är bekräftad.`,
      kort: `Betalningen är genomförd och en orderbekräftelse skickas till ${order.email}.`,
      faktura: `Fakturan skickas till ${order.invoiceEmail || order.email} med 30 dagars betalningsvillkor.`
    };

    els.confirmText.textContent = messages[order.method] || messages.swish;
    els.confirmOrderNo.textContent = order.orderNumber;
    els.confirmTime.textContent = order.timeLabel;
    els.confirmMethod.textContent =
      order.mode === "leverans" ? `Leverans · ${order.address}` : "Hämtning · Kanalgatan 8";
    els.confirmPay.textContent = methodLabels[order.method] || "Swish";
    els.confirmTotal.textContent = formatKr(order.total);

    if (els.checkoutDialog.open) els.checkoutDialog.close();
    els.confirmDialog.showModal();

    state.cart = [];
    saveCart();
    renderCart();
    updateCartBadge(false);
    resetCheckout();
  }

  function resetCheckout() {
    els.checkoutForm.reset();
    ["card-number", "card-expiry", "card-cvc", "invoice-ssn"].forEach((id) => {
      const input = document.getElementById(id);
      if (input) input.setCustomValidity("");
    });
    const swishPhone = document.getElementById("swish-phone");
    if (swishPhone) delete swishPhone.dataset.manual;
    updateFulfillmentUI();
    updatePaymentUI("swish");
  }

  function bindCheckout() {
    els.checkoutForm.addEventListener("change", (event) => {
      if (event.target.name === "payment") updatePaymentUI(event.target.value);
      if (event.target.name === "fulfillment") updateFulfillmentUI();
    });

    els.checkoutForm.addEventListener("submit", handleCheckoutSubmit);

    const phoneInput = document.getElementById("co-phone");
    const swishPhone = document.getElementById("swish-phone");
    phoneInput.addEventListener("input", () => {
      if (!swishPhone.dataset.manual) swishPhone.value = phoneInput.value;
    });
    swishPhone.addEventListener("input", () => {
      swishPhone.dataset.manual = "1";
      swishPhone.setCustomValidity("");
    });

    const cardNumber = document.getElementById("card-number");
    const cardExpiry = document.getElementById("card-expiry");
    const cardCvc = document.getElementById("card-cvc");
    const invoiceSsn = document.getElementById("invoice-ssn");

    cardNumber.addEventListener("input", () => {
      const digits = cardNumber.value.replace(/\D/g, "").slice(0, 19);
      cardNumber.value = digits.replace(/(.{4})/g, "$1 ").trim();
      cardNumber.setCustomValidity("");
    });

    cardExpiry.addEventListener("input", () => {
      const digits = cardExpiry.value.replace(/\D/g, "").slice(0, 4);
      cardExpiry.value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
      cardExpiry.setCustomValidity("");
    });

    cardCvc.addEventListener("input", () => {
      cardCvc.value = cardCvc.value.replace(/\D/g, "").slice(0, 4);
      cardCvc.setCustomValidity("");
    });

    invoiceSsn.addEventListener("input", () => invoiceSsn.setCustomValidity(""));

    els.confirmClose.addEventListener("click", () => {
      els.confirmDialog.close();
      scrollToMenu();
    });
  }

  function bindDialogs() {
    document.addEventListener("click", (event) => {
      const closeButton = event.target.closest("[data-close-dialog]");
      if (!closeButton) return;
      const dialog = closeButton.closest("dialog");
      if (dialog && dialog.open) dialog.close();
    });

    [els.cartDialog, els.checkoutDialog, els.confirmDialog].forEach((dialog) => {
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
      });
    });
  }

  function initHeader() {
    const updateHeader = () => {
      els.header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    const closeNav = () => {
      els.header.classList.remove("nav-open");
      els.navToggle.setAttribute("aria-expanded", "false");
      els.navToggle.setAttribute("aria-label", "Öppna meny");
    };

    els.navToggle.addEventListener("click", () => {
      const isOpen = els.header.classList.toggle("nav-open");
      els.navToggle.setAttribute("aria-expanded", String(isOpen));
      els.navToggle.setAttribute("aria-label", isOpen ? "Stäng meny" : "Öppna meny");
    });

    els.mainNav.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeNav();
    });

    document.addEventListener("click", (event) => {
      if (!els.header.classList.contains("nav-open")) return;
      if (!els.header.contains(event.target)) closeNav();
    });
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function scrollToMenu() {
    const menu = document.getElementById("meny");
    if (menu) menu.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  }

  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `${ICONS.check}<span>${escapeHtml(message)}</span>`;
    els.toastStack.appendChild(toast);
    while (els.toastStack.children.length > 3) {
      els.toastStack.firstElementChild.remove();
    }
    window.setTimeout(() => {
      toast.classList.add("toast-out");
      window.setTimeout(() => toast.remove(), 320);
    }, 3000);
  }

  function initReveal() {
    const elements = document.querySelectorAll("[data-reveal]");
    if (!elements.length) return;
    if (!("IntersectionObserver" in window) || prefersReducedMotion()) return;
    elements.forEach((element) => element.classList.add("reveal"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    elements.forEach((element) => observer.observe(element));
  }
})();
