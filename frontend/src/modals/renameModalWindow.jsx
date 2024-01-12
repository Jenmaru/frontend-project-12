import React, { useRef, useEffect, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Form } from 'react-bootstrap';
import ChatContext from '../contexts/chatContext';
import { useTranslation } from 'react-i18next';

const validate = Yup.object().shape({
    channelname: Yup.string()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .required('От 3 до 20 символов'),
  });

const RenameModal = ({ onChange, channel, toastMessage }) => {
    const { t } = useTranslation();
    const inputRef = useRef();
    const chatContext = useContext(ChatContext);
    const { renameChannel } = chatContext;
    const handleClick = () => {
        onChange(true);
    }

    useEffect(() => {
        inputRef.current.focus();
      }, []);

    const formik = useFormik({
        initialValues: {
          channelname: channel.name,
        },
        onSubmit: (values) => {
            try {
            renameChannel(channel.id, values.channelname);
            onChange(true);
            toastMessage(t('toast.channelRename'), 'success');
            } catch {
                toastMessage(t('toast.error'), 'error'); 
            }
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
                        <div class="modal-title h4">{t("modal.rename")}</div>
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
                        <label class="visually-hidden" for="name">{t("channels.name")}</label>
                        {formik.errors.channelname && formik.touched.channelname && (
                        <div class="invalid-feedback">{formik.errors.channelname}</div>
                        )}
                        
                        <div class="d-flex justify-content-end">
                            <Button onClick={handleClick} type="button" variant="secondary me-2" disabled={formik.isSubmitting}>{t("modal.cancel")}</Button>
                            <Button type="submit" value='submit' variant="primary" disabled={formik.isSubmitting}>{t("modal.send")}</Button>
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

export default RenameModal;