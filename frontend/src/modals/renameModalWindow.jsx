import React, { useRef, useEffect, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import ChatContext from '../contexts/chatContext';
import { selectors } from '../reducers/Channels';

const validate = (channelsName) => Yup.object().shape({
  channelname: Yup.string()
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов')
    .required('От 3 до 20 символов')
    .notOneOf(channelsName, 'Должно быть уникальным'),
});

const RenameModal = ({ onChange, channel, toast }) => {
  const { t } = useTranslation();
  const inputRef = useRef();
  const chatContext = useContext(ChatContext);
  const { renameChannel } = chatContext;
  const handleClick = () => {
    onChange(true);
  };

  const channels = useSelector(selectors.selectAll);
  const channelsName = channels.map((channelProp) => channelProp.name);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      channelname: '',
    },
    onSubmit: (values) => {
      try {
        renameChannel(channel.id, values.channelname);
        onChange(true);
        toast(t('toast.channelRename'), 'success');
      } catch {
        toast(t('toast.error'), 'error');
      }
    },
    validationSchema: validate(channelsName),
    validateOnChange: false,
  });

  return (
    <>
      <div className="fade modal-backdrop show">
        <div />
      </div>
      <div role="dialog" aria-modal="true" style={{ display: 'block' }} className="fade modal show" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title h4">{t('modal.rename')}</div>
              <button onClick={handleClick} type="button" aria-label="Close" data-bs-dismiss="modal" className="btn btn-close" />
            </div>
            <div className="modal-body">
              <Form onSubmit={formik.handleSubmit} class="">
                <fieldset disabled={formik.isSubmitting}>
                  <div>
                    <Form.Control
                      className="mb-2"
                      onChange={formik.handleChange}
                      value={formik.values.channelname}
                      name="channelname"
                      id="channelname"
                      autoComplete="channelname"
                      isInvalid={formik.errors.channelname && formik.touched.channelname}
                      required
                      ref={inputRef}
                    />
                    <label className="visually-hidden" htmlFor="name">{t('channels.name')}</label>
                    {formik.errors.channelname && formik.touched.channelname && (
                    <div className="invalid-feedback">{formik.errors.channelname}</div>
                    )}

                    <div className="d-flex justify-content-end">
                      <Button onClick={handleClick} type="button" variant="secondary me-2" disabled={formik.isSubmitting}>{t('modal.cancel')}</Button>
                      <Button type="submit" value="submit" variant="primary" disabled={formik.isSubmitting}>{t('modal.send')}</Button>
                    </div>
                  </div>
                </fieldset>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RenameModal;
