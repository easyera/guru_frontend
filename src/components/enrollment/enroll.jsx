import Styles from "./enroll.module.css";
import { useNavigate } from "react-router-dom";

function Enroll() {
  const navigate = useNavigate();

  const redirecttopath = (path) => {
    navigate(path);
  }
  return (
    <div className={Styles.container}>
      <div className={Styles.enroll}>
        <h1 className={Styles.enroll_heading}>enroll now</h1>
        <div className={Styles.enroll_cards}>
          <div className={Styles.card}>
            <div>
            <h1 className={Styles.card_heading}>Mentee</h1>
            <ul className={Styles.card_ul}>
                <li>Receive expert advice and continuous support.</li>
                <li>Learn new skills and achieve goals.</li>
                <li> Connect with industry experts and engage in the community</li>
                <li>Accelerate your career and build confidence.</li>
            </ul>
            </div>
            <button className={Styles.card_btn} onClick={() => redirecttopath("/login/mentee")}>Join as Mentee</button>
          </div>
          <div className={Styles.card}>
            <div>
            <h1 className={Styles.card_heading}>Mentor</h1>
            <ul className={Styles.card_ul}>
                <li>Impact others and gain recognition.</li>
                <li>Develop leadership and communication skills.</li>
                <li>Connect and collaborate with professionals.</li>
                <li>Experience satisfaction and inspire others.</li>
            </ul>
            </div>
            <button className={Styles.card_btn} onClick={() => redirecttopath("/login/mentor")}>Join as Mentor</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Enroll;
