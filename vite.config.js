import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * 让 dist 里的 index.html 能直接双击打开（file://）。
 *
 * 默认情况下 Vite 会输出 <script type="module" crossorigin src="...">。
 * 浏览器对 module 脚本一律走 CORS 检查，而 file:// 页面的 origin 是 null，
 * 结果脚本被拦下、#root 里空空如也，页面就是一片白。
 * 这里把入口脚本改写为带 defer 的经典脚本，样式表去掉 crossorigin，
 * 打包格式同步换成 iife，产物就与 file:// 兼容了。
 */
function makeDoubleClickable() {
  return {
    name: 'make-double-clickable',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml(html) {
      // 成品里删掉「请用 npm run dev」那段兜底文案：dist 的脚本一定能跑起来，
      // 留着反而可能在首帧闪一下。只有源码入口才需要它。
      let out = html.replace(
        /<!-- build-strip:start[\s\S]*?<!-- build-strip:end -->/,
        ''
      );
      // 入口脚本：去掉 type="module" 与 crossorigin，补上 defer（保证在 DOM 解析后执行）。
      out = out.replace(
        /<script\b([^>]*?)src=(["'])([^"']+)\2([^>]*)><\/script>/g,
        (full, pre, quote, src, post) => {
          if (!/\btype=["']module["']/.test(pre + post)) return full;
          return `<script defer src=${quote}${src}${quote}></script>`;
        }
      );
      // 样式表：file:// 下带上 crossorigin 同样会被拦。
      out = out.replace(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/g, (tag) =>
        tag.replace(/\s+crossorigin(=["'][^"']*["'])?/g, '')
      );
      // 收尾：把掏空后的 #root 压成一行。
      out = out.replace(/<div id="root">\s*<\/div>/, '<div id="root"></div>');
      return out;
    },
  };
}

// base 用相对路径：构建产物既能放站点根目录，也能放 GitHub Pages 的子路径，
// 还能放在任意文件夹里直接双击打开。
export default defineConfig({
  base: './',
  plugins: [react(), makeDoubleClickable()],
  server: {
    port: 5178,
    open: false,
  },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        // iife 是经典脚本格式，自身不带 ESM 语义，可以在 file:// 下运行。
        format: 'iife',
        inlineDynamicImports: true,
      },
    },
  },
});
