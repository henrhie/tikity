import { useEffect } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const Signout = () => {
  useEffect(() => {
    doRequest();
  }, []);

  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "get",
    body: {},
    onSuccess: () => {
      Router.push("/");
    },
  });

  return <div></div>;
};

export default Signout;
