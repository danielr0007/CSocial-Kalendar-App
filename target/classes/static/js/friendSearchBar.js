

let friendRequestButton = document.getElementById("send_request_btn");
let friendRequestInput = document.getElementById("friend_username_input");
let userId = JSON.parse(localStorage.id);

friendRequestButton.addEventListener("click", async function () {
  let friendEmail = friendRequestInput.value;

  let friendObj = {};
  friendObj.email = friendEmail;
  let friendObject = await getFriendObjWithEmail(friendObj);
  console.log("this is the friend object fetched by sending email: ");

  console.log(friendObject.body);

  let currenFriendRequests = JSON.parse(friendObject.body.friendRequests);
  let currenFriends = JSON.parse(friendObject.body.friends);
  console.log(currenFriendRequests);

  let requestAlreadySent = false;

  if(currenFriendRequests != null || currenFriends != null){
    //check if user id is already in his friends friend requests array..if it is then dont send request
    for(let i=0; i<currenFriendRequests.length; i++){

      if(currenFriendRequests[i].id == userId){

        document.getElementById("requestAlreadySent").classList.remove("hide");

        setTimeout(function () {
          document.getElementById("requestAlreadySent").classList.add("hide");
        }, 5000);
        requestAlreadySent = true;
        break;
      }
    }

    //check if user id is already in his friends friends array..if it is then dont send request
    for(let i=0; i<currenFriends.length; i++){


      if(currenFriends[i].id == userId){

        document.getElementById("alreadyYourFriendAlert").classList.remove("hide");

        setTimeout(function () {
          document.getElementById("alreadyYourFriendAlert").classList.add("hide");
        }, 5000);
        requestAlreadySent = true;
        break;
      }
    }


  }

  if(requestAlreadySent == false){

    if (!Array.isArray(currenFriendRequests)) {
      //if return is null it creates a new array
      currenFriendRequests = [];
    }
    let userData = {};
    userData.email = friendRequestInput.value;
    let userid = JSON.parse(localStorage.id);
    currenFriendRequests.push({ id: userid });
    userData.friendRequests = JSON.stringify(currenFriendRequests);

    let datapack = await sendFriendRequest(userData);

    console.log(datapack.body);
    if (datapack.body == false) {
      document.getElementById("alreadyRegisteredAlert").classList.remove("hide");

      setTimeout(function () {
        document.getElementById("alreadyRegisteredAlert").classList.add("hide");
      }, 5000);
      return;
    }

    document.getElementById("userRegisteredAlert").classList.remove("hide");

    setTimeout(function () {
      document.getElementById("userRegisteredAlert").classList.add("hide");
    }, 5000);
  }


});

async function sendFriendRequest(friendObject) {
  const rawResponse = await fetch("/sendFriendRequest", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(friendObject),
  });

  let status = await rawResponse.status;
  let data = await rawResponse.json();

  let dataPack = {};
  dataPack.status = await status;
  dataPack.body = await data;

  return dataPack;
}

async function getFriendObjWithEmail(friendObject) {
  const rawResponse = await fetch("/getUserWithEmail", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(friendObject),
  });

  let status = await rawResponse.status;
  let data = await rawResponse.json();

  let dataPack = {};
  dataPack.status = await status;
  dataPack.body = await data;

  return dataPack;
}
