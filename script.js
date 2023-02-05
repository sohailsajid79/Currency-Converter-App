const dropList = document.querySelectorAll(".drop-list select");
const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");
const getButton = document.querySelector("form button");

for (let i = 0; i < dropList.length; i++) {
  for (currencyCode in countryList) {
    let selected;
    if (i == 0) {
      selected = currencyCode == "USD" ? "selected" : "";
    } else if (i == 1) {
      selected = currencyCode == "GBP" ? "selected" : "";
    }
    // creating option tag with passing currency code as a text and value
    const optionTag = `<option value="${currencyCode}" ${selected}>${countryList[currencyCode]}</option>`;
    // inserting options tag inside select tag
    dropList[i].insertAdjacentHTML("beforeend", optionTag);
  }
  dropList[i].addEventListener("change", (e) => {
    loadFlag(e.target); // calling loadFlag with passing target element as an arguement
  });
}

function loadFlag(element) {
  for (code in countryList) {
    if (code == element.value) {
      // if currency code of country list is equal to option value
      const imgTag = element.parentElement.querySelector("img"); // selecting img tag of particular drop list
      imgTag.src = `https://flagsapi.com/${countryList[code]}/shiny/64.png`;
    }
  }
}

window.addEventListener("load", () => {
  getExchangeRate();
});

getButton.addEventListener("click", (e) => {
  e.preventDefault(); //prevent form from submitting
  getExchangeRate();
});

const exchangeIcon = document.querySelector(".drop-list .icon");
exchangeIcon.addEventListener("click", () => {
  const tempCode = fromCurrency.value; // temporary currency code 'from' drop list
  fromCurrency.value = toCurrency.value; // passing 'to' currency code to 'from' currency code
  toCurrency.value = tempCode; // passing temporary currency code 'to' currency code
  loadFlag(fromCurrency); // calling loadFlag with passing select element (fromCurrency) of 'from'
  loadFlag(toCurrency); // calling loadFlag with passing select element (toCurrency) of 'to'
  getExchangeRate();
});

function getExchangeRate() {
  const amount = document.querySelector("form input");
  const exchangeRateTxt = document.querySelector("form .exchange-rate");
  let amountVal = amount.value;
  // if user doesn't enter any value or enter 0, then the defaut value is 1
  if (amountVal == "" || amountVal == "0") {
    amount.value = "1";
    amountVal = 1;
  }

  exchangeRateTxt.innerText = "Fetching exchange rate...";

  // getting data from the APIkey
  const apiKey = "e4884c15584b0db43363b5e6";

  const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency.value}`;
  // fetching api response and parsing into json object and in another method receiving that object
  fetch(apiUrl)
    .then((response) => response.json())
    .then((result) => {
      const exchangeRate = result.conversion_rates[toCurrency.value];
      const totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
      const exchangeRateTxt = document.querySelector(".exchange-rate");
      exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
    });
}
