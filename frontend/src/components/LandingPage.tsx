import React from 'react';
import { Sprout, Wheat, Droplet, Heart, Cloud } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingPageProps {
  onExplore: () => void;
}

export default function LandingPage({ onExplore }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-2">
        <img
          src="/images/emojis/Logo SembrandoBits.png"
          alt="Logo SembrandoBits"
          className="w-8 h-8 object-contain"
        />
        <span>Panel de Información</span>
      </header>

      {/* Hero Section */}
      <main className="flex-1 relative">
        <div className="relative h-[500px] w-full overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=500&fit=crop"
              alt="Rural landscape"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/30 to-white/70"></div>
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
            {/* Logo and Title */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 flex items-center justify-center">
                <img
                  src="/images/emojis/Logo SembrandoBits.png"
                  alt="Logo SembrandoBits"
                  className="w-16 h-16 object-contain"
                />
              </div>
              <div className="text-left">
                <h1 className="text-4xl mb-0">
                  Proyecto<br />
                  <span>Sembrando Bits</span>
                </h1>
              </div>
            </div>

            {/* Subtitle */}
            <p className="mb-4 max-w-xl">
              Sistema IoT para monitorear variables de suelo y AtmoSmart en entornos rurales
            </p>

            {/* Description */}
            <p className="mb-8 max-w-2xl text-sm">
              Una plataforma co-creada con mujeres rurales para potenciar la agricultura sostenible y el conocimiento local, transformando datos en decisiones inteligentes para un futuro más verde.
            </p>

            {/* CTA Button */}
            <Button 
              onClick={onExplore}
              className="bg-[#7cb342] hover:bg-[#689f38] text-white px-8 py-3"
            >
              Explorar sensores
            </Button>
          </div>
        </div>

        {/* Footer Icons */}
        <div className="bg-[#f5f5dc] py-8">
          <div className="flex items-center justify-center gap-12">
            <div className="flex flex-col items-center gap-2">
              <Wheat className="w-6 h-6" />
              <span className="text-xs">Cultivo</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Droplet className="w-6 h-6" />
              <span className="text-xs">Tierra</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Sprout className="w-6 h-6" />
              <span className="text-xs">Datos</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Heart className="w-6 h-6" />
              <span className="text-xs">Colaboración</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Cloud className="w-6 h-6" />
              <span className="text-xs">Ambiente</span>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="text-center mt-6 text-xs text-gray-600">
            © 2025 Panel de información. Todos los derechos reservados.
          </div>
        </div>
      </main>
    </div>
  );
}
