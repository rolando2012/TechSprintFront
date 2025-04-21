interface PaymentModalProps {
    onClose: () => void;
    onPayment: () => void;
  }
  
  const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onPayment }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4">
              <img src="/Logo-bcp.png" alt="BCP" className="h-8" />
            </div>
            
            <div className="w-64 h-64 bg-gray-200 flex items-center justify-center mb-4">
              <div className="text-3xl text-gray-700">$</div>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">vence el 19/03/2026</p>
            
            <button
              onClick={onPayment}
              className="bg-boton hover:bg-boton-hover text-white px-6 py-3 rounded-md font-medium transition w-full"
            >
              Pagar
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default PaymentModal;