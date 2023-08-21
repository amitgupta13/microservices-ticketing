import axios from "axios";

export default ({ req }) => {
  if (typeof window === "undefined") {
    // we are on the server
    // request should be made to http://ingress-nginx-controller.ingress-nginx.svc.cluster.local use this or the external name service ingress-nginx-srv
    return axios.create({
      baseURL: "http://ingress-nginx-srv",
      headers: req.headers,
    });
  } else {
    // we must be on the browser
    return axios.create({
      baseURL: "/",
    });
  }
};
