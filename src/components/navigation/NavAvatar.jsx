import React, { useEffect, useState } from 'react';
import profileImg from '/users.jpg';
import { userApi } from '../../api'; // Updated to use new centralized API
import ImageUpload from '../common/ImageUpload';

function NavAvatar({ userInfo, setUserInfo }) {
  const [showModal, setShowModal] = React.useState(false);
  const [userImage, setUserImage] = useState(profileImg);

  const logOut = async () => {
    try {
      await userApi.logout();
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout API fails, clear local storage and redirect
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  const handleProfileClick = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  useEffect(() => {
    // Check if userInfo.image exists and form the Cloudinary URL, else use the default profileImg
    const newImageUrl = userInfo.image
      ? `https://res.cloudinary.com/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload/c_scale,w_300/v1/${userInfo.image}`
      : profileImg;

    setUserImage(newImageUrl); // Update the state with the new image URL

    // Log the new value after setting it (you can log here to see what is happening)
  }, [userInfo.image, profileImg]); // Depend on `userInfo.image` and `profileImg`

  return (
    <>
      <li className='nav-item dropdown pe-3'>
        <a
          className='nav-link nav-profile d-flex align-items-center pe-0'
          href='#'
          data-bs-toggle='dropdown'
        >
          <img
            src={userImage}
            alt='profile'
            className='rounded-circle aspect-square
'
          />
          <span className='d-none d-md-block dropdown-toggle ps-2'>
            {userInfo.nom} {userInfo.prenom}
          </span>
        </a>

        <ul className='dropdown-menu dropdown-menu-end dropdown-menu-arrow profile'>
          <li className='dropdown-header'>
            <h6>
              {userInfo.nom} {userInfo.prenom}
            </h6>
          </li>

          <li>
            <hr className='dropdown-divider' />
          </li>

          <li>
            <button
              className='dropdown-item d-flex align-items-center w-100'
              onClick={handleProfileClick}
            >
              <i className='bi bi-person'></i>
              <span className='ms-2'>Mon Profil</span>
            </button>
          </li>

          <li>
            <hr className='dropdown-divider' />
          </li>

          <li>
            <button className='dropdown-item d-flex align-items-center' onClick={logOut}>
              <i className='bi bi-box-arrow-right'></i>
              <span className='ms-2'> Se déconnecter</span>
            </button>
          </li>
        </ul>
      </li>

      {/* Modal Profile */}
      {showModal && (
        <div
          className='modal show fade d-block'
          tabIndex='-1'
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className='modal-dialog modal-dialog-centered'>
            <div className='modal-content rounded-4 p-4' style={{ overflow: 'visible' }}>
              {/* Image en haut */}
              <div className='modal-body text-center '>
                <div className='position-relative text-center ' style={{ marginTop: '-60px' }}>
                  <img
                    src={userImage}
                    alt='Profile'
                    className='rounded-circle shadow'
                    style={{
                      width: '120px',
                      height: '120px',
                      objectFit: 'cover',
                      border: '4px solid #2D499B',
                    }}
                  />
                </div>
                <ImageUpload userId={userInfo.id_utilisateur} setImageUrl={setUserImage} />

                {/* Liste des infos */}
                <div className='mt-4'>
                  <div className='d-flex justify-content-between py-3  border-bottom'>
                    <span className='text-muted'>Nom</span>
                    <span>
                      {' '}
                      {userInfo.nom} {userInfo.prenom}
                    </span>
                  </div>
                  <div className='d-flex justify-content-between py-3  border-bottom'>
                    <span className='text-muted'>Poste</span>
                    <span>{userInfo.role} </span>
                  </div>
                  <div className='d-flex justify-content-between py-3  border-bottom'>
                    <span className='text-muted'>Email</span>
                    <span>{userInfo.email} </span>
                  </div>
                  <div className='d-flex justify-content-between py-3  border-bottom'>
                    <span className='text-muted'>Matricule </span>
                    <span>{userInfo.matricule}</span>
                  </div>
                  <div className='d-flex justify-content-between py-3  border-bottom'>
                    <span className='text-muted'>Tel </span>
                    <span>{userInfo.tel}</span>
                  </div>
                </div>
              </div>

              {/* Bouton Fermer */}
              <div className='text-center mt-4'>
                <button
                  type='button'
                  className='btn px-4'
                  style={{
                    backgroundColor: '#2D499B',
                    color: '#fff',
                    border: 'none',
                  }}
                  onClick={handleClose}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NavAvatar;
