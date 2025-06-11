'use client'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider, { CustomArrowProps, Settings } from "react-slick";
import { Box, Button, Divider } from "@mui/material";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import Link from "next/link";

interface IPops {
    data: ITrackTop[],
    title: string
}

const MainSlider = (props: IPops) => {
    const { data, title } = props;

    console.log('>> check data: ', props.data)
    const NextArrow = (props: CustomArrowProps) => {
        return (
            <Button
                color="inherit"
                variant='contained'
                onClick={props.onClick}
                sx={{
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

    const PrevArrow = (props: CustomArrowProps) => {
        return (
            <Button
                color="inherit"
                variant='contained'
                onClick={props.onClick}
                sx={{
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
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    return (
        <Box
            sx={{
                paddingX: '24px',
                ".track-container": {
                    width: '160px !important',
                },
                ".slick-slide": {
                    textAlign: "center",
                },
                ".slick-track": {
                    marginLeft: 0,
                }
            }}
        >
            <h2 className="text-2xl font-medium">{title}</h2>

            <Slider {...settings} className="pt-4">
                {data.map((track, index) => (
                    <div className="track-container" key={track._id}>
                        <div className="track-main">
                            <div className="track-image w-full cursor-pointer">
                                <img
                                    className="w-full"
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
                                />
                            </div>

                            <div className="track-footer mt-3 text-start select-text">
                                <div className="track-title overflow-hidden whitespace-nowrap text-ellipsis">
                                    <Link href={`/track/${track._id}?audio=${track.trackUrl}`}>
                                        <span className="text-sm font-light">{track.title}</span>
                                    </Link>
                                </div>
                                <div className="track-artist overflow-hidden whitespace-nowrap text-ellipsis">
                                    <span className="text-gray-400 text-xs cursor-pointer">{track.category} {index}</span>
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