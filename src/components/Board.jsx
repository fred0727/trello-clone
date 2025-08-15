import React, { useState } from 'react';
import List from './List';
import { Plus, X } from 'lucide-react';

/**
 * Componente Board - Representa el tablero principal que contiene todas las listas
 * @param {Object} boardData - Datos del tablero con listas y tarjetas
 * @param {Function} onAddList - Función para agregar una nueva lista
 * @param {Function} onEditList - Función para editar el título de una lista
 * @param {Function} onDeleteList - Función para eliminar una lista
 * @param {Function} onAddCard - Función para agregar una nueva tarjeta
 * @param {Function} onEditCard - Función para editar una tarjeta
 * @param {Function} onDeleteCard - Función para eliminar una tarjeta
 */
const Board = ({
  boardData,
  onAddList,
  onEditList,
  onDeleteList,
  onAddCard,
  onEditCard,
  onDeleteCard
}) => {
  // Estado para controlar si se está agregando una nueva lista
  const [isAddingList, setIsAddingList] = useState(false);
  // Estado para el título de la nueva lista
  const [newListTitle, setNewListTitle] = useState('');

  /**
   * Manejar el envío del formulario para agregar una nueva lista
   * @param {Event} e - Evento del formulario
   */
  const handleAddListSubmit = (e) => {
    e.preventDefault();
    
    // Validar que el título no esté vacío
    if (newListTitle.trim()) {
      onAddList(newListTitle.trim());
      // Limpiar el formulario y cerrar el modo de edición
      setNewListTitle('');
      setIsAddingList(false);
    }
  };

  /**
   * Cancelar la creación de una nueva lista
   */
  const handleCancelAddList = () => {
    setNewListTitle('');
    setIsAddingList(false);
  };

  return (
    <div className="w-full h-full">
      {/* Información del tablero - Movida arriba */}
      <div className="mb-6 text-center">
        <div className="bg-white rounded-lg shadow-sm px-6 py-3 inline-block">
          <p className="text-sm text-gray-600 font-medium">
            {boardData.lists.length} {boardData.lists.length === 1 ? 'lista' : 'listas'} • {' '}
            {boardData.lists.reduce((total, list) => total + list.cards.length, 0)} {' '}
            {boardData.lists.reduce((total, list) => total + list.cards.length, 0) === 1 ? 'tarjeta' : 'tarjetas'}
          </p>
        </div>
      </div>

      {/* Contenedor scrolleable horizontal para las listas */}
      <div className="flex space-x-4 overflow-x-auto pb-4 custom-scrollbar min-h-[calc(100vh-250px)] w-full px-2">
        {/* Renderizar todas las listas existentes */}
        {boardData.lists.map((list, index) => (
          <List
            key={list.id}
            list={list}
            index={index}
            onEditList={onEditList}
            onDeleteList={onDeleteList}
            onAddCard={onAddCard}
            onEditCard={onEditCard}
            onDeleteCard={onDeleteCard}
          />
        ))}

        {/* Formulario para agregar nueva lista o botón para mostrar formulario */}
        <div className="flex-shrink-0 w-80">
          {isAddingList ? (
            /* Formulario para crear nueva lista */
            <div className="bg-white rounded-lg shadow-list p-4 animate-slide-in">
              <form onSubmit={handleAddListSubmit} className="space-y-3">
                <input
                  type="text"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  placeholder="Ingresa el título de la lista..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                  maxLength={50}
                />
                
                <div className="flex items-center space-x-2">
                  <button
                    type="submit"
                    disabled={!newListTitle.trim()}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      newListTitle.trim()
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Agregar lista
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleCancelAddList}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
                    title="Cancelar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Botón para mostrar formulario de nueva lista */
            <button
              onClick={() => setIsAddingList(true)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 rounded-lg p-4 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all duration-200 group"
            >
              <div className="flex items-center justify-center space-x-2">
                <Plus className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Agregar una lista</span>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Board;
