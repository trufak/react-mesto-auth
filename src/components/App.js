import React from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import EditProfilePopup from "./EditProfilePopup";
import ImagePopup from "./ImagePopup";
import api from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import DeleteCardPopup from "./DeleteCardPopup";
import { Switch, Route, Redirect} from 'react-router-dom';

function App() {
  //States
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] =
    React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [isCardPopupOpen, setIsCardPopupOpen] = React.useState(false);
  const [cards, setCards] = React.useState([]);
  const [currentUser, setCurrentUser] = React.useState({});
  const [loggedIn, setLoggedIn]=React.useState(false);

  //Hookes
  //Запрос данных о пользователе и карточек при монтировании
  React.useEffect(() => {
    Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([userInfo, initialCards]) => {
        setCurrentUser(userInfo);
        setCards(initialCards);
      })
      .catch((err) => console.log(err));
  }, []);

  //Functions and callbacks
  //Обработчик нажатия на кнопку редактирования аватара
  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };
  //Обработчик нажатия на кнопку редактирования профиля
  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };
  //Обработчик нажатия на кнопку добавления карточки
  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };
  //Обработчик нажатия на карточку
  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsCardPopupOpen(true);
  };
  //Обновление данных пользователя
  const handleUpdateUser = (userData) => {
    api
      .patchUserInfo(userData.name, userData.about)
      .then((userInfo) => {
        setCurrentUser(userInfo);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  };
  //Обновление аватара
  const handleUpdateAvatar = (link) => {
    api
      .changeAvatar(link)
      .then((userInfo) => {
        setCurrentUser(userInfo);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  };
  //Установка/снятие лайка
  const handleCardLike = (card) => {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log(err));
  };
  //Открытия popup подтверждения
  const handleCardDelete = (card) => {
    setSelectedCard(card);
    setIsDeleteCardPopupOpen(true);
  };
  //Удаление карточки
  const handleCardDeleteSubmit = () => {
    api
      .deleteCard(selectedCard._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== selectedCard._id));
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  };
  //Добавление карточки
  const handleAddPlaceSubmit = (name, link) => {
    api
      .postCard(name, link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  };
  //Обработчик закрытия popup при нажатии на крестик или оверлей
  const handleClosePopup = (e) => {
    if (
      e.target.classList.contains("popup") ||
      e.target.classList.contains("close-button")
    )
      closeAllPopups();
  };
  //Закрытие popup
  const closeAllPopups = () => {
    isEditAvatarPopupOpen && setIsEditAvatarPopupOpen(false);
    isEditProfilePopupOpen && setIsEditProfilePopupOpen(false);
    isAddPlacePopupOpen && setIsAddPlacePopupOpen(false);
    isCardPopupOpen && setIsCardPopupOpen(false);
    isDeleteCardPopupOpen && setIsDeleteCardPopupOpen(false);
    setSelectedCard({});
  };

  const isOpen =
    isEditAvatarPopupOpen ||
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    selectedCard.link;

  React.useEffect(() => {
    function closeByEscape(evt) {
      if (evt.key === "Escape") {
        closeAllPopups();
      }
    }
    if (isOpen) {
      // навешиваем только при открытии
      document.addEventListener("keydown", closeByEscape);
      return () => {
        document.removeEventListener("keydown", closeByEscape);
      };
    }
  }, [isOpen]);

  return (
    <div className="App">
    <Switch>
      <Route path = "/sign-up">
        <p>sign-up</p>
      </Route>
      <Route path = "/sign-in">
        <p>sign-in</p>
      </Route>
      <Route path = "/">  {
        loggedIn
          ? <CurrentUserContext.Provider value={currentUser}>
          <div className="main-page">
            <Header />
            <Main
              cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              onEditAvatar={handleEditAvatarClick}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onCardClick={handleCardClick}
            />
            <Footer />
          </div>
          <ImagePopup
            card={selectedCard}
            onClose={handleClosePopup}
            isOpen={isCardPopupOpen}
          />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={handleClosePopup}
            onUpdateUser={handleUpdateUser}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={handleClosePopup}
            onUpdateAvatar={handleUpdateAvatar}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={handleClosePopup}
            onAddPlace={handleAddPlaceSubmit}
          />
          <DeleteCardPopup
            isOpen={isDeleteCardPopupOpen}
            onClose={handleClosePopup}
            onSubmit={handleCardDeleteSubmit}
          />
          </CurrentUserContext.Provider>
          : <Redirect to="/sign-in" /> }
      </Route>
    </Switch>




    </div>
  );
}

export default App;
