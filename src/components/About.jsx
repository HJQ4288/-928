import {
  experienceList,
  profile,
  profileDetails,
  researchDirection,
  stats,
} from '../data.js';
import Reveal from './Reveal.jsx';
import ShardField from './ShardField.jsx';

/** 个人经历模块：人物图 + 自我介绍 + 联系方式 + 项目数据 + 教育与工作经历。 */
export default function About() {
  const contactItem = profileDetails.find((item) => item.type === 'links');
  const addressItem = profileDetails.find((item) => item.label === '通讯地址');

  return (
    <section className="section" id="about">
      {/* 浅色章节：底色取 --bg，碎片场压得淡一些，保证正文可读 */}
      <ShardField tone="light" opacity={0.42} />

      <div className="page">
        <Reveal className="sec-head">
          <div>
            <p className="sec-eyebrow">About / 关于</p>
            <h2 className="sec-title">关于我</h2>
          </div>
        </Reveal>

        <div className="about-grid">
          {/* 左：人物图 + 联系方式 */}
          <div className="about-side">
            <Reveal className="portrait">
              <img
                src={profile.avatar}
                alt={profile.avatarAlt}
                width="720"
                height="720"
              />
            </Reveal>

            <Reveal className="contact-card" delay={90}>
              <h3 className="card-title">联系方式</h3>
              <ul className="contact-rows">
                {contactItem.value.map((link) => (
                  <li key={link.href}>
                    <span className="row-label">
                      {link.href.startsWith('mailto:') ? '邮箱' : '电话'}
                    </span>
                    <a className="cursor-target" href={link.href}>
                      {link.text}
                    </a>
                  </li>
                ))}
                <li>
                  <span className="row-label">{addressItem.label}</span>
                  <p>{addressItem.value}</p>
                </li>
              </ul>
            </Reveal>
          </div>

          {/* 右：自我介绍 + 研究方向 + 基本资料 */}
          <div className="about-main">
            <Reveal className="intro">
              <p className="intro-lead">{profile.role}</p>
              <p className="intro-school">
                {profile.school}
                <br />
                {profile.school2}
              </p>

              <div className="direction">
                <span className="direction-label">研究方向</span>
                <p>
                  <strong>{researchDirection.strong}</strong>
                  {researchDirection.rest}
                </p>
              </div>
            </Reveal>

            <div className="info-grid">
              {profileDetails.map((item, index) => (
                <Reveal className="info-item" key={item.label} delay={index * 70}>
                  <span className="info-label">{item.label}</span>
                  {item.type === 'links' ? (
                    <p className="info-value info-links">
                      {item.value.map((link) => (
                        <a className="cursor-target" key={link.href} href={link.href}>
                          {link.text}
                        </a>
                      ))}
                    </p>
                  ) : (
                    <p className="info-value">{item.value}</p>
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* 项目数据：数字全部来自上面真实内容的条数 */}
        <Reveal className="stats">
          {stats.map((item) => (
            <div className="stat" key={item.label}>
              <p className="stat-value">
                {item.value}
                <em>{item.unit}</em>
              </p>
              <p className="stat-label">{item.label}</p>
            </div>
          ))}
        </Reveal>

        {/* 教育与工作经历 */}
        <div className="experience" id="experience">
          <Reveal className="block-head">
            <p className="sec-eyebrow">Experience / 经历</p>
            <h3 className="block-title">教育与工作经历</h3>
          </Reveal>

          <ol className="timeline">
            {experienceList.map((item, index) => (
              <Reveal as="li" className="tl-item" key={item.title} delay={index * 80}>
                <p className="tl-title">{item.title}</p>
                <p className="tl-meta">
                  <time>{item.time}</time>
                  <span>{item.detail}</span>
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
