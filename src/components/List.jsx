import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import Card from './Card';
import { Plus, MoreHorizontal, Edit2, Trash2, X, Check } from 'lucide-react';

/**
 * Componente List - Representa una lista de tarjetas dentro del tablero
 * @param {Object} list - Datos de la lista con sus tarjetas
 * @param {number} index - Índice de la lista en el tablero
 * @param {Function} onEditList - Función para editar el título de la lista
 * @param {Function} onDeleteList - Función para eliminar la lista
 * @param {Function} onAddCard - Función para agregar una nueva tarjeta
 * @param {Function} onEditCard - Función para editar una tarjeta
 * @param {Function} onDeleteCard - Función para eliminar una tarjeta
 */
const List = ({
  list,
  index,
  onEditList,
  onDeleteList,
  onAddCard,
  onEditCard,
  onDeleteCard
}) => {
  // Estados para controlar los diferentes modos de la lista
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  // Estados para los formularios
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');
  const [editedTitle, setEditedTitle] = useState(list.title);

  /**
   * Manejar el envío del formulario para agregar una nueva tarjeta
   * @param {Event} e - Evento del formulario
   */
  const handleAddCardSubmit = (e) => {
    e.preventDefault();
    
    // Validar que el título no esté vacío
    if (newCardTitle.trim()) {
      onAddCard(list.id, {
        title: newCardTitle.trim(),
        description: newCardDescription.trim()
      });
      
      // Limpiar el formulario y cerrar el modo de edición
      setNewCardTitle('');
      setNewCardDescription('');
      setIsAddingCard(false);
    }
  };

  /**
   * Cancelar la creación de una nueva tarjeta
   */
  const handleCancelAddCard = () => {
    setNewCardTitle('');
    setNewCardDescription('');
    setIsAddingCard(false);
  };

  /**
   * Manejar el envío del formulario para editar el título de la lista
   * @param {Event} e - Evento del formulario
   */
  const handleEditTitleSubmit = (e) => {
    e.preventDefault();
    
    // Validar que el título no esté vacío y sea diferente
    if (editedTitle.trim() && editedTitle.trim() !== list.title) {
      onEditList(list.id, editedTitle.trim());
    }
    
    setIsEditingTitle(false);
    setShowMenu(false);
  };

  /**
   * Cancelar la edición del título
   */
  const handleCancelEditTitle = () => {
    setEditedTitle(list.title);
    setIsEditingTitle(false);
  };

  /**
   * Manejar la eliminación de la lista
   */
  const handleDeleteList = () => {
    onDeleteList(list.id);
    setShowMenu(false);
  };

  return (
    <div className="flex-shrink-0 w-80 bg-gray-50 rounded-lg shadow-list">
      {/* Header de la lista */}
      <div className="p-3 border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex items-center justify-between">
          {isEditingTitle ? (
            /* Formulario para editar título */
            <form onSubmit={handleEditTitleSubmit} className="flex-1 flex items-center space-x-2">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="flex-1 px-2 py-1 text-sm font-semibold text-gray-800 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
                maxLength={50}
              />
              <button
                type="submit"
                className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors duration-200"
                title="Guardar"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleCancelEditTitle}
                className="p-1 text-gray-400 hover:bg-gray-100 rounded transition-colors duration-200"
                title="Cancelar"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Título normal de la lista */
            <>
              <h3 className="text-sm font-semibold text-gray-800 truncate pr-2">
                {list.title}
              </h3>
              
              {/* Menú de opciones */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200"
                  title="Opciones de lista"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {/* Dropdown del menú */}
                {showMenu && (
                  <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 animate-fade-in">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsEditingTitle(true);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition-colors duration-200"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Editar título</span>
                      </button>
                      
                      <button
                        onClick={handleDeleteList}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Eliminar lista</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Contador de tarjetas */}
        <div className="mt-1">
          <span className="text-xs text-gray-500">
            {list.cards.length} {list.cards.length === 1 ? 'tarjeta' : 'tarjetas'}
          </span>
        </div>
      </div>

      {/* Sección para agregar nueva tarjeta - Movida arriba */}
      <div className="p-3 border-b border-gray-200 bg-white">
        {isAddingCard ? (
          /* Formulario para agregar nueva tarjeta */
          <form onSubmit={handleAddCardSubmit} className="space-y-3">
            <input
              type="text"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              placeholder="Título de la tarjeta..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
              maxLength={100}
            />
            
            <textarea
              value={newCardDescription}
              onChange={(e) => setNewCardDescription(e.target.value)}
              placeholder="Descripción (opcional)..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="2"
              maxLength={500}
            />
            
            <div className="flex items-center space-x-2">
              <button
                type="submit"
                disabled={!newCardTitle.trim()}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  newCardTitle.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Agregar tarjeta
              </button>
              
              <button
                type="button"
                onClick={handleCancelAddCard}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
                title="Cancelar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          /* Botón para mostrar formulario de nueva tarjeta */
          <button
            onClick={() => setIsAddingCard(true)}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-200 group"
          >
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            <span className="text-sm font-medium">Agregar una tarjeta</span>
          </button>
        )}
      </div>

      {/* Área de drop para las tarjetas - Sin scroll, altura automática */}
      <Droppable droppableId={list.id} type="DEFAULT">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-3 min-h-[50px] space-y-3 transition-all duration-200 bg-gray-50 rounded-b-lg ${
              snapshot.isDraggingOver 
                ? 'bg-blue-50 border-2 border-blue-200 border-dashed' 
                : ''
            }`}
          >
            {/* Renderizar todas las tarjetas */}
            {list.cards.map((card, cardIndex) => (
              <Card
                key={card.id}
                card={card}
                index={cardIndex}
                listId={list.id}
                onEditCard={onEditCard}
                onDeleteCard={onDeleteCard}
              />
            ))}
            
            {provided.placeholder}

            {/* Mensaje cuando la lista está vacía */}
            {list.cards.length === 0 && !isAddingCard && (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">No hay tarjetas</p>
                <p className="text-gray-400 text-xs mt-1">Usa el botón de arriba para agregar una nueva tarjeta</p>
              </div>
            )}
          </div>
        )}
      </Droppable>

      {/* Cerrar menú al hacer clic fuera */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default List;
