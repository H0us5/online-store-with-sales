const popupCart = document.querySelector(".js-popup-cart");
const popupOrder = document.querySelector(".js-popup-order");
const showOrderBtn = document.querySelector(".js-show-order");
const popupCartList = document.querySelector(".js-popup-cart-list");
const headerCount = document.querySelector(".js-header-count");
const filterSelect = document.querySelector(".js-goods-filter");
const sortInputs = document.querySelectorAll(".js-goods-sort");
const notification = document.querySelector(".js-notification");
const notificationText = document.querySelector(".js-notification-content");
const ids = getAddedProducts();

setCount(ids.length);
getSearchParams("filter");
showOrderBtn.addEventListener("click", () => {
  hidePopup(popupCart);
  showPopup(popupOrder);
});

async function getGoods() {
  let url = "https://my-json-server.typicode.com/OlhaKlymas/json-lesson/goods";
  let response = await fetch(url);
  return response.json();
}

function showProducts(goods, filterBy) {
  let productList = document.querySelector(".product-list");
  productList.innerHTML = "";

  switch (filterBy) {
    case "all":
      goods = [...goods];
      break;
    case "new":
    case "sale":
      goods = goods.filter((item) => item.badge === filterBy);
      break;
    case "low-price":
      goods = goods.filter((item) => item.price.current <= 1000);
      break;
    case "high-price":
      goods = goods.filter((item) => item.price.current > 1000);
      break;
  }

  goods.forEach((item) => {
    const article = document.createElement("article");
    article.classList.add("product-list__item", "tile", "js-product");
    article.setAttribute("data-id", item.id);

    article.innerHTML = `
        <a href="${item.href}" class="tile__link">
            <span class="tile__top">
                <span class="tile__badge tile__badge--${item.badge}">${item.badge}</span>
                <span class="tile__delete hidden js-delete-item"> 
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_6043_11153)">
                        <path d="M2.03125 3.85352H12.9687" stroke="#EF3E33" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M11.753 3.85352V12.3605C11.753 12.9681 11.1454 13.5757 10.5378 13.5757H4.46137C3.85373 13.5757 3.24609 12.9681 3.24609 12.3605V3.85352" stroke="#EF3E33" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M5.06934 3.85341V2.63813C5.06934 2.03049 5.67697 1.42285 6.28461 1.42285H8.71517C9.32281 1.42285 9.93045 2.03049 9.93045 2.63813V3.85341" stroke="#EF3E33" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </g>
                        <defs>
                        <clipPath id="clip0_6043_11153">
                        <rect width="14.5833" height="14.5833" fill="white" transform="translate(0.208008 0.208008)"/>
                        </clipPath>
                        </defs>
                    </svg>
                </span>
            </span>
            <span class="tile__image">
                <img src="${item.images[0].preview}" alt="${item.title}">
            </span>
            <span class="tile__title">${item.title}</span>
            <span class="tile__sale-info sale">
                <span class="sale__text">Акція діє до 01.04.2023</span>
                <span class="sale__counter">24 дня 2 год 54 хв 05 сек</span>
            </span>
            <span class="tile__info">
                <span class="tile__price">
                    <span class="tile__old-price">${item.price.old} ₴</span>
                    <span class="tile__new-price">${item.price.current} ₴</span>
                </span>
                <button class="btn js-add-to-cart-btn">Купити</button>
            </span>
        </a>
    `;
    productList.appendChild(article);
  });
}

function showDeleteButton(ids) {
  let products = document.querySelectorAll(".js-product");
  products.forEach(function (product) {
    if (ids.includes(product.dataset.id)) {
      let deleteButton = product.querySelector(".js-delete-item");
      deleteButton.classList.remove("hidden");
    }
  });
}

function setCount(num) {
  headerCount.innerText = num;
}

function setCountEvent(products) {
  headerCount.addEventListener("click", () => {
    let addedToCartProducts = getAddedProducts();
    if (addedToCartProducts.length > 0) {
      showCartProducts(addedToCartProducts, products);
      showPopup(popupCart);
    }
  });
}

function getAddedProducts() {
  return localStorage.getItem("cart")?.split(", ") || [];
}

function removeFromCart(parent, isPopup = false) {
  let id = parent.dataset.id;
  let addedToCartProducts = getAddedProducts();
  let newProductsList = addedToCartProducts.filter((item) => item != id);
  newProductsList.length > 0
    ? localStorage.setItem("cart", newProductsList.join(", "))
    : localStorage.removeItem("cart");
  setCount(newProductsList.length);
  if (!isPopup) {
    let deleteButton = parent.querySelector(".js-delete-item");
    let tileTitle = parent.querySelector(".tile__title").innerText;
    deleteButton.classList.add("hidden");
    showNotification(tileTitle, "видалено", "orange");
  } else {
    let products = document.querySelectorAll(".js-product");
    products.forEach((product) => {
      if (product.dataset.id === id) {
        let deleteButton = product.querySelector(".js-delete-item");
        deleteButton.classList.add("hidden");
      }
    });
  }
}

function addToCart(button) {
  let parent = button.closest(".product-list__item");
  let deleteButton = parent.querySelector(".js-delete-item");
  let id = parent.dataset.id;
  let tileTitle = parent.querySelector(".tile__title").innerText;
  let addedToCartProducts = getAddedProducts();

  deleteButton.classList.remove("hidden");
  addedToCartProducts.push(id);
  localStorage.setItem("cart", addedToCartProducts.join(", "));
  setCount(addedToCartProducts.length);
  showNotification(tileTitle, "додано", "green");
}

function showNotification(name, text, status) {
  function setBg(color) {
    notification.classList.remove("notification--orange");
    notification.classList.remove("notification--red");
    notification.classList.remove("notification--green");
    notification.classList.add(`notification--${color}`);
  }
  if (status === "greeting") {
    setBg("green");
    localStorage.setItem("greetingShowDate", new Date().getDate());
    notification.classList.add("notification--active");
    notificationText.innerText = `Привіт, ${name}! ${text}`;
  }
  if (status === "green") {
    setBg("green");
    notification.classList.add("notification--active");
    notificationText.innerText = `Продукт ${name} успішно ${text}!`;
  }
  if (status === "orange") {
    setBg("orange");
    notification.classList.add("notification--active");
    notificationText.innerText = `Продукт ${name} успішно ${text}!`;
  }
  if (status === "red") {
    setBg("red");
    notification.classList.add("notification--active");
    notificationText.innerText = text + name;
  }
  setTimeout(() => notification.classList.remove("notification--active"), 3000);
}

function checkGreetingTimer() {
  if (!localStorage.getItem("name")) return true;
  const now = new Date().getDate();
  return now > localStorage.getItem("greetingShowDate");
}

function showPopup(popup) {
  let popupClose = popup.querySelector(".js-popup-close");
  popup.classList.add("popup--active");
  popupClose.addEventListener("click", () => hidePopup(popup));
}
function hidePopup(popup) {
  popup.classList.remove("popup--active");
}

function showCartProducts(productIds, goods) {
  popupCartList.innerHTML = "";
  goods.forEach((item) => {
    if (productIds.includes(String(item.id))) {
      let filtered = productIds.filter((el) => el === String(item.id));
      let counter = filtered.length;
      let itemList = document.createElement("li");
      itemList.className = "popup-cart__list-item cart-item";
      itemList.dataset.id = item.id;
      itemList.innerHTML = `<span class="cart-item__img">
                                    <img src="${item.images[0].preview}" alt="${
        item.title
      }">
                                </span>
                                <span class="cart-item__info">
                                    <a href="${
                                      item.href
                                    }" class="cart-item__link">
                                        <span class="cart-item__title">${
                                          item.title
                                        }</span>
                                        <span class="cart-item__price">
                                            <span class="tile__count">${counter}</span>
                                            <span class="tile__price">Вартість - ${
                                              item.price.current
                                            } ₴</span>
                                            <span class="tile__total-price">Сума - ${
                                              item.price.current * counter
                                            } ₴</span>
                                        </span>
                                    </a>
                                </span>
                                <span class="cart-item__remove js-cart-remove">
                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_6043_11153)">
                                        <path d="M2.03125 3.85352H12.9687" stroke="#EF3E33" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M11.753 3.85352V12.3605C11.753 12.9681 11.1454 13.5757 10.5378 13.5757H4.46137C3.85373 13.5757 3.24609 12.9681 3.24609 12.3605V3.85352" stroke="#EF3E33" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M5.06934 3.85341V2.63813C5.06934 2.03049 5.67697 1.42285 6.28461 1.42285H8.71517C9.32281 1.42285 9.93045 2.03049 9.93045 2.63813V3.85341" stroke="#EF3E33" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </g>
                                        <defs>
                                        <clipPath id="clip0_6043_11153">
                                        <rect width="14.5833" height="14.5833" fill="white" transform="translate(0.208008 0.208008)"/>
                                        </clipPath>
                                        </defs>
                                    </svg>
                                </span>`;
      popupCartList.appendChild(itemList);
    }
  });
  setPopupCartRemove();
}

function setPopupCartRemove() {
  let removeBtns = document.querySelectorAll(".js-cart-remove");

  removeBtns.forEach((btn) =>
    btn.addEventListener("click", function () {
      let parent = btn.closest(".cart-item");
      parent.classList.add("hidden");
      removeFromCart(parent, true);
    })
  );
}

function sortProducts(e, products) {
  let value = e.target.value;
  let sortedProducts = [...products];

  switch (value) {
    case "price":
      sortedProducts = products.sort((a, b) =>
        a.price.current > b.price.current ? 1 : -1
      );
      break;
    case "alphabet":
      sortedProducts = products.sort((a, b) => (a.title > b.title ? 1 : -1));
      break;
  }

  showProducts(sortedProducts);
}

function setSort(arr) {
  sortInputs.forEach((input) =>
    input.addEventListener("change", (e) => sortProducts(e, arr))
  );
}

function setFilter(arr) {
  filterSelect.addEventListener("change", (e) => getFilteredProducts(e, arr));
}

function getFilteredProducts(e, products) {
  let value = e.target.value;
  let filteredProducts = null;

  if (value == "all") {
    setSearchParams("filter", "");
    filteredProducts = [...products];
  } else {
    setSearchParams("filter", value);
    filteredProducts = products.filter((item) => item.tag_list.includes(value));
  }

  showProducts(filteredProducts);
}

function setSearchParams(key, value) {
  let currentUrl = window.location;
  let url = new URL(currentUrl);
  let params = new URLSearchParams(url.search);

  if (value === "") {
    params.delete(key);
  } else {
    params.set(key, value);
  }
  url.search = params.toString();
  window.location.href = url.toString();
}

function getSearchParams(key) {
  let currentUrl = window.location;
  let url = new URL(currentUrl);
  let params = new URLSearchParams(url.search);
  let search = params.get(key);

  if (search) {
    setCurrentOption(search);
  }

  getGoods()
    .then((result) => {
      showProducts(result, search);
      setSort(result);
      setFilter(result);
      showDeleteButton(ids);
      setBtnProductsEvent();
      setCountEvent(result);
      workWithLocalStorage();
      setSaleBadge();
      setInterval(calculateSaleEnd, 1000);
      hideBanner();
      if (checkBannerTimer()) {
        setTimeout(showBanner, 3000);
      } else {
        hideBanner();
      }
      if (checkGreetingTimer() && localStorage.getItem("name")) {
        showNotification(
          localStorage.getItem("name"),
          "Раді Вас знову бачити",
          "greeting"
        );
      }
    })
    .catch((error) => showNotification(error, "Сталася помилка: ", "red"));
}

function setCurrentOption(val) {
  filterSelect
    .querySelector(`option[value=${val}]`)
    .setAttribute("selected", "selected");
}

function setBtnProductsEvent() {
  let deleteButtons = document.querySelectorAll(".js-delete-item");
  let addToCartButtons = document.querySelectorAll(".js-add-to-cart-btn");

  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      removeFromCart(btn.closest(".product-list__item"));
    });
  });

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      addToCart(button);
    });
  });
}

const workWithLocalStorage = () => {
  const orderFormEl = document.querySelector(".popup-order__form");
  const saveCheckboxEl = orderFormEl.querySelector("#save");
  const inputNameEl = orderFormEl.querySelector("#name");
  const inputSecondNameEl = orderFormEl.querySelector("#sName");
  const inputTel = orderFormEl.querySelector("#tel");
  const inputEmailEl = orderFormEl.querySelector("#email");
  const inputAddresEl = orderFormEl.querySelector("#address");
  const userInfoName = document.querySelector(".user-info__name");
  const userInfoAdress = document.querySelector(".user-info__addres");

  const showInfoInHeader = () => {
    userInfoName.innerText =
      localStorage.getItem("name") && localStorage.getItem("sName")
        ? `${localStorage.getItem("name")} ${localStorage.getItem("sName")}`
        : "";

    userInfoAdress.innerText = localStorage.getItem("Addres")
      ? localStorage.getItem("Addres")
      : "";
  };

  const writeUnitSaveData = (element, elName) => {
    element.value = localStorage.getItem(elName)
      ? localStorage.getItem(elName)
      : "";
  };

  const writeSaveDataInForm = () => {
    writeUnitSaveData(inputNameEl, "name");
    writeUnitSaveData(inputSecondNameEl, "sName");
    writeUnitSaveData(inputTel, "tel");
    writeUnitSaveData(inputEmailEl, "Email");
    writeUnitSaveData(inputAddresEl, "Addres");
  };

  showOrderBtn.addEventListener("click", () => {
    writeSaveDataInForm();
  });

  showInfoInHeader();

  orderFormEl.addEventListener("submit", (e) => {
    if (saveCheckboxEl.checked) {
      localStorage.setItem("name", inputNameEl.value);
      localStorage.setItem("sName", inputSecondNameEl.value);
      localStorage.setItem("tel", inputTel.value);
      localStorage.setItem("Email", inputEmailEl.value);
      localStorage.setItem("Addres", inputAddresEl.value);
      showInfoInHeader();
    } else {
      localStorage.removeItem("name");
      localStorage.removeItem("sName");
      localStorage.removeItem("tel");
      localStorage.removeItem("Email");
      localStorage.removeItem("Addres");
    }
  });
};

function validateForm() {
  const form = document.querySelector(".order-form");
  const groupErrors = document.querySelectorAll(".order-form__group-error");
  const validator = (evt) => {
    groupErrors.forEach((el) =>
      el.classList.add("order-form__group-error--hidden")
    );
    const name = document.querySelector("#name");
    const sName = document.querySelector("#sName");
    const email = document.querySelector("#email");
    const tel = document.querySelector("#tel");
    const nameRegExp = /^[a-zA-Z_а-яі ]+$/gi;
    const sNameRegExp = /^[a-zA-Z_а-яі ]+$/gi;
    const telRegExp = /^\+38\d{10}$/g;
    const emailRegExp = /^(?=.*\.)(?=.*@).*$/;
    const errors = [];
    if (!nameRegExp.test(name.value)) {
      errors.push(name.value);
      name.nextElementSibling.classList.remove(
        "order-form__group-error--hidden"
      );
    }
    if (!sNameRegExp.test(sName.value)) {
      errors.push(sName.value);
      sName.nextElementSibling.classList.remove(
        "order-form__group-error--hidden"
      );
    }
    if (!telRegExp.test(tel.value)) {
      errors.push(tel.value);
      tel.nextElementSibling.classList.remove(
        "order-form__group-error--hidden"
      );
    }
    if (!emailRegExp.test(email.value)) {
      errors.push(email.value);
      email.nextElementSibling.classList.remove(
        "order-form__group-error--hidden"
      );
    }
    if (errors.length) {
      evt.preventDefault();
    }
  };
  form.addEventListener("submit", validator);
}
validateForm();

function setPrices(currency, sign) {
  const oldPrices = document.querySelectorAll(".tile__old-price");
  const newPrices = document.querySelectorAll(".tile__new-price");
  oldPrices.forEach((el) => {
    const newPrice = el.innerHTML.match(/\d/g).join("");
    el.innerHTML = (newPrice * currency).toFixed(2) + ` ${sign}`;
  });
  newPrices.forEach((el) => {
    const newPrice = el.innerHTML.match(/\d/g).join("");
    el.innerHTML = (newPrice * currency).toFixed(2) + ` ${sign}`;
  });
}

async function getCurrency() {
  const key = "kVXapdrJEpJJdsIkYg1rOxZrRF8zsgUp";
  const url = `https://api.apilayer.com/fixer/latest?base=UAH&symbols=USD,EUR&apikey=${key}`;
  const response = await fetch(url);
  return response.json();
}
getCurrency()
  .then((result) => {
    const select = document.querySelector("#currency");
    select.addEventListener("change", (e) => {
      if (e.target.value === "usd") {
        listItems();
        setPrices(result.rates.USD, "$");
      } else if (e.target.value === "eur") {
        listItems();
        setPrices(result.rates.EUR, "€");
      } else {
        listItems();
      }
    });
  })
  .catch(() => console.error("Помилка!"))
  .finally(() => console.log("Проміс завершений"));

// hw №6

function getSiblings(node) {
  return [...node.parentNode.children].filter((child) => child !== node);
}

function setSaleBadge() {
  const saleBadge = document.querySelectorAll(".sale");

  saleBadge.forEach((item) => {
    if (getSiblings(item)[0].children[0].innerHTML === "new") {
      item.classList.add("sale--hidden");
    }
  });
}

function calculateSaleEnd() {
  const saleCounter = document.querySelectorAll(".sale__counter");
  const now = new Date();
  const saleEnd = new Date(2023, 3, 1);
  const saleRemains = saleEnd - now;
  const seconds = Math.floor((saleRemains / 1000) % 60);
  const minutes = Math.floor((saleRemains / 1000 / 60) % 60);
  const hours = Math.floor((saleRemains / (1000 * 60 * 60)) % 24);
  const days = Math.floor(saleRemains / (1000 * 60 * 60 * 24));

  saleCounter.forEach(
    (item) =>
      (item.innerHTML = `${days} дня ${hours} години ${minutes} хвилини ${seconds} секунди`)
  );
}

function showBanner() {
  const banner = document.querySelector(".js-sale-banner");
  banner.classList.remove("sale-banner--hidden");
}

function hideBanner() {
  const banner = document.querySelector(".js-sale-banner");
  const closeButton = document.querySelector(".js-sale-banner-close");
  closeButton.addEventListener("click", () => {
    const bannerTimer = new Date();
    banner.classList.add("sale-banner--hidden");
    bannerTimer.setDate(bannerTimer.getDate() + 7);
    localStorage.setItem("bannerShowDate", bannerTimer.getTime());
  });
}
function checkBannerTimer() {
  const now = new Date();
  if (!localStorage.getItem("bannerShowDate")) return true;
  return now >= localStorage.getItem("bannerShowDate");
}
