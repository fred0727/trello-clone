/**
 * Utilidades para la aplicación Trello Clone
 * Funciones helper reutilizables
 */

/**
 * Generar un ID único basado en timestamp
 * @param {string} prefix - Prefijo para el ID
 * @returns {string} ID único
 */
export const generateId = (prefix = 'item') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Truncar texto a una longitud específica
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @param {string} suffix - Sufijo para el texto truncado
 * @returns {string} Texto truncado
 */
export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength) + suffix;
};

/**
 * Formatear fecha de manera legible
 * @param {Date|string} date - Fecha a formatear
 * @param {Object} options - Opciones de formato
 * @returns {string} Fecha formateada
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  };

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('es-ES', defaultOptions).format(dateObj);
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return 'Fecha inválida';
  }
};

/**
 * Obtener tiempo relativo (hace X minutos, hace X horas, etc.)
 * @param {Date|string} date - Fecha a comparar
 * @returns {string} Tiempo relativo
 */
export const getRelativeTime = (date) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now - dateObj) / 1000);

    if (diffInSeconds < 60) {
      return 'Hace un momento';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `Hace ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `Hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `Hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`;
    }

    return formatDate(dateObj, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (error) {
    console.error('Error al calcular tiempo relativo:', error);
    return 'Fecha inválida';
  }
};

/**
 * Validar datos de tarjeta
 * @param {Object} cardData - Datos de la tarjeta
 * @returns {Object} Resultado de validación
 */
export const validateCard = (cardData) => {
  const errors = {};
  
  if (!cardData.title || cardData.title.trim().length === 0) {
    errors.title = 'El título es obligatorio';
  } else if (cardData.title.length > 100) {
    errors.title = 'El título no puede exceder 100 caracteres';
  }

  if (cardData.description && cardData.description.length > 500) {
    errors.description = 'La descripción no puede exceder 500 caracteres';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validar datos de lista
 * @param {Object} listData - Datos de la lista
 * @returns {Object} Resultado de validación
 */
export const validateList = (listData) => {
  const errors = {};
  
  if (!listData.title || listData.title.trim().length === 0) {
    errors.title = 'El título es obligatorio';
  } else if (listData.title.length > 50) {
    errors.title = 'El título no puede exceder 50 caracteres';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Limpiar datos de entrada
 * @param {string} input - Texto de entrada
 * @returns {string} Texto limpio
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/\s+/g, ' ') // Reemplazar múltiples espacios con uno solo
    .replace(/[<>]/g, ''); // Remover caracteres potencialmente peligrosos
};

/**
 * Contar elementos en el tablero
 * @param {Object} boardData - Datos del tablero
 * @returns {Object} Conteos
 */
export const getBoardStats = (boardData) => {
  if (!boardData || !boardData.lists) {
    return { lists: 0, cards: 0, cardsPerList: {} };
  }

  const stats = {
    lists: boardData.lists.length,
    cards: 0,
    cardsPerList: {}
  };

  boardData.lists.forEach(list => {
    const cardCount = list.cards ? list.cards.length : 0;
    stats.cards += cardCount;
    stats.cardsPerList[list.id] = cardCount;
  });

  return stats;
};

/**
 * Buscar en el tablero
 * @param {Object} boardData - Datos del tablero
 * @param {string} query - Término de búsqueda
 * @returns {Array} Resultados de búsqueda
 */
export const searchBoard = (boardData, query) => {
  if (!boardData || !query || query.trim().length === 0) {
    return [];
  }

  const searchTerm = query.toLowerCase().trim();
  const results = [];

  boardData.lists.forEach(list => {
    // Buscar en títulos de listas
    if (list.title.toLowerCase().includes(searchTerm)) {
      results.push({
        type: 'list',
        listId: list.id,
        title: list.title,
        match: 'título de lista'
      });
    }

    // Buscar en tarjetas
    list.cards.forEach(card => {
      let matchType = null;
      
      if (card.title.toLowerCase().includes(searchTerm)) {
        matchType = 'título de tarjeta';
      } else if (card.description && card.description.toLowerCase().includes(searchTerm)) {
        matchType = 'descripción de tarjeta';
      }

      if (matchType) {
        results.push({
          type: 'card',
          listId: list.id,
          cardId: card.id,
          listTitle: list.title,
          title: card.title,
          description: card.description,
          match: matchType
        });
      }
    });
  });

  return results;
};

/**
 * Exportar datos del tablero
 * @param {Object} boardData - Datos del tablero
 * @param {string} format - Formato de exportación ('json', 'csv')
 * @returns {string} Datos exportados
 */
export const exportBoard = (boardData, format = 'json') => {
  try {
    switch (format.toLowerCase()) {
      case 'json':
        return JSON.stringify(boardData, null, 2);
      
      case 'csv':
        let csv = 'Lista,Tarjeta,Descripción\n';
        boardData.lists.forEach(list => {
          list.cards.forEach(card => {
            const title = `"${card.title.replace(/"/g, '""')}"`;
            const description = `"${(card.description || '').replace(/"/g, '""')}"`;
            csv += `"${list.title}",${title},${description}\n`;
          });
        });
        return csv;
      
      default:
        throw new Error(`Formato no soportado: ${format}`);
    }
  } catch (error) {
    console.error('Error al exportar datos:', error);
    throw error;
  }
};

/**
 * Importar datos al tablero
 * @param {string} data - Datos a importar
 * @param {string} format - Formato de los datos
 * @returns {Object} Datos del tablero
 */
export const importBoard = (data, format = 'json') => {
  try {
    switch (format.toLowerCase()) {
      case 'json':
        const parsed = JSON.parse(data);
        // Validar estructura básica
        if (!parsed.lists || !Array.isArray(parsed.lists)) {
          throw new Error('Formato JSON inválido: falta array de listas');
        }
        return parsed;
      
      default:
        throw new Error(`Formato de importación no soportado: ${format}`);
    }
  } catch (error) {
    console.error('Error al importar datos:', error);
    throw error;
  }
};

/**
 * Debounce function para optimizar búsquedas
 * @param {Function} func - Función a debounce
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función debounced
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Clonar objeto profundamente
 * @param {*} obj - Objeto a clonar
 * @returns {*} Copia profunda del objeto
 */
export const deepClone = (obj) => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    console.error('Error al clonar objeto:', error);
    return obj;
  }
};
