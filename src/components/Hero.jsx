import Backdrop from './Backdrop.jsx';
import { profile } from '../data.js';

/** 首屏：整屏背景（视频 + 渐变兜底），背景层与「我的爱好」共用同一个组件。 */
export default function Hero() {
  return (
    <section className="hero" id="hero">
      <Backdrop />

      <div className="page hero-inner">
        <div className="hero-copy">
          <p className="hero-eyebrow">
            {profile.school}
            <em>/</em>
            {profile.school2}
          </p>

          <h1 className="hero-title">
            {profile.name}
            <span>{profile.nameEn}</span>
          </h1>

          <p className="hero-role">{profile.role}</p>

          <div className="hero-actions">
            <a className="btn btn-primary cursor-target" href="mailto:yb774488@um.edu.mo">
              与我联系
              <em aria-hidden="true">→</em>
            </a>
            <a className="btn btn-ghost cursor-target" href="#research">
              科研项目
            </a>
          </div>
        </div>

        <figure className="hero-visual cursor-target">
          <img
            src={profile.avatar}
            alt={profile.avatarAlt}
            width="360"
            height="360"
          />
          <figcaption>
            {profile.name}
            <span>{profile.nameEn}</span>
          </figcaption>
        </figure>
      </div>

      <a className="hero-scroll" href="#about">
        向下滚动
        <span aria-hidden="true">↓</span>
      </a>
    </section>
  );
}
