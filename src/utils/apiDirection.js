export const addDirection = async Direction => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  try {
    const response = await fetch(`${API_URL}/directions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Direction }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'ajout de la direction");
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
};
