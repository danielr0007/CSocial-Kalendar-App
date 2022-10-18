package com.calendar.CalendarApp.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name= "user_table")
public class User {

    public User(String firstName, String lastName, String email, String password, String birthday,
                String gender, String picture, String friends, String data, String friendRequests){

        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.birthday = birthday;
        this.gender = gender;
        this.picture = picture;
        this.friends = friends;
        this.data = data;
        this.friendRequests = friendRequests;
    }



    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "firstname")
    private String firstName;

    @Column(name = "lastname")
    private String lastName;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "birthday")
    private String birthday;

    @Column(name = "gender")
    private String gender;

    @Column(name = "picture")
    private String picture;

    @Column(name = "friends")
    private String friends;

    @Column(name = "data")
    private String data;

    @Column(name = "friendrequests")
    private String friendRequests;

}




