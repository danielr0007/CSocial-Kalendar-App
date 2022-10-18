//OMAR CODE*************************

//sends userID and gets userObject from api when page loads.

loadUserData();


async function loadUserData() {
    let userData = {};
    userData.id = JSON.parse(localStorage.id);
    //get user object from backend
    let dataPack = await getUserObject(userData);
    //store user object in local storage
    localStorage.userObject = JSON.stringify(dataPack.body);
    let calendarData = dataPack.body.data;

    console.log(dataPack);
    //sets picture and email on nav bar when page loads
    document.getElementById("userNavName").innerText = dataPack.body.email;
    if (dataPack.body.picture == null || dataPack.body.picture == "") {
        document.getElementById("userPhoto").src = "images/userDefault.png";
    } else {
        document.getElementById("userPhoto").src = dataPack.body.picture;
    }

    /**********load friends list on user homepage*********/

        //get friends ids array from user object
    let friendIds = JSON.parse(dataPack.body.friends);
    loadFriendsHtml(friendIds);

    /*******load friend requests list on user homepage******/

        //gets friend request ids from user object
    let friendRequestsIds = JSON.parse(dataPack.body.friendRequests);
    loadFriendRequestsHtml(friendRequestsIds);
}



//FUNCTION CALLED ON FRIEND NAME CLICK
//passes the html element id and calls api with that id and stores the userobj in localstorage
//as friendObject so we can use it on another html and js files. Then redirects to friendprofile.html
async function displayFriendProfile(id) {
    let userData = {};
    userData.id = id;

    let dataPack = await getUserObject(userData);

    console.log("Friend data pack:");
    console.log(dataPack);
    dataPack.body.password = "";
    localStorage.friendObject = JSON.stringify(dataPack.body);

    location.href = "friend.html";


}



let changePictureButton = document.getElementById("changePictureButton");
let fileuploader = document.getElementById("fileuploader");



let userPhotoButton = document.getElementById("userPhoto");
let dropdownMenu = document.querySelector(".dropdown-content");
//dropdown menu click toggle
userPhotoButton.addEventListener("click", () =>{
console.log("photo clicked")

    if(dropdownMenu.style.display == 'none') dropdownMenu.style.display = 'block';
    else dropdownMenu.style.display = 'none';

})


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


//when userInfo from dropdown gets clicked

let accountInfoButton = document.getElementById("accountInfoButton");
let signUpForm = document.querySelector(".signUpForm");
let overlay = document.querySelector(".overlay");

accountInfoButton.addEventListener("click", function () {

    let userInfo = JSON.parse(localStorage.userObject); //gets user obj and turns it to a js object(from a string)
    console.log(userInfo);


    document.getElementById("userInfoBoxPictureImage").src = userInfo.picture;
    if(userInfo.picture == null) {
        document.getElementById("userInfoBoxPictureImage").src = "images/userDefault.png";
    }

    document.getElementById("userInfoBoxFirstName").innerText = userInfo.firstName;
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
//logout button on click from dropdown
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

async function updateUserFriendRequestField(userData2) {
    const rawResponse = await fetch("/updateUserFriendRequestField", {
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

            if(friendPicture == null){
                friendPicture ="images/userDefault.png";
            }

            let friendHTML =
                '<div class="friendMainDiv"><div class="friendDiv" onclick="displayFriendProfile(this.id)"  id="'+friendID+'">' +
                '<img src='+friendPicture+'><p>'+friendFirstName+' '+friendLastName+'</p></div>' +
                '<div id="'+friendId+'" class="chatIconDiv" onclick="openChatWindow(this.id)"><i class=\'fas fa-comment\'></i></div></div>';

            document.getElementById("friendListDiv").innerHTML += friendHTML;
        }
    }
}



async function loadFriendRequestsHtml(friendRequestsIds) {
    if (friendRequestsIds != null) {
        for (let i = 0; i < friendRequestsIds.length; i++) {
            let friendData = {};
            friendData.id = friendRequestsIds[i].id;

            let friendDataPack = await getUserObject(friendData);
            let friendId = friendData.id;
            localStorage.setItem(friendId, JSON.stringify(friendDataPack.body));

            let friendID = friendDataPack.body.id;
            let friendFirstName = friendDataPack.body.firstName;
            let friendLastName = friendDataPack.body.lastName;
            let friendPicture = friendDataPack.body.picture;
            if(friendPicture == null) friendPicture ="images/userDefault.png";

            let friendHTML = '<div id='+(friendID * -1)+'><div class="friendDiv">\n' +
                '              <img src="'+friendPicture+'"/>\n' +
                '              <p>'+friendFirstName+' '+friendLastName+'</p>\n' +
                '            </div>\n' +
                '            <div class="friendDivButtonsDiv">\n' +
                '              <button id='+friendID+' class="acceptButton" onclick=" addFriend('+friendID+')">Accept</button\n' +
                '              ><button id='+friendID+' class="declineButton" onclick=" deleteRequest(id)">Decline</button></div></div>';


            document.getElementById("friendListDiv2").innerHTML += friendHTML;
        }
    }
}
//function in decline button of requests
async function deleteRequest(id) {
    //alert(id);
    //get user id,post user updating friend request field
    let userData2 = {};
    userData2.id = JSON.parse(localStorage.id);
    let dataPack = await getUserObject(userData2); //gets current friend list from db
    let currentFriendRequestList = JSON.parse(dataPack.body.friendRequests);
    //filter for friend id in the array and only keep the ones that don't match with id passed
    currentFriendRequestList = currentFriendRequestList.filter(
        (friend) => friend.id != id
    );
    userData2.friendRequests = JSON.stringify(currentFriendRequestList);
    let dataPack4 = await updateUserFriendRequestField(userData2);
    console.log(
        "this is the datapack4 received in the deleteRequests function(dropdown.js)"
    );
    console.log(dataPack4);
    //now, the friend request field html needs to get deleted from user profile
    let stringId = JSON.stringify(id * -1);
    document.getElementById(stringId).remove();

}

//function in accept button of requests
async function addFriend(id) {
    //get user id,post user updating friend field
    let userData2 = {};
    userData2.id = JSON.parse(localStorage.id);
    let dataPack = await getUserObject(userData2); //gets current friend list from db

    let currentFriendList = JSON.parse(dataPack.body.friends); //changes friends field to an obj

    if (!Array.isArray(currentFriendList)) {
        currentFriendList = [];
    }

    if (!currentFriendList.includes(id)) {
        currentFriendList.push({ id }); //adds the new friend id passed to the function
        userData2.friends = JSON.stringify(currentFriendList);
        console.log("line 105......" + JSON.stringify(userData2));
        let dataPack3 = await updateUserFriendField(userData2); //updates new friend field of user
        console.log(
            "this is the datapack3 received in the addFriend function(dropdown.js)"
        );
        console.log(dataPack3); //displays new user with update field

        //updates the new friend in html
        let userInfo = JSON.parse(localStorage.getItem(id));
        let friendID = userInfo.id;
        let friendFirstName = userInfo.firstName;
        let friendLastName = userInfo.lastName;
        let friendPicture = userInfo.picture;

        let friendHTML =
            '<div class="friendDiv" onclick="displayFriendProfile(this.id)" id="' +
            friendID +
            '">\n' +
            '              <img src="data:image/jpeg;base64,' +
            friendPicture +
            '"/>\n' +
            "              <p >" +
            friendFirstName +
            " " +
            friendLastName +
            "</p>\n" +
            "            </div>";

        document.getElementById("friendListDiv").innerHTML += friendHTML;

        //updating friend request field in database
        let currentFriendRequestList = JSON.parse(dataPack.body.friendRequests);

        currentFriendRequestList = currentFriendRequestList.filter(
            (friend) => friend.id != id
        );
        userData2.friendRequests = JSON.stringify(currentFriendRequestList);
        let dataPack4 = await updateUserFriendRequestField(userData2);
        console.log(
            "this is the datapack4 received in the addFriend function(dropdown.js)"
        );
        console.log(dataPack4);
        //now, the friend request field html needs to get deleted from user profile
        let stringId = JSON.stringify(id * -1);
        document.getElementById(stringId).remove();

        //now add user to the friends friend list in the db
        let userData3 = {};
        userData3.id = id;
        console.log(
            "this the friends id line 147: " + JSON.stringify(userData3.id)
        ); //74 raul
        let dataPack5 = await getUserObject(userData3); //gets current friend list from db
        let currentFriendList2 = JSON.parse(dataPack5.body.friends); //changes friends field to an obj

        if (!Array.isArray(currentFriendList2)) {
            currentFriendList2 = [];
        }
        id = JSON.parse(localStorage.getItem("id"));

        if (!currentFriendList2.includes(id)) {
            currentFriendList2.push({ id }); //adds the new friend id passed to the function
            userData3.friends = JSON.stringify(currentFriendList2);

            let dataPack3 = await updateUserFriendField(userData3); //updates new friend field of user
        }

        //now update the user friend field in the database
    }
}



//chat functionality
let sock;
let client;
let chatWindow = document.querySelector('.chatWindow');

document.getElementById("chatButton").addEventListener("click", sendMessage);
document.getElementById("chatCloseContainer").addEventListener("click", closeConnection);

async function openChatWindow(id) {
    //set up chat window
    let friendObj = JSON.parse(localStorage.getItem(id));
    localStorage.chatFriend = localStorage.getItem(id);
    localStorage.userNick = (JSON.parse(localStorage.userObject).firstName);


    document.querySelector('.chatWindowContainer').style.display = 'block';
    document.querySelector('.chatFriendName').innerHTML = '<p>' + friendObj.firstName + ' ' + friendObj.lastName + '</p>';

    if(sock == null){
        // Try to set up WebSocket connection with the handshake at "http://localhost:8080/stomp"
        sock = new SockJS("https://socialkalendar.herokuapp.com/stomp");
        // Create a new StompClient object with the WebSocket endpoint
        client = Stomp.over(sock);
        // Start the STOMP communications, provide a callback for when the CONNECT frame arrives.
        client.connect({},  OnConnected);
    }

}

function OnConnected(){
    //subscribe to the endpoint and put the callback function that'll receive all the messages
    client.subscribe("/topic/messages", onMessageReceived);
    //Register
    let nickName = localStorage.userNick;
    //send a joing message to let server know who you are
    client.send('/app/chat.register', {}, JSON.stringify({message: "", name: nickName, type:'JOIN'}))
}

function onMessageReceived(payload){
    let body = JSON.parse(payload.body);

    let avatarDiv = document.createElement('div');
    let avatarPic = document.createElement('img');
    let messageString = document.createElement('p');
    let messageStringTime = document.createElement('p');
    let messageContainer = document.createElement('div');
    let everythingContainer = document.createElement('div');
    let mes = body.message;


    messageString.classList.add('text');
    messageContainer.classList.add("messageContainer");

    messageContainer.appendChild(messageString);

    console.log("payload:");
    console.log(payload);

    avatarDiv.classList.add("avatar");
    avatarPic.classList.add("avatarPic");
    avatarPic.src = (JSON.parse(localStorage.userObject).picture);
    avatarDiv.appendChild(avatarPic);

    if(body.name != localStorage.userNick){

        avatarDiv.style.backgroundColor = '#493e66';
        avatarPic.src = (JSON.parse(localStorage.chatFriend).picture);
        messageContainer.classList.add("messageContainer2");
    }


    if(body.type == 'JOIN'){
        let joinTag = document.createElement('p');
        joinTag.classList.add('join');
        joinTag.innerText = body.name + " joined";
        chatWindow.appendChild(joinTag);
    }else if (body.type == 'LEAVE'){
        let joinTag = document.createElement('p');
        joinTag.classList.add('join');
        joinTag.innerText = body.name + " left";
        chatWindow.appendChild(joinTag);
    }else{
        let date = new Date();
        let hour = 24 - date.getHours();
        let timeOfDay = 'am';
        if(date.getHours() > 12) timeOfDay = 'pm';

        messageStringTime.innerText = hour+":"+date.getMinutes()+timeOfDay;
        messageStringTime.classList.add('time');


        messageString.innerText = mes;
        everythingContainer.classList.add('everythingContainer');

        if(body.name != localStorage.userNick){
            everythingContainer.appendChild(messageStringTime);
            everythingContainer.appendChild(messageContainer);
            everythingContainer.appendChild(avatarDiv);
        }else{
            everythingContainer.appendChild(avatarDiv);
            everythingContainer.appendChild(messageContainer);
            everythingContainer.appendChild(messageStringTime);
        }


        chatWindow.appendChild(everythingContainer);
    }
}

function sendMessage(){
    let nickName = localStorage.userNick;
    let input = document.getElementById("chatInpuField");
    let message = input.value;

    client.send('/app/chat.send', {}, JSON.stringify({message: message, name: nickName, type:'CHAT'}));
    input.value = "";
}

function closeConnection(){
    let nickName = localStorage.userNick;
    client.send('/app/chat.send', {}, JSON.stringify({message: "", name: nickName, type:'LEAVE'}));
    document.querySelector('.chatWindowContainer').style.display = 'none';
}







