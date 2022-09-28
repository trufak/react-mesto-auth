import PopupWithForm from "./PopupWithForm";
import { useRef, useState, useEffect } from "react";

function EditAvatarPopup({ isOpen, onUpdateAvatar, onClose }) {
  const [textButton, setTextButton] = useState("Сохранить");

  useEffect(() => {
    isOpen && setTextButton("Сохранить");
    avatarRef.current.value = "";
  }, [isOpen]);

  const avatarRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    setTextButton("Сохранение...");
    onUpdateAvatar(avatarRef.current.value);
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
            ref={avatarRef}
          />
          <span className="popup__input-error link-avatar-error" />
        </li>
      </ul>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
