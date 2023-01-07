import { webAPI } from "./webapi.js";

// FFHS Web API Initialization
const rootURL = "https://web-modules.dev/api/v1";
const api = new webAPI(rootURL);

// query DOM elements
const productContainer = document.querySelector(".product-container");
const leftArrow = document.querySelector("#left-arrow");
const rightArrow = document.querySelector("#right-arrow");
const spinner = document.querySelector(".spinner");

// fetch data from FFHS Web API and store it into a Promise variable
let data = api
  .get("/products/20")
  .then((data) => {
    let productHTML = ``;
    data.products.forEach((product) => {
      productHTML += `
    <article class="card">
      <img
      src="${product.image}"
      alt="${product.name}"
      />           
      <div class="container">
        <p class="center">${product.name}</p>
        <p>Kategorie: ${product.category.name}</p>
        <p>Artikel-Nr. ${product.sku}</p>
        <p>CHF ${product.price.toFixed(2)}</p>
        <p>
          <span id="id${product.id}" class="fas fa-thumbs-up like">&nbsp</span
          ><span class="like-counter">${product.likes_count}</span>
        </p>
        <p><u>Beschreibung</u></p>
        <p>${product.description}</p>              
      </div>            
    </article>
    `;
    });

    spinner.style = "display: none"; // on received data, remove spinner
    productContainer.innerHTML += productHTML; // then, inject HTML into productContainer element
  })
  .catch((error) => {
    errorMessage(error);
  });

// use the already fetched data (Promise variable) to query likes
data.then(() => {
  const likes = document.querySelectorAll(".like");
  const likeCounters = document.querySelectorAll(".like-counter");

  // common like event handler
  likes.forEach((like, index) => {
    like.addEventListener("click", () => {
      let likeCounter = parseInt(likeCounters[index].innerText); // get the actual value as Int

      likeCounter++;
      likeCounters[index].innerText = likeCounter; // on increase write it back

      let prod = {
        type: "product",
        id: parseInt(like.id.substring(2)),
      };

      // POST the new like value
      api
        .post("/like", prod)
        .then((res) => {})
        .catch((error) => {
          errorMessage(error);
        });
    });
  });
});

// api error message
function errorMessage(error) {
  let main = document.querySelector("main");

  main.innerHTML = `
    <div class="alert">
      <strong>Error!</strong> ${error.toString()}. Please press the Refresh button.
    </div>
  `;

  // remove error popup after 2 secs
  setTimeout(() => {
    document.querySelector(".alert").style = "display: none";
  }, 3000);
}

// left arrow (scroll to left) event handler
leftArrow.addEventListener("click", () => {
  const slideWidth = productContainer.clientWidth;

  productContainer.scrollLeft -= slideWidth;
});

// right arrow (scroll to right) event handler
rightArrow.addEventListener("click", () => {
  const slideWidth = productContainer.clientWidth;

  productContainer.scrollLeft += slideWidth;
});
