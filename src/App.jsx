import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Research from './components/Research.jsx';
import Hobbies from './components/Hobbies.jsx';
import Strengths from './components/Strengths.jsx';
import Contact from './components/Contact.jsx';
import TargetCursor from './components/TargetCursor.jsx';

export default function App() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Research />
        <Hobbies />
        <Strengths />
      </main>
      <Contact />

      {/* 鼠标跟随准星：portal 到 body，用 difference 混合自适应深浅底色。
          cursorColorOnTarget 取站点自己的古铜金 --gold，和整体配色一致。 */}
      <TargetCursor
        targetSelector=".cursor-target"
        spinDuration={2}
        hideDefaultCursor
        hoverDuration={0.2}
        parallaxOn
        cursorColor="#ffffff"
        cursorColorOnTarget="#b8a27d"
      />
    </>
  );
}
