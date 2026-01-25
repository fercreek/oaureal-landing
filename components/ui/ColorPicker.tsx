'use client';

import { useState } from 'react';
import { Palette, X, RotateCcw } from 'lucide-react';
import { useColorTheme } from '@/lib/hooks/useColorTheme';
import { motion, AnimatePresence } from 'framer-motion';

interface ColorPickerProps {
  showSecondary?: boolean;
  compact?: boolean;
  position?: 'fixed' | 'relative';
}

export default function ColorPicker({
  showSecondary = false,
  compact = false,
  position = 'fixed',
}: ColorPickerProps) {
  const { theme, setPrimaryColor, setSecondaryColor, setTertiaryColor, setBgDeepColor, resetColors, hasCustomColors, isLoaded } = useColorTheme();
  const [isOpen, setIsOpen] = useState(false);

  if (!isLoaded) return null;

  if (compact) {
    return (
      <div className={`${position === 'fixed' ? 'fixed bottom-6 right-6 z-50' : 'relative'}`}>
        <AnimatePresence>
          {isOpen ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="absolute bottom-16 right-0 w-80 p-6 rounded-2xl bg-bg-secondary border border-white/10 backdrop-blur-xl shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-title text-primary">Colores</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-text-muted hover:text-text hover:bg-white/10 transition-colors"
                  aria-label="Cerrar"
                >
                  <X size={18} />
                </button>
              </div>
              <ColorPickerContent
                theme={theme}
                setPrimaryColor={setPrimaryColor}
                setSecondaryColor={setSecondaryColor}
                setTertiaryColor={setTertiaryColor}
                setBgDeepColor={setBgDeepColor}
                resetColors={resetColors}
                hasCustomColors={hasCustomColors}
                showSecondary={showSecondary}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-primary text-bg flex items-center justify-center shadow-[0_0_20px_var(--color-primary)] hover:scale-110 transition-transform"
          aria-label="Abrir selector de colores"
        >
          <Palette size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-2xl bg-bg-secondary border border-white/10 ${position === 'fixed' ? 'fixed top-6 right-6 z-50 max-w-sm' : 'relative'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-title text-primary">Personalizar Colores</h3>
        {hasCustomColors && (
          <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-subtitle">
            Personalizado
          </span>
        )}
      </div>
      <ColorPickerContent
        theme={theme}
        setPrimaryColor={setPrimaryColor}
        setSecondaryColor={setSecondaryColor}
        setTertiaryColor={setTertiaryColor}
        setBgDeepColor={setBgDeepColor}
        resetColors={resetColors}
        hasCustomColors={hasCustomColors}
        showSecondary={showSecondary}
      />
    </div>
  );
}

interface ColorPickerContentProps {
  theme: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary?: string;
    secondaryLight?: string;
    secondaryDark?: string;
    tertiary?: string;
    bgDeep?: string;
  };
  setPrimaryColor: (hex: string) => void;
  setSecondaryColor: (hex: string) => void;
  setTertiaryColor: (hex: string) => void;
  setBgDeepColor: (hex: string) => void;
  resetColors: () => void;
  hasCustomColors: boolean;
  showSecondary: boolean;
}

function ColorPickerContent({
  theme,
  setPrimaryColor,
  setSecondaryColor,
  setTertiaryColor,
  setBgDeepColor,
  resetColors,
  hasCustomColors,
  showSecondary,
}: ColorPickerContentProps) {
  const PRESET_COLORS = [
    { name: 'Turquesa', value: '#a5f0fa' },
    { name: 'Azul Intenso', value: '#011797' },
    { name: 'Púrpura Oscuro', value: '#54008c' },
    { name: 'Púrpura Medio', value: '#520f5e' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-subtitle font-bold mb-2 text-text-muted">
          Paleta de Temas (Cambiar Color Principal)
        </label>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {PRESET_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setPrimaryColor(color.value);
              }}
              className="group relative w-full aspect-square rounded-lg border border-white/10 hover:scale-105 transition-transform cursor-pointer"
              style={{ backgroundColor: color.value }}
              title={`Usar ${color.name} como color principal`}
            >
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ring-2 ring-white/50 pointer-events-none" />
              {theme.primary.toLowerCase() === color.value.toLowerCase() && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-2 h-2 bg-white rounded-full shadow-lg" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-subtitle font-bold mb-2 text-text-muted">
          Color Primario
        </label>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="color"
              value={theme.primary}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-16 h-16 rounded-xl border-2 border-white/20 cursor-pointer"
              aria-label="Color primario"
            />
            <div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                boxShadow: `0 0 20px ${theme.primary}`,
              }}
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={theme.primary}
              onChange={(e) => {
                if (e.target.value.startsWith('#')) {
                  setPrimaryColor(e.target.value);
                }
              }}
              className="w-full p-2 rounded-lg bg-bg border border-white/10 text-text font-mono text-sm outline-none focus:border-primary transition-colors"
              placeholder="#a5f0fa"
            />
            <div className="flex gap-2 mt-2">
              <div className="flex-1">
                <p className="text-xs text-text-secondary mb-1 font-body">Light</p>
                <div
                  className="h-6 rounded border border-white/10"
                  style={{ backgroundColor: theme.primaryLight }}
                />
              </div>
              <div className="flex-1">
                <p className="text-xs text-text-secondary mb-1 font-body">Dark</p>
                <div
                  className="h-6 rounded border border-white/10"
                  style={{ backgroundColor: theme.primaryDark }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSecondary && (
        <div>
          <label className="block text-sm font-subtitle font-bold mb-2 text-text-muted">
            Color Secundario
          </label>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="color"
                value={theme.secondary || '#a020f0'}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-16 h-16 rounded-xl border-2 border-white/20 cursor-pointer"
                aria-label="Color secundario"
              />
              {theme.secondary && (
                <div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{
                    boxShadow: `0 0 20px ${theme.secondary}`,
                  }}
                />
              )}
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={theme.secondary || '#a020f0'}
                onChange={(e) => {
                  if (e.target.value.startsWith('#')) {
                    setSecondaryColor(e.target.value);
                  }
                }}
                className="w-full p-2 rounded-lg bg-bg border border-white/10 text-text font-mono text-sm outline-none focus:border-primary transition-colors"
                placeholder="#a020f0"
              />
              {theme.secondaryLight && theme.secondaryDark && (
                <div className="flex gap-2 mt-2">
                  <div className="flex-1">
                    <p className="text-xs text-text-secondary mb-1 font-body">Light</p>
                    <div
                      className="h-6 rounded border border-white/10"
                      style={{ backgroundColor: theme.secondaryLight }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-text-secondary mb-1 font-body">Dark</p>
                    <div
                      className="h-6 rounded border border-white/10"
                      style={{ backgroundColor: theme.secondaryDark }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {hasCustomColors && (
        <button
          onClick={resetColors}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/20 text-text hover:bg-white/10 hover:border-primary/50 transition-all font-subtitle"
        >
          <RotateCcw size={16} />
          Restaurar Colores por Defecto
        </button>
      )}
    </div>
  );
}
