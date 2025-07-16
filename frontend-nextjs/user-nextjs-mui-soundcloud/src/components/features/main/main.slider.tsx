'use client'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider, { CustomArrowProps, Settings } from "react-slick";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import NavigateNext from "@mui/icons-material/NavigateNext";
import NavigateBefore from "@mui/icons-material/NavigateBefore";
import Link from "next/link";
import { convertSlugUrl } from "@/lib/utils/api";
import Image from "next/image";
import { useState } from "react";

interface IPops {
    data: ITrackTop[],
    title: string,
    totalElement: number;
}

const MainSlider = (props: IPops) => {
    const { data, title, totalElement: totalSlides } = props;
    const [currentSlide, setCurrentSlide] = useState(0);

    const NextArrow = (props: CustomArrowProps & { isDisabled: boolean }) => {
        return (
            <Button
                color="inherit"
                variant='contained'
                onClick={props.onClick}
                sx={{
                    display: props.isDisabled ? 'none' : 'inline-flex',
                    position: "absolute",
                    right: 0,
                    top: "30%",
                    zIndex: 2,
                    minWidth: 30,
                    width: 35,
                    borderRadius: "50%",
                }}
            >
                <NavigateNext />
            </Button>
        )
    }

    const PrevArrow = (props: CustomArrowProps & { isDisabled: boolean }) => {
        return (
            <Button
                color="inherit"
                variant='contained'
                onClick={props.onClick}
                sx={{
                    display: props.isDisabled ? 'none' : 'inline-flex',
                    position: "absolute",
                    top: "30%",
                    zIndex: 2,
                    minWidth: 30,
                    width: 35,
                    borderRadius: "50%",
                }}
            >
                <NavigateBefore />
            </Button>
        )
    }

    const settings: Settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 5,
        nextArrow: <NextArrow isDisabled={currentSlide >= totalSlides - 5} />,
        prevArrow: <PrevArrow isDisabled={currentSlide === 0} />,
        afterChange: (index) => setCurrentSlide(index),

        responsive: [
            {
                breakpoint: 875,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    nextArrow: <NextArrow isDisabled={currentSlide >= totalSlides - 4} />,
                }
            },
            {
                breakpoint: 700,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    initialSlide: 3,
                    nextArrow: <NextArrow isDisabled={currentSlide >= totalSlides - 3} />,
                }
            },
            {
                breakpoint: 500,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    nextArrow: <NextArrow isDisabled={currentSlide >= totalSlides - 2} />,
                }
            }
        ]
    };

    return (
        <Box
            sx={{
                ".slick-track": {
                    marginLeft: 0,
                    display: 'flex',
                    gap: '20px',
                },
            }}
        >
            <h2 className="text-2xl font-medium">{title}</h2>

            <Slider {...settings} className="pt-4">
                {data.map((track, index) => (
                    <div className="track-container" key={track._id}>
                        <div className="track-main">
                            <Link href={`/track/${convertSlugUrl(track.title)}-${track._id}.html?audio=${track.trackUrl}`}>
                                <div className="track-image w-full cursor-pointer">
                                    <div className="relative h-[160px] w-full">
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
                                            alt="track image"
                                            fill
                                            sizes="(min-width: 808px) 50vw, 100vw"
                                            style={{
                                                objectFit: 'contain', // cover, contain, none
                                            }}
                                        />
                                    </div>
                                </div>
                            </Link>

                            <div className="track-footer mt-1 text-center select-text">
                                <Link href={`/track/${convertSlugUrl(track.title)}-${track._id}.html?audio=${track.trackUrl}`}>
                                    <div className="track-title overflow-hidden whitespace-nowrap text-ellipsis">
                                        <span className="text-sm font-light">{track.title}</span>
                                    </div>
                                </Link>

                                <div className="track-artist overflow-hidden whitespace-nowrap text-ellipsis">
                                    <span className="text-gray-400 text-xs">{track.uploader.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

            </Slider>
            <Divider />
        </Box>
    );
}

export default MainSlider;