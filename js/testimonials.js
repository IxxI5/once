import { webAPI } from "./webapi.js";

// FFHS Web API Initialization
const rootURL = "https://web-modules.dev/api/v1";
const api = new webAPI(rootURL);

// query DOM elements
const spinner = document.querySelector(".spinner");
const testimonialContainer = document.querySelector(".testimonial-container");

// fetch data from FFHS Web API and store it into a Promise variable
let data = api
  .get("/testimonials/20")
  .then((data) => {
    let testimonialHTML = ``;
    data.testimonials.forEach((testimonial) => {
      testimonialHTML += `
      <article class="card">
      <div class="card-container">
        <img
            src="${testimonial.avatar}"
            alt="${testimonial.firstname} ${testimonial.lastname}"
        />
        <p><b>${testimonial.firstname} ${testimonial.lastname}.</b><span> ${testimonial.company}</span></p>
      </div>
      <blockquote>
        <em>
            "${testimonial.quote}."
        </em>
        <span id="id${testimonial.id}" class="fas fa-thumbs-up like">&nbsp</span
          ><span class="like-counter">${testimonial.likes_count}</span>
      </blockquote>
      </article>
      `;
    });

    spinner.style = "display: none"; // on received data, remove spinner
    testimonialContainer.innerHTML += testimonialHTML; // then, inject HTML into testimonialContainer element
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
        type: "testimonial",
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
