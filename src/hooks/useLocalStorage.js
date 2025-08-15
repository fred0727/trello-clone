import { useState, useEffect } from 'react';

/**
 * Hook personalizado para manejar datos persistentes en localStorage
 * Simula un backend real manteniendo los datos entre sesiones
 * 
 * @param {string} key - Clave para el localStorage
 * @param {*} initialValue - Valor inicial si no hay datos guardados
 * @returns {Array} [value, setValue, loading, error]
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos del localStorage al montar el componente
  useEffect(() => {
    try {
      setLoading(true);
      setError(null);
      
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsedValue = JSON.parse(item);
        setStoredValue(parsedValue);
        console.log(`📦 Datos cargados desde localStorage para '${key}'`);
      } else {
        console.log(`📦 Usando valor inicial para '${key}'`);
        setStoredValue(initialValue);
      }
    } catch (err) {
      console.error(`❌ Error al cargar desde localStorage para '${key}':`, err);
      setError(err);
      setStoredValue(initialValue);
    } finally {
      setLoading(false);
    }
  }, [key, initialValue]);

  // Función para actualizar el valor y guardarlo en localStorage
  const setValue = (value) => {
    try {
      setError(null);
      
      // Permitir que value sea una función como en useState normal
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      // Guardar en localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      console.log(`💾 Datos guardados en localStorage para '${key}'`);
      
    } catch (err) {
      console.error(`❌ Error al guardar en localStorage para '${key}':`, err);
      setError(err);
    }
  };

  return [storedValue, setValue, loading, error];
};

/**
 * Hook para simular operaciones asíncronas como las de un backend real
 * Añade delays realistas para simular latencia de red
 * 
 * @param {Function} asyncFunction - Función asíncrona a ejecutar
 * @param {Object} options - Opciones de configuración
 * @returns {Array} [execute, loading, error, data]
 */
export const useAsyncOperation = (asyncFunction, options = {}) => {
  const { delay = 1000, onSuccess, onError } = options;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = async (...args) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Iniciando operación asíncrona...');
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Ejecutar la función
      const result = await asyncFunction(...args);
      
      setData(result);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      console.log('✅ Operación completada exitosamente');
      return result;
      
    } catch (err) {
      console.error('❌ Error en operación asíncrona:', err);
      setError(err);
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return [execute, loading, error, data];
};

/**
 * Hook para gestionar el estado de guardado de datos
 * Útil para mostrar indicadores de "cambios sin guardar"
 * 
 * @returns {Object} Objeto con estado y funciones de control
 */
export const useSaveState = () => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const markAsChanged = () => {
    setHasUnsavedChanges(true);
  };

  const markAsSaved = () => {
    setHasUnsavedChanges(false);
    setLastSaved(new Date());
  };

  const startSaving = () => {
    setIsSaving(true);
  };

  const stopSaving = () => {
    setIsSaving(false);
  };

  return {
    hasUnsavedChanges,
    lastSaved,
    isSaving,
    markAsChanged,
    markAsSaved,
    startSaving,
    stopSaving
  };
};

/**
 * Hook para gestionar el historial de cambios (undo/redo)
 * Permite deshacer y rehacer operaciones
 * 
 * @param {*} initialState - Estado inicial
 * @param {number} maxHistory - Máximo número de estados en el historial
 * @returns {Object} Estado actual y funciones de control
 */
export const useHistory = (initialState, maxHistory = 10) => {
  const [history, setHistory] = useState([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const current = history[currentIndex];
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const setState = (newState) => {
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newState);
    
    // Limitar el tamaño del historial
    if (newHistory.length > maxHistory) {
      newHistory.shift();
    } else {
      setCurrentIndex(prev => prev + 1);
    }
    
    setHistory(newHistory);
  };

  const undo = () => {
    if (canUndo) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const redo = () => {
    if (canRedo) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const clearHistory = () => {
    setHistory([current]);
    setCurrentIndex(0);
  };

  return {
    current,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
    historyLength: history.length
  };
};
