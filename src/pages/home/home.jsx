import Header from "../../components/header/header"
import Herocarousel from "../../components/hero/herocarousel"
import Aboutus from "../../components/Aboutus/aboutus"
import Enroll from "../../components/enrollment/enroll"
import Testimonials from "../../components/testimonials/testimonials"
import Footer from "../../components/footer/footer"
import Howcard from "../../components/howcard/howcard"
import Count from "../../components/counter/count"
import styles from "./home.module.css"

function Home() {
  return (
    <div className={styles.home}>
      <Header/>
      <Herocarousel/>
      <Howcard/>
      <Aboutus/>
      <Enroll/>
      <Count/>
      <Testimonials/>
      <Footer/>
    </div>
  )
}

export default Home