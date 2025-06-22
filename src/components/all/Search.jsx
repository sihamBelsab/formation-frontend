import React from 'react';
import './search.css';
function Search() {
  return (
    <div className='search-bar '>
      <form className='search-form d-flex align-items-center' method='POST' action='#'>
        <input type='text' name='query' placeholder='Rechercher' title='Rechercher par mot clé' />
        <button type='submit' title='Rechercher'>
          <i className='bi bi-search'></i>
        </button>
      </form>
    </div>
  );
}

export default Search;
