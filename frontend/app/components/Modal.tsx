import { ModalProps } from '../types/Generic';
import React from 'react';
import styles from '@/app/styles/modal.module.css';
//import "bootstrap/dist/css/bootstrap.min.css";

const Modal: React.FC<ModalProps> = ({ children, open, close, title }) => (
  <div
    className={`${styles.modal} ${open && styles.modalShow}`}
    tabIndex={-1}
    role="dialog"
    onClick={(evt) => { if (evt.target === evt.currentTarget) close(); }}
  >
    <div className={styles.modalDialog} role="document">
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>{title}</h3>
          <button type="button" className="btn-close" aria-label="Close"
            onClick={close}
          />
        </div>
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  </div>
);

export default Modal;