import { useEffect, useState } from 'react';
import { navItems, profile } from '../data.js';

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [active, setActive] = useState('');

  // 滚过首屏后切换成实底导航；同时算出当前所在栏目并高亮。
  // 用滚动位置直接判断，比 IntersectionObserver 更稳定：
  // 长栏目内部滚动时不会出现「没有任何条目变化 → 高亮卡住」的情况。
  useEffect(() => {
    const ids = navItems.map((item) => item.id);

    const onScroll = () => {
      setSolid(window.scrollY > window.innerHeight * 0.62);

      // 以「视口上方 40% 处」为基准线，最后一个越过基准线的栏目即为当前栏目。
      const line = window.scrollY + window.innerHeight * 0.4;
      let current = '';
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= line) current = id;
      });
      setActive(current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <header className={`nav${solid ? ' is-solid' : ''}`}>
      <div className="page nav-inner">
        <a className="brand cursor-target" href="#hero">
          {profile.name}
          <span>{profile.nameEn}</span>
        </a>

        <nav className="nav-links" aria-label="主导航">
          {navItems.map((item) => {
            const current = active === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`cursor-target${current ? ' is-current' : ''}`}
                aria-current={current ? 'location' : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <a className="nav-cta cursor-target" href="#contact">
          联系我
        </a>
      </div>
    </header>
  );
}
