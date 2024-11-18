import { createRoot } from "react-dom/client";
import "react-loading-skeleton/dist/skeleton.css";
import App from "@client/App";

const container = document.getElementById("react-root");

container
  ? createRoot(container).render(<App />)
  : (() => {
      throw new Error("react의 root 컨테이너가 없습니다");
    })();
