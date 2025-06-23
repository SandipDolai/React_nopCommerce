import NivoSlider from "./NivoSlider";
import HomePageProducts from "./HomePageProducts";
// import { Container } from '@mui/material';
import NewArrivalProductList from "./NewArrivalProductList";
import BestSellers from "./BestSellers";
import React from "react";
//import Vote from "./Vote";

//export default function HomePage() {
const HomePage: React.FC = React.memo(() => {
  console.log("HomePage rendered");
  return (
    // <Container maxWidth="lg">
    <>
      <NivoSlider />
      {/* <SearchComponent /> */}
      <HomePageProducts />
      <BestSellers />
      <NewArrivalProductList />
      {/* <Vote /> */}
      <br />
    </>
    // </Container>
  );
});

export default HomePage;
