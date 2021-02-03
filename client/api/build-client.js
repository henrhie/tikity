import axios from "axios";

const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    //on server
    return axios.create({
      baseURL: "http://ingress-nginx-controller.kube-system.svc.cluster.local",
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
