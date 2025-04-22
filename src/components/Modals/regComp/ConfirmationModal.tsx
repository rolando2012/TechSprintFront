import { adlam } from "@/config/fonts";
interface ConfirmationModalProps {
    onClose: () => void;
    area: string;
    level: string;
  }
  
  const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ onClose, area, level }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className={`text-center ${adlam.className} `}>
            <h2 className="text-xl font-bold text-bright-gray-700 mb-4">Solicitud de Validación de Pago Enviada</h2>
            
            <p className="text-bright-gray-700 mb-6">
              Tu solicitud para la inscripción a la competencia de [{area} Nivel {level}] ha sido enviada exitosamente
              para validación. Un cajero revisará tu información y confirmará el estado de tu pago. Recibirás una notificación
              una vez que el proceso haya sido completado. ¡Gracias por tu paciencia!
            </p>
            
            <button
              onClick={onClose}
              className="bg-boton hover:bg-boton-hover text-white px-6 py-2 rounded-md transition"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ConfirmationModal;