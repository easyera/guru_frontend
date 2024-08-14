/* eslint-disable react/no-unescaped-entities */
import Styles from "./how.module.css";

function How() {
  return (
    <div className={Styles.container}>
      <div className={Styles.how}>
        <div className={Styles.how_head}>
          <h1 className={Styles.how_title}>How Does it Work?</h1>
          <p className={Styles.how_dis}>
            Gain insights and strategies to advance your career.
          </p>
        </div>
        <ol className={Styles.how_list}>
          <li>
            <span className={Styles.marker}>1</span>
            Register as a mentor or mentee and complete your profile with
            relevant information and goals.
          </li>
          <li>
            <span className={Styles.marker}>2</span>
            Use our platform to search for mentors or mentees based on skills,
            interests, and expertise.
          </li>
          <li>
            <span className={Styles.marker}>3</span>
            Schedule sessions, ask questions, and participate in discussions to
            gain knowledge and insights.
          </li>
          <li>
            <span className={Styles.marker}>4</span>
            Set milestones, receive feedback, and monitor your progress to
            achieve personal and professional growth.
          </li>
        </ol>
      </div>
    </div>
  );
}

export default How;
