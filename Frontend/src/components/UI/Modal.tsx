import { Dialog, DialogTitle, Transition } from "@headlessui/react";
import { Fragment, type ReactNode } from "react";

interface IProps {
  isOpen: boolean;
  closeModal: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
}

export default function Modal({
  closeModal,
  isOpen,
  title,
  children,
  description,
}: IProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <div
          className="fixed inset-0  backdrop-blur-sm bg-black bg-opacity-25"
          aria-hidden="true"
        ></div>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto ">
            <div className="flex min-h-full items-center justify-center p-4 text-lightText dark:text-darkText">
              <Dialog.Panel className="relative w-full max-w-md rounded-xl shadow-lg bg-lightBg dark:bg-darkBg p-6">
                {title && (
                  <DialogTitle
                    as="h3"
                    className={`text-lg font-bold text-lightText dark:text-darkText ${
                      title === "Edit this todo" || title === "Add new todo"
                        ? "text-center"
                        : "mt-3 max-w-sm"
                    }`}
                  >
                    {title}
                  </DialogTitle>
                )}
                <div className="mt-2">
                  <p className="text-sm text-secondaryLightText dark:text-secondaryDarkText">
                    {description}
                  </p>
                </div>

                <div className="mt-4">{children}</div>

                {/* Close Button */}
                <button
                  className="absolute top-3 right-3 text-red-700 dark:text-red-500"
                  onClick={closeModal}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </Dialog.Panel>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
