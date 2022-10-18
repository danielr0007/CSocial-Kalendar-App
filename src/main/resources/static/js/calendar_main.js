//DANY CODE ****************************************************************************************

async function getUserObject(userData) {
  const rawResponse = await fetch("/getUser", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  let data = await rawResponse.json();

  return await data;
}
let userData = {};
userData.id = JSON.parse(localStorage.id);
let dataToExport = getUserObject(userData);

// ELEMENTS USED.........................................
const calendarSquaresContainer = document.querySelector(".calendar_space");
const calendarBox = document.querySelectorAll(".daybox");
const dayOfWeekText = document.querySelectorAll(".dayofweek");
const navCurrDateDisplay = document.querySelector("#nav_curr_date_display");
const previousMonthArrow = document.querySelector("#previous_month");
const nextMonthArrow = document.querySelector("#next_month");
const arrowsContainer = document.querySelector(".change_month_arrow");
const todayElement = document.querySelector("#today_element");
const overlayx = document.querySelector(".overlay");
const calendarContentBox = document.querySelector(".calendar_content_box");
const closeContentBoxButton = document.querySelector("#ContentBox");

// DATE FUNCTIONALITY INFO...............................
const date = new Date();
const currentYear = date.getFullYear();
const currentMonth = date.getMonth() + 1;
const currentDay = date.getDate();
const currentWeekDayNumber = date.getDay() + 1;

// holds the number of days in the current month we are in
const totalDaysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);

// holds the name of the current weekday
const currentDayOfTheWeekName = dayOfTheWeek(currentWeekDayNumber);

// HELPER FUNCTIONS....................................................................................
// ....................................................................................................
// ....................................................................................................
// ....................................................................................................
// function that finds the number of days in a specific month
function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

// function that returns the name of the day of the week
function dayOfTheWeek(day) {
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
function firstDayOfTheMonthWhatWeekDay(date) {
  let stringOfMonth = date.toDateString().slice(4, 7);
  let stringOfYear = date.toDateString().slice(11, 15);
  let firstDayString = stringOfMonth + " " + "1" + ", " + stringOfYear;
  return new Date(firstDayString).getDay();
}

// this helper function rounds a number to the nearest 1000th place
function roundNearest1000(num) {
  return Math.round(num / 1000) * 1000;
}

// helper function that sets the images stored in the day
function setImageStored(loopVariable, dayWorking) {
  for (
    let j = 0;
    j < months[loopVariable].days[Number(dayWorking)].pic.length;
    j++
  ) {
    // checks if position in array is empty, if it is then the code does not run
    if (
      months[loopVariable].days[Number(dayWorking)].pic[j] != null ||
      months[loopVariable].days[Number(dayWorking)].pic[j] != undefined
    ) {
      document
        .querySelector(".images_container")
        .insertAdjacentHTML(
          "beforeend",
          `<img width="200" class="output" id="output" src="" alt="" data-index="${
            months[loopVariable].days[Number(dayWorking)].pic[j]
          }">`
        );

      console.log(months[loopVariable].days[Number(dayWorking)].pic[j]);
      let image = document.querySelector(".images_container").children;
      image[j].src = months[loopVariable].days[Number(dayWorking)].pic[j];
    }
  }
}

// MAIN FUNCTIONALITY CODE//////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
// ............................................................................................

// all the data user data within the calendar for 12 months
let months = [
  { month: "Jul 2022", days: {} },
  { month: "Aug 2022", days: {} },
  { month: "Sep 2022", days: {} },
  { month: "Oct 2022", days: {} },
  { month: "Nov 2022", days: {} },
  { month: "Dec 2022", days: {} },
  { month: "Jan 2023", days: {} },
  { month: "Feb 2023", days: {} },
  { month: "Mar 2023", days: {} },
  { month: "Apr 2023", days: {} },
  { month: "May 2023", days: {} },
  { month: "Jun 2023", days: {} },
];

// function that adds the days to the months data structure. For each day an object is added with text and pic property and empty values
function addDayInSetForMonth(arrayLocation, daysInMonth) {
  for (let i = 0; i < daysInMonth; i++) {
    months[arrayLocation].days[i] = {
      text: "",
      pic: [],

      getText() {
        return this.text;
      },

      getImage() {
        return this.pic;
      },

      setText(newText) {
        this.text = this.text + newText;
      },

      setImage(newImage) {
        this.pic.push(newImage);
      },

      removeImage(imageName) {
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
      },
    };
  }
}

// calls the addDayInSetForMonth() function to fill the map for the days of every month
for (let i = 0; i < 12; i++) {
  addDayInSetForMonth(i, getDaysInMonth(2022, 7 + i));
}

// SEND CALENDAR DATA TO DATABASE AND RETURN THE USER OBJECTOH//////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
// ............................................................................................

async function sendMainGoalsToDb(months) {
  let userData = {};
  userData.id = JSON.parse(localStorage.id);
  userData.data = JSON.stringify(months);

  const rawResponse = await fetch("/updateUserDataField", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData), //the object containing email and pass converted to JSON in the request body
  });

  let status = await rawResponse.status;
  let data = await rawResponse.json();

  let dataPack = {};
  dataPack.status = await status;
  dataPack.body = await data;

  return await dataPack;
}

// FUNCTION THAT ADDS CALENDAR DAYS ELEMENTS BASED ON THE CURRENT MONTH AND DAY (SHOWS CURRENT MONTH BY DEFAULT)
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
function populateCalendar(
  dayOfWeekForDayOne = firstDayOfTheMonthWhatWeekDay(new Date()),
  totalDaysInMonth = totalDaysInCurrentMonth,
  month = new Date().getMonth() + 1,
  dateForDisplay = new Date()
) {
  // sets the date in the nav bar (date display)
  navCurrDateDisplay.innerText =
    dateForDisplay.toDateString().slice(4, 8) +
    dateForDisplay.toDateString().slice(11, 15);

  // sets the days/spaces in the week that belong to the prior month (sets empty boxes)
  for (let i = 0; i < dayOfWeekForDayOne; i++) {
    calendarSquaresContainer.insertAdjacentHTML(
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
    calendarSquaresContainer.insertAdjacentHTML(
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
    document.querySelectorAll(".dayofweek")[i].innerText = dayOfTheWeek(i + 1);
  }

  // sets the prior month's days(numbers) at the beginning as needed
  const priorMonth = month - 1;
  let daysInPriorMonth = getDaysInMonth(currentYear, priorMonth);

  for (let i = 0; i <= dayOfWeekForDayOne - 1; i++) {
    document.querySelectorAll(".day")[i].innerText =
      daysInPriorMonth - dayOfWeekForDayOne + i + 1;
  }
}

populateCalendar();

// CHANGES THE MONTH ON THE DOM WHEN THE ARROWS ARE CLICKED./////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

// counter keeps track of how many clicks user did and what month to show (goes forward and backward)
let counter = 0;
function changeMonthsArrows() {
  // used event delegation to add an event to the arrows that the user clicks on to change months
  arrowsContainer.addEventListener("click", function (e) {
    // if user does not click on an arrow, this code exits out of the function
    if (e.target === arrowsContainer) return;

    // when user clicks on forward arrow, this if statement checks for it and runs the adequate logic
    if (e.target === nextMonthArrow) {
      //adds 1 to the counter variable
      counter++;

      // empties the calendar to make space for the new information to be populated
      calendarSquaresContainer.innerHTML = "";

      //  calls the function that populates the calendar but with the appropriate month and info
      populateCalendar(
        firstDayOfTheMonthWhatWeekDay(
          new Date(2022, new Date().getMonth() + counter, 1, 0)
        ),
        getDaysInMonth(
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
      calendarSquaresContainer.innerHTML = "";

      populateCalendar(
        firstDayOfTheMonthWhatWeekDay(
          new Date(2022, new Date().getMonth() + counter, 1, 0)
        ),
        getDaysInMonth(
          new Date().getFullYear(),
          new Date().getMonth() + 1 + counter
        ),
        new Date().getMonth() + 1 + counter,
        new Date(2022, new Date().getMonth() + counter, 1, 0)
      );
    }
    // calls function that inserts content into calendar boxes
    insertPreviewContentIntoBoxes();
  });
}
changeMonthsArrows();

// GOES TO THE CURRENT MONTH AND RESETS COUNTER TO START FROM 0/////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
function goToCurrentDateAndReset() {
  // sets counter to 0 to reset months
  counter = 0;

  // clears all dom calendar elements
  calendarSquaresContainer.innerHTML = "";

  // sets the calendar info for the current month
  populateCalendar();
}

todayElement.addEventListener("click", goToCurrentDateAndReset);

// OPEN CONTENT BOX FOR A GIVEN DAY OF THE MONTH///////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////

function openContentBoxOnClick() {
  calendarSquaresContainer.addEventListener("click", function (e) {
    const clicked = e.target.closest(".daybox");

    // shows overlay and day content box
    overlayx.classList.remove("hide");
    calendarContentBox.classList.remove("hide");

    // gets the day of the box clicked on and places it in the editable content box
    document.querySelector("#day_editable_content_box").innerText =
      clicked.children[0].children[1].innerText;

    // current month and year (used to find the right location to get the text data from)
    const monthAndYearWorkingWith = navCurrDateDisplay.textContent;

    // current day (used to find the right location to get the text data from)
    const dayWorkingWith = clicked.children[0].children[1].innerText;

    // loops through the MONTHS array and finds the matching month and then the matching day and places the data text in the <p> tag
    for (let i = 0; i < months.length; i++) {
      if (months[i].month === monthAndYearWorkingWith) {
        document.querySelector(
          ".content_box_inner_container"
        ).children[0].textContent =
          months[i].days[Number(dayWorkingWith)].getText();

        // sets the images stored in the day using a created helper function
        setImageStored(i, dayWorkingWith);

        // clears the data location so it can be updated appropriately
        months[i].days[Number(dayWorkingWith)].text = "";
      }
    }
  });
}
// calls the above function
openContentBoxOnClick();

// CLOSES THE CONTENT BOX AND SIMULTANOUSLY SAVES ANY TEXT AND CLEARS ELEMENTS SO IT CAN BE USED FOR THE NEXT DAY CLICKED
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function closeContentBox() {
  document
    .querySelector("#close_box")
    .addEventListener("click", async function () {
      // current month and year (used to find the right location to save into)
      const monthAndYearWorkingWith = navCurrDateDisplay.textContent;

      // current day (used to find the right location to save into)
      const dayWorkingWith = document.querySelector(
        "#day_editable_content_box"
      ).innerText;

      // text typed in by user that needs to be saved
      const textToSave = document.querySelector(".content_box_inner_container")
        .children[0].textContent;

      // loops through the MONTHS array and finds the matching month and day to then save the text the user typed
      for (let i = 0; i < months.length; i++) {
        if (months[i].month === monthAndYearWorkingWith) {
          if (
            textToSave !== months[i].days[Number(dayWorkingWith)].getText() &&
            textToSave !== ""
          ) {
            // saves text
            months[i].days[Number(dayWorkingWith)].setText(textToSave);
          }
        }
      }

      // hides the editable content box and overlay and clears elements, both text and images elements
      overlayx.classList.add("hide");
      calendarContentBox.classList.add("hide");
      document.querySelector(
        ".content_box_inner_container"
      ).children[0].textContent = "";
      document.querySelector(".images_container").innerHTML = "";
      console.log(months);

      // calls function that inserts content into calendar boxes
      insertPreviewContentIntoBoxes();

      // function that sends data to database
      let response = await sendMainGoalsToDb(months);
      console.log(response);
    });
}
// calls the above function
closeContentBox();

// ALLOWS IMAGES TO BE UPLOADED TO THE APPROPRIATE DAY (WORKS BY PUSHING IMAGE UPLOADED BY USER INTO AN ARRAY)
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function uploadPic() {
  document
    .querySelector("#uploadpic")
    .addEventListener("change", async function () {
      const formData = new FormData();
      formData.append("file", document.querySelector("#uploadpic").files[0]);

      //save pic to aws amazons storage
      let rawResponse = await fetch("/uploadFileToAmazon", {
        method: "POST",
        body: formData,
      });
      let fileUrl = await rawResponse.text();
      console.log(fileUrl);

      let file = document.querySelector("#uploadpic").files[0];
      let reader = new FileReader();

      reader.addEventListener("load", function () {
        console.log(reader.result);
        // current month and year (used to find the right location to save into)
        const monthAndYearWorkingWith = navCurrDateDisplay.textContent;

        // current day (used to find the right location to save into)
        const dayWorkingWith = document.querySelector(
          "#day_editable_content_box"
        ).innerText;

        // loops through the MONTHS array and finds the matching month and day to then save the text the user typed
        for (let i = 0; i < months.length; i++) {
          if (months[i].month === monthAndYearWorkingWith) {
            months[i].days[Number(dayWorkingWith)].setImage(fileUrl);
            // formdata goes above*******

            // clears the images container box so that it could be placed all over again by the function below
            document.querySelector(".images_container").innerHTML = "";

            // sets the images stored in the day using a created helper function
            setImageStored(i, dayWorkingWith);
          }
        }
      });

      reader.readAsDataURL(file);

      // sends data to database
      let response = await sendMainGoalsToDb(months);
      console.log(response);
      console.log(months);
    });
}
// calls the above function
uploadPic();

// DISPLAYS IMAGES LARGE IN THE MIDDLE OF THE SCREEN WITH AN OVERLAY AFTER IT IS CLICKED////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function enlargeImageOnClick() {
  document
    .querySelector(".images_container")
    .addEventListener("click", function (e) {
      if (e.target === document.querySelector(".images_container")) return;

      // places and overlay to single out the clicked on image
      document.body.insertAdjacentHTML(
        "beforeend",
        `<div class="overlay2"></div>`
      );

      // places the image clicked on in the middle of the page enlarged
      document.body.insertAdjacentHTML(
        "beforeend",
        `<img id="enlarged_image" width="700" data-index="${
          e.target.dataset.index
        }" src="${e.target.getAttribute("src")}" >`
      );

      // places the delete option in the middle of the page
      document.body.insertAdjacentHTML(
        "beforeend",
        `<h4 class="delete_image">Delete Image</h4>`
      );
      exitOutOfEnlargedImage();
      removeImage();
    });
}
enlargeImageOnClick();

// EXITS OUT OF ENLARGED IMAGE MODE WHEN USER CLICKS ANYWHERE OUTSIDE OF THE IMAGE/////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
function exitOutOfEnlargedImage() {
  document.querySelector(".overlay2").addEventListener("click", () => {
    document.getElementById("enlarged_image").remove();
    document.querySelector(".overlay2").remove();
    document.querySelector(".delete_image").remove();
  });
}

// REMOVES AN IMAGE FROM THE DAY DATA/////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
function removeImage() {
  document
    .querySelector(".delete_image")
    .addEventListener("click", async function () {
      // current month and year (used to find the right location to get data from)
      const monthAndYearWorkingWith = navCurrDateDisplay.textContent;

      // current day (used to find the right location to get data from)
      const dayWorkingWith = document.querySelector(
        "#day_editable_content_box"
      ).innerText;

      // loops through the MONTHS array and finds the matching month and day to then get the right images
      for (let i = 0; i < months.length; i++) {
        if (months[i].month === monthAndYearWorkingWith) {
          // romoves the image from the matching month and day
          months[i].days[Number(dayWorkingWith)].removeImage(
            document.getElementById("enlarged_image").dataset.index
          );

          // clears the images container box so that it could be placed all over again by the function below
          document.querySelector(".images_container").innerHTML = "";

          // sets the images stored in the day using a created helper function
          setImageStored(i, dayWorkingWith);
        }
      }

      // sends data to database
      let response = await sendMainGoalsToDb(months);
      console.log(response);
    });
}

// current month and year (used to find the right location to get data from)
function insertPreviewContentIntoBoxes() {
  // current month and year (used to find the right location to get data from)
  const monthAndYearWorkingWith = navCurrDateDisplay.textContent;

  // empty array to push the text content for the whole month into
  let allTexts = [];

  // loop to find right month
  for (let i = 0; i < months.length; i++) {
    if (months[i].month === monthAndYearWorkingWith) {
      // loop to get text content from all days of the located month
      for (let j = 0; j < Object.keys(months[i].days).length - 1; j++) {
        // push all the content found into empty array
        allTexts.push(months[i].days[1 + j].text);

        // places all the content into the DOM as a preview
        document.querySelectorAll("#active_daybox")[
          j
        ].children[1].children[0].textContent = allTexts[j];
      }
    }
  }
}

// A TIMED FUNCTION THAT LOADS DATA FROM DATABASE INTO DOM////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

setTimeout(() => {
  dataToExport.then(function (res) {
    if (res.data === null || res.data === undefined) return;
    // months array is redeclared with data from DB (missing methods)
    months = JSON.parse(res.data);

    // this function adds the methods into the months data storage because they were lost in the process of saving to DB
    function addGetText(arrayLocation, daysInMonth) {
      for (let i = 0; i < daysInMonth; i++) {
        months[arrayLocation].days[i].getText = function () {
          return this.text;
        };

        months[arrayLocation].days[i].getImage = function () {
          return this.pic;
        };

        months[arrayLocation].days[i].setImage = function (newImage) {
          this.pic.push(newImage);
        };

        months[arrayLocation].days[i].setText = function (newText) {
          this.text = this.text + newText;
        };

        months[arrayLocation].days[i].removeImage = function (imageName) {
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
      addGetText(i, getDaysInMonth(2022, 7 + i));
    }

    insertPreviewContentIntoBoxes();
  });
}, 3000);

console.log("balls");
