import { researchProjects } from '../data.js';
import Reveal from './Reveal.jsx';

/** 科研项目模块：大卡片展示原站「科研」栏目的三项课题。
 *  背景图为用户提供的图（.photo-bg）。 */
export default function Research() {
  return (
    <section className="section alt photo-bg" id="research">
      <div className="page">
        <Reveal className="sec-head">
          <div>
            <p className="sec-eyebrow">Research / 科研</p>
            <h2 className="sec-title">科研项目</h2>
          </div>
        </Reveal>

        <ol className="research-grid">
          {researchProjects.map((item, index) => (
            <Reveal
              as="li"
              className="research-card cursor-target"
              key={item.title}
              delay={index * 110}
            >
              <time className="research-time">{item.time}</time>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
