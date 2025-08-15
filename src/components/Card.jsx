import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Edit2, Trash2, X, Check, GripVertical } from 'lucide-react';

/**
 * Componente Card - Representa una tarjeta individual dentro de una lista
 * @param {Object} card - Datos de la tarjeta (id, title, description)
 * @param {number} index - Índice de la tarjeta en la lista
 * @param {string} listId - ID de la lista que contiene la tarjeta
 * @param {Function} onEditCard - Función para editar la tarjeta
 * @param {Function} onDeleteCard - Función para eliminar la tarjeta
 */
const Card = ({ card, index, listId, onEditCard, onDeleteCard }) => {
  // Estados para controlar los modos de edición
  const [isEditing, setIsEditing] = useState(false);
  const [showActions, setShowActions] = useState(false);
  
  // Estados para los formularios de edición
  const [editedTitle, setEditedTitle] = useState(card.title);
  const [editedDescription, setEditedDescription] = useState(card.description || '');

  /**
   * Manejar el envío del formulario de edición
   * @param {Event} e - Evento del formulario
   */
  const handleEditSubmit = (e) => {
    e.preventDefault();
    
    // Validar que el título no esté vacío
    if (editedTitle.trim()) {
      onEditCard(listId, card.id, {
        title: editedTitle.trim(),
        description: editedDescription.trim()
      });
      setIsEditing(false);
      setShowActions(false);
    }
  };

  /**
   * Cancelar la edición y restaurar valores originales
   */
  const handleCancelEdit = () => {
    setEditedTitle(card.title);
    setEditedDescription(card.description || '');
    setIsEditing(false);
  };

  /**
   * Manejar la eliminación de la tarjeta
   */
  const handleDelete = () => {
    onDeleteCard(listId, card.id);
    setShowActions(false);
  };

  /**
   * Truncar texto si es muy largo
   * @param {string} text - Texto a truncar
   * @param {number} maxLength - Longitud máxima
   * @returns {string} Texto truncado
   */
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`bg-white rounded-lg shadow-card border border-gray-200 transition-all duration-200 group ${
            snapshot.isDragging
              ? 'shadow-2xl transform rotate-2 scale-105 z-50'
              : 'hover:shadow-card-hover card-hover'
          }`}
          style={{
            ...provided.draggableProps.style,
            ...(snapshot.isDragging && {
              transform: `${provided.draggableProps.style?.transform} rotate(2deg)`,
            })
          }}
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          {isEditing ? (
            /* Modo de edición */
            <div className="p-4">
              <form onSubmit={handleEditSubmit} className="space-y-3">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                  maxLength={100}
                  placeholder="Título de la tarjeta..."
                />
                
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  maxLength={500}
                  placeholder="Descripción (opcional)..."
                />
                
                <div className="flex items-center space-x-2">
                  <button
                    type="submit"
                    disabled={!editedTitle.trim()}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                      editedTitle.trim()
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Guardar
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-3 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Modo de visualización */
            <div className="p-4 relative">
              {/* Handle para arrastrar - Más prominente */}
              <div
                {...provided.dragHandleProps}
                className={`absolute top-2 right-2 p-1 rounded transition-all duration-200 cursor-grab active:cursor-grabbing ${
                  showActions || snapshot.isDragging ? 'opacity-100 bg-gray-100 hover:bg-gray-200' : 'opacity-0'
                }`}
                title="Arrastrar tarjeta"
              >
                <GripVertical className="w-4 h-4 text-gray-500" />
              </div>

              {/* Botones de acción */}
              <div className={`absolute top-2 right-10 flex items-center space-x-1 transition-opacity duration-200 ${
                showActions || snapshot.isDragging ? 'opacity-100' : 'opacity-0'
              }`}>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                  title="Editar tarjeta"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                
                <button
                  onClick={handleDelete}
                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                  title="Eliminar tarjeta"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              {/* Contenido de la tarjeta */}
              <div className="pr-14">
                <h4 className="text-sm font-medium text-gray-800 mb-2 leading-tight">
                  {card.title}
                </h4>
                
                {card.description && (
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {truncateText(card.description, 120)}
                  </p>
                )}
              </div>

              {/* Indicadores adicionales */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {/* Indicador de descripción larga */}
                  {card.description && card.description.length > 120 && (
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                      Ver más...
                    </span>
                  )}
                </div>

                {/* Indicador de ID para desarrollo (opcional) */}
                <span className="text-xs text-gray-400 font-mono">
                  #{card.id.split('-')[1]}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default Card;
