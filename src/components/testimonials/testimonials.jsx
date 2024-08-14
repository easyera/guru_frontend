import Styles from "./testimonials.module.css";
import quotes from "../../assets/img/testimonials.png";

function Testimonials() {
  return (
    <div className={Styles.container}>
      <div className={Styles.testimonials_container}>
        <h1 className={Styles.testimonials_title}>Testimonials</h1>
        <div className={Styles.testimonials_cards}>
          <div className={Styles.cards}>
            <img className={Styles.cards_img} src={quotes} alt="quotes" />
              <p className={Styles.cards_text}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa
                repellat placeat, non dignissimos voluptatibus iusto!
              </p>
            <div className={Styles.user}>
                <h3>James</h3>
                <p>Plumer</p>
            </div>  
          </div>
          <div className={Styles.cards}>
            <img className={Styles.cards_img} src={quotes} alt="quotes" />
              <p className={Styles.cards_text}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa
                repellat placeat, non dignissimos voluptatibus iusto!
              </p>
            <div className={Styles.user}>
                <h3>James</h3>
                <p>Plumer</p>
            </div>  
          </div>
          <div className={Styles.cards}>
            <img className={Styles.cards_img} src={quotes} alt="quotes" />
              <p className={Styles.cards_text}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa
                repellat placeat, non dignissimos voluptatibus iusto!
              </p>
            <div className={Styles.user}>
                <h3>James</h3>
                <p>Plumer</p>
            </div>  
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimonials;
