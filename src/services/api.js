
const SERVER_URL = 'http://localhost:3001'; // Cambia esto a la URL de tu servidor
// Función para obtener la lista de mesas
export const fetchTables = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/api/tables`);
    if (!response.ok) {
      throw new Error('Error al cargar las mesas');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Función para crear una nueva mesa
export const createTable = async (tableName, userId) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/tables`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: tableName,
        createdBy: userId,
      }),
    });
    if (!response.ok) {
      throw new Error('Error al crear la mesa');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Función para unirse a una mesa
export const joinTable = async (tableId, userId) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/tables/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tableId,
        userId,
      }),
    });
    if (!response.ok) {
      throw new Error('Error al unirse a la mesa');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Función para salir de una mesa
export const leaveTable = async (tableId, userId) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/tables/leave`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tableId,
        userId,
      }),
    });
    if (!response.ok) {
      throw new Error('Error al salir de la mesa');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};