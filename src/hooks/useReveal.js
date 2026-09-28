import { useEffect, useRef, useState } from 'react';

/**
 * 元素进入视口后返回 visible=true，用于做「淡入上浮」的进场动画。
 * 只在第一次进入时触发，之后断开监听；不支持 IntersectionObserver 时直接可见，
 * 保证内容永远不会因为动画失败而消失。
 */
export function useReveal({ threshold = 0.16, rootMargin = '0px 0px -6% 0px' } = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, visible];
}
