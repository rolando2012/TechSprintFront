interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50  z-50">
      <div className="bg-bright-gray-200 p-8 rounded-lg shadow-xl max-w-md w-full flex flex-col items-center text-center">
        {children}
      </div>
    </div>
  );
}