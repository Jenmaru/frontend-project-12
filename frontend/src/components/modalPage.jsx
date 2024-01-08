import React, { useState, useRef, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { selectors, actions as channelsAction } from '../reducers/Channels';
import * as Yup from 'yup';
import { Button, Form } from 'react-bootstrap';
import ChatContext from '../contexts/chatContext';

const validate = Yup.object().shape({
    channelname: Yup.string()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .required('От 3 до 20 символов'),
  });

const Modal = ({ onChange }) => {
    const inputRef = useRef();
    const channels = useSelector(selectors.selectAll);
    const chatContext = useContext(ChatContext);
    const { sendNewChannel } = chatContext;
    const handleClick = () => {
        onChange(true);
    }

    useEffect(() => {
        inputRef.current.focus();
      }, []);

    const formik = useFormik({
        initialValues: {
          channelname: '',
        },
        onSubmit: (values) => {
            sendNewChannel(values.channelname);
            onChange(true);
      },
        validationSchema: validate,
        validateOnChange: false,
      });

    return (
        <>
        <div class="fade modal-backdrop show">
            <div></div>
        </div>
        <div role="dialog" aria-modal="true" style={{ display: 'block' }} class="fade modal show" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="modal-title h4">Добавить канал</div>
                        <button onClick={handleClick} type="button" aria-label="Close" data-bs-dismiss="modal" class="btn btn-close"></button>
                    </div>
                    <div class="modal-body">
                        <Form onSubmit={formik.handleSubmit}  class="">
                        <fieldset disabled={formik.isSubmitting}>
                        <div>
                            <Form.Control
                                className='mb-2'
                                onChange={formik.handleChange}
                                value={formik.values.channelname}
                                name="channelname"
                                id="channelname"
                                autoComplete="channelname"
                                isInvalid={formik.errors.channelname && formik.touched.channelname}
                                required
                                ref={inputRef}
                            />
                        <label class="visually-hidden" for="name">Имя канала</label>
                        {formik.errors.channelname && formik.touched.channelname && (
                        <div class="invalid-feedback">{formik.errors.channelname}</div>
                        )}
                        
                        <div class="d-flex justify-content-end">
                            <Button onClick={handleClick} type="button" variant="secondary me-2" disabled={formik.isSubmitting}>Отменить</Button>
                            <Button type="submit" value='submit' variant="primary" disabled={formik.isSubmitting}>Отправить</Button>
                        </div>
                    </div>
                    </fieldset>
                    </Form>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Modal;