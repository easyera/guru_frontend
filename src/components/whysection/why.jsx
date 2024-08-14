/* eslint-disable react/no-unescaped-entities */
import Styles from "./why.module.css";
import vision from "../../assets/img/vision_logo.png";
import core from "../../assets/img/core_logo.png";
import community from "../../assets/img/Community_logo.png";

function Why() {
  return (
    <div className={Styles.container}>
      <div className={Styles.why_container}>
        <h1 className={Styles.title}>About Gurunatha.</h1>
        <div className={Styles.card_container}>
          <div className={Styles.cards}>
            <img className={Styles.cards_img} src={vision} alt="vision"></img>
            <h1 className={Styles.cards_heading}>Our Vision</h1>
            <p className={Styles.cards_para}>
              Gurunatha connects mentors and mentees globally, fostering
              skill-sharing and personal development opportunities.
            </p>
          </div>
          <div className={Styles.cards}>
            <img className={Styles.cards_img} src={core} alt="core"></img>
            <h1 className={Styles.cards_heading}>Core Values</h1>
            <p className={Styles.cards_para}>
              Inclusivity, collaboration, and continuous learning drive Gurunatha's
              supportive community of mentors and mentees.
            </p>
          </div>
          <div className={Styles.cards}>
            <img className={Styles.cards_img} src={community} alt="community"></img>
            <h1 className={Styles.cards_heading}>Impact</h1>
            <p className={Styles.cards_para}>
              Gurunatha empowers through mentorship, turning aspirations into
              achievements in a thriving environment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Why;
