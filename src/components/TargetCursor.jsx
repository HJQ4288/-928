import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import { createPortal } from 'react-dom';
import './TargetCursor.css';

const TargetCursor = ({
  targetSelector = '.cursor-target',
  spinDuration = 2,
  hideDefaultCursor = true,
  hoverDuration = 0.2,
  parallaxOn = true,
  cursorColor = '#ffffff',
  cursorColorOnTarget = '#6366F1',
  borderWidth = 2,
  cornerSize = 12
}) => {
  const cursorRef = useRef(null);
  const cornersRef = useRef(null);
  const spinTl = useRef(null);
  const dotRef = useRef(null);
  const [isActive, setIsActive] = useState(false);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    return hasTouch && window.innerWidth <= 768;
  }, []);

  const constants = useMemo(
    () => ({
      borderWidth,
      cornerSize
    }),
    [borderWidth, cornerSize]
  );

  const moveCursor = useCallback((x, y) => {
    if (!cursorRef.current) return;
    gsap.to(cursorRef.current, {
      x,
      y,
      duration: 0.1,
      ease: 'power3.out'
    });
  }, []);

  useEffect(() => {
    if (isMobile || !cursorRef.current) return;

    const originalCursor = document.body.style.cursor;
    if (hideDefaultCursor) {
      document.body.style.cursor = 'none';
    }

    const cursor = cursorRef.current;
    cornersRef.current = cursor.querySelectorAll('.target-cursor-corner');

    let activeTarget = null;
    let currentLeaveHandler = null;
    let resumeTimeout = null;

    const cleanupTarget = (target) => {
      if (currentLeaveHandler) {
        target.removeEventListener('mouseleave', currentLeaveHandler);
      }
      currentLeaveHandler = null;
    };

    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });

    const createSpinTimeline = () => {
      if (spinTl.current) {
        spinTl.current.kill();
      }
      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursor, { rotation: '+=360', duration: spinDuration, ease: 'none' });
    };

    createSpinTimeline();

    // ── 角标定位（对原实现的修正）──────────────────────────────────────────
    // 原实现把「元素在视口里的绝对坐标」直接当作角标的 x/y。但角标是
    // .target-cursor-wrapper 的子元素，会跟着父级的位移和自转一起走，
    // 于是自转一停下来，四个角就被甩到视口外（实测 hover 首屏按钮时
    // 角落落在 (-476, 7) 一带，屏幕上只剩中心那个圆点）。
    // 改为：以「元素矩形 − 指针位置」作为角标相对指针的局部位移。
    // 调用前会把自转归位到最近的整圈，锁定后角标与元素边缘保持平行。
    const placeCorners = (target, duration) => {
      if (!cursorRef.current || !cornersRef.current) return;
      const rect = target.getBoundingClientRect();
      const { borderWidth } = constants;
      // 用容器「当前」的位移做参照，而不是指针的事件坐标。
      // 容器是带着 0.1s 补间跟指针走的，事件坐标和容器实际位置之间会差一步，
      // 按事件坐标算出来的角标就会整体偏一截。
      const pointerX = Number(gsap.getProperty(cursorRef.current, 'x')) || 0;
      const pointerY = Number(gsap.getProperty(cursorRef.current, 'y')) || 0;

      Array.from(cornersRef.current).forEach((corner) => {
        const w = corner.offsetWidth;
        const h = corner.offsetHeight;
        const cn = corner.className;
        // 角标盒子左上角在视口里的目标位置
        let worldX = 0;
        let worldY = 0;
        if (cn.includes('corner-tl')) {
          worldX = rect.left - borderWidth;
          worldY = rect.top - borderWidth;
        } else if (cn.includes('corner-tr')) {
          worldX = rect.right + borderWidth - w;
          worldY = rect.top - borderWidth;
        } else if (cn.includes('corner-br')) {
          worldX = rect.right + borderWidth - w;
          worldY = rect.bottom + borderWidth - h;
        } else if (cn.includes('corner-bl')) {
          worldX = rect.left - borderWidth;
          worldY = rect.bottom + borderWidth - h;
        }

        // 用 left/top 相对指针容器定位，而不是 translate。
        // 角标在零位移时的基准位置取决于它在 flex 容器里的静态位置，用 translate 会带上
        // 一段说不清的偏移；left/top 的参照系是容器的内边距盒，落点是确定的。
        // 容器自身带 translate(-50%,-50%)（由 CSS 提供，gsap 会保留为 xPercent），
        // 所以这里再补偿半个角标尺寸，让世界坐标正好等于 worldX / worldY。
        const patch = {
          left: worldX - pointerX + w / 2,
          top: worldY - pointerY + h / 2,
          x: 0,
          y: 0
        };
        if (duration > 0) {
          gsap.to(corner, { ...patch, duration, ease: 'power3.out' });
        } else {
          gsap.set(corner, patch);
        }
      });
    };

    // 锁定期间容器还在朝指针补间，容器一动、位置算好的角标就会被一起拖偏。
    // 所以开一个逐帧循环，每帧按容器「实时」位置重算一次，角标才能钉死在元素上。
    let trackFrame = 0;

    const stopTracking = () => {
      if (trackFrame) cancelAnimationFrame(trackFrame);
      trackFrame = 0;
    };

    const trackLoop = () => {
      trackFrame = 0;
      if (!activeTarget) return;
      placeCorners(activeTarget, 0);
      trackFrame = requestAnimationFrame(trackLoop);
    };

    const startTracking = () => {
      stopTracking();
      trackFrame = requestAnimationFrame(trackLoop);
    };

    const moveHandler = (e) => moveCursor(e.clientX, e.clientY);
    window.addEventListener('mousemove', moveHandler);

    const scrollHandler = () => {
      if (!activeTarget || !cursorRef.current) return;

      const mouseX = gsap.getProperty(cursorRef.current, 'x');
      const mouseY = gsap.getProperty(cursorRef.current, 'y');

      const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
      const isStillOverTarget =
        elementUnderMouse &&
        (elementUnderMouse === activeTarget ||
          elementUnderMouse.closest(targetSelector) === activeTarget);

      if (!isStillOverTarget) {
        if (currentLeaveHandler) {
          currentLeaveHandler();
        }
      }
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });

    const mouseDownHandler = () => {
      if (!dotRef.current) return;
      gsap.to(dotRef.current, { scale: 0.7, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 0.9, duration: 0.2 });
    };

    const mouseUpHandler = () => {
      if (!dotRef.current) return;
      gsap.to(dotRef.current, { scale: 1, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 1, duration: 0.2 });
    };

    window.addEventListener('mousedown', mouseDownHandler);
    window.addEventListener('mouseup', mouseUpHandler);

    const enterHandler = (e) => {
      const directTarget = e.target;
      const allTargets = [];
      let current = directTarget;

      while (current && current !== document.body) {
        if (current.matches(targetSelector)) {
          allTargets.push(current);
        }
        current = current.parentElement;
      }

      const target = allTargets[0] || null;
      if (!target || !cursorRef.current || !cornersRef.current) return;
      if (activeTarget === target) return;

      if (activeTarget) {
        cleanupTarget(activeTarget);
      }

      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
        resumeTimeout = null;
      }

      activeTarget = target;
      const corners = Array.from(cornersRef.current);
      corners.forEach((corner) => gsap.killTweensOf(corner));

      gsap.set(corners, { scale: 1, opacity: 1 });

      // 自转归位到最近的整圈：锁定后角标与元素边缘平行，最多转半圈。
      const spin = Number(gsap.getProperty(cursorRef.current, 'rotation')) || 0;
      gsap.set(cursorRef.current, { rotation: Math.round(spin / 360) * 360 });

      placeCorners(target, 0);
      startTracking();

      if (spinTl.current) {
        spinTl.current.pause();
        spinTl.current.timeScale(1.5);
      }

      const tl = gsap.timeline();
      tl.to(cursor, { backgroundColor: cursorColorOnTarget }, 0)
        .to(
          corners,
          {
            borderColor: cursorColorOnTarget,
            boxShadow: `0px 0px 10px 0px ${cursorColorOnTarget}4d`
          },
          0
        )
        .to(cursor, { backgroundColor: cursorColorOnTarget }, 0);

      void tl;
      setIsActive(true);

      const leaveHandler = () => {
        if (activeTarget !== target) return;

        activeTarget = null;
        setIsActive(false);
        stopTracking();
        if (cornersRef.current) {
          const cornersToReset = Array.from(cornersRef.current);
          cornersToReset.forEach((corner) => {
            gsap.killTweensOf(corner);
            gsap.to(corner, {
              left: 0,
              top: 0,
              x: 0,
              y: 0,
              scale: 1,
              duration: 0.3,
              ease: 'power3.out'
            });
          });
        }

        const tlLeave = gsap.timeline();
        tlLeave.to(cursor, { backgroundColor: cursorColor }, 0).to(corners, { borderColor: cursorColor }, 0);

        // 重建而不是 resume：锁定期间自转角度被归过位，
        // 直接 resume 会让时间线从旧起点续算而跳一下。
        setTimeout(() => {
          if (spinTl.current) createSpinTimeline();
        }, spinDuration * 1000);

        cleanupTarget(target);
      };

      currentLeaveHandler = leaveHandler;
      target.addEventListener('mouseleave', leaveHandler);
    };

    window.addEventListener('mouseover', enterHandler, true);

    return () => {
      if (spinTl.current) {
        spinTl.current.kill();
      }
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseover', enterHandler, true);
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('mousedown', mouseDownHandler);
      window.removeEventListener('mouseup', mouseUpHandler);
      if (resumeTimeout) clearTimeout(resumeTimeout);
      if (activeTarget) cleanupTarget(activeTarget);
      if (hideDefaultCursor) {
        document.body.style.cursor = originalCursor;
      }
    };
  }, [
    targetSelector,
    spinDuration,
    hideDefaultCursor,
    hoverDuration,
    parallaxOn,
    cursorColor,
    cursorColorOnTarget,
    isMobile,
    constants,
    moveCursor
  ]);

  const cursorMarkup = (
    <div
      ref={cursorRef}
      className="target-cursor-wrapper"
      data-active={isActive ? 'true' : 'false'}
      style={{ '--cursor-color': cursorColor }}
    >
      <div ref={dotRef} className="target-cursor-dot" style={{ backgroundColor: cursorColor }} />
      <div
        className="target-cursor-corner corner-tl"
        style={{ borderColor: cursorColor, borderWidth: constants.borderWidth, width: constants.cornerSize, height: constants.cornerSize }}
      />
      <div
        className="target-cursor-corner corner-tr"
        style={{ borderColor: cursorColor, borderWidth: constants.borderWidth, width: constants.cornerSize, height: constants.cornerSize }}
      />
      <div
        className="target-cursor-corner corner-br"
        style={{ borderColor: cursorColor, borderWidth: constants.borderWidth, width: constants.cornerSize, height: constants.cornerSize }}
      />
      <div
        className="target-cursor-corner corner-bl"
        style={{ borderColor: cursorColor, borderWidth: constants.borderWidth, width: constants.cornerSize, height: constants.cornerSize }}
      />
    </div>
  );

  if (isMobile) return null;

  return createPortal(cursorMarkup, document.body);
};

export default TargetCursor;
