import React, { useState } from 'react';
import { 
  Settings, 
  Download, 
  Upload, 
  Info, 
  Keyboard, 
  X, 
  FileText,
  HelpCircle,
  Github,
  Heart
} from 'lucide-react';

/**
 * Componente HelpModal - Modal de ayuda y configuración
 * @param {boolean} isOpen - Si el modal está abierto
 * @param {Function} onClose - Función para cerrar el modal
 * @param {Object} boardData - Datos del tablero para exportar
 */
const HelpModal = ({ isOpen, onClose, boardData }) => {
  const [activeTab, setActiveTab] = useState('help');

  if (!isOpen) return null;

  /**
   * Exportar datos del tablero
   */
  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(boardData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `trello-board-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      console.log('📁 Datos exportados correctamente');
    } catch (error) {
      console.error('Error al exportar:', error);
      alert('Error al exportar los datos');
    }
  };

  /**
   * Importar datos al tablero
   */
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          // Aquí podrías agregar validación y importar los datos
          console.log('📁 Datos importados:', data);
          alert('Función de importación disponible en versión completa');
        } catch (error) {
          console.error('Error al importar:', error);
          alert('Error al leer el archivo JSON');
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  };

  const tabs = [
    { id: 'help', label: 'Ayuda', icon: HelpCircle },
    { id: 'shortcuts', label: 'Atajos', icon: Keyboard },
    { id: 'settings', label: 'Configuración', icon: Settings },
    { id: 'about', label: 'Acerca de', icon: Info }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Ayuda y Configuración</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {activeTab === 'help' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">¿Cómo usar Trello Clone?</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div>
                    <strong>Crear listas:</strong> Haz clic en "Agregar una lista" para crear nuevas categorías.
                  </div>
                  <div>
                    <strong>Agregar tarjetas:</strong> Usa el botón "Agregar una tarjeta" dentro de cada lista.
                  </div>
                  <div>
                    <strong>Mover tarjetas:</strong> Arrastra y suelta las tarjetas entre diferentes listas.
                  </div>
                  <div>
                    <strong>Editar contenido:</strong> Pasa el mouse sobre tarjetas y listas para ver opciones de edición.
                  </div>
                  <div>
                    <strong>Guardar cambios:</strong> Los cambios se guardan automáticamente en tu navegador.
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-2">Funciones principales:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Drag & drop entre listas</li>
                  <li>Edición en línea de títulos y descripciones</li>
                  <li>Persistencia local de datos</li>
                  <li>Interfaz responsive para móviles</li>
                  <li>Animaciones suaves</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'shortcuts' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Atajos de teclado</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Agregar nueva lista</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Ctrl + L</kbd>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Agregar nueva tarjeta</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Ctrl + N</kbd>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Guardar cambios</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Ctrl + S</kbd>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Ayuda</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">F1</kbd>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                * Los atajos de teclado estarán disponibles en la próxima versión
              </p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Configuración</h3>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Datos del tablero</h4>
                <div className="space-y-3">
                  <button
                    onClick={handleExport}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Download className="w-4 h-4" />
                    <span>Exportar datos (JSON)</span>
                  </button>
                  
                  <button
                    onClick={handleImport}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Importar datos (JSON)</span>
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-3">Preferencias</h4>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input 
                      type="checkbox" 
                      defaultChecked 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">Habilitar animaciones</span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input 
                      type="checkbox" 
                      defaultChecked 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">Guardar automáticamente</span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">Modo oscuro (próximamente)</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Trello Clone</h3>
                <p className="text-gray-600">Versión 1.0.0</p>
              </div>

              <div className="text-center space-y-3">
                <p className="text-sm text-gray-600">
                  Una aplicación de gestión de tareas construida con React, TailwindCSS y react-beautiful-dnd.
                </p>
                
                <div className="flex items-center justify-center space-x-4">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    <Github className="w-4 h-4" />
                    <span className="text-sm">GitHub</span>
                  </a>
                  
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="text-sm">Hecho con amor</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-800 mb-2">Tecnologías utilizadas:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>• React 18</div>
                  <div>• TailwindCSS</div>
                  <div>• Vite</div>
                  <div>• React Beautiful DnD</div>
                  <div>• Lucide React</div>
                  <div>• LocalStorage API</div>
                </div>
              </div>

              <div className="text-center text-xs text-gray-500">
                <p>© 2024 Trello Clone. Proyecto educativo.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
