import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import SearchableSelect from './SearchableSelect';
import RadioGroup from './RadioGroup';

const FormationForm = ({ values, onChange, besoins, organismes, formateurs, disabled = false }) => (
  <Form>
    <Row>
      <Col md={6}>
        <Form.Group className='mb-3'>
          <Form.Label>Besoin de formation</Form.Label>
          <SearchableSelect
            options={besoins}
            value={values.idbes}
            onChange={idbes => onChange('idbes', idbes)}
            placeholder='Sélectionnez un besoin'
            displayField='titre'
            valueField='idbes'
            disabled={disabled}
          />
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label className='fw-bold'>Catégorie</Form.Label>
          <RadioGroup
            name='categorie'
            options={['metier', 'transverse', 'ordre légale']}
            value={values.categorie}
            onChange={e => onChange('categorie', e.target.value)}
            disabled={disabled}
          />
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group className='mb-3'>
          <Form.Label>Thème</Form.Label>
          <Form.Control
            type='text'
            name='theme'
            value={values.theme}
            onChange={e => onChange('theme', e.target.value)}
            className='custom-input'
            disabled={disabled}
          />
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label className='fw-bold'>Type</Form.Label>
          <RadioGroup
            name='type'
            options={['interne', 'externe']}
            value={values.type}
            onChange={e => onChange('type', e.target.value)}
            disabled={disabled}
          />
        </Form.Group>
      </Col>
    </Row>
    <Row>
      <Col md={6}>
        <Form.Group className='mb-3'>
          <Form.Label>Date début</Form.Label>
          <Form.Control
            type='date'
            name='date_debut'
            value={values.date_debut}
            onChange={e => onChange('date_debut', e.target.value)}
            className='custom-input'
            disabled={disabled}
          />
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group className='mb-3'>
          <Form.Label>Date fin</Form.Label>
          <Form.Control
            type='date'
            name='date_fin'
            value={values.date_fin}
            onChange={e => onChange('date_fin', e.target.value)}
            className='custom-input'
            disabled={disabled}
          />
        </Form.Group>
      </Col>
    </Row>
    <Row>
      <Col md={6}>
        <Form.Group className='mb-3'>
          <Form.Label>Organisme</Form.Label>
          <SearchableSelect
            options={organismes}
            value={values.id}
            onChange={id => onChange('id', id)}
            placeholder='Sélectionnez un organisme'
            displayField='libelle'
            valueField='id'
            disabled={disabled}
          />
        </Form.Group>
      </Col>
    </Row>
    <Form.Group className='mb-3'>
      <Form.Label>Formateur</Form.Label>
      <SearchableSelect
        options={formateurs}
        value={values.idformateur}
        onChange={idformateur => onChange('idformateur', idformateur)}
        placeholder='Sélectionnez un formateur'
        displayField={item => `${item.prenom} ${item.nom}`}
        valueField='idformateur'
        disabled={disabled}
      />
    </Form.Group>
    <Form.Group className='mb-3'>
      <Form.Label>État</Form.Label>
      <Form.Select
        name='etat'
        value={values.etat}
        onChange={e => onChange('etat', e.target.value)}
        className='custom-input'
        disabled={disabled}
      >
        <option value=''>Sélectionnez un état</option>
        <option value='realisé'>Réalisé</option>
        <option value='encours'>En cours</option>
        <option value='reporteé'>Reporté</option>
        <option value='annuleé'>Annulée</option>
      </Form.Select>
    </Form.Group>
  </Form>
);

export default FormationForm;
