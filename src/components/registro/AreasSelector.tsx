import {getAreas} from '@/lib/api/registro';
import { getCosto } from '@/lib/api/registro';

interface AreasSelectorProps {
  selectedArea: string;
  onSelectArea: (area: string) => void;
  disabled?: boolean;
}
const areas = await getAreas();
const costoGeneral = await getCosto();


const AreasSelector: React.FC<AreasSelectorProps> = ({ selectedArea, onSelectArea, }) => {
  //const areas = ['Informatica', 'Astronomia', 'Robotica', 'Biologia', 'Fisica', 'Matematicas', 'Quimica'];
  const costo = costoGeneral.costo
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-4">
        {areas.map((area) => (
          <button
            key={area.codArea}
            type="button"
            className={`py-3 px-6 rounded-md transition-colors ${
              selectedArea === area.nombreArea
                ? 'bg-boton text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
            onClick={() => onSelectArea(area.nombreArea)}
          >
            {area.nombreArea}
          </button>
        ))}
      </div>
      {selectedArea && (
        <div className="mt-4 p-2 bg-gray-100 rounded-md border-l-4 border-boton flex items-center justify-between">
        <h3 className="font-thin text-xl text-gray-800">{selectedArea}</h3>
        <span className="text-xl font-bold text-gray-600">{`Costo General: ${costo} bs`}</span>
      </div>
      
      )}
    </div>
  );
};

export default AreasSelector;