import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const EmployeeModal = ({ show, onHide, employees = [], title = 'Employés concernés' }) => {
  return (
    <Modal show={show} onHide={onHide} centered size='md'>
      <Modal.Header closeButton className='bg-light'>
        <Modal.Title className='text-primary'>
          <i className='bi bi-people-fill me-2'></i>
          {title}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {employees && employees.length > 0 ? (
          <div className='employee-list'>
            {employees.map((emp, index) => (
              <div
                key={emp.id_employe || `${emp.nom}-${index}`}
                className='employee-card mb-3 p-3 border rounded shadow-sm'
                style={{
                  transition: 'all 0.3s ease',
                  backgroundColor: '#f8f9fa',
                }}
              >
                <div className='d-flex justify-content-between align-items-start'>
                  <div className='flex-grow-1'>
                    <h6 className='mb-1 text-primary fw-bold'>
                      {emp.nom || 'Non renseigné'} {emp.prenom || 'Non renseigné'}
                    </h6>

                    <div className='text-muted small'>
                      <div className='mb-1'>
                        <i className='bi bi-briefcase me-1'></i>
                        <strong>Poste:</strong> {emp.poste || 'Non spécifié'}
                      </div>

                      <div className='mb-1'>
                        <i className='bi bi-building me-1'></i>
                        <strong>Direction:</strong> {emp.direction || 'Non spécifié'}
                      </div>

                      {emp.grade && (
                        <div className='mb-1'>
                          <i className='bi bi-award me-1'></i>
                          <strong>Grade:</strong> {emp.grade}
                        </div>
                      )}

                      {emp.email && (
                        <div className='mb-1'>
                          <i className='bi bi-envelope me-1'></i>
                          <strong>Email:</strong>
                          <a href={`mailto:${emp.email}`} className='text-decoration-none ms-1'>
                            {emp.email}
                          </a>
                        </div>
                      )}

                      {emp.tel && (
                        <div>
                          <i className='bi bi-telephone me-1'></i>
                          <strong>Téléphone:</strong>
                          <a href={`tel:${emp.tel}`} className='text-decoration-none ms-1'>
                            {emp.tel}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='text-end'>
                    <span className='badge bg-primary rounded-pill'>{emp.matricule || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}

            <div className='mt-3 p-2 bg-info bg-opacity-10 rounded'>
              <small className='text-muted'>
                <i className='bi bi-info-circle me-1'></i>
                Total: <strong>{employees.length}</strong> employé(s) concerné(s)
              </small>
            </div>
          </div>
        ) : (
          <div className='text-center py-4'>
            <i className='bi bi-people fs-1 text-muted mb-3'></i>
            <h5 className='text-muted'>Aucun employé associé</h5>
            <p className='text-muted mb-0'>
              Aucun employé n'est encore associé à ce besoin de formation.
            </p>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant='outline-primary' onClick={onHide}>
          <i className='bi bi-x-circle me-1'></i>
          Fermer
        </Button>
      </Modal.Footer>

      <style jsx>{`
        .employee-card:hover {
          background-color: #e9ecef !important;
          transform: translateX(5px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
        }

        .employee-list {
          max-height: 400px;
          overflow-y: auto;
        }

        .employee-list::-webkit-scrollbar {
          width: 6px;
        }

        .employee-list::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .employee-list::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }

        .employee-list::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </Modal>
  );
};

export default EmployeeModal;
