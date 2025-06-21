import React from 'react';
import { Table } from 'react-bootstrap';

export const TableComponent = ({
  currentRows, //Les données à afficher (tableau d'objets, chaque objet = une ligne).
  selectedRows, //Un tableau contenant les index des lignes sélectionnées.
  handleCheckboxChange, //Fonction appelée quand une case à cocher est cliquée.
  emptyRowTemplate, //Un objet définissant la structure des colonnes (ex: { nom: "", prenom: "" })
  columnLabels, // Les en-têtes de colonnes (ex: { nom: "Nom", prenom: "Prénom" }).
}) => {
  const rowStyle = index => ({
    backgroundColor: selectedRows.includes(index) ? '#58a5e0' : '58a5e0',
  });
  return (
    <Table striped hover responsive>
      <thead>
        <tr>
          <th className='table-header'></th>
          {Object.keys(columnLabels).map(key => (
            <th className='table-header' key={key}>
              {columnLabels[key]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {currentRows.map((row, index) => (
          <tr key={index} style={rowStyle(index)}>
            <td>
              <input
                type='checkbox'
                checked={selectedRows.includes(index)}
                onChange={() => handleCheckboxChange(index)}
              />
            </td>
            {Object.keys(emptyRowTemplate).map(key => (
              <td key={key}>
                {key === 'Statut' ? (
                  <Form.Check
                    type='switch'
                    id={`statut-switch-${index}`}
                    label={row.Statut === 1 ? '1' : '0'}
                    checked={row.Statut === 1}
                  />
                ) : (
                  row[key]
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
