import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import useAuth from '../hooks/index';
import routes from '../hooks/routes.js';
import axios from 'axios';
import Header from '../components/header';

const loginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От трех до 20 символов')
    .required('Обязательное поле'),
  password: Yup.string()
    .min(6, 'Не менее 6 символов')
    .required('Обязательное поле'),
  confirmpassword: Yup.string()
  .min(5, 'Минимум 8 буквы')
  .max(50, 'Максимум 50 букв')
  .required('Обязательное поле'),
});

const SignUpPage = () => {
    const auth = useAuth();
    const [authFailed, setAuthFailed] = useState(false);
    const inputRef = useRef();
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
              setAuthFailed(true);
              inputRef.current.select();
              return;
            }
            throw err;
          }
        },
        validationSchema: loginSchema, 
        validateOnChange: true,
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
        <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
            <div>
                <img className='rounded-circle' alt='Регистрация' />
            </div>
          <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
            <fieldset disabled={formik.isSubmitting}>
                <h1 className='text-center mb-4'>Регистрация</h1>
              <Form.Group className='form-floating mb-3'>
                <Form.Control
                  onChange={formik.handleChange}
                  value={formik.values.username}
                  name="username"
                  id="username"
                  autoComplete="username"
                  isInvalid={authFailed}
                  required
                  placeholder="Имя пользователя"
                  ref={inputRef}
                />
                <label for='username'>Имя пользователя</label>
                {formik.errors.username && formik.touched.username && (
                    <div className='invalid-tooltip' placement='right'>{formik.errors.username}</div>
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
              <Form.Group className='form-floating mb-3'>
                <Form.Control
                  type="confirmpassword"
                  onChange={formik.handleChange}
                  value={formik.values.confirmpassword}
                  placeholder="Подтвердите пароль"
                  name="confirmpassword"
                  id="confirmpassword"
                  autoComplete="current-password"
                  isInvalid={authFailed}
                  required
                />
                <label for='confirmpassword'>Подтвердите пароль</label>
                <Form.Control.Feedback type="invalid">the username or password is incorrect</Form.Control.Feedback>
              </Form.Group>
              <Button type="submit" variant="outline-primary w-100 mb-3">Зарегистрироваться</Button>
            </fieldset>
          </Form>
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

export default SignUpPage;