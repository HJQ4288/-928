import { hobbies } from '../data.js';
import Backdrop from './Backdrop.jsx';
import Reveal from './Reveal.jsx';

/**
 * 我的爱好：夹在「科研项目」与「个人优势」之间。
 * 背景直接复用首屏那一层（Backdrop），所以两处是同一张背景图 / 同一段视频。
 */
export default function Hobbies() {
  return (
    <section className="hobbies" id="hobbies">
      <Backdrop variant="center" />

      <div className="page hobbies-inner">
        <Reveal className="sec-head">
          <div>
            <p className="sec-eyebrow">Interests / 爱好</p>
            <h2 className="sec-title">我的爱好</h2>
          </div>
        </Reveal>

        <ul className="hobby-grid">
          {hobbies.map((item, index) => (
            <Reveal
              as="li"
              className="hobby-card cursor-target"
              key={item.name}
              delay={index * 110}
            >
              <span className="hobby-index">{item.index}</span>
              <h3>{item.name}</h3>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
