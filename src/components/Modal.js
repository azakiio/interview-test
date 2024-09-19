// Modal as a separate component
import { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";

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
      <div className="flex flex-col">
        <button
          onClick={closeModal}
          className="p-2 rounded-full bg-red text-white w-fit ml-auto"
        >
          <Icon icon="ic:round-close" className="w-5 h-5" />
        </button>
        {children}
      </div>
    </dialog>
  );
}

export default Modal;
