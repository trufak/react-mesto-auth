import successImage from "../images/Success.svg";
import failImage from "../images/Fail.svg";

function InfoTooltip({ isOpen, loggedIn, onClose }) {
  return (
    <div className={`popup ${isOpen && "popup_opened"}`} onClick={onClose}>
      <div className="popup__container popup__container_login">
        <button
            type="button"
            className="close-button close-button_popup"
            aria-label="Закрыть"
          />
        <img
          className="popup__mask-login"
          src={loggedIn ? successImage : failImage}
        />
        <h3 className="popup__title popup__title_login">
          {loggedIn
            ? "Вы успешно зарегистрировались!"
            : "Что-то пошло не так! Попробуйте ещё раз."}
        </h3>
      </div>
    </div>
  );
}

export default InfoTooltip;
