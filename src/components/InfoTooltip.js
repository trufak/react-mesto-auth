import successImage from "../images/Success.svg";
import failImage from "../images/Fail.svg";

function InfoTooltip({ isOpen, statusLogin }) {
  return (
    <div className={`popup ${isOpen && "popup_opened"}`}>
      <div className="popup__container">
        <img
          className="popup__mask_login"
          src={statusLogin ? successImage : failImage}
        />
        <h3 className="popup__title">
          {statusLogin
            ? "Вы успешно зарегистрировались!"
            : "Что-то пошло не так! Попробуйте ещё раз."}
        </h3>
      </div>
    </div>
  );
}

export default InfoTooltip;
