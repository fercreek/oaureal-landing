'use client';

import { useState, useEffect, useCallback } from 'react';
import { generateColorVariations, isValidHex } from '@/lib/utils/colorUtils';

const STORAGE_KEY = 'oaureal-color-theme';

interface ColorTheme {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary?: string;
  secondaryLight?: string;
  secondaryDark?: string;
  updatedAt?: string;
}

const DEFAULT_THEME: ColorTheme = {
  primary: '#a5f0fa',
  primaryLight: '#b7f3fb',
  primaryDark: '#84c0c8',
};

function getCssVariable(name: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function getInitialTheme(): ColorTheme {
  if (typeof window === 'undefined') return DEFAULT_THEME;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.primary && isValidHex(parsed.primary)) {
        return parsed;
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  const cssPrimary = getCssVariable('--color-primary') || DEFAULT_THEME.primary;
  const cssPrimaryLight = getCssVariable('--color-primary-light') || DEFAULT_THEME.primaryLight;
  const cssPrimaryDark = getCssVariable('--color-primary-dark') || DEFAULT_THEME.primaryDark;

  return {
    primary: cssPrimary.startsWith('#') ? cssPrimary : `#${cssPrimary}`,
    primaryLight: cssPrimaryLight.startsWith('#') ? cssPrimaryLight : `#${cssPrimaryLight}`,
    primaryDark: cssPrimaryDark.startsWith('#') ? cssPrimaryDark : `#${cssPrimaryDark}`,
  };
}

function applyThemeToCss(theme: ColorTheme) {
  if (typeof window === 'undefined') return;

  document.documentElement.style.setProperty('--color-primary', theme.primary);
  document.documentElement.style.setProperty('--color-primary-light', theme.primaryLight);
  document.documentElement.style.setProperty('--color-primary-dark', theme.primaryDark);

  if (theme.secondary) {
    document.documentElement.style.setProperty('--color-secondary', theme.secondary);
  }
  if (theme.secondaryLight) {
    document.documentElement.style.setProperty('--color-secondary-light', theme.secondaryLight);
  }
  if (theme.secondaryDark) {
    document.documentElement.style.setProperty('--color-secondary-dark', theme.secondaryDark);
  }
}

function saveThemeToStorage(theme: ColorTheme) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...theme, updatedAt: new Date().toISOString() }));
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error);
  }
}

export function useColorTheme() {
  const [theme, setTheme] = useState<ColorTheme>(DEFAULT_THEME);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    applyThemeToCss(initialTheme);
    setIsLoaded(true);
  }, []);

  const setPrimaryColor = useCallback((hex: string) => {
    if (!isValidHex(hex)) return;

    const variations = generateColorVariations(hex);
    const newTheme: ColorTheme = {
      ...theme,
      primary: variations.base,
      primaryLight: variations.light,
      primaryDark: variations.dark,
    };

    setTheme(newTheme);
    applyThemeToCss(newTheme);
    saveThemeToStorage(newTheme);
  }, [theme]);

  const setSecondaryColor = useCallback((hex: string) => {
    if (!isValidHex(hex)) return;

    const variations = generateColorVariations(hex);
    const newTheme: ColorTheme = {
      ...theme,
      secondary: variations.base,
      secondaryLight: variations.light,
      secondaryDark: variations.dark,
    };

    setTheme(newTheme);
    applyThemeToCss(newTheme);
    saveThemeToStorage(newTheme);
  }, [theme]);

  const resetColors = useCallback(() => {
    const defaultTheme = {
      primary: '#a5f0fa',
      primaryLight: '#b7f3fb',
      primaryDark: '#84c0c8',
    };

    setTheme(defaultTheme);
    applyThemeToCss(defaultTheme);

    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      document.documentElement.style.removeProperty('--color-primary');
      document.documentElement.style.removeProperty('--color-primary-light');
      document.documentElement.style.removeProperty('--color-primary-dark');
      document.documentElement.style.removeProperty('--color-secondary');
      document.documentElement.style.removeProperty('--color-secondary-light');
      document.documentElement.style.removeProperty('--color-secondary-dark');
    }
  }, []);

  const hasCustomColors = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEY) !== null;
  }, []);

  return {
    theme,
    isLoaded,
    setPrimaryColor,
    setSecondaryColor,
    resetColors,
    hasCustomColors: hasCustomColors(),
  };
}
