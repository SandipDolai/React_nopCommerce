import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Zoom, Navigation } from 'swiper/modules';
import { Swiper as SwiperClass } from 'swiper/types';
import { Box } from '@mui/material';
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';
import 'swiper/css/navigation';

interface PictureModel {
    ImageUrl: string;
    ThumbImageUrl: string;
    Title: string;
    AlternateText: string;
    FullSizeImageUrl: string;
}

interface Props {
    images: PictureModel[];
    initialSlideFullSizeImageUrl?: string;
}

export default function ProductImageGallery({ images, initialSlideFullSizeImageUrl }: Props) {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
    const mainSwiperRef = useRef<SwiperClass | null>(null);

    // Effect to control the main Swiper's slide based on initialSlideFullSizeImageUrl
    useEffect(() => {
        if (initialSlideFullSizeImageUrl && mainSwiperRef.current && images.length > 0) {
            const indexToSet = images.findIndex(img => img.FullSizeImageUrl === initialSlideFullSizeImageUrl);
            if (indexToSet !== -1 && mainSwiperRef.current.activeIndex !== indexToSet) {
                // Use `slideToLoop` if you have `loop={true}` on your Swiper, otherwise `slideTo`
                mainSwiperRef.current.slideTo(indexToSet);
            }
        }
    }, [initialSlideFullSizeImageUrl, images]); // Re-run if initialSlideFullSizeImageUrl or images change

    return (
        <Box sx={{ position: 'relative' }}>
            {/* Main Gallery */}
            <Swiper
                onSwiper={(swiper) => { mainSwiperRef.current = swiper; }} // Get instance
                style={{ width: '100%', height: '500px' }}
                spaceBetween={10}
                navigation={false}
                zoom
                modules={[Thumbs, Zoom, Navigation]}
                // Pass thumbsSwiper for synchronization
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            >
                {images.map((img, index) => (
                    <SwiperSlide key={index}>
                        <div
                            className="swiper-zoom-container"
                            style={{ position: 'relative', width: '100%', height: '500px' }}
                        >
                            <img
                                src={img.FullSizeImageUrl}
                                alt={img.AlternateText}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                    color: '#fff',
                                    opacity: 0,
                                    transition: 'opacity 0.3s',
                                    textAlign: 'center',
                                    p: 1,
                                    '&:hover': {
                                        opacity: 1,
                                    },
                                }}
                            >
                                {img.AlternateText}
                            </Box>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Thumbnails */}
            <Swiper
                onSwiper={(swiper) => setThumbsSwiper(swiper)}
                spaceBetween={18}
                slidesPerView={5.2}
                modules={[Thumbs]}
                style={{ marginTop: 10 }}
            >
                {images.map((img, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={img.ThumbImageUrl} // Use ThumbImageUrl for thumbnails
                            alt={img.AlternateText}
                            style={{
                                width: '100px',
                                height: '100px',
                                objectFit: 'contain',
                                borderRadius: 0,
                                cursor: 'pointer', // Still indicate clickable
                                // REMOVE THIS LINE TO STOP HIGHLIGHTING:
                                // border: `2px solid ${mainSwiperRef.current?.activeIndex === index ? 'blue' : 'transparent'}`,
                                // transition: 'border-color 0.2s ease-in-out',
                            }}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    );
}