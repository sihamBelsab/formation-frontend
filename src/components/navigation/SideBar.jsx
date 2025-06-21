import React from 'react';
import './sidebar.css';
import { Link } from 'react-router-dom';

function SideBar(props) {
  const { userInfo } = props;
  const sidebarItems = [
    {
      name: 'Tableau de bord',
      icon: 'bi bi-grid',
      path: '/',
      allowedRoles: ['service_formation', 'directeur_rh', 'directeur_general', 'admin'],
    },
    {
      name: 'Utilisateurs',
      icon: 'bi bi-people',
      allowedRoles: ['admin', 'service_formation'],
      innerItems: [
        {
          name: 'Gestion des comptes',
          icon: 'bi bi-person-lines-fill',
          path: '/gestion-comptes',
          allowedRoles: ['admin'],
        },
        {
          name: 'Gestion des employés',
          icon: 'bi bi-person-plus',
          path: '/gestion-employes',
          allowedRoles: ['admin', 'service_formation'],
        },
      ],
    },
    {
      name: 'Besoin en formations',
      icon: 'bi bi-pencil-square',
      path: '/gestion-besoins',
      allowedRoles: ['responsable_direction', 'admin'],
    },
    {
      name: 'Gestion des Formations',
      icon: 'bi bi-pencil-square',
      allowedRoles: ['admin', 'service_formation', 'directeur_general'],
      innerItems: [
        {
          name: 'Planification des formations',
          icon: 'bi bi-calendar-event',
          path: '/gestion-formations',
          allowedRoles: ['admin', 'service_formation', 'directeur_general'],
        },
        {
          name: 'Intervenants externes',
          icon: 'bi bi-person-plus',
          path: '/gestion-formateurs',
          allowedRoles: ['admin', 'service_formation', 'directeur_general'],
        },
        {
          name: 'Structure ',
          icon: 'bi bi-diagram-3',
          path: '/gestion-structure',
          allowedRoles: ['admin', 'service_formation', 'directeur_general'],
        },
      ],
    },
    {
      name: 'Évaluation',
      icon: 'bi bi-star',
      innerItems: [
        {
          name: 'Évaluation à froid',
          icon: 'bi bi-bookmark-star',
          path: '/evaluation-froid',
          allowedRoles: ['responsable_direction', 'admin', 'service_formation'],
        },
        { name: 'Évaluation à chaud', icon: 'bi bi-bookmark-star', path: '/evaluation-chaud' },
      ],
    },
    {
      name: 'Plan Annuel',
      icon: 'bi bi-file-earmark-text',
      allowedRoles: ['admin', 'service_formation', 'directeur_general', 'directeur_rh'],
      innerItems: [
        {
          name: 'Etablir le plan',
          icon: 'bi bi-pencil-square',
          path: '/Etablir-plan',
          allowedRoles: ['admin', 'service_formation'],
        },
        {
          name: 'Valider le plan',
          icon: 'bi bi-file-check',
          path: '/valider-plan',
          allowedRoles: ['directeur_rh', 'directeur_general'],
        },
      ],
    },
  ];

  return (
    <aside id='sidebar' className='sidebar'>
      <ul className='sidebar-nav' id='sidebar-nav'>
        {sidebarItems.map((item, index) => {
          if (item.innerItems) {
            if (item.allowedRoles && !item.allowedRoles.includes(userInfo.role)) {
              return null; // Skip rendering this item if the user's role is not allowed
            }
            return (
              <li className='nav-item' key={index}>
                <a
                  className='nav-link collapsed'
                  data-bs-target={`#${item.name.replace(/\s+/g, '')}-nav`}
                  data-bs-toggle='collapse'
                  href='#'
                >
                  <i className={item.icon}></i>
                  <span>{item.name}</span>
                  <i className='bi bi-chevron-down ms-auto'></i>
                </a>
                <ul
                  id={`${item.name.replace(/\s+/g, '')}-nav`}
                  className='nav-content collapse'
                  data-bs-parent='#sidebar-nav'
                >
                  {item.innerItems.map((innerItem, innerIndex) => {
                    if (innerItem.allowedRoles && !innerItem.allowedRoles.includes(userInfo.role)) {
                      return null; // Skip rendering this item if the user's role is not allowed
                    }
                    return (
                      <li key={innerIndex}>
                        <Link className='nav-link' to={innerItem.path}>
                          <i className={innerItem.icon}></i>
                          <span>{innerItem.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          } else {
            if (item.allowedRoles && !item.allowedRoles.includes(userInfo.role)) {
              return null; // Skip rendering this item if the user's role is not allowed
            }
            return (
              <li className='nav-item' key={index}>
                <Link className='nav-link collapsed' to={item.path}>
                  <i className={item.icon}></i>
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          }
        })}
      </ul>
    </aside>
  );
}

export default SideBar;
