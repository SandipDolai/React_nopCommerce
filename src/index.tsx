//import React from "react";
import ReactDOM from "react-dom/client";

import "./app/layout/styles.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router/Router.tsx";
//import { StoreProvider } from "./app/context/StoreContext.tsx";
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';
import 'swiper/css/navigation';


//import { fetchProductsAsync } from "./features/catalog/catalogSlice.ts";
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

//store.dispatch(fetchProductsAsync());
//ReactDOM.createRoot(document.getElementById("root")!).render(
root.render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>
);
