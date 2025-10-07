import { useEffect, useRef } from 'react';

export function useLockScroll(isOpen, modalRef) {
  const savedY = useRef(0);
  const preventTouchRef = useRef(null);

  useEffect(() => {
    const isIOS =
      /iP(ad|hone|od)/.test(navigator.platform) ||
      (navigator.userAgent.includes("Mac") && navigator.maxTouchPoints > 1);

    if (!isOpen) return;

    if (isIOS) {
      savedY.current = window.scrollY || window.pageYOffset;
      Object.assign(document.body.style, {
        position: 'fixed',
        top: `-${savedY.current}px`,
        left: '0',
        right: '0',
        width: '100%',
      });

      preventTouchRef.current = (e) => {
        if (modalRef?.current && modalRef.current.contains(e.target)) return;
        e.preventDefault();
      };
      document.addEventListener('touchmove', preventTouchRef.current, { passive: false });
    } else {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }

    return () => {
      if (isIOS) {
        document.removeEventListener('touchmove', preventTouchRef.current);
        Object.assign(document.body.style, {
          position: '',
          top: '',
          left: '',
          right: '',
          width: '',
        });
        window.scrollTo(0, savedY.current);
      } else {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
      }
    };
  }, [isOpen, modalRef]);
}
