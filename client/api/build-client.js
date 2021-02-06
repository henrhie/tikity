import axios from "axios";

const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    //on server
    return axios.create({
      baseURL: "http://tikity-henry-production-dev.xyz",
      headers: req.headers,
    });
  } else {
    //in browser
    return axios.create({
      baseURL: "/",
    });
  }
};

export default buildClient;
