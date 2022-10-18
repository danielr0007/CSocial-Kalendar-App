

//Signup form fields
let firstNameField = document.getElementById("firstName");
let lastNameField = document.getElementById("lastName");
let emailField = document.getElementById("email");
let passwordField = document.getElementById("password");
let birthdayField = document.getElementById("birthday");
let genderField = document.getElementById("gender");

//LOGIN FORM(send pass and email to api and responds with id and the token which gets stored in localstorage)
document
  .getElementById("loginButton")
  .addEventListener("click", async function (e) {
    let userData = {};
    userData.email = document.getElementById("loginEmail").value;
    userData.password = document.getElementById("loginPassword").value;

    let dataPack = await loginUser(userData);

    if (dataPack.body[0] == "failed") {
      let loginFailedAlert = document.getElementById("loginFailedAlert");

      loginFailedAlert.classList.remove("hide");
      console.log(dataPack);
      setTimeout(function () {
        loginFailedAlert.classList.add("hide");
      }, 5000);
      return;
    }

    /*   body: Array(2)
               0: "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxNCIsCIZDR73iaqqbLLhnMHYL6V6TuvVV7lmHR0Un1Iwk"
               1: "14"
    */
    console.log(dataPack);
    localStorage.id = JSON.stringify(dataPack.body[1]);
    localStorage.token = JSON.stringify(dataPack.body[0]);

    location.href = "calendar_main.html";
  });

let signUpForm = document.querySelector(".signUpForm");
let overlay = document.querySelector(".overlay");
//displays signup form when login 'create account' is clicked
document
  .getElementById("createAccountButton")
  .addEventListener("click", function () {
    signUpForm.classList.remove("hide");
    overlay.classList.remove("hide");
  });

document
  .getElementById("signUpFormCloseButton")
  .addEventListener("click", function () {
    firstNameField.value = "";
    lastNameField.value = "";
    emailField.value = "";
    passwordField.value = "";

    signUpForm.classList.add("hide");
    overlay.classList.add("hide");
  });

//SIGNUP FORM
document
  .getElementById("signUpButton")
  .addEventListener("click", async function () {
    let userData = {};
    userData.firstName = firstNameField.value;
    userData.lastName = lastNameField.value;
    userData.email = emailField.value;
    userData.password = passwordField.value;
    userData.birthday = birthdayField.value;
    userData.gender = genderField.value;

    let data1 = await verifyIfEmailIsAlreadyRegistered(userData); //returns true or false

    if (data1 == true) {
      registerUser(userData);
    } else {
      document
        .getElementById("alreadyRegisteredAlert")
        .classList.remove("hide");

      setTimeout(function () {
        document.getElementById("alreadyRegisteredAlert").classList.add("hide");
      }, 5000);
    }
  });

async function verifyIfEmailIsAlreadyRegistered(userData) {
  const rawResponse1 = await fetch("/verifyUser", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  let status1 = await rawResponse1.status;
  let data1 = await rawResponse1.json();

  return await data1;
}

async function registerUser(userData) {
  const rawResponse2 = await fetch("/registerUser", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  let status2 = await rawResponse2.status;
  let data2 = await rawResponse2.json();
  console.log("status: " + status2);
  console.log(data2);

  let userEmail = data2.email;
  if (data2 != null) {
    document.getElementById("userRegisteredAlert").classList.remove("hide");
    document.getElementById("loginEmail").value = userEmail;
    document.getElementById("loginPassword").value = "";

    setTimeout(function () {
      document.getElementById("userRegisteredAlert").classList.add("hide");
    }, 5000);
  }
}

async function loginUser(userData) {
  const rawResponse = await fetch("/loginUser", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  let status = await rawResponse.status;
  let data = await rawResponse.json();

  let dataPack = {};
  dataPack.status = await status;
  dataPack.body = await data;

  return await dataPack;
}
