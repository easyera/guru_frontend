import Styles from "./aboutus.module.css";
import quotes from "../../assets/img/testimonials.png";

function Aboutus() {
  return (
    <div className={Styles.container}>
      <div className={Styles.aboutus}>
        <h1 className={Styles.heading}>About Gurunathan</h1>
        <div className={Styles.content}>
          <div className={Styles.quotes}> <img src={quotes} alt="quotes" /> </div>
          <div className={Styles.discription}>
            Gurunathan connects mentors and mentees for skill sharing. Users can
            ask questions, join discussions, and access tailored resources.
            Empowering individuals through knowledge exchange, Gurunathan
            fosters a supportive learning community. Join us to discover, share,
            and grow.
          </div>
          <div className={Styles.quotes}> <img src={quotes} alt="quotes" /> </div>
        </div>
      </div>
    </div>
  );
}

export default Aboutus;
