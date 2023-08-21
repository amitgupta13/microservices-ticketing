import { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signin",
    method: "post",
    body: { email, password },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = async (e) => {
    e.preventDefault("");
    doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign In</h1>
      <div className="form-group m-1">
        <label>Email Address</label>
        <input
          type="text"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className="form-control"
        />
      </div>
      <div className="form-group m-1">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </div>
      {errors}
      <button className="btn btn-primary m-1">Sign In</button>
    </form>
  );
}
