/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import { Avatar, Rate, Card, Modal } from "antd";
import { useState } from "react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import _ from "lodash";
import { useSelector } from "react-redux";

const CustomerReview = ({ customerReview }) => {
  const [view, setView] = useState("");
  const { fourthColor } = useSelector((state) => state.auth);
  return (
    <div className="w-screen lg:min-h-[50vh] lg:center_div justify-start  items-start lg:pt-10 pt-4">
      <div className="lg:text-6xl font-bold  text-left w-screen text-light_gray px-4 pb-5">
        <h1 className="ultraSm:text-xl lg:text-4xl text-black" style={{ color: fourthColor }}>
          Customer's Review
        </h1>
        <div className="w-[30px] lg:h-[40px]  h-[5px] ultraSm:bg-[#DF9300] lg:hidden xl:hidden 2xl:hidden md:hidden rounded-2xl "></div>
      </div>
      <Swiper
        slidesPerView={1}
        centeredSlides={false}
        slidesPerGroupSkip={1}
        grabCursor={true}
        modules={[Autoplay, Pagination]}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 1000,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          1024: {
            slidesPerView: 3,
          },
        }}
        loop={true}
        spaceBetween={30}
        className="mySwiper w-screen center_div"
      >
        {customerReview.map((res, index) => {
          return (
            <SwiperSlide
              key={index}
              className=" lg:py-10 w-screen pl-[20px] px-4"
            >
              <Card
                hoverable
                className="lg:w-[30vw] lg:p-4 w-[90vw]  rounded-2xl shadow-xl overflow-hidden  ultraSm:h-[200px] md:h-[350px] lg:h-[350px] xl:h-[350px] 2xl:h-[350px]"
              >
                <Card.Meta
                  avatar={
                    _.get(res, "userRef.user_image", "") ? (
                      <div className="avatar">
                        <div className="ultraSm:w-16 md:w-24 lg:w-24 xl:w-24 2xl:w-24 rounded-full">
                          <img src={_.get(res, "userRef.user_image", "")} />
                        </div>
                      </div>
                    ) : (
                      <Avatar className="lg:w-[50px] lg:h-[50px] w-[30px] h-[30px] rounded-full uppercase center_div">
                        {_.get(res, "userRef.user", "").split("")[0]}
                      </Avatar>
                    )
                  }
                  title={
                    <p className="font-bold ultraSm:text-sm lg:text-2xl capitalize mt-3 ">
                      {_.get(res, "userRef.user", "")}
                    </p>
                  }
                  description={
                    <Rate
                      value={Number(res.ratings)}
                      disabled
                      className="lg:text-md ultraSm:text-sm lg:text-lg"
                    />
                  }
                />
                <div className="px-3 my-1">
                  <p className="ultraSm:text-sm lg:text-lg text-start leading-loose text-black/60 font-sans">
                    {_.get(res, "message", "").slice(0, 160)}
                    &nbsp;
                    <span
                      onClick={() => {
                        setView(res.message);
                      }}
                      className="text-black/75 ultraSm:text-sm lg:text-lg font-extrabold hover:text-black"
                    >
                      {_.get(res, "message", "").length > 150
                        ? "  view more"
                        : ""}
                    </span> 
                  </p>
                </div>
              </Card>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <Modal
        open={view}
        onCancel={() => {
          setView("");
        }}
        footer={false}
        closable={false}
        className="!bg-white !rounded-lg"
      >
        <p className="lg:text-md text-sm text-justify leading-loose pt-4 indent-8">
          {view}
        </p>
      </Modal>
    </div>
  );
};

export default CustomerReview;
