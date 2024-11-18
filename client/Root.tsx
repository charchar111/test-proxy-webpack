import Com1222 from "@public/image/com1222";
import "@client/asset/styles/app.css";
import "@client/asset/styles/app2.scss";
import { useState } from "react";
import example1 from "@client/asset/data/json/example1.json";
import ImageLoader from "components/imageLoader";
import SVGLoader from "components/SVGLoader";
import FontLoader from "components/FontLoader";
import { Link, Outlet } from "react-router-dom";
import APIRequester from "components/APIRequester";

function Root() {
  const [openImg, setOpenImg] = useState(false);
  const [openSvg, setOpenSvg] = useState(false);
  return (
    <div>
      <button onClick={() => setOpenImg((prev) => !prev)}>
        open ImageLoader
      </button>
      <button onClick={() => setOpenSvg((prev) => !prev)}>
        open SVGLoader
      </button>
      hello
      {!openImg ? null : <ImageLoader />}
      {!openSvg ? null : <SVGLoader />}
      <FontLoader />
      <Link to={`about`}>About</Link>
      <APIRequester
        srcset={[
          {
            url: "/getjson",

            ui: "proxy1 => local:5000",
          },
          {
            url: "/getjson2",

            ui: "proxy2 =>local:5000",
          },
          {
            url: "http://localhost:5000/getjson",

            ui: "no proxy => local:5000",
          },
          {
            url: "setAnotherCookie",

            ui: "set Another Cookie: dev.zetalux.co.kr",
          },
          {
            url: "/getjson3",

            ui: "no proxy error ",
          },
          {
            url: "/echo",

            ui: "proxy echo ",
          },
          {
            url: "http://echo.jsontest.com/echo",

            ui: "no proxy echo",
          },
        ]}
      />
      <Outlet />
    </div>
  );
}

export default Root;
