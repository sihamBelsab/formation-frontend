import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { userApi } from '../api'; // Updated to use new centralized API

const emailDomain = import.meta.env.VITE_EMAIL_DOMAIN;
const emailRegex = new RegExp(import.meta.env.VITE_EMAIL_REGEX);

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const onSubmit = async data => {
    try {
      setLoading(true);
      setError('');
      const response = await userApi.login(data.email, data.password);
      if (response.data.success) {
        const utilisateur = response.data.data;
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(utilisateur));
        window.location.href = '/';
      } else {
        setError(response.data.message || 'Échec de la connexion');
      }
    } catch (err) {
      console.error('Erreur de connexion :', err);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Échec de la connexion. Veuillez vérifier vos identifiants.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-page d-flex vh-100'>
      <div className='logo-container'>
        <img src='./src/images/logocev.png' alt='Logo' className='logo' />
      </div>

      <div className='login-form-section col-md-6 col-12 d-flex flex-column justify-content-center align-items-center px-5'>
        <h2 className='mb-3 fw-bold text-primary-custom'>Connexion</h2>
        <p className='mb-4 text-muted'>Veuillez vous connecter pour accéder à la plateforme</p>

        <form className='w-100' style={{ maxWidth: '400px' }} onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div className='mb-3 position-relative'>
            <label htmlFor='email' className='form-label'>
              Adresse e-mail
            </label>
            <div className='input-container position-relative'>
              <FaEnvelope
                className='input-icon position-absolute'
                style={{ left: 10, top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type='email'
                id='email'
                className={`form-control rounded-pill pl-5 ${errors.email ? 'is-invalid' : ''}`}
                placeholder={`prenom.nom@${emailDomain}`}
                disabled={loading}
                {...register('email', {
                  required: "L'email est requis.",
                  pattern: {
                    value: emailRegex,
                    message: `L'email doit être sous la forme prenom.nom@${emailDomain}.`,
                  },
                })}
              />
            </div>
            {errors.email && <div className='invalid-feedback'>{errors.email.message}</div>}
          </div>

          {/* Mot de passe */}
          <div className='mb-4 position-relative'>
            <label htmlFor='password' className='form-label'>
              Mot de passe
            </label>
            <div className='input-container position-relative'>
              <FaLock
                className='input-icon position-absolute'
                style={{ left: 10, top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                id='password'
                className={`form-control rounded-pill pl-5 ${errors.password ? 'is-invalid' : ''}`}
                disabled={loading}
                {...register('password', {
                  required: 'Le mot de passe est requis.',
                  pattern: {
                    value: /^(?=.*\d)[A-Za-z\d]{8,}$/,
                    message:
                      'Le mot de passe doit contenir au moins 8 caractères, dont un chiffre.',
                  },
                })}
              />
              <button
                type='button'
                className='position-absolute'
                style={{
                  right: 15,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                }}
                onClick={togglePasswordVisibility}
                disabled={loading}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            {errors.password && <div className='invalid-feedback'>{errors.password.message}</div>}
          </div>

          {/* Message d'erreur global */}
          {error && <div className='alert alert-danger'>{error}</div>}

          {/* Bouton de connexion */}
          <button
            type='submit'
            className='btn custom-login-btn w-100 rounded-pill mb-3'
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className='spinner-border spinner-border-sm me-2'
                  role='status'
                  aria-hidden='true'
                ></span>
                Connexion en cours...
              </>
            ) : (
              'Se connecter'
            )}
          </button>

          <div className='text-center text-muted small'>
            Accès réservé aux employés disposant d'un compte.
            <br />
            Veuillez contacter l'administrateur en cas de problème.
          </div>
        </form>
      </div>

      <div className='login-image-section col-md-6 col-12'></div>
    </div>
  );
};

export default Login;
