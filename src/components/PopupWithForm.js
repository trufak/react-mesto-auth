import FormValidator from '../utils/FormValidator';
import formValidSetting from '../utils/formValidSetting';
import { useRef, useEffect, useState } from 'react';

function PopupWithForm({
  isOpen,
  onClose,
  onSubmit,
  name,
  title,
  buttonClassName,
  textButton,
  children,
}) {

  const formRef = useRef();
  const [formValidator] = useState(new FormValidator(formValidSetting));

  useEffect(()=>{
    formValidator.enableValidation(formRef.current);
  },[]);

  useEffect(()=>{
    isOpen && formValidator.clearErrors();
  },[isOpen]);

  return (
    <div
      className={`popup ${name} ${isOpen && "popup_opened"}`}
      onClick={onClose}
    >
      <div className="popup__container">
        <button
          type="button"
          className="close-button close-button_popup"
          aria-label="Закрыть"
        />
        <h3 className="popup__title">{title}</h3>
        <form
          ref={formRef}
          name={name}
          className="popup__form"
          noValidate
          onSubmit={onSubmit}
        >
          {children}
          <button
            type="submit"
            className={`popup__submit-button ${buttonClassName}`}
          >
            {textButton}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;
