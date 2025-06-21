import React from 'react';
import { Button } from 'react-bootstrap';
export const ActionButtons = ({
  buttonsList, //Un tableau d'objets, où chaque objet représente un bouton
  //label (String) : Texte du bouton (ex: "Ajouter").
  //icon (JSX/React Node) : Icône (ex: <FaPlus />).
  //onClick (Function) : Fonction appelée lors du clic.
}) => {
  return (
    <div className='d-flex align-items-center gap-3 flex-wrap'>
      {buttonsList.map((button, index) => (
        <Button key={index} onClick={button.onClick} className='action-button'>
          {button.icon} {button.label}
        </Button>
      ))}
    </div>
  );
};
