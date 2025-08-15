import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import Board from './components/Board';
import HelpModal from './components/HelpModal';
import mockData from './data/mockData.json';
import { useLocalStorage, useSaveState } from './hooks/useLocalStorage';
import { Trello, Save, RotateCcw, Clock, Wifi, WifiOff, HelpCircle } from 'lucide-react';

/**
 * Componente principal de la aplicación Trello Clone
 * Maneja el estado global de los tableros y la lógica de drag & drop
 */
function App() {
  // Hook para persistencia local con localStorage
  const [boardData, setBoardData, loadingStorage] = useLocalStorage('trello-board-data', mockData.boards[0]);
  
  // Hook para gestionar el estado de guardado
  const {
    hasUnsavedChanges,
    lastSaved,
    isSaving,
    markAsChanged,
    markAsSaved,
    startSaving,
    stopSaving
  } = useSaveState();

  // Estado para mostrar mensajes de feedback
  const [message, setMessage] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showHelpModal, setShowHelpModal] = useState(false);

  /**
   * Efecto para monitorear la conectividad
   */
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setMessage('🔗 Conexión restablecida');
      setTimeout(() => setMessage(''), 2000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setMessage('📴 Trabajando sin conexión');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  /**
   * Mostrar mensaje temporal
   */
  const showMessage = (msg, duration = 3000) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), duration);
  };

  /**
   * Simular el guardado de datos al JSON
   * En una aplicación real, esto haría una petición POST/PUT al backend
   */
  const handleSaveData = async () => {
    try {
      startSaving();
      showMessage('💾 Guardando cambios...');
      
      // Simular guardado con delay realista
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('💾 Datos guardados (simulado):', boardData);
      markAsSaved();
      showMessage('✅ Cambios guardados correctamente');
      
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      showMessage('❌ Error al guardar los cambios');
    } finally {
      stopSaving();
    }
  };

  /**
   * Restablecer datos a la versión original del JSON
   */
  const handleResetData = () => {
    if (window.confirm('¿Estás seguro de que quieres restablecer todos los cambios?')) {
      setBoardData(mockData.boards[0]);
      markAsSaved();
      showMessage('🔄 Datos restablecidos');
    }
  };

  /**
   * Manejar el final del arrastre de tarjetas
   * @param {Object} result - Resultado del drag & drop de react-beautiful-dnd
   */
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // Si no hay destino válido, no hacer nada
    if (!destination) return;

    // Si la tarjeta se soltó en la misma posición, no hacer nada
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Crear una copia profunda de los datos para evitar mutaciones
    const newBoardData = JSON.parse(JSON.stringify(boardData));
    
    // Encontrar las listas de origen y destino
    const sourceList = newBoardData.lists.find(list => list.id === source.droppableId);
    const destinationList = newBoardData.lists.find(list => list.id === destination.droppableId);

    // Remover la tarjeta de la lista de origen
    const [movedCard] = sourceList.cards.splice(source.index, 1);

    // Agregar la tarjeta a la lista de destino
    destinationList.cards.splice(destination.index, 0, movedCard);

    // Actualizar el estado
    setBoardData(newBoardData);
    markAsChanged();

    console.log(`🔄 Tarjeta "${movedCard.title}" movida de "${sourceList.title}" a "${destinationList.title}"`);
  };

  /**
   * Agregar una nueva lista al tablero
   * @param {string} title - Título de la nueva lista
   */
  const handleAddList = (title) => {
    const newList = {
      id: `list-${Date.now()}`,
      title: title,
      cards: []
    };

    const newBoardData = {
      ...boardData,
      lists: [...boardData.lists, newList]
    };

    setBoardData(newBoardData);
    markAsChanged();
    console.log(`➕ Nueva lista creada: "${title}"`);
  };

  /**
   * Editar el título de una lista existente
   * @param {string} listId - ID de la lista a editar
   * @param {string} newTitle - Nuevo título para la lista
   */
  const handleEditList = (listId, newTitle) => {
    const newBoardData = {
      ...boardData,
      lists: boardData.lists.map(list =>
        list.id === listId ? { ...list, title: newTitle } : list
      )
    };

    setBoardData(newBoardData);
    markAsChanged();
    console.log(`✏️ Lista editada: "${newTitle}"`);
  };

  /**
   * Eliminar una lista del tablero
   * @param {string} listId - ID de la lista a eliminar
   */
  const handleDeleteList = (listId) => {
    const listToDelete = boardData.lists.find(list => list.id === listId);
    
    if (window.confirm(`¿Estás seguro de que quieres eliminar la lista "${listToDelete.title}" y todas sus tarjetas?`)) {
      const newBoardData = {
        ...boardData,
        lists: boardData.lists.filter(list => list.id !== listId)
      };

      setBoardData(newBoardData);
      markAsChanged();
      console.log(`🗑️ Lista eliminada: "${listToDelete.title}"`);
    }
  };

  /**
   * Agregar una nueva tarjeta a una lista
   * @param {string} listId - ID de la lista donde agregar la tarjeta
   * @param {Object} cardData - Datos de la nueva tarjeta
   */
  const handleAddCard = (listId, cardData) => {
    const newCard = {
      id: `card-${Date.now()}`,
      title: cardData.title,
      description: cardData.description || ''
    };

    const newBoardData = {
      ...boardData,
      lists: boardData.lists.map(list =>
        list.id === listId
          ? { ...list, cards: [...list.cards, newCard] }
          : list
      )
    };

    setBoardData(newBoardData);
    markAsChanged();
    console.log(`➕ Nueva tarjeta agregada: "${newCard.title}"`);
  };

  /**
   * Editar una tarjeta existente
   * @param {string} listId - ID de la lista que contiene la tarjeta
   * @param {string} cardId - ID de la tarjeta a editar
   * @param {Object} updatedCardData - Nuevos datos para la tarjeta
   */
  const handleEditCard = (listId, cardId, updatedCardData) => {
    const newBoardData = {
      ...boardData,
      lists: boardData.lists.map(list =>
        list.id === listId
          ? {
              ...list,
              cards: list.cards.map(card =>
                card.id === cardId
                  ? { ...card, ...updatedCardData }
                  : card
              )
            }
          : list
      )
    };

    setBoardData(newBoardData);
    markAsChanged();
    console.log(`✏️ Tarjeta editada: "${updatedCardData.title}"`);
  };

  /**
   * Eliminar una tarjeta de una lista
   * @param {string} listId - ID de la lista que contiene la tarjeta
   * @param {string} cardId - ID de la tarjeta a eliminar
   */
  const handleDeleteCard = (listId, cardId) => {
    const list = boardData.lists.find(l => l.id === listId);
    const card = list.cards.find(c => c.id === cardId);
    
    if (window.confirm(`¿Estás seguro de que quieres eliminar la tarjeta "${card.title}"?`)) {
      const newBoardData = {
        ...boardData,
        lists: boardData.lists.map(list =>
          list.id === listId
            ? { ...list, cards: list.cards.filter(card => card.id !== cardId) }
            : list
        )
      };

      setBoardData(newBoardData);
      markAsChanged();
      console.log(`🗑️ Tarjeta eliminada: "${card.title}"`);
    }
  };

  // Mostrar loading mientras se cargan los datos
  if (loadingStorage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tablero...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header de la aplicación */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo y título */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Trello className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Trello Clone</h1>
                <p className="text-sm text-gray-500">{boardData.title}</p>
              </div>
            </div>

            {/* Controles de la aplicación */}
            <div className="flex items-center space-x-3">
              {/* Estado de conexión */}
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <div className="flex items-center space-x-1 text-green-600" title="En línea">
                    <Wifi className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs">En línea</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-orange-600" title="Sin conexión">
                    <WifiOff className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs">Sin conexión</span>
                  </div>
                )}
              </div>

              {/* Último guardado */}
              {lastSaved && (
                <div className="hidden md:flex items-center space-x-1 text-gray-500 text-xs">
                  <Clock className="w-3 h-3" />
                  <span>
                    Guardado {new Date(lastSaved).toLocaleTimeString()}
                  </span>
                </div>
              )}

              {/* Mensaje de estado */}
              {message && (
                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium animate-fade-in">
                  {message}
                </div>
              )}

              {/* Indicador de cambios */}
              {hasUnsavedChanges && (
                <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  {isSaving ? 'Guardando...' : 'Cambios sin guardar'}
                </div>
              )}

              {/* Botones de acción */}
              <button
                onClick={() => setShowHelpModal(true)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                title="Ayuda y configuración"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Ayuda</span>
              </button>

              <button
                onClick={handleResetData}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                title="Restablecer cambios"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Restablecer</span>
              </button>

              <button
                onClick={handleSaveData}
                disabled={!hasUnsavedChanges || isSaving}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  hasUnsavedChanges && !isSaving
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                title="Guardar cambios"
              >
                <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">
                  {isSaving ? 'Guardando...' : 'Guardar'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="w-full p-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Board
            boardData={boardData}
            onAddList={handleAddList}
            onEditList={handleEditList}
            onDeleteList={handleDeleteList}
            onAddCard={handleAddCard}
            onEditCard={handleEditCard}
            onDeleteCard={handleDeleteCard}
          />
        </DragDropContext>
      </main>

      {/* Modal de ayuda */}
      <HelpModal 
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        boardData={boardData}
      />
    </div>
  );
}

export default App;
