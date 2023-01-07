// query DOM elements
const name2 = document.querySelector("#name2");
const email2 = document.querySelector("#email2");
const message = document.querySelector("#message");
const contactBtn = document.querySelector("#contactBtn");
const feedbackMessage2 = document.querySelector("#feedbackMessage2");

// regex => letters range [3, 100] AND no numbers
const name2Regex = /^([a-zA-Z '.-]{3,100})$/;

// regex => email
const email2Regex = /[^@\s]+@[^@\s]+\.[^@\s]+/;

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
  message: "",
};

formValidation(validationArray);

// input validation while typing on input name1
name2.addEventListener("input", () => {
  const isValidName2 = name2Regex.test(name2.value);

  validationArray[0].active = !isValidName2;
  feedbackObj.name = name2.value;

  formValidation(validationArray);
});

// input validation while typing on input email1
email2.addEventListener("input", () => {
  const isValidEmail2 = email2Regex.test(email2.value);

  validationArray[1].active = !isValidEmail2;
  feedbackObj.email = email2.value;

  formValidation(validationArray);
});

// prevent default form submission
contactBtn.addEventListener("click", (e) => {
  e.preventDefault();

  feedbackObj.message = feedbackMessage2.value;

  name2.value = "";
  email2.value = "";
  feedbackMessage2.value = "";
  contactBtn.disabled = true;

  validationArray[0].active = true;
  validationArray[1].active = true;

  message.innerHTML = "Thank you for contacting us!";

  setTimeout(() => {
    formValidation(validationArray);
  }, 3000);
});

// form validation function
function formValidation(array) {
  let html = `<ul>`;
  let result = (array[0].active || array[1].active) === true;

  contactBtn.disabled = result;

  Array.from(array).forEach((item) => {
    if (item.active === true) {
      html += `<li id="message2" class="invalid">${item.errormessage}</li>`;
    }

    switch (item.type) {
      case "name":
        classSelector(name2, item.active); // add/remove styling class on item.active
        break;
      case "email":
        classSelector(email2, item.active); // add/remove styling class on item.active
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
