import PopupWithForm from "./PopupWithForm";
import { useState, useEffect } from "react";
import useForm from "../utils/useForm";

function AddPlacePopup({ isOpen, onAddPlace, onClose }) {
  const [textButton, setTextButton] = useState("Создать");

  const { values, handleChange, setValues } = useForm({
    name: "",
    link: "",
  });

  useEffect(() => {
    isOpen && setTextButton("Создать");
    setValues({
      name: "",
      link: "",
    });
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTextButton("Создание...");
    onAddPlace(values.name, values.link);
  };

  return (
    <PopupWithForm
      name="popup_add-card"
      title="Новое место"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonClassName="popup__submit-button_add"
      textButton={textButton}
    >
      <ul className="popup__inputs">
        <li>
          <input
            className="popup__input popup__input_name-card"
            id="name-card"
            name="name"
            type="text"
            placeholder="Название"
            minLength="2"
            maxLength="30"
            required
            value={values.name}
            onChange={handleChange}
          />
          <span className="popup__input-error name-card-error" />
        </li>
        <li>
          <input
            className="popup__input popup__input_link-card"
            id="link-card"
            name="link"
            type="url"
            placeholder="Ссылка на картинку"
            required
            value={values.link}
            onChange={handleChange}
          />
          <span className="popup__input-error link-card-error" />
        </li>
      </ul>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
