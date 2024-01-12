import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import ChatContext from '../contexts/chatContext';
import { useTranslation } from 'react-i18next';

const RemoveModal = ({ onChange, channel, toastMessage }) => {
    const { t } = useTranslation();
    const chatContext = useContext(ChatContext);
    const { removeChannel } = chatContext;
    const handleClick = () => {
        onChange(true);
    }

    const remove = () => {
        try {
            removeChannel(channel.id);
            onChange(true);
            toastMessage(t('toast.channelRemove'), 'success');
        } catch {
            toastMessage(t('toast.error'), 'error');
        }
      };

    return (
        <>
        <div class="fade modal-backdrop show">
            <div></div>
        </div>
        <div role="dialog" aria-modal="true" style={{ display: 'block' }} class="fade modal show" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="modal-title h4">{t("modal.remove")}</div>
                        <button onClick={handleClick} type="button" aria-label="Close" data-bs-dismiss="modal" class="btn btn-close"></button>
                    </div>
                    <div class="modal-body">
                        <p className='lead'>{t("modal.confirm")}</p>
                        <div class="d-flex justify-content-end">
                            <Button onClick={handleClick} type="button" variant="secondary me-2">{t("modal.cancel")}</Button>
                            <Button onClick={() => remove()} type="button" value='submit' variant="primary btn-danger">{t("modal.removeSend")}</Button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RemoveModal;