import { useEffect, useRef, useState } from 'react';
import ShardField from './ShardField.jsx';

/**
 * 首屏背景层：视频 + 渐变兜底 + 压暗层 + AeroShards 碎片场。
 *
 * 首屏与「我的爱好」共用这个组件，两处是同一张背景。
 *
 * 视频文件放在 public/assets/hero.mp4（用户稍后自行放入）。
 * 文件不存在时不会出现黑屏或破图：
 *   - <video> 一直挂载并尝试加载，加载失败或超时就保持透明；
 *   - 底层始终有一层动态渐变兜底，所以没视频也照样好看。
 *
 * variant:
 *   'hero'   左侧文字重，压暗层偏左；首屏用。
 *   'center' 内容居中，压暗层环绕收边；「我的爱好」用。
 */
export default function Backdrop({ variant = 'hero' }) {
  const videoRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    let alive = true;
    const markReady = () => {
      if (alive) setVideoReady(true);
    };
    const markFail = () => {
      if (alive) setVideoReady(false);
    };

    video.addEventListener('loadeddata', markReady);
    video.addEventListener('canplay', markReady);
    video.addEventListener('error', markFail);

    const source = video.querySelector('source');
    if (source) source.addEventListener('error', markFail);

    // 有些情况下 <video> 既不触发 canplay 也不触发 error，这里兜一个超时判定。
    const timer = window.setTimeout(() => {
      if (alive && video.readyState < 2) setVideoReady(false);
    }, 2600);

    const playing = video.play?.();
    if (playing && typeof playing.catch === 'function') playing.catch(() => {});

    return () => {
      alive = false;
      window.clearTimeout(timer);
      video.removeEventListener('loadeddata', markReady);
      video.removeEventListener('canplay', markReady);
      video.removeEventListener('error', markFail);
      if (source) source.removeEventListener('error', markFail);
    };
  }, []);

  return (
    <div
      className={`backdrop${variant === 'center' ? ' is-center' : ''}`}
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        className={`backdrop-video${videoReady ? ' is-ready' : ''}`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="assets/hero.mp4" type="video/mp4" />
      </video>
      <div className="backdrop-fallback" />
      <div className="backdrop-veil" />
      {/* 碎片场压在压暗层之上，否则会被那层深色滤镜吃掉亮度 */}
      <ShardField tone="dark" />
    </div>
  );
}
