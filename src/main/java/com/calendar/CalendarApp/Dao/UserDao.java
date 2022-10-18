package com.calendar.CalendarApp.Dao;

import com.calendar.CalendarApp.Model.User;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface UserDao {

    User registerUser(User user);

    boolean verifyuser(User user);


    User loginUser(User user);

    User uploadPic(String url, int id) throws IOException;

    User getUser(User user);

    boolean sendFriendRequest(User user);

    User getUserWithEmail(User user);

    User updateUserFriendField(User user);

    User updateUserFriendRequestField(User user);

    User updateUserDataField(User user);

}
