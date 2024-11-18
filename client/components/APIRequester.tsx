import axios from "axios";
import React, { useState } from "react";

export default function APIRequester({
  srcset,
}: {
  srcset: { url: string; ui: string }[];
}) {
  const [api1, setApi1] = useState<{ loading: boolean; data: any; error: any }>(
    { loading: false, data: null, error: null }
  );

  console.log("res", api1);

  function handleApiCall(argUrl: string) {
    setApi1((prev) => ({ ...prev, loading: true }));
    axios(argUrl, { withCredentials: true })
      .then((res) => {
        console.log("success", res);

        setApi1((prev) => ({
          ...prev,
          data: res,
          error: null,
          loading: false,
        }));
      })
      .catch((rej) => {
        console.log("fail", rej);

        setApi1((prev) => ({
          ...prev,
          data: null,
          error: rej,
          loading: false,
        }));
      });
  }

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      APIRequester
      {srcset.map((el, idx) => (
        <button
          key={idx}
          style={{ fontFamily: "sans-serif" }}
          onClick={() => handleApiCall(el.url)}
        >
          {el.ui}
        </button>
      ))}
      <div>
        Response
        <div style={{ fontFamily: "sans-serif" }}>
          {" "}
          {api1.data ? JSON.stringify(api1.data.data) : ""}
        </div>
      </div>
    </div>
  );
}
