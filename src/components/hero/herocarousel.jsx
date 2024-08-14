/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Styles from "./herocarousel.module.css";
import arrow from "../../assets/img/carousel_arrow.svg";
import hero1 from "../../assets/img/hero_img1.png";
import hero2 from "../../assets/img/hero_img2.png";

function Herocarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 2;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  return (
    <div className={Styles.herocarousel}>
      <div className={Styles.slides}>
        <div
          className={`${Styles.slide} ${
            currentSlide === 0 ? Styles.active : ""
          }`}
        >
          <div className={Styles.slide_content}>
            <h1 className={Styles.slide_title}>
              Empower Your Journey with Gurunatha: Personalized Mentorship
            </h1>
            <p className={Styles.slide_text}>
              Connect with experienced mentors to achieve your personal and
              professional goals
            </p>
          </div>
          <div className={Styles.slide_image}>
            <img src={hero1} alt="img1" />
          </div>
        </div>
        <div
          className={`${Styles.slide} ${
            currentSlide === 1 ? Styles.active : ""
          }`}
        >
          <div className={Styles.slide_content}>
            <h1 className={Styles.slide_title}>
              Skill Up with Gurunatha: Community for Growth
            </h1>
            <p className={Styles.slide_text}>
              Mentors and mentees unite to focus on skill growth and
              development.
            </p>
          </div>
          <div className={Styles.slide_image}>
            <img src={hero2} alt="img2" />
          </div>
        </div>
      </div>
      <div className={Styles.carousel_items}>
        <img
          src={arrow}
          alt="carousel arrow"
          className={Styles.prev_arrow}
          onClick={prevSlide}
        />
        <img
          src={arrow}
          alt="carousel arrow"
          className={Styles.next_arrow}
          onClick={nextSlide}
        />
        <div className={Styles.carousel_indicator}>
          <span
            className={currentSlide === 0 ? Styles.active : ""}
            onClick={() => setCurrentSlide(0)}
          ></span>
          <span
            className={currentSlide === 1 ? Styles.active : ""}
            onClick={() => setCurrentSlide(1)}
          ></span>
        </div>
      </div>
    </div>
  );
}

export default Herocarousel;
