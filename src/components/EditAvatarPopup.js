import PopupWithForm from "./PopupWithForm";
import { useState, useEffect } from "react";
import { useFormAndValidation } from "../hooks/useFormAndValidation";

function EditAvatarPopup({ isOpen, onUpdateAvatar, onClose }) {
  const [textButton, setTextButton] = useState("Сохранить");
  const {values, handleChange, errors, isValid, setValues, resetForm} = useFormAndValidation();

  useEffect(() => {
    isOpen && setTextButton("Сохранить");
    resetForm();
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTextButton("Сохранение...");
    onUpdateAvatar(values.link);
  };

  return (
    <PopupWithForm
      name="popup_edit-avatar"
      title="Обновить аватар"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonClassName="popup__submit-button_edit"
      textButton={textButton}
    >
      <ul className="popup__inputs">
        <li>
          <input
            className="popup__input popup__input_link-avatar"
            id="link-avatar"
            name="link"
            type="url"
            placeholder="Ссылка на изображение"
            required
            value={values.link}
          />
          <span className="popup__input-error link-avatar-error">{errors.link}</span>
        </li>
      </ul>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
