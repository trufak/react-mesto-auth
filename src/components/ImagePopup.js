function ImagePopup({ isOpen, onClose, card }) {
  return (
    <div
      className={`popup popup_card ${isOpen && "popup_opened"}`}
      onClick={onClose}
    >
      <div className="popup__card-container">
        <button
          type="button"
          className="close-button close-button_popup"
          aria-label="Закрыть"
        />
        <img
          className="popup__mask"
          src={card.link}
          alt={card.name}
        />
        <h2 className="popup__caption">{card.name}</h2>
      </div>
    </div>
  );
}

export default ImagePopup;
