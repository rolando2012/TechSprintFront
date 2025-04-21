interface AreasSelectorProps {
  selectedArea: string;
  onSelectArea: (area: string) => void;
}

const AreasSelector: React.FC<AreasSelectorProps> = ({ selectedArea, onSelectArea }) => {
  const areas = ['Informatica', 'Astronomia', 'Robotica', 'Biologia', 'Fisica', 'Matematicas', 'Quimica'];

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-4">
        {areas.map((area) => (
          <button
            key={area}
            className={`py-3 px-6 rounded-md transition-colors ${
              selectedArea === area
                ? 'bg-boton text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
            onClick={() => onSelectArea(area)}
          >
            {area}
          </button>
        ))}
      </div>
      {selectedArea && (
        <div className="mt-4 p-2 bg-gray-100 rounded-md border-l-4 border-boton">
          <h3 className="font-semibold text-gray-800">{selectedArea}</h3>
        </div>
      )}
    </div>
  );
};

export default AreasSelector;