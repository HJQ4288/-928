import { useEffect, useState } from 'react';
import AeroShards from './AeroShards.jsx';

/**
 * AeroShards（React Bits / WebGPU）的站点化包装。
 *
 * 配色不另起炉灶，全部取自 styles.css 里的设计变量：
 *   --ink #0c1a15 / --ink-2 #16291f  深墨绿（深色章节底色）
 *   --gold #b8a27d                   古铜金（碎片主色）
 *   --accent #42635b                 灰绿（高光/反射的强调色）
 *
 * tone:
 *   'dark'  深色沉浸式章节（首屏 / 我的爱好 / 底部联系）用，底色取首屏渐变的主色 #0A1712。
 *   'light' 浅色章节（关于我）用，底色取 --bg #fbfaf6；
 *           组件会按背景亮度自动切到「浅色表面」光照，并改用碎片色做光晕，不会糊成一片脏灰。
 *
 * 两条降级路径，保证不支持的浏览器上页面照旧：
 *   1. 浏览器没有 WebGPU → 整层不渲染，章节原有的渐变 / 底色照常显示；
 *   2. WebGPU 初始化或渲染中途失败 → onError 触发，同样撤掉这一层。
 */
const TONES = {
  dark: {
    backgroundColor: '#0A1712',
    shardColor: '#B8A27D',
    accentColor: '#4E8A72',
    opacity: 0.92,
    bloom: 0.5,
    grain: 0.05,
  },
  light: {
    backgroundColor: '#FBFAF6',
    shardColor: '#B8A27D',
    accentColor: '#42635B',
    opacity: 0.5,
    bloom: 0.45,
    grain: 0.035,
  },
};

export default function ShardField({
  tone = 'dark',
  placement = 'full',
  opacity,
  density = 1.1,
  speed = 0.8,
  className = '',
}) {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    // 只认真正可用的 WebGPU：navigator.gpu 存在且能拿到适配器时才挂载渲染器。
    if (typeof navigator === 'undefined' || !navigator.gpu) return undefined;

    let alive = true;
    navigator.gpu
      .requestAdapter()
      .then((adapter) => {
        if (alive && adapter) setSupported(true);
      })
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, []);

  if (!supported) return null;

  const config = TONES[tone] ?? TONES.dark;

  return (
    <div
      className={`shard-layer${className ? ` ${className}` : ''}`}
      style={{ opacity: opacity ?? config.opacity }}
      aria-hidden="true"
    >
      <AeroShards
        backgroundColor={config.backgroundColor}
        shardColor={config.shardColor}
        accentColor={config.accentColor}
        placement={placement}
        flow="stream"
        material="pearl"
        detail="balanced"
        effect="none"
        density={density}
        speed={speed}
        bloom={config.bloom}
        grain={config.grain}
        interaction="repel"
        holdToGather
        onError={() => setSupported(false)}
      />
    </div>
  );
}
