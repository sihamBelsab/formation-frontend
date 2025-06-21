export const addDirection = async Direction => {
  try {
    const response = await fetch('http://localhost:5000/api/directions', {
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
