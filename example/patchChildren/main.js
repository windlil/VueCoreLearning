import { createApp } from "../../dist/mini-vue.mjs";
import App from "./App.js";

const rootContainer = document.querySelector("#app");
createApp(App).mount(rootContainer);
