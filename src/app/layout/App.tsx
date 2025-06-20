

import Header from "./Header";
import {
  Container,
  CssBaseline,
  // ThemeProvider,
  // createTheme,
} from "@mui/material";

import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
//import { useStoreContext } from "../context/StoreContext";


import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { CategoryProvider } from "../context/CategoryProvider";
import Footer from "./Footer";



function App() {
  // const { setBasket } = useStoreContext();
  // const dispatch = useAppDispatch();
  // const [loading, setLoading] = useState(true);
  // const initApp = useCallback(async () => {
  //   try {
  //     await dispatch(fetchCurrentUser());

  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, [dispatch])

  // useEffect(() => {
  //   // const buyerId = getCookie('buyerId');
  //   // dispatch(fetchCurrentUser());
  //   // if (buyerId) {
  //   //   agent.Basket.get()
  //   //     // .then(basket => setBasket(basket))
  //   //     .then(basket => dispatch(setBasket(basket)))
  //   //     .catch(error => console.log(error))
  //   //     .finally(() => setLoading(false));
  //   // } else {
  //   //   setLoading(false);
  //   // }

  //   initApp().then(() => setLoading(false));

  // }, [initApp])
  //}, [setBasket])
  // }, [dispatch])


  // const [darkmode, setDarkMode] = useState(false);
  // const paletteType = darkmode ? "dark" : "light";
  // const theme = createTheme({
  //   palette: {
  //     mode: paletteType,
  //     background: {
  //       default: paletteType === "light" ? "#fff" : "#121212",
  //     },
  //   },
  // });
  // function handleThemeChange() {
  //   setDarkMode(!darkmode);
  // }
  //if (loading) return <LoadingComponent message="Initialising app...." />
  return (
    <CategoryProvider>
      <AuthProvider>
        <CartProvider>
          {/* <ThemeProvider theme={theme}> */}
          <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
          <CssBaseline />
          {/* <Header darkmode={darkmode} handleThemeChange={handleThemeChange} /> */}
          <Header />
          <Container maxWidth="lg">
            <Outlet />
          </Container>
          {/* </ThemeProvider> */}

          <Footer />
        </CartProvider>
      </AuthProvider >
    </CategoryProvider>
  );
}

export default App;
