var axios = require("axios");

const baseAPI = "https://api.stagemed.com.br/";

export default async () => {
  var routes = [];

  await axios({ method: "GET", url: `${baseAPI}products/list` })
    .then((res) => {
      res.data.forEach((product) => {
        routes.push("/product/" + product._id);
      });
    })
    .catch((error) => {
      return error;
    });

  await axios({ method: "GET", url: `${baseAPI}users/tags` })
    .then((res) => {
      res.data.forEach((tag) => {
        routes.push("/" + tag.tag);
      });
    })
    .catch((error) => {
      return error;
    });

  return routes.sort((a, b) => a - b);
};
