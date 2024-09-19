// Modal as a separate component
import { useEffect, useRef } from "react";

function Modal({ openModal, closeModal, children }) {
  const ref = useRef();

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [openModal]);

  return (
    <dialog ref={ref} onCancel={closeModal} className="p-4 max-w-md w-full">
      <button onClick={closeModal}>X</button>
      {children}
    </dialog>
  );
}

export default Modal;
