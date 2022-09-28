export default class FormValidator {
  constructor(formValidSetting) {
    this._formValidSetting = formValidSetting;
  }

  _setFormElement (formElement) {
    this._formElement = formElement;
    this._inputList = Array.from(
      this._formElement.querySelectorAll(this._formValidSetting.inputSelector));
    this._buttonElement = this._formElement.querySelector(
      this._formValidSetting.submitButtonSelector
    );
  }
  //Добавить валидацию форме
  enableValidation(formElement) {
    this._setFormElement(formElement);
    this._setEventListener();
  }
  //Очистка полей ошибок формы
  clearErrors() {
    this._inputList.forEach((inputElement) => {
      this._hideInputError(inputElement);
    });
    this._toggleButtonState();
  }
  //Добавление обработчиков всем полям формы
  _setEventListener = () => {
    this._toggleButtonState();
    this._inputList.forEach((inputElement) => {
      inputElement.addEventListener("input", () => {
        this._isValid(inputElement);
        this._toggleButtonState();
      });
    });
  };
  //Стилизация кнопки submit
  _toggleButtonState() {
    if (this._hasInvalidInput()) {
      this._buttonElement.disabled = true;
      this._buttonElement.classList.add(
        this._formValidSetting.inactiveButtonClass
      );
    } else {
      this._buttonElement.disabled = false;
      this._buttonElement.classList.remove(
        this._formValidSetting.inactiveButtonClass
      );
    }
  }
  //Проверка всех полей формы
  _hasInvalidInput() {
    return this._inputList.some((inputElement) => {
      return !inputElement.validity.valid;
    });
  }
  //Валидация поля
  _isValid(inputElement) {
    if (!inputElement.validity.valid)
      this._showInputError(inputElement, inputElement.validationMessage);
    else this._hideInputError(inputElement);
  }
  //Отображение сообщения об ошибке
  _showInputError(inputElement, errorMessage) {
    const errorElement = this._formElement.querySelector(
      `.${inputElement.id}-error`
    );
    inputElement.classList.add(this._formValidSetting.inputErrorClass);
    errorElement.textContent = errorMessage;
  }
  //Скрытие сообщения об ошибке
  _hideInputError(inputElement) {
    const errorElement = this._formElement.querySelector(
      `.${inputElement.id}-error`
    );
    inputElement.classList.remove(this._formValidSetting.inputErrorClass);
    errorElement.textContent = "";
  }
}
