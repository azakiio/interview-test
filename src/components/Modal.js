// Modal as a separate component
import { Icon } from "@iconify/react";
import { useEffect, useRef } from "react";

function Modal({ openModal, closeModal, children, Title }) {
  const ref = useRef();

  // TODO: close on click outside
  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [openModal]);

  return (
    <dialog ref={ref} onCancel={closeModal} className="p-4 max-w-md w-full rounded-lg">
      <div className="flex flex-col">
        <div className="flex justify-between gap-4">
          {Title}
          <button
            onClick={closeModal}
            className="btn p-2 rounded-full bg-red text-white w-fit ml-auto"
          >
            <Icon icon="ic:round-close" className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}

export default Modal;
