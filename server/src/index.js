const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;
const crypto = require("crypto");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// app.use(cors());

app.get("/getjson", (req, res) => {
  const responseData = {
    message: "Hello, world!",
    success: true,
    data: [1, 2, 3, 4],
    // random: Math.random() > 0.6 ? true : false,
  };

  console.log("쿠키1", req.cookies.myCookie1);
  if (!req.cookies.myCookie1)
    res.cookie("myCookie1", new Date().getHours(), {
      maxAge: 7200000,
      httpOnly: true,
    }); // 1시간 유지
  res.status(200).json(responseData);
  console.log("요청 수신1");
});

app.get("/getjson2", (req, res) => {
  const responseData = {
    message: "bye, world!",
    success: true,
    data: [12, 22, 32, 42],
    // random: Math.random() > 0.6 ? true : false,
  };

  console.log("요청 수신2");
  console.log("쿠키2", req.cookies);
  if (!req.cookies.myCookie2)
    res.cookie("myCookie2", new Date().getHours(), {
      maxAge: 7200000,
      httpOnly: true,
    }); // 1시간 유지
  res.json(responseData);
});

app.get("/setAnotherCookie", (req, res) => {
  const responseData = {
    message: "cookie, set!",
    success: true,
    data: [12, 22, 32, 42],
    // random: Math.random() > 0.6 ? true : false,
  };

  console.log("요청 수신 setAnotherCookie");
  console.log("쿠키3", req.cookies);
  if (req.cookies) {
    Object.entries(req.cookies).forEach((el, idx) => {
      res.cookie(el[0], el[1], {
        maxAge: 7200000,
        httpOnly: true,
        domain: "dev.zetalux.co.kr",
      }); // 1시간 유지
    });
  }

  res.json(responseData);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
