let friends_list_Title = document.getElementById("friends_list_Title");

let userNavName = document.getElementById("userNavName");
let userPhoto = document.getElementById("userPhoto");

let friendProfilePicture = document.getElementById("friendProfilePicture");
let friendProfileEmail = document.getElementById("friendProfileEmail");
let friendProfileFriendsCount = document.getElementById("friendProfileFriendsCount");
let friendProfileInfoTitle = document.getElementById("friendProfileInfoTitle");

let friendObject = JSON.parse(localStorage.friendObject);
let userObject = JSON.parse(localStorage.userObject);

//FRIEND POPULATION OF DATA ON PAGE
friends_list_Title.innerText = friendObject.firstName + "'s friends";

if (friendObject.picture == null) friendProfilePicture = "images/userDefault.png";
friendProfilePicture.src = friendObject.picture;

friendProfileEmail.innerText = friendObject.email;

let friendList = JSON.parse(friendObject.friends);
let friendCount = 0;
for (let i = 0; i < 50; i++) {
  if (friendList[i] != null) friendCount++;
}
friendProfileFriendsCount.innerText = friendCount + " friend(s)";

friendProfileInfoTitle.innerText =
  friendObject.firstName + " " + friendObject.lastName;

document.getElementById("friendButton").addEventListener("click", function () {
  if (
    confirm("Are you sure you want to unfriend " + friendObject.firstName + "?")
  ) {
    deleteFriendFromList(friendObject.id);
    deleteFriendFromList2(friendObject.id);
  }
});

//FRIEND POPULATION OF FRIEND LIST ON PAGE
let friendsFriendlist = JSON.parse(friendObject.friends);
console.log(friendsFriendlist);

loadFriendsHtml(friendsFriendlist);

//USER POPULATION OF DATA ON PAGE
userNavName.innerText = userObject.email;
userPhoto.src = userObject.picture;

//UPLOAD PICTURE FUNCTION FOR THIS PAGE'S NAVA BAR FUINCTIONALITY
let changePictureButton = document.getElementById("changePictureButton");
let fileuploader = document.getElementById("fileuploader");

//change picture from dropdown click trigger
changePictureButton.addEventListener("click", function () {
  fileuploader.click(); //simulates the click

  fileuploader.addEventListener("change", async function () {
    let formData = new FormData();
    formData.append("file", fileuploader.files[0]);
    formData.append("id", JSON.parse(localStorage.id));

    let data = await uploadPicture(formData); //Returns an array[2] with status & body(user object with new pic)
    console.log("From dropdownMenu.js :");
    console.log(data);

    localStorage.userObject = JSON.stringify(data.body);
    document.getElementById("userPhoto").src = data.body.picture;
  });
});

let userPhotoButton = document.getElementById("userPhoto");
let dropdownMenu = document.querySelector(".dropdown-content");
//dropdown menu click toggle
userPhotoButton.addEventListener("click", () => {
  if (dropdownMenu.style.display == "none")
    dropdownMenu.style.display = "block";
  else dropdownMenu.style.display = "none";
});

//NAV BAR DROP DOWN FUNCTIONALITY..............
let accountInfoButton = document.getElementById("accountInfoButton");
let signUpForm = document.querySelector(".signUpForm");
let overlay = document.querySelector(".overlay");

//when userInfo from dropdown gets clicked
accountInfoButton.addEventListener("click", function () {
  let userInfo = JSON.parse(localStorage.userObject); //gets user obj and turns it to a js object(from a string)
  console.log(userInfo);
  document.getElementById("userInfoBoxPictureImage").src = userInfo.picture;
  document.getElementById("userInfoBoxFirstName").innerText =
    userInfo.firstName;
  document.getElementById("userInfoBoxLastName").innerText = userInfo.lastName;
  document.getElementById("userInfoBoxEmail").innerText = userInfo.email;
  document.getElementById("userInfoBoxBirthday").innerText = userInfo.birthday;
  document.getElementById("userInfoBoxGender").innerText = userInfo.gender;

  signUpForm.classList.remove("hide");
  overlay.classList.remove("hide");
});

//close button from userInfo popup
document
  .getElementById("signUpFormCloseButton")
  .addEventListener("click", function () {
    signUpForm.classList.add("hide");
    overlay.classList.add("hide");
  });

document.getElementById("logoutButton").addEventListener("click", function () {
  localStorage.token = "";
  location.href = "index.html";
});

//my profile button on click from dropdown
document
  .getElementById("myProfileButton")
  .addEventListener("click", function () {
    location.href = "calendar_main.html";
  });

//DATA FETCHING FUNCTIONS TO USE ABOVE*********************************************
async function uploadPicture(formData) {
  const rawResponse = await fetch("/uploadPic", {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: formData,
  });

  let status = await rawResponse.status;
  let data = await rawResponse.json();

  let dataPack = {};
  dataPack.status = await status;
  dataPack.body = await data;

  return await dataPack;
}

async function getUserObject(userData) {
  const rawResponse = await fetch("/getUser", {
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

async function loadFriendsHtml(friendIds) {
  //if the array's not empty, it loops through ids and places the html on page
  if (friendIds != null) {
    for (let i = 0; i < friendIds.length; i++) {
      //get friend object from backend
      let friendData = {};
      friendData.id = friendIds[i].id;
      let friendDataPack = await getUserObject(friendData);
      //sets friend id and its object in local storage
      let friendId = friendData.id;
      localStorage.setItem(friendId, JSON.stringify(friendDataPack.body));

      //now insert friend html on page
      let friendID = friendDataPack.body.id;
      let friendFirstName = friendDataPack.body.firstName;
      let friendLastName = friendDataPack.body.lastName;
      let friendPicture = friendDataPack.body.picture;
      if (friendPicture == null || friendPicture == "")
        friendPicture = "images/userDefault.png";

      let friendHTML =
        '<div class="friendDiv2" id="' +
        friendID +
        '"><img src="' +
        friendPicture +
        '"/><p>' +
        friendFirstName +
        " " +
        friendLastName +
        "</p></div>";

      document.getElementById("friendListDiv").innerHTML += friendHTML;
    }
  }
}

//function in decline button of requests
async function deleteFriendFromList(friendId) {
  //alert(id);
  //get user id,post user updating friend request field
  let userData2 = {};
  userData2.id = JSON.parse(localStorage.id);
  let dataPack = await getUserObject(userData2); //gets current friend list from db
  let currentFriendList = JSON.parse(dataPack.body.friends);
  //filter for friend id in the array and only keep the ones that don't match with id passed
  currentFriendList = currentFriendList.filter(
    (friend) => friend.id != friendId
  );
  userData2.friends = JSON.stringify(currentFriendList);
  let dataPack4 = await updateUserFriendField(userData2);
  console.log(
    "this is the datapack4 received in the deleteFriendFromList function(friendProfile.js)"
  );
  console.log(dataPack4);
  //now, the friend request field html needs to get deleted from user profile
  let stringId = JSON.stringify(friendId);
  document.getElementById(stringId).remove();
}

async function deleteFriendFromList2(friendId) {
  //alert(id);
  //get user id,post user updating friend request field
  let userData2 = {};
  userData2.id = JSON.parse(friendId);
  let dataPack = await getUserObject(userData2); //gets current friend list from db
  let currentFriendList = JSON.parse(dataPack.body.friends);
  //filter for friend id in the array and only keep the ones that don't match with id passed
  currentFriendList = currentFriendList.filter(
    (friend) => friend.id != JSON.parse(localStorage.id)
  );
  userData2.friends = JSON.stringify(currentFriendList);
  let dataPack4 = await updateUserFriendField(userData2);
  console.log(
    "this is the datapack4 received in the deleteFriendFromList function(friendProfile.js)"
  );
  console.log(dataPack4);
  //now, the friend request field html needs to get deleted from user profile
  location.href = "calendar_main.html";
}

async function updateUserFriendField(userData2) {
  const rawResponse = await fetch("/updateUserFriendField", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData2),
  });

  let status = await rawResponse.status;
  let data = await rawResponse.json();

  let dataPack = {};
  dataPack.status = await status;
  dataPack.body = await data;

  return await dataPack;
}

// DANNY CODE///////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

const calendarSquaresContainer2 = document.querySelector(".calendar_space");
const navCurrDateDisplay2 = document.querySelector("#nav_curr_date_display2");
const previousMonthArrow2 = document.querySelector("#previous_month");
const nextMonthArrow2 = document.querySelector("#next_month");
const arrowsContainer2 = document.querySelector(".change_month_arrow");
const todayElement2 = document.querySelector("#today_element");
const calendarContentBox2 = document.querySelector(".calendar_content_box");
const overlayxx = document.querySelector(".overlay");
// DATE FUNCTIONALITY INFO...............................
const date = new Date();
const currentYear2 = date.getFullYear();
const currentMonth2 = date.getMonth() + 1;
const currentDay2 = date.getDate();
const currentWeekDayNumber2 = date.getDay() + 1;

// holds the number of days in the current month we are in
const totalDaysInCurrentMonth2 = getDaysInMonth2(currentYear2, currentMonth2);

// holds the name of the current weekday
const currentDayOfTheWeekName2 = dayOfTheWeek2(currentWeekDayNumber2);

// HELPER FUNCTIONS....................................................................................
// ....................................................................................................
// ....................................................................................................
// ....................................................................................................

// gets friend data from local storage
const dataFromLocal = JSON.parse(localStorage.getItem("friendObject"));
const friendsDataFromLocal = JSON.parse(dataFromLocal.data);
console.log(friendsDataFromLocal);

// function that finds the number of days in a specific month
function getDaysInMonth2(year, month) {
  return new Date(year, month, 0).getDate();
}

// function that returns the name of the day of the week
function dayOfTheWeek2(day) {
  switch (day) {
    case 1:
      return "Sunday";
    case 2:
      return "Monday";
    case 3:
      return "Tuesday";
    case 4:
      return "Wednesday";
    case 5:
      return "Thursday";
    case 6:
      return "Friday";
    case 7:
      return "Saturday";
  }
}

// this function receives any date and finds out what day of the week (mon, tues, wed...) landed the first day of that month
function firstDayOfTheMonthWhatWeekDay2(date) {
  let stringOfMonth = date.toDateString().slice(4, 7);
  let stringOfYear = date.toDateString().slice(11, 15);
  let firstDayString = stringOfMonth + " " + "1" + ", " + stringOfYear;
  return new Date(firstDayString).getDay();
}

// helper function that sets the images stored in the day
function setImageStored2(loopVariable, dayWorking) {
  for (
    let j = 0;
    j < friendsDataFromLocal[loopVariable].days[Number(dayWorking)].pic.length;
    j++
  ) {
    // checks if position in array is empty, if it is then the code does not run
    if (
      friendsDataFromLocal[loopVariable].days[Number(dayWorking)].pic[j] !=
        null ||
      months[loopVariable].days[Number(dayWorking)].pic[j] != undefined
    ) {
      document
        .querySelector(".images_container")
        .insertAdjacentHTML(
          "beforeend",
          `<img width="200" class="output" id="output" src="" alt="" data-index="${
            friendsDataFromLocal[loopVariable].days[Number(dayWorking)].pic[j]
          }">`
        );

      let image = document.querySelector(".images_container").children;
      image[j].src =
        friendsDataFromLocal[loopVariable].days[Number(dayWorking)].pic[j];
    }
  }
}

// FUNCTION THAT ADDS CALENDAR DAYS ELEMENTS BASED ON THE CURRENT MONTH AND DAY (SHOWS CURRENT MONTH BY DEFAULT)
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
function populateCalendar2(
  dayOfWeekForDayOne = firstDayOfTheMonthWhatWeekDay2(new Date()),
  totalDaysInMonth = totalDaysInCurrentMonth2,
  month = new Date().getMonth() + 1,
  dateForDisplay = new Date()
) {
  // sets the date in the nav bar (date display)
  document.querySelector("#nav_curr_date_display2").innerText =
    dateForDisplay.toDateString().slice(4, 8) +
    dateForDisplay.toDateString().slice(11, 15);

  // sets the days/spaces in the week that belong to the prior month (sets empty boxes)
  for (let i = 0; i < dayOfWeekForDayOne; i++) {
    calendarSquaresContainer2.insertAdjacentHTML(
      "beforeend",
      `<div class="daybox" >
      <div class="day_and_date">
        <h6 class="dayofweek">0</h6>
        <h6 class="day">0</h6>
      </div>
      <div class="tasks_preview_container">
        <p></p>
      </div>
    </div>`
    );
  }

  // sets the days of the month (populates boxes with days inside)
  for (let i = 1; i < totalDaysInMonth + 1; i++) {
    calendarSquaresContainer2.insertAdjacentHTML(
      "beforeend",
      `<div class="daybox" id="active_daybox" data-validity="valid">
      <div class="day_and_date">
        <h6 class="dayofweek"></h6>
        <h6 class="day">${i}</h6>
      </div>
      <div class="tasks_preview_container">
        <p></p>
      </div>
    </div>`
    );
  }

  //  add the days of the week on the first row (mon, tues, wed...)
  for (let i = 0; i < 7; i++) {
    document.querySelectorAll(".dayofweek")[i].innerText = dayOfTheWeek2(i + 1);
  }

  // sets the prior month's days(numbers) at the beginning as needed
  const priorMonth = month - 1;
  let daysInPriorMonth = getDaysInMonth2(currentYear2, priorMonth);

  for (let i = 0; i <= dayOfWeekForDayOne - 1; i++) {
    document.querySelectorAll(".day")[i].innerText =
      daysInPriorMonth - dayOfWeekForDayOne + i + 1;
  }
}

populateCalendar2();

// CHANGES THE MONTH ON THE DOM WHEN THE ARROWS ARE CLICKED./////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

// counter keeps track of how many clicks user did and what month to show (goes forward and backward)
let counter = 0;
function changeMonthsArrows2() {
  // used event delegation to add an event to the arrows that the user clicks on to change months
  arrowsContainer2.addEventListener("click", function (e) {
    // if user does not click on an arrow, this code exits out of the function
    if (e.target === arrowsContainer2) return;

    // when user clicks on forward arrow, this if statement checks for it and runs the adequate logic
    if (e.target === nextMonthArrow2) {
      //adds 1 to the counter variable
      counter++;

      // empties the calendar to make space for the new information to be populated
      calendarSquaresContainer2.innerHTML = "";

      //  calls the function that populates the calendar but with the appropriate month and info
      populateCalendar2(
        firstDayOfTheMonthWhatWeekDay2(
          new Date(2022, new Date().getMonth() + counter, 1, 0)
        ),
        getDaysInMonth2(
          new Date().getFullYear(),
          new Date().getMonth() + 1 + counter
        ),
        new Date().getMonth() + 1 + counter,
        new Date(2022, new Date().getMonth() + counter, 1, 0)
      );
    }
    // when user clicks on forward arrow, this if statement checks for it and runs the adequate logic (same as above, but in reverse)
    else {
      counter--;
      calendarSquaresContainer2.innerHTML = "";

      populateCalendar2(
        firstDayOfTheMonthWhatWeekDay2(
          new Date(2022, new Date().getMonth() + counter, 1, 0)
        ),
        getDaysInMonth2(
          new Date().getFullYear(),
          new Date().getMonth() + 1 + counter
        ),
        new Date().getMonth() + 1 + counter,
        new Date(2022, new Date().getMonth() + counter, 1, 0)
      );
    }
    // calls function that inserts content into calendar boxes
    // insertPreviewContentIntoBoxes();
  });
}
changeMonthsArrows2();

// GOES TO THE CURRENT MONTH AND RESETS COUNTER TO START FROM 0/////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
function goToCurrentDateAndReset2() {
  // sets counter to 0 to reset months
  counter = 0;

  // clears all dom calendar elements
  calendarSquaresContainer2.innerHTML = "";

  // sets the calendar info for the current month
  populateCalendar2();
}

todayElement2.addEventListener("click", goToCurrentDateAndReset2);

//function adds the methods into the months data storage because they were lost in the process of saving to DB ////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// this function adds the methods into the months data storage because they were lost in the process of saving to DB
function addGetText(arrayLocation, daysInMonth) {
  for (let i = 0; i < daysInMonth; i++) {
    friendsDataFromLocal[arrayLocation].days[i].getText = function () {
      return this.text;
    };

    friendsDataFromLocal[arrayLocation].days[i].getImage = function () {
      return this.pic;
    };

    friendsDataFromLocal[arrayLocation].days[i].setImage = function (newImage) {
      this.pic.push(newImage);
    };

    friendsDataFromLocal[arrayLocation].days[i].setText = function (newText) {
      this.text = this.text + newText;
    };

    friendsDataFromLocal[arrayLocation].days[i].removeImage = function (
      imageName
    ) {
      // loops through array to find matching image name
      for (let j = 0; j < this.pic.length; j++) {
        // if image name matches then the index of the image is found and then it is deleted from the array for that day
        if (imageName === this.pic[j]) {
          // finds index
          const indexOfImageToDelete = this.pic.indexOf(this.pic[j]);
          // deletes value
          this.pic.splice(indexOfImageToDelete, 1);
        }
      }
    };
  }
}

// calls the addDayInSetForMonth() function to fill the map for the days of every month
for (let i = 0; i < 12; i++) {
  addGetText(i, getDaysInMonth2(2022, 7 + i));
}
// OPEN CONTENT BOX FOR A GIVEN DAY OF THE MONTH///////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////

function openContentBoxOnClick2() {
  calendarSquaresContainer2.addEventListener("click", function (e) {
    const clicked = e.target.closest(".daybox");

    // shows overlay and day content box
    overlayxx.classList.remove("hide");
    calendarContentBox2.classList.remove("hide");

    // gets the day of the box clicked on and places it in the editable content box
    document.querySelector("#day_editable_content_box").innerText =
      clicked.children[0].children[1].innerText;

    // current month and year (used to find the right location to get the text data from)
    const monthAndYearWorkingWith = navCurrDateDisplay2.textContent;

    // current day (used to find the right location to get the text data from)
    const dayWorkingWith = clicked.children[0].children[1].innerText;

    // loops through the MONTHS array and finds the matching month and then the matching day and places the data text in the <p> tag
    for (let i = 0; i < friendsDataFromLocal.length; i++) {
      if (friendsDataFromLocal[i].month === monthAndYearWorkingWith) {
        document.querySelector(
          ".content_box_inner_container"
        ).children[0].textContent =
          friendsDataFromLocal[i].days[Number(dayWorkingWith)].getText();

        // sets the images stored in the day using a created helper function
        setImageStored2(i, dayWorkingWith);
      }
    }
  });
}
// calls the above function
openContentBoxOnClick2();

// CLOSES THE CONTENT BOX
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function closeContentBox2() {
  document
    .querySelector("#close_box")
    .addEventListener("click", async function () {
      // hides the editable content box and overlay and clears elements, both text and images elements
      overlayxx.classList.add("hide");
      calendarContentBox2.classList.add("hide");
      document.querySelector(
        ".content_box_inner_container"
      ).children[0].textContent = "";
      document.querySelector(".images_container").innerHTML = "";
    });
}
// calls the above function
closeContentBox2();

// SHOWS PREVIEW OF CONTENT INTO CALENDAR BOXES///////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// current month and year (used to find the right location to get data from)
function insertPreviewContentIntoBoxes2() {
  // current month and year (used to find the right location to get data from)
  const monthAndYearWorkingWith = navCurrDateDisplay2.textContent;

  // empty array to push the text content for the whole month into
  let allTexts = [];

  // loop to find right month
  for (let i = 0; i < friendsDataFromLocal.length; i++) {
    if (friendsDataFromLocal[i].month === monthAndYearWorkingWith) {
      // loop to get text content from all days of the located month
      for (
        let j = 0;
        j < Object.keys(friendsDataFromLocal[i].days).length - 1;
        j++
      ) {
        // push all the content found into empty array
        allTexts.push(friendsDataFromLocal[i].days[1 + j].text);

        // places all the content into the DOM as a preview
        document.querySelectorAll("#active_daybox")[
          j
        ].children[1].children[0].textContent = allTexts[j];
      }
    }
  }
}
insertPreviewContentIntoBoxes2();
