interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
  }
  
  export default function Modal({ children, onClose }: ModalProps) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50">
        <div className="bg-bright-gray-200  items-center gap-x-2 p-6 rounded shadow-lg">
          {children}

          <button onClick={onClose} className="mt-4 px-4 py-2 bg-bright-gray-400 hover:bg-bright-gray-500 text-white rounded-2xl">
            No, cerrar
          </button>
        </div>
      </div>
    );
  }
  