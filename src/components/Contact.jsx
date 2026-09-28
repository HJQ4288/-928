import { footer, profileDetails } from '../data.js';
import Reveal from './Reveal.jsx';
import ShardField from './ShardField.jsx';

/** 底部联系方式：整屏收尾页，与首屏的深色形成呼应。 */
export default function Contact() {
  const links = profileDetails.find((item) => item.type === 'links').value;
  const address = profileDetails.find((item) => item.label === '通讯地址').value;

  return (
    <section className="contact" id="contact">
      <div className="contact-glow" aria-hidden="true" />
      <ShardField tone="dark" />

      <div className="page contact-inner">
        <Reveal>
          <p className="sec-eyebrow light">Contact / 联系</p>
          <h2 className="contact-title">
            {footer.name}
            <span>{footer.nameEn}</span>
          </h2>
        </Reveal>

        <Reveal delay={90}>
          <a className="contact-mail cursor-target" href={footer.href}>
            {footer.text}
          </a>
        </Reveal>

        <Reveal className="contact-rows-wrap" delay={160}>
          <ul className="contact-rows wide">
            {links.map((link) => (
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
              <span className="row-label">通讯地址</span>
              <p>{address}</p>
            </li>
          </ul>
        </Reveal>

        <div className="contact-foot">
          <span>
            {footer.name}
            <em>{footer.nameEn}</em>
          </span>
          <a className="back-top cursor-target" href="#hero">
            回到顶部 ↑
          </a>
        </div>
      </div>
    </section>
  );
}
