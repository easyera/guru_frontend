/* eslint-disable no-unused-vars */
import Styles from "./footer.module.css";

function Footer() {
  return (
    <div className={Styles.container}>
      <div className={Styles.footer_content}>
        <h1 className={Styles.footer_title}>Gurunatha</h1>
        <p className={Styles.footer_text}>
          Gurunatha connects mentors and mentees worldwide for skill sharing and
          mentorship. Join our community to learn, share, and achieve your goals
          together.
        </p>
        <ul className={Styles.social_links}>
          <li>Fb</li>
          <li>Twitter</li>
          <li>Instagram</li>
        </ul>
      </div>

      <div className={Styles.footer_end}>
        <p className={Styles.end_text}>
          <span className={Styles.copyright}>Copyright © 2022.</span> All Rights
          Reserved.
        </p>
        <ul className={Styles.footer_links}>
          <li> <a href="/">Privacy Policy</a> </li>
          <li><a href="/">Terms & Conditions</a></li>
          <li><a href="/">Sitemap</a></li>
        </ul>
      </div>
    </div>
  )
}

export default Footer