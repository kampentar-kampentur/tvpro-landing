
"use client"
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import styles from './SliderGallery.module.css';

export const SliderGallery = ({ 
  CardComponent, 
  cardsPerPage = 1, 
  cardData, 
  autoplayInterval = 0,
  enableAutoplay = true,
  transitionDuration = 300
}) => {
  const sliderRef = useRef(null);
  const autoplayRef = useRef(null);
  const currentIndexRef = useRef(0);
  const scrollTimeoutRef = useRef(null);
  const isScrollingRef = useRef(false);
  
  const [activeDotIndex, setActiveDotIndex] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  // Мемоизируем вычисления
  const totalPages = useMemo(() => 
    Math.ceil(cardData.length / cardsPerPage), 
    [cardData.length, cardsPerPage]
  );

  const cardWidth = useMemo(() => 
    100 / cardsPerPage, 
    [cardsPerPage]
  );

  // Оптимизированная функция скролла с debounce
  const scrollToPage = useCallback((pageIndex) => {
    const slider = sliderRef.current;
    if (!slider || isScrollingRef.current) return;

    isScrollingRef.current = true;
    const visibleWidth = slider.offsetWidth;
    const scrollLeft = pageIndex * visibleWidth;
    
    slider.scrollTo({
      left: scrollLeft,
      behavior: 'smooth',
    });

    currentIndexRef.current = pageIndex;
    setActiveDotIndex(pageIndex);

    // Сброс флага после завершения анимации
    setTimeout(() => {
      isScrollingRef.current = false;
    }, transitionDuration);
  }, [transitionDuration]);

  // Оптимизированный обработчик скролла с throttling
  const handleScroll = useCallback(() => {
    if (isScrollingRef.current) return;

    const slider = sliderRef.current;
    if (!slider) return;

    // Очищаем предыдущий timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Устанавливаем новый timeout для debounce
    scrollTimeoutRef.current = setTimeout(() => {
      const scrollLeft = slider.scrollLeft;
      const visibleWidth = slider.offsetWidth;
      const newPageIndex = Math.round(scrollLeft / visibleWidth);
      
      if (newPageIndex !== currentIndexRef.current) {
        currentIndexRef.current = newPageIndex;
        setActiveDotIndex(newPageIndex);
      }
    }, 50); // 50ms throttle
  }, []);

  // Управление автоплеем
  const startAutoplay = useCallback(() => {
    if (!enableAutoplay || autoplayInterval <= 0 || isUserInteracting) return;

    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }

    autoplayRef.current = setInterval(() => {
      const nextIndex = (currentIndexRef.current + 1) % totalPages;
      scrollToPage(nextIndex);
    }, autoplayInterval);
  }, [enableAutoplay, autoplayInterval, totalPages, scrollToPage, isUserInteracting]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  // Обработчики взаимодействия пользователя
  const handleMouseEnter = useCallback(() => {
    setIsUserInteracting(true);
    stopAutoplay();
  }, [stopAutoplay]);

  const handleMouseLeave = useCallback(() => {
    setIsUserInteracting(false);
    startAutoplay();
  }, [startAutoplay]);

  const handleTouchStart = useCallback(() => {
    setIsUserInteracting(true);
    stopAutoplay();
  }, [stopAutoplay]);

  const handleTouchEnd = useCallback(() => {
    setTimeout(() => {
      setIsUserInteracting(false);
      startAutoplay();
    }, 1000); // Задержка перед возобновлением автоплея
  }, [startAutoplay]);

  // Обработчик клика по точкам с предотвращением двойного клика
  const handleDotClick = useCallback((index) => {
    if (index === activeDotIndex) return;
    scrollToPage(index);
  }, [activeDotIndex, scrollToPage]);

  // Keyboard navigation
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      const prevIndex = (currentIndexRef.current - 1 + totalPages) % totalPages;
      scrollToPage(prevIndex);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      const nextIndex = (currentIndexRef.current + 1) % totalPages;
      scrollToPage(nextIndex);
    }
  }, [totalPages, scrollToPage]);

  // Эффекты
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    slider.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      slider.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
  }, [startAutoplay, stopAutoplay]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      stopAutoplay();
    };
  }, [stopAutoplay]);

  // Мемоизируем рендер карточек
  const renderCards = useMemo(() => 
    cardData.map((data, index) => (
      <div 
        key={data.id || index} 
        className={styles.sliderCard} 
        style={{ minWidth: `${cardWidth}%` }}
      >
        <CardComponent {...data} />
      </div>
    )), 
    [cardData, CardComponent, cardWidth]
  );

  // Мемоизируем рендер точек
  const renderDots = useMemo(() => 
    Array.from({ length: totalPages }, (_, index) => (
      <button
        key={index}
        type="button"
        className={`${styles.dot} ${index === activeDotIndex ? styles.activeDot : ''}`}
        onClick={() => handleDotClick(index)}
        aria-label={`Перейти к слайду ${index + 1}`}
        aria-current={index === activeDotIndex ? 'true' : 'false'}
      />
    )), 
    [totalPages, activeDotIndex, handleDotClick]
  );

  return (
    <div 
      className={styles.sliderContainer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Галерея слайдов"
    >
      <div
        className={styles.sliderWrapper}
        ref={sliderRef}
        role="list"
        aria-live="polite"
      >
        {renderCards}
      </div>
      
      {totalPages > 1 && (
        <div className={styles.paginationDots} role="tablist">
          {renderDots}
        </div>
      )}
    </div>
  );
};