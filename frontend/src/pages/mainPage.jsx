import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Form, FloatingLabel } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import axios from 'axios';
import useAuth from '../hooks/index.jsx';
import routes from '../hooks/routes.js';
import Header from '../components/header.jsx';

const MainPage = () => {
  const auth = useAuth();
  const { t } = useTranslation();
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
        console.log(localStorage, values);
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
  });

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div className="h-100">
      <div id="chat" className="h-100">
        <div className="d-flex flex-column h-100">
          <Header />
          <div className="container-fluid h-100">
            <div className="row justify-content-center align-content-center h-100">
              <div className="col-12 col-md-8 col-xxl-6">
                <div className="card shadow-sm">
                  <div className="card-body row p-5">
                    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                      <img className="rounded-circle" alt="Войти" />
                    </div>
                    <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
                      <fieldset disabled={formik.isSubmitting}>
                        <h1 className="text-center mb-4">Войти</h1>
                        <Form.Group className="form-floating mb-3">
                          <FloatingLabel
                            controlId="floatingInput"
                            label="Ваш ник"
                            className="mb-3"
                          >
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
                          </FloatingLabel>
                          {formik.errors.username && formik.touched.username && (
                          <div className="text-danger">{formik.errors.username}</div>
                          )}
                        </Form.Group>
                        <Form.Group className="form-floating mb-3">
                          <FloatingLabel
                            controlId="floatingInput"
                            label="Пароль"
                            className="mb-3"
                          >
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
                          </FloatingLabel>
                          <Form.Control.Feedback type="invalid">the username or password is incorrect</Form.Control.Feedback>
                        </Form.Group>
                        <Button type="submit" variant="outline-primary w-100 mb-3">Войти</Button>
                      </fieldset>
                    </Form>
                  </div>
                  <div className="card-footer p-4">
                    <div className="text-center">
                      <span>Нет аккаунта?</span>
                      {' '}
                      <a href="/signup">{t('signUp.title')}</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
