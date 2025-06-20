import NivoSlider from "./NivoSlider";
import HomePageProducts from "./HomePageProducts";
// import { Container } from '@mui/material';
import NewArrivalProductList from "./NewArrivalProductList";
import BestSellers from "./BestSellers";
//import Vote from "./Vote";

export default function HomePage() {
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
}
