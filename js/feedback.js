import { webAPI } from "./webapi.js";

// FFHS Web API Initialization
const rootURL = "https://web-modules.dev/api/v1";
const api = new webAPI(rootURL);

// query DOM elements
const name1 = document.querySelector("#name1");
const email1 = document.querySelector("#email1");
const message = document.querySelector("#message");
const feedbackMessage1 = document.querySelector("#feedbackMessage1");
const cstars = document.querySelector(".cstars");
const dstars = document.querySelector(".dstars");
const feedbackBtn = document.querySelector("#feedbackBtn");

// regex => letters range [3, 100] AND no numbers
const name1Regex = /^([a-zA-Z '.-]{3,100})$/;

// regex => email
const email1Regex = /[^@\s]+@[^@\s]+\.[^@\s]+/;

// gather all input validation results
let validationArray = [
  {
    type: "name",
    errormessage:
      "Error! Name must be between 3 and 100 letters but no numbers",
    active: true,
  },
  {
    type: "email",
    errormessage:
      "Error! Email must be in the form e.g name@company.com and upto 200 characters",
    active: true,
  },
];

// feedback obj to submit
let feedbackObj = {
  name: "",
  email: "",
  rating_design: 1,
  rating_components: 1,
  comment: "",
};

// initialize -> button disabled
formValidation(validationArray);

// input validation while typing on input name1
name1.addEventListener("input", () => {
  const isValidName1 = name1Regex.test(name1.value);

  validationArray[0].active = !isValidName1;
  feedbackObj.name = name1.value;

  formValidation(validationArray);
});

// input validation while typing on input email1
email1.addEventListener("input", () => {
  const isValidEmail1 = email1Regex.test(email1.value);

  validationArray[1].active = !isValidEmail1;
  feedbackObj.email = email1.value;

  formValidation(validationArray);
});

// color the stars upto the selected one
function selectedStars(star) {
  const index = Array.from(star.parentElement.children).indexOf(star);
  const stars = Array.from(star.parentElement.children);

  for (let i = 1; i < stars.length; i++) {
    const element = stars[i];

    if (i <= index) {
      element.classList.add("starcolor");
    } else {
      element.classList.remove("starcolor");
    }
  }

  return index + 1;
}

// reset stars
function clearStars(stars) {
  Array.from(stars.children).forEach((element, index) => {
    if (index > 0) {
      element.classList.remove("starcolor");
    }
  });
}

// components stars (use of a single event handling (over the parent), preventing memory leaks)
cstars.addEventListener("click", (e) => {
  feedbackObj.rating_components = selectedStars(e.target); // clicked star
});

// design stars (use of a single event handling (over the parent), preventing memory leaks)
dstars.addEventListener("click", (e) => {
  feedbackObj.rating_design = selectedStars(e.target); // clicked star
});

// prevent default form submission
feedbackBtn.addEventListener("click", (e) => {
  e.preventDefault();

  feedbackObj.comment = feedbackMessage1.value;

  // POST the new feedback
  api
    .post("/feedback", feedbackObj)
    .then((res) => {
      name1.value = "";
      email1.value = "";
      feedbackMessage1.value = "";
      feedbackBtn.disabled = true;

      validationArray[0].active = true;
      validationArray[1].active = true;

      // reset stars
      clearStars(cstars);
      clearStars(dstars);

      // update charts
      displayCharts("Components", "stats1");
      displayCharts("Design", "stats2");

      message.innerHTML = "Thank you for your valuable feedback!";

      setTimeout(() => {
        formValidation(validationArray);
      }, 3000);
    })
    .catch((error) => {
      errorMessage(error);
    });
});

// form validation function
function formValidation(array) {
  let html = `<ul>`;
  let result = (array[0].active || array[1].active) === true;

  feedbackBtn.disabled = result;

  Array.from(array).forEach((item) => {
    if (item.active === true) {
      html += `<li id="message1" class="invalid">${item.errormessage}</li>`;
    }

    switch (item.type) {
      case "name":
        classSelector(name1, item.active); // add/remove styling class on item.active
        break;
      case "email":
        classSelector(email1, item.active); // add/remove styling class on item.active
    }
  });

  html += `</ul>`;
  message.innerHTML = html;
}

// styling class selector
function classSelector(element, active = true) {
  if (active) {
    element.classList.remove("valid");
    element.classList.add("invalid");
  } else {
    element.classList.remove("invalid");
    element.classList.add("valid");
  }
}

// rendering a Chart (chart.js)
function renderChart(dataY, dataX, chartName, canvas) {
  var ctx = document.getElementById(canvas).getContext("2d");

  new Chart(ctx, {
    type: "horizontalBar",
    data: {
      labels: dataX,
      datasets: [
        {
          label: chartName,
          data: dataY,
          borderColor: "#3602EB",
          backgroundColor: [
            "#04AA6D",
            "#2196F3",
            "#00bcd4",
            "#ff9800",
            "#f44336",
          ],
        },
      ],
    },
    options: {
      scales: {
        xAxes: [{ ticks: { min: 0, max: 20 } }],
        yAxes: [{ ticks: { min: 1, max: 10 } }],
      },
    },
  });
}

// calculate and return the average and total reviews
function calc(dataY) {
  const total = dataY.reduce((a, b) => a + b, 0);
  const average = (total / (dataY.length > 0 ? dataY.length : 1)).toFixed(1);
  const reviews = dataY.length;
  return { average, reviews };
}

let ratings = [];
let dataY = [];

const dataX = [
  "9-10 Stars",
  "7-8 Stars",
  "5-6 Stars",
  "3-4 Stars",
  "1-2 Stars",
];

// populates the dataY with the API rating values
//  returns a Promise
function rating(rating) {
  return api.get("/feedback").then((data) => {
    data.feedbacks.forEach((feedback) => {
      if (rating === "Components") {
        ratings.push(feedback.rating_components);
      } else {
        ratings.push(feedback.rating_design);
      }
    });
  });
}

// rating group occurence e.g. 1-2 Stars occurence (count)
function ratingOccurence(starLow, starHigh) {
  let counter = 0;

  ratings.forEach((item) => {
    if (item === starLow || item === starHigh) {
      counter++;
    }
  });

  dataY.push(counter);
}

// display charts on canvases
function displayCharts(type, canvas) {
  // Components/Design Rating Promise
  rating(type).then(() => {
    ratingOccurence(1, 2);
    ratingOccurence(3, 4);
    ratingOccurence(5, 6);
    ratingOccurence(7, 8);
    ratingOccurence(9, 10);

    renderChart(
      dataY,
      dataX,
      `${type} Rating | ${calc(ratings).average} average based on ${
        calc(ratings).reviews
      } reviews`,
      `${canvas}`
    );

    dataY = []; // array must be cleared within the Promise to work
    ratings = []; // array must be cleared within the Promise to work
  });
}

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

// display components rating
displayCharts("Components", "stats1");

// display design rating
displayCharts("Design", "stats2");
