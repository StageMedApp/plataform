import axios from "axios";
const baseAPI = "http://127.0.0.1:4000/";

class Auth {
  async checkUser(user, create) {
    return await this.getUser(user.uid, user.accessToken).then(async (currentUser) => {
      if (currentUser.code === 404 && create) {
        var newUser = {
          _id: user.uid,
          name: user.displayName || user.name || user.email,
          email: user.email,
        };

        if (user.photoURL) {
          newUser.picture = user.photoURL;
          newUser.pictureMedium = user.photoURL;
          newUser.pictureSmall = user.photoURL;
        }
        var saveUser = await this.setUser(newUser, user.accessToken);
        return saveUser;
      }
      return currentUser;
    });
  }
  async getUser(id, token = false) {
    let setting = {
      method: "GET",
      url: `${baseAPI}users/${id}`,
    };
    if (token) setting.headers = { Authorization: "Bearer " + token };

    return await axios(setting)
      .then(
        (res) => {
          return res.data;
        },
        () => {
          return Promise.resolve({ code: 404 });
        }
      )
      .catch((error) => {
        return Promise.reject(error);
      });
  }
  async setUser(user, token = false) {
    let setting = {
      method: "POST",
      url: `${baseAPI}users`,
      data: user,
    };
    if (token) setting.headers = { Authorization: "Bearer " + token };

    return await axios(setting)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        return error;
      });
  }
}
export default new Auth();
