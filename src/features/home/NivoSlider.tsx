import { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import { Skeleton } from '@mui/material';
import NopApi from "../../app/api/ThemeContext/NopApi";

interface GalleryItem {
  PictureUrl: string;
  Link: string;
}

export default function NivoSlider() {
  const [galleryData, setGalleryData] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await NopApi.Home.NivoSlider({ StoreId: 0 });
        setGalleryData(response.gallery || []);
      } catch (error) {
        console.error('Error fetching NivoSlider data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home_banner_slider">
      {loading ? (
        <Skeleton variant="rectangular" height={820} width="100%" />
      ) : (
        <Carousel fade indicators={false}>
          {galleryData.map((item, index) => (
            <Carousel.Item key={index}>
              <a href={item.Link} target="_blank" rel="noopener noreferrer">
                <img
                  className="d-block w-100"
                  src={item.PictureUrl}
                  alt={`Slide ${index + 1}`}
                  loading="lazy"
                />
              </a>
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </div>
  );
}
