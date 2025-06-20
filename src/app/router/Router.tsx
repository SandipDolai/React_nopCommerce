import { createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import ServerError from "../errors/ServerError";

import CheckOutPage from "../../features/checkout/CheckOutPage";
//import Register from "../../features/account/Register";
//import Login from "../../features/account/Login";


//import GetProductByCategory from "../../features/catalog/GetProductByCategory";
//import NopProductDetail from "../../features/catalog/NopProductDetail";
import NopRegister from "../../features/account/NopRegister";
import Noplogin from "../../features/account/Noplogin";
import NopCart from "../../features/basket/NopCart";
import NopWishList from "../../features/basket/NopWishList";
import AdvancedSearch from "../layout/AdvancedSearch";
import OrderConformation from "../../features/order/OrderConformation";
import NewAddress from "../../features/profile/NewAddress";
import OrderHistory from "../../features/order/OrderHistory";
import OrderDetails from "../../features/order/OrderDetails";
import Info from "../../features/profile/Info";
import Address from "../../features/profile/Address";

import ForgetPassword from "../../features/account/ForgotPassword";
import DynamicRouteHandler from "./DynamicRouteHandler";
import CustomerLayout from "../layout/CustomerLayout";
import ContactUs from "../../features/contact/ContactUs";
import ManufacturersList from "../../features/Manufacturers/ManufacturersList";
import SideLayout from "../layout/SideLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // {
      //   element: <RequireAuth />, children: [
      //     { path: "checkout", element: <CheckOutPage /> },
      //   ]
      // },
      { path: "", element: <HomePage /> },

      //{ path: "getProductByCategory/:subCategoryId", element: <GetProductByCategory /> },
      // { path: ":seName", element: <DynamicRouteHandler /> },

      //{ path: "getCategory/:subCategoryId", element: <GetCategory /> },
      //{ path: "nopProductDetail/:id", element: <NopProductDetail /> },
      { path: "advancedSearch", element: <AdvancedSearch /> },///advancedSearch?query=${productName}

      {
        element: <SideLayout />,
        children: [
          { path: "manufacturer/all", element: <ManufacturersList /> },
        ],
      },
      {
        path: ":seName",
        element: <DynamicRouteHandler />,
      },



      { path: "server-error", element: <ServerError /> },
      { path: "cart", element: <NopCart /> },
      { path: "orderconfirmation", element: <OrderConformation /> },
      { path: "wishlist", element: <NopWishList /> },
      // { path: "Table1", element: <Table1 /> },
      //{ path: "login", element: <Login /> },
      { path: "login", element: <Noplogin /> },
      { path: "passwordrecovery", element: <ForgetPassword /> },

      { path: "register", element: <NopRegister /> },
      //{ path: "register", element: <Register /> },
      { path: "onepagecheckout", element: <CheckOutPage /> },
      { path: "addressadd", element: <NewAddress /> },
      //{ path: "orderhistory", element: <OrderHistory /> },
      { path: "orderdetails", element: <OrderDetails /> },
      //{ path: "info", element: <Info /> },
      { path: "addresses", element: <Address /> },
      { path: "contactus", element: <ContactUs /> },

      //{ path: '*', element: <Navigate replace to='/not-found' /> }

      {
        path: "customer",
        element: <CustomerLayout />,
        children: [
          { path: "info", element: <Info /> },
          { path: "addresses", element: <Address /> },
        ]
      },
      {
        path: "order",
        element: <CustomerLayout />,
        children: [
          { path: "history", element: <OrderHistory /> }
        ]
      }

    ],
  },
]);
