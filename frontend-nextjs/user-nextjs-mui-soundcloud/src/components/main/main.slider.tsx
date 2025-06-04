'use client'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider, { Settings } from "react-slick";
import { Box, Button, Divider, Grid, Stack } from "@mui/material";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";

const MainSlider = () => {
    const NextArrow = (props: any) => {
        return (
            <Button variant='outlined' onClick={props.onClick}
                sx={{
                    position: "absolute",
                    right: 0,
                    top: "50%",
                    zIndex: 2,
                    minWidth: 30,
                    width: 35,
                }}
            >
                <NavigateNext />
            </Button>
        )
    }

    const PrevArrow = (props: any) => {
        return (
            <Button variant='outlined' onClick={props.onClick}
                sx={{
                    position: "absolute",
                    top: "50%",
                    zIndex: 2,
                    minWidth: 30,
                    width: 35,
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
        <Stack
            spacing={5}
            sx={{
                paddingTop: '24px',
            }}
        >
            <Box
                sx={{
                    paddingX: '24px',
                    ".abc": {
                        padding: "0 10px",
                    },
                    "h3": {
                        border: "1px solid #ccc",
                        padding: "20px",
                        height: "200px",
                    }
                }}>
                <h2 className="text-2xl font-medium">Multiple tracks</h2>

                <Slider {...settings} className="pt-4">
                    <div className="abc">
                        <h3>Track 1</h3>
                    </div>
                    <div className="abc">
                        <h3>Track 2</h3>
                    </div>
                    <div className="abc">
                        <h3>Track 3</h3>
                    </div>
                    <div className="abc">
                        <h3>Track 4</h3>
                    </div>
                    <div className="abc">
                        <h3>Track 5</h3>
                    </div>
                    <div className="abc">
                        <h3>Track 6</h3>
                    </div>
                </Slider>
                <Divider sx={{ marginTop: 2 }} />
            </Box>
            <Box
                sx={{
                    paddingX: '24px',
                    ".abc": {
                        padding: "0 10px",
                    },
                    "h3": {
                        border: "1px solid #ccc",
                        padding: "20px",
                        height: "200px",
                    }
                }}>
                <h2 className="text-2xl font-medium">Multiple tracks</h2>

                <Slider {...settings} className="pt-4">
                    <div className="abc">
                        <h3>Track 1</h3>
                    </div>
                    <div className="abc">
                        <h3>Track 2</h3>
                    </div>
                    <div className="abc">
                        <h3>Track 3</h3>
                    </div>
                    <div className="abc">
                        <h3>Track 4</h3>
                    </div>
                    <div className="abc">
                        <h3>Track 5</h3>
                    </div>
                    <div className="abc">
                        <h3>Track 6</h3>
                    </div>
                </Slider>
                <Divider sx={{ marginTop: 2 }} />
            </Box>
            <Box
                sx={{
                    paddingX: '24px',
                    ".abc": {
                        padding: "0 10px",
                    },
                    "h3": {
                        border: "1px solid #ccc",
                        padding: "20px",
                        height: "200px",
                    }
                }}>
                <h2 className="text-2xl font-medium">Multiple tracks</h2>

                <Slider {...settings} className="pt-4">
                    <div className="abc">
                        <h3>Track 1</h3>
                    </div>
                    <div className="abc">
                        <h3>Track 2</h3>
                    </div>
                    <div className="abc">
                        <h3>Track 3</h3>
                    </div>
                    <div className="abc">
                        <h3>Track 4</h3>
                    </div>
                    <div className="abc">
                        <h3>Track 5</h3>
                    </div>
                    <div className="abc">
                        <h3>Track 6</h3>
                    </div>
                </Slider>
                <Divider sx={{ marginTop: 2 }} />
            </Box>
        </Stack>

    );
}

export default MainSlider;