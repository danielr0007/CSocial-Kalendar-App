package com.calendar.CalendarApp.Dao;

import com.calendar.CalendarApp.Model.User;
import org.springframework.stereotype.Repository;

import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.io.IOException;
import java.util.List;


@Repository
@Transactional
public class UserDaoImp implements UserDao{


    @PersistenceContext
    EntityManager entityManager;

    @Override
    public User registerUser(User user) {
        return entityManager.merge(user);
    }

    @Override
    public boolean verifyuser(User user) {
        String query = "FROM User WHERE email = :email";

        List<User> list = entityManager.createQuery(query)
                .setParameter("email", user.getEmail()).getResultList();

        if (list.isEmpty()) {
            return true;
        }

        return false;
    }

    @Override
    public User loginUser(User user) {

        String query = "FROM User WHERE email = :email AND password = :password";
        List<User> list = entityManager.createQuery(query)
                .setParameter("email", user.getEmail())
                .setParameter("password", user.getPassword())
                .getResultList();

        if(list.isEmpty()){
            return null;
        }

        return list.get(0);
    }

    @Override
    public User uploadPic(String url, int id) throws IOException {

        System.out.println("in uuploadpic dao function");
        User user = entityManager.find(User.class,id);
        System.out.println(user);
        user.setPicture(url);

        return  entityManager.merge(user);
    }

    @Override
    public User getUser(User user) {

        String query = "FROM User WHERE id = :id";

        List<User> list = entityManager.createQuery(query).setParameter("id", user.getId()).getResultList();

        if(list.isEmpty()){
            return null;
        }

        return list.get(0);
    }

    @Override
    public boolean sendFriendRequest(User user) {

        System.out.println("friend emaiL:" + user.getEmail());//THE FRIEND YOU TRYING TO ADD EMAIL
        System.out.println("user id:" + user.getFriendRequests());//THE USER SENDING THE REQUEST ID

        String query = "FROM User WHERE email = :email";

        List<User> list = entityManager.createQuery(query)
                          .setParameter("email", user.getEmail()).getResultList();

        if (list.isEmpty()) {
            return false;
        }

        //updates user friend request column
        User friend = list.get(0);
        friend.setFriendRequests(String.valueOf(user.getFriendRequests()));
        entityManager.merge(friend);


        return true;
    }

    @Override
    public User getUserWithEmail(User user) {
        String query = "FROM User WHERE email = :email";

        List<User> list = entityManager.createQuery(query).setParameter("email", user.getEmail()).getResultList();

        if(list.isEmpty()){
            return new User();
        }

        return list.get(0);
    }

    @Override
    public User updateUserFriendField(User user) {

        User user2 = getUser(user);

        user2.setFriends(user.getFriends());

        return entityManager.merge(user2);

    }

    @Override
    public User updateUserFriendRequestField(User user) {

        User user2 = getUser(user);

        user2.setFriendRequests(user.getFriendRequests());

        return entityManager.merge(user2);

    }

    @Override
    public User updateUserDataField(User user) {

        User user2 = getUser(user);

        user2.setData(user.getData());

        return entityManager.merge(user2);
    }



}
