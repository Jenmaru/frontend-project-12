import React, { useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Form, FloatingLabel } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import useAuth from '../hooks/index.jsx';
import routes from '../hooks/routes.js';
import Header from '../components/header.jsx';

const loginSchema = Yup.object().shape({
  username: Yup.string()
    .required('Обязательное поле')
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов'),
  password: Yup.string()
    .required('Обязательное поле')
    .min(6, 'Не менее 6 символов'),
  confirmpassword: Yup.string()
    .required('Обязательное поле')
    .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать'),
});

const SignUpPage = () => {
  const auth = useAuth();
  const userNameRef = useRef();
  const passwordRef = useRef();
  const confirmRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmpassword: '',
    },
    onSubmit: async (values) => {
      const { username, password } = values;

      try {
        const response = await axios.post(routes.createUserPath(), { username, password });
        auth.logIn(response.data.token, response.data.username);
        const { from } = location.state || { from: { pathname: '/' } };
        navigate(from);
      } catch (err) {
        formik.setSubmitting(false);
        if (err.isAxiosError && err.response.status === 401) {
          userNameRef.current.select();
          return;
        }
        throw err;
      }
    },
    validationSchema: loginSchema,
    validateOnChange: true,
  });

  useEffect(() => {
    userNameRef.current.focus();
  }, []);

  return (
    <div className="d-flex flex-column h-100">
      <Header />
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-content-center h-100">
          <div className="col-12 col-md-8 col-xxl-6">
            <div className="card shadow-sm">
              <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
                <div>
                  <img className="rounded-circle" src="https://frontend-chat-ru.hexlet.app/static/media/avatar_1.6084447160acc893a24d.jpg" alt="Регистрация" />
                </div>
                <Form onSubmit={formik.handleSubmit} className="w-50">
                  <fieldset disabled={formik.isSubmitting}>
                    <h1 className="text-center mb-4">Регистрация</h1>
                    <Form.Group className="form-floating mb-3">
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Имя пользователя"
                        className="mb-3"
                      >
                        <Form.Control
                          onChange={formik.handleChange}
                          value={formik.values.username}
                          name="username"
                          id="username"
                          autoComplete="username"
                          required
                          placeholder="Имя пользователя"
                          ref={userNameRef}
                          className={formik.touched.username
                    && formik.errors.username ? 'is-invalid' : ''}
                        />
                        <div className="invalid-tooltip">{formik.errors.username}</div>
                      </FloatingLabel>
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
                          ref={passwordRef}
                          required
                          className={formik.touched.password
                    && formik.errors.password ? 'is-invalid' : ''}
                        />
                        <div className="invalid-tooltip">{formik.errors.password}</div>
                      </FloatingLabel>
                    </Form.Group>
                    <Form.Group className="form-floating mb-4">
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Подтвердите пароль"
                        className="mb-4"
                      >
                        <Form.Control
                          type="confirmpassword"
                          onChange={formik.handleChange}
                          value={formik.values.confirmpassword}
                          placeholder="Подтвердите пароль"
                          name="confirmpassword"
                          id="confirmpassword"
                          autoComplete="current-password"
                          ref={confirmRef}
                          required
                          className={formik.touched.confirmpassword
                    && formik.errors.confirmpassword ? 'is-invalid' : ''}
                        />
                        <div className="invalid-tooltip">{formik.errors.confirmpassword}</div>
                      </FloatingLabel>
                    </Form.Group>
                    <Button type="submit" variant="outline-primary w-100">Зарегистрироваться</Button>
                  </fieldset>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
