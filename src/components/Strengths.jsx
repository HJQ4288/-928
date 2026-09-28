import { skills } from '../data.js';
import Reveal from './Reveal.jsx';

/** 个人优势模块：把原站「技能与实践」的三组内容做成三张大卡片。
 *  背景图为用户提供的图（.photo-bg）。 */
export default function Strengths() {
  return (
    <section className="section photo-bg" id="skills">
      <div className="page">
        <Reveal className="sec-head">
          <div>
            <p className="sec-eyebrow">Strengths / 优势</p>
            <h2 className="sec-title">个人优势</h2>
          </div>
          <p className="sec-note">技能与实践 · 三个方向</p>
        </Reveal>

        <div className="strength-grid">
          {skills.map((skill, index) => (
            <Reveal className="strength-card cursor-target" key={skill.title} delay={index * 110}>
              <span className="strength-index">{skill.index}</span>
              <h3>
                {skill.title}
                {/* 原站是「研究方法：正文」，冒号作为字段分隔符保留，只做成金色点缀 */}
                <span className="colon">：</span>
              </h3>
              <p className="strength-desc">{skill.desc}</p>
              <ul className="tag-list">
                {skill.tags.map((tag) => (
                  <li className="tag cursor-target" key={tag}>
                    {tag}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
