"use client"
import React, { createContext, useContext, useState, useCallback } from 'react';

// Создаем контекст для модалки
const ModalContext = createContext();

// Провайдер модалки
export const ModalProvider = ({ children }) => {
  const [modals, setModals] = useState([]);
  const [modalIdCounter, setModalIdCounter] = useState(0); // Счетчик для id

  // Функция для открытия модалки
  const openModal = useCallback((name, props = {}) => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden'; 
    setModals(prev => [
      ...prev,
      { name, props, id: modalIdCounter }
    ]);
    setModalIdCounter(prev => prev + 1);
  }, [modalIdCounter]);

  // Функция для закрытия модалки по имени
  const closeModal = useCallback((name) => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden'; 
    setModals(prev => prev.filter(modal => modal.name !== name));
  }, []);

  // Функция для закрытия последней модалки
  const closeLastModal = useCallback(() => {
    setModals(prev => prev.slice(0, -1));
  }, []);

  // Функция для закрытия всех модалок
  const closeAllModals = useCallback(() => {
    setModals([]);
  }, []);

  // Функция для получения активной модалки
  const getActiveModal = useCallback(() => {
    return modals.length > 0 ? modals[modals.length - 1] : null;
  }, [modals]);

  // Проверка, открыта ли модалка с определенным именем
  const isModalOpen = useCallback((name) => {
    return modals.some(modal => modal.name === name);
  }, [modals]);

  const value = {
    modals,
    openModal,
    closeModal,
    closeLastModal,
    closeAllModals,
    getActiveModal,
    isModalOpen,
    // Для удобства - получение имени активной модалки
    activeModalName: getActiveModal()?.name || null
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};

// Хук для использования контекста модалки
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

// Хук для конкретной модалки
export const useModalState = (modalName) => {
  const { isModalOpen, openModal, closeModal, modals } = useModal();
  const modalData = modals.find(m => m.name === modalName)
  return {
    isOpen: isModalOpen(modalName),
    open: (props) => openModal(modalName, props),
    close: () => closeModal(modalName),
    data: modalData,
  };
};
