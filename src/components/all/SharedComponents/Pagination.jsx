import React from 'react';
import { Button } from 'react-bootstrap';
//currentPage (number) : La page actuellement affichée (ex: 2).

//totalPages (number) : Le nombre total de pages (ex: 5).

//paginate (function) : Fonction appelée pour changer de page (reçoit le numéro de page).
export const Pagination = ({ currentPage, totalPages, paginate }) => {
  return (
    <div className='d-flex align-items-center gap-2 flex-wrap'>
      <span className='me-2'>
        Page ({currentPage} / {totalPages})
      </span>
      <Button
        variant='light'
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &laquo;
      </Button>
      <Button
        variant='light'
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &raquo;
      </Button>
    </div>
  );
};
