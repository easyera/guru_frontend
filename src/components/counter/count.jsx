import Styles from "./count.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChalkboardUser,
  faGraduationCap,
  faBook
} from "@fortawesome/free-solid-svg-icons";

const Count = () => {
  return (
    <div className={Styles.container}>
      <div className={Styles.Count}>
        <div className={Styles.Count_card}>
          <FontAwesomeIcon icon={faChalkboardUser} className={Styles.icon} />
          <div className={Styles.Count_content}>
            <h1 className={Styles.number}>975+</h1>
            <h5 className={Styles.title}>Mentor</h5>
          </div>
        </div>
        <div className={Styles.Count_card}>
          <FontAwesomeIcon icon={faGraduationCap} className={Styles.icon} />
          <div className={Styles.Count_content}>
            <h1 className={Styles.number}>975+</h1>
            <h5 className={Styles.title}>Mentee</h5>
          </div>
        </div>
        <div className={Styles.Count_card}>
        <FontAwesomeIcon icon={faBook} className={Styles.icon} />
          <div className={Styles.Count_content}>
            <h1 className={Styles.number}>975+</h1>
            <h5 className={Styles.title}>Courses</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Count;
