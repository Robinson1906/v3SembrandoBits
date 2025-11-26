import React, { useState } from 'react';
import { Leaf, Cloud, Check } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

type MedioType = 'terreno' | 'aire' | null;
type DispositivoType = 1 | 2 | 3 | null;

const crops = [
  {
    id: 'maiz',
    name: 'Maíz',
    image: 'https://images.unsplash.com/photo-1608995855173-bb65a3fe1bec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3JuJTIwbWFpemUlMjBjcm9wfGVufDF8fHx8MTc2Mjk1NzA5NHww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'tabaco',
    name: 'Tabaco',
    image: 'https://images.unsplash.com/photo-1758414083946-df1b3b44ce84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2JhY2NvJTIwbGVhdmVzJTIwcGxhbnR8ZW58MXx8fHwxNzYyOTU3MDk0fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'nopal',
    name: 'Nopal',
    image: 'https://images.unsplash.com/photo-1708289455563-f42d5cb97bfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3BhbCUyMGNhY3R1c3xlbnwxfHx8fDE3NjI5NTcwOTV8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'lima',
    name: 'Lima',
    image: 'https://images.unsplash.com/photo-1616963738682-9df1389e5932?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaW1lJTIwY2l0cnVzJTIwZnJ1aXR8ZW58MXx8fHwxNzYyOTU3MDk1fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'frijoles',
    name: 'Frijoles',
    image: 'https://images.unsplash.com/photo-1564894809611-1742fc40ed80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFucyUyMGxlZ3VtZXN8ZW58MXx8fHwxNzYyOTU3MDk1fDA&ixlib=rb-4.1.0&q=80&w=1080'
  }
];

export default function SelectionPage() {
  const [selectedMedio, setSelectedMedio] = useState<MedioType>(null);
  const [selectedDispositivo, setSelectedDispositivo] = useState<DispositivoType>(null);

  return (
    <div className="min-h-screen">
      {/* Select Medium Section */}
      <div className="bg-[#f5f5dc] py-12 px-6">
        <h2 className="text-center text-2xl mb-8">
          Selecciona el Medio a explorar
        </h2>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Terreno Card */}
          <div className="bg-white rounded-lg p-8 flex flex-col items-center shadow-sm">
            <div className="w-20 h-20 rounded-full bg-[#7cb342]/10 flex items-center justify-center mb-4">
              <Leaf className="w-12 h-12 text-[#7cb342]" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl text-[#7cb342] mb-3">Terreno</h3>
            <p className="text-center text-sm mb-6">
              Explora sensores del suelo (humedad, pH, nutrientes).
            </p>
            <Button 
              onClick={() => setSelectedMedio('terreno')}
              className={`${
                selectedMedio === 'terreno' 
                  ? 'bg-[#7cb342] hover:bg-[#689f38]' 
                  : 'bg-[#9ccc65] hover:bg-[#8bc34a]'
              } text-white px-6`}
            >
              Haz click aquí
            </Button>
          </div>

          {/* Aire Card */}
          <div className="bg-white rounded-lg p-8 flex flex-col items-center shadow-sm">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Cloud className="w-12 h-12 text-blue-500" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl text-blue-500 mb-3">Aire</h3>
            <p className="text-center text-sm mb-6">
              Explora sensores del entorno (temperatura, gases, humedad).
            </p>
            <Button 
              onClick={() => setSelectedMedio('aire')}
              className={`${
                selectedMedio === 'aire' 
                  ? 'bg-blue-500 hover:bg-blue-600' 
                  : 'bg-blue-400 hover:bg-blue-500'
              } text-white px-6`}
            >
              Haz click aquí
            </Button>
          </div>
        </div>
      </div>

      {/* Select Device Section */}
      <div className="bg-white py-12 px-6">
        <h2 className="text-center text-2xl mb-8">
          Selecciona el dispositivo que quieres revisar
        </h2>
        
        <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-4">
          <Button
            onClick={() => setSelectedDispositivo(1)}
            className={`${
              selectedDispositivo === 1 
                ? 'bg-[#ff8a65] hover:bg-[#ff7043]' 
                : 'bg-[#ffab91] hover:bg-[#ff8a65]'
            } text-black px-6 py-3 rounded-full flex items-center gap-2`}
          >
            {selectedDispositivo === 1 && <Check className="w-4 h-4" />}
            Dispositivo 1
          </Button>

          <Button
            onClick={() => setSelectedDispositivo(2)}
            className={`${
              selectedDispositivo === 2 
                ? 'bg-[#66bb6a] hover:bg-[#4caf50]' 
                : 'bg-[#81c784] hover:bg-[#66bb6a]'
            } text-black px-6 py-3 rounded-full flex items-center gap-2`}
          >
            {selectedDispositivo === 2 && <Check className="w-4 h-4" />}
            Dispositivo 2
          </Button>

          <Button
            onClick={() => setSelectedDispositivo(3)}
            className={`${
              selectedDispositivo === 3 
                ? 'bg-[#ffd54f] hover:bg-[#ffca28]' 
                : 'bg-[#ffe082] hover:bg-[#ffd54f]'
            } text-black px-6 py-3 rounded-full flex items-center gap-2`}
          >
            {selectedDispositivo === 3 && <Check className="w-4 h-4" />}
            Dispositivo 3
          </Button>
        </div>
      </div>

      {/* Select Crop Section */}
      <div className="bg-[#f5f5dc] py-12 px-6">
        <h2 className="text-center text-2xl mb-8">
          Selecciona el cultivo que quieres revisar
        </h2>
        
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {crops.map((crop) => (
            <div key={crop.id} className="bg-white rounded-lg p-4 flex flex-col items-center shadow-sm">
              <div className="w-24 h-24 rounded-lg overflow-hidden mb-3 bg-gray-100">
                <ImageWithFallback
                  src={crop.image}
                  alt={crop.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="mb-3">{crop.name}</h3>
              <Button 
                className="bg-[#9ccc65] hover:bg-[#8bc34a] text-white text-xs px-4 py-2"
              >
                Haz click aquí
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
