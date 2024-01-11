import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import useAuth from '../hooks/index';
import routes from '../hooks/routes.js';
import axios from 'axios';
import Header from "../components/header";

const loginSchema = Yup.object().shape({
  username: Yup.string()
    .min(5, 'Минимум 5 букв')
    .max(50, 'Максимум 50 букв')
    .required('Обязательное поле'),
  password: Yup.string()
    .min(5, 'Минимум 8 буквы')
    .max(50, 'Максимум 50 букв')
    .required('Обязательное поле'),
});

const MainPage = () => {
    const auth = useAuth();
    const [authFailed, setAuthFailed] = useState(false);
    const inputRef = useRef();
    const location = useLocation();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
          username: '',
          password: '',
        },
        onSubmit: async (values) => {
          setAuthFailed(false);
    
          try {
            const response = await axios.post(routes.loginPath(), values);
            localStorage.setItem('userId', JSON.stringify(response.data));
            auth.logIn(response.data.token, response.data.username);
            const { from } = location.state || { from: { pathname: '/' } };
            navigate(from);
          } catch (err) {
            formik.setSubmitting(false);
            if (err.isAxiosError && err.response.status === 401) {
              setAuthFailed(true);
              inputRef.current.select();
              return;
            }
            throw err;
          }
        },
        validationSchema: loginSchema, 
      });

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div className='h-100'>
    <div id='chat' className='h-100'>
    <div className='d-flex flex-column h-100'>
    <Header />
    <div className='container-fluid h-100'>
    <div className='row justify-content-center align-content-center h-100'>
    <div className="col-12 col-md-8 col-xxl-6">
      <div className="card shadow-sm">
        <div className="card-body row p-5">
          <div className='col-12 col-md-6 d-flex align-items-center justify-content-center'>
            <img className='rounded-circle' alt='Войти' />
          </div>
          <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
            <fieldset disabled={formik.isSubmitting}>
                <h1 className='text-center mb-4'>Войти</h1>
              <Form.Group className='form-floating mb-3'>
                <Form.Control
                  onChange={formik.handleChange}
                  value={formik.values.username}
                  name="username"
                  id="username"
                  autoComplete="username"
                  isInvalid={authFailed}
                  required
                  placeholder="Ваш ник"
                  ref={inputRef}
                />
                <label for='username'>Ваш ник</label>
                {formik.errors.username && formik.touched.username && (
                    <div className='text-danger'>{formik.errors.username}</div>
                )}
              </Form.Group>
              <Form.Group className='form-floating mb-3'>
                <Form.Control
                  type="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  placeholder="Пароль"
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  isInvalid={authFailed}
                  required
                />
                <label for='password'>Пароль</label>
                <Form.Control.Feedback type="invalid">the username or password is incorrect</Form.Control.Feedback>
              </Form.Group>
              <Button type="submit" variant="outline-primary w-100 mb-3">Войти</Button>
            </fieldset>
          </Form>
        </div>
        <div className='card-footer p-4'>
          <div className='text-center'>
            <span>Нет аккаунта?</span>
            {' '}
            <a href='/signup'>Регистрация</a>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
  )
};

export default MainPage;
