import Styles from "./howcard.module.css"
function Howcard() {
    return (
        <section className={Styles.how_it_works}>
          <h1>How Gurunatha works?</h1>
          <p>To learn more about how this platform works, see the below steps for more information.</p>
          <div className={Styles.steps}>
            <div className={Styles.step}>
              <div className={Styles.step_icon}>1</div>
              <h3>Create your Account</h3>
              <p>Consistent Latin fill placeholder text with a realistic text appearance.</p>
            </div>
            <div className={Styles.arrow}>→</div>
            <div className={Styles.step}>
              <div className={Styles.step_icon}>2</div>
              <h3>Setup your Account</h3>
              <p>Consistent Latin fill placeholder text with a realistic text appearance.</p>
            </div>
            <div className={Styles.arrow}>→</div>
            <div className={Styles.step}>
              <div className={Styles.step_icon}>3</div>
              <h3>Start creating with Horizon</h3>
              <p>Consistent Latin fill placeholder text with a realistic text appearance.</p>
            </div>
          </div>
        </section>
      );
}

export default Howcard