"use client"
import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useStore } from '@nanostores/react';
import { $modals, $modalIdCounter, openModalAction, closeModalAction, closeLastModalAction, closeAllModalsAction } from '@/store/modalStore';

// Создаем контекст для модалки
const ModalContext = createContext();

// Провайдер модалки
export const ModalProvider = ({ children }) => {
  const modals = useStore($modals);

  // Мы просто прокидываем actions и state из nanostores в Context
  const value = useMemo(() => ({
    modals,
    openModal: openModalAction,
    closeModal: closeModalAction,
    closeLastModal: closeLastModalAction,
    closeAllModals: closeAllModalsAction,
    getActiveModal: () => modals.length > 0 ? modals[modals.length - 1] : null,
    isModalOpen: (name) => modals.some(modal => modal.name === name),
    activeModalName: modals.length > 0 ? modals[modals.length - 1].name : null
  }), [modals]);

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};

// Хук для использования контекста модалки
export const useModal = () => {
  // Для Astro мы возвращаем fallback, если провайдера нет, 
  // используя nanostores напрямую.
  const context = useContext(ModalContext);
  const modals = useStore($modals);

  if (!context) {
    // В Astro островах может не быть провайдера, 
    // поэтому возвращаем функционал через nanostores напрямую.
    return {
      modals,
      openModal: openModalAction,
      closeModal: closeModalAction,
      closeLastModal: closeLastModalAction,
      closeAllModals: closeAllModalsAction,
      getActiveModal: () => modals.length > 0 ? modals[modals.length - 1] : null,
      isModalOpen: (name) => modals.some(modal => modal.name === name),
      activeModalName: modals.length > 0 ? modals[modals.length - 1].name : null
    };
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
