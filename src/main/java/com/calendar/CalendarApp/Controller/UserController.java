package com.calendar.CalendarApp.Controller;

import com.calendar.CalendarApp.Utils.AmazonClient;
import com.calendar.CalendarApp.Utils.JWTUtil;
import com.calendar.CalendarApp.Dao.UserDao;
import com.calendar.CalendarApp.Model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
public class UserController {

    @Autowired
    UserDao userDao;

    @Autowired
    JWTUtil jwtUtil;

    @Autowired
    AmazonClient amazonClient;

    @PostMapping("/registerUser")
    public User registerUser(@RequestBody User user){

        return userDao.registerUser(user);
    }

    @PostMapping("/updateUserFriendField")
    public User updateUserFriendField(@RequestBody User user){

        return userDao.updateUserFriendField(user);
    }

    @PostMapping("/updateUserFriendRequestField")
    public User updateUserFriendRequestField(@RequestBody User user){

        return userDao.updateUserFriendRequestField(user);
    }

    @PostMapping("/updateUserDataField")
    public User updateUserDataField(@RequestBody User user){

        return userDao.updateUserDataField(user);
    }

    @PostMapping(path = "/verifyUser")
    public boolean verifyUser(@RequestBody User user) {

        return userDao.verifyuser(user);
    }

    @PostMapping(path = "/loginUser")
    public String[] loginUser(@RequestBody User user) {

        User verifiedUser= userDao.loginUser(user);

        if(verifiedUser == null){
            return new String[]{"failed"};
        }

        String token = jwtUtil.create(String.valueOf(verifiedUser.getId()), verifiedUser.getEmail());

        return new String[]{token, String.valueOf(verifiedUser.getId())};
    }


    @PostMapping("/uploadPic")
    public User uploadPicture(@RequestParam("file") MultipartFile file, @RequestParam("id") int id) throws IOException {
        System.out.println("in uuploadpic function");

        System.out.println("in uuploadpic function2");

        String url = amazonClient.uploadFile(file);


        return userDao.uploadPic(url,id);

    }


    @PostMapping(path = "/getUser")
    public User getUser(@RequestBody User user) {

        return userDao.getUser(user);
    }

    @PostMapping(path = "/getUserWithEmail")
    public User getUserWithEmail(@RequestBody User user) {

        return userDao.getUserWithEmail(user);
    }


    @PostMapping(path = "/sendFriendRequest")
    public boolean sendFriendRequest(@RequestBody User user ) {

        return userDao.sendFriendRequest(user);
    }

    @PostMapping("/uploadFileToAmazon")
    public String uploadFileToAmazon(@RequestParam(value = "file") MultipartFile file){

        return amazonClient.uploadFile(file);
    }





}
