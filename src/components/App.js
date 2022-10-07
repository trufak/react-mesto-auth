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
import { Switch, Route, useHistory } from "react-router-dom";
import Register from "./Register";
import Login from './Login';
import ProtectedRoute from "./ProtectedRoute";
import apiAuth from "../utils/authApi";
import InfoTooltip from "./InfoTooltip";

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
  const history = useHistory();

  //Hookes
  //Запрос email о пользователе и карточек
  useEffect(()=>{
    const token = localStorage.getItem('tokenMesto');
    if (token) {
      apiAuth.getUser(token)
      .then (data=>{
        setLoggedIn(true);
        setCurrentUser(Object.assign(data.data, currentUser));
        history.push('/');
      })
      .catch(err=>console.log(err));
    }
  },[]);
  //Запрос данных о пользователе и карточек
  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([userInfo, initialCards]) => {
        setCurrentUser(Object.assign(userInfo, currentUser));
        setCards(initialCards);
      })
      .catch((err) => console.log(err));
    }
  }, [loggedIn]);

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
  //Закрытие InfoTooltip
  const closeInfoTooltip = () => {
    isInfoTooltipOpen && setIsInfoTooltipOpen(false);
    loggedIn && history.push('/');
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
    return apiAuth.signup(email, password)
    .then(res=>{
      handleLogin(res.data.email, password);
    })
    .catch(err=>{
      console.log(err);
      setIsInfoTooltipOpen(true);
    });
  };
  //авторизация пользователя
  const handleLogin = (email, password) => {
    return apiAuth.signin(email, password)
    .then(data=>{
      if (data.token) {
        setIsInfoTooltipOpen(true);
        localStorage.setItem('tokenMesto', data.token);
        const emailObj = { email: email };
        setCurrentUser(Object.assign({ email: email }, currentUser));
        setLoggedIn(true);
      } else return Promise.reject();
    })
    .catch(err=> {
      console.log(err);
      setIsInfoTooltipOpen(true);
    });
  };

  return (
    <div className="main-page">
      <CurrentUserContext.Provider value={currentUser}>
          <Header />
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
          <InfoTooltip isOpen={isInfoTooltipOpen} loggedIn={loggedIn} onClose={closeInfoTooltip}/>
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
