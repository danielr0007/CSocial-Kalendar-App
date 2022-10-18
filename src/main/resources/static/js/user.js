export class User {
  constructor(
    id,
    firstName,
    lastname,
    email,
    password,
    birthday,
    gender,
    picture,
    friends,
    data
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastname = lastname;
    this.email = email;
    this.password = password;
    this.birthday = birthday;
    this.gender = gender;
    this.picture = picture;
    this.friends = friends;
    this.data = data;
  }

  getDataValue() {
    return this.data[0].days[1];
  }

  getdata() {
    return this.data;
  }
}
