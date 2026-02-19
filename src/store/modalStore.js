import { atom } from 'nanostores';

export const $modals = atom([]);
export const $modalIdCounter = atom(0);

export const openModalAction = (name, props = {}) => {
    if (typeof document !== 'undefined') {
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
    }
    const currentCounter = $modalIdCounter.get();
    $modals.set([
        ...$modals.get(),
        { name, props, id: currentCounter }
    ]);
    $modalIdCounter.set(currentCounter + 1);
};

export const closeModalAction = (name) => {
    if (typeof document !== 'undefined') {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
    }
    $modals.set($modals.get().filter(modal => modal.name !== name));
};

export const closeLastModalAction = () => {
    $modals.set($modals.get().slice(0, -1));
};

export const closeAllModalsAction = () => {
    $modals.set([]);
};
