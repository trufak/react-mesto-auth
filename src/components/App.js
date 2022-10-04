import { useState, useEffect, useContext } from "react";
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
import { Switch, Route, useLocation } from "react-router-dom";
import Register from "./Register";
import Login from './Login';
import ProtectedRoute from "./ProtectedRoute";
import apiAuth from "../utils/authApi";

function App() {
  //States
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] =
    useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [isCardPopupOpen, setIsCardPopupOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [headerLink, setHeaderLink] = useState({
    name: 'Регистрация',
    path: '/sign-up'
  });
  const location = useLocation();

  useEffect(()=>{
    if (location.pathname === '/sign-in') {
      setHeaderLink({
        name: 'Регистрация',
        path: '/sign-up'
      });
    }
    else if (location.pathname === '/sign-up') {
      setHeaderLink({
        name: 'Вход',
        path: '/sign-in'
      });
    }
    else {
      setHeaderLink ({
        name: 'Выйти',
        path: '/sign-in'
      });
    }
  },[location]);

  //Hookes
  //Запрос данных о пользователе и карточек при монтировании
  useEffect(() => {
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
    isInfoTooltipOpen && setIsInfoTooltipOpen(false);
    setSelectedCard({});
  };

  const isOpen =
    isEditAvatarPopupOpen ||
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    selectedCard.link;

  useEffect(() => {
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

  //регистрация пользователя
  const handleRegister = (email, password) => {
    apiAuth.signup(email, password)
    .then(res=>{
      setIsInfoTooltipOpen(true);
    })
    .catch(err=>console.log(err));
  };
    //авторизация пользователя
  const handleLogin = (email, password) => {
    apiAuth.signup(email, password)
    .then(token=>{
      setIsInfoTooltipOpen(true);
      setLoggedIn(true);
    })
    .catch(err=>console.log(err));
  };

  return (
    <div className="main-page">
      <CurrentUserContext.Provider value={currentUser}>
          <Header link={headerLink}/>
          <Switch>
            <Route path="/sign-up">
              <Register onRegister={handleRegister}/>
            </Route>
            <Route path="/sign-in">
              <Login onLogin={handleLogin}/>
            </Route>
            <ProtectedRoute path="/" loggedIn={loggedIn}>
              <div>
                  <Main
                    cards={cards}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDelete}
                    onEditAvatar={handleEditAvatarClick}
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onCardClick={handleCardClick}
                  />
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
                  <Footer />
                </div>
            </ProtectedRoute>
          </Switch>
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
