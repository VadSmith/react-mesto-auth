import React, { useState, useEffect } from 'react';
import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import ImagePopup from './ImagePopup.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import api from '../utils/api.js';
import CurrentUserContext from '../contexts/CurrentUserContext';

function App() {
  const [currentUser, setCurrentUser] = useState({ name: '', about: '', avatar: '', _id: '' });
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cards, setCards] = useState([]);


  useEffect(() => {
    api.getInitialCards()
      .then((cardsJSON) => {
        setCards(cardsJSON);
      })
      .catch(err => `ОШИБКА! Не удалось получить карточки: ${err}`)
  }, [])

  useEffect(() => {
    api.getMyUserInfo()
      .then((userData) => {
        setCurrentUser(userData);
      })
      .catch(err => `ОШИБКА! Не удалось получить данные пользователя: ${err}`)
  }, [])


  function handleCardClick(cardJSON) {
    setSelectedCard(cardJSON);
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, !isLiked) // меняем статус лайка на противоположный
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      }).catch((err) => { console.log('Ошибка лайка', err) });
  }

  // Удаление карточки
  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      }).catch((err) => { console.log('Ошибка удаления карточки ', err) })
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  // Апдейт данных пользователя
  function handleUpdateUser(userObject) {
    api.setUserInfo(userObject)
      .then(responseUserObject => {
        setCurrentUser({ ...responseUserObject });
      })
      .catch(error => console.log('Ошибка сохранения даных юзера', error))
      .finally(
        closeAllPopups()
      )
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  // Апдейт аватара пользователя
  function handleUpdateAvatar(avatarUrl) {
    api.editAvatar(avatarUrl)
      .then(responseUserObject => {
        setCurrentUser({ ...responseUserObject });
      })
      .catch(error => console.log('Ошибка сохранения аватара', error))
      .finally(
        closeAllPopups()
      )
  }
  // Добавление карточи
  function handleAddPlace(cardObject) {
    api.addCard(cardObject)
      .then(newCard => {
        setCards([newCard, ...cards]);
      })
      .catch(error => console.log('ОШИБКА добавления места', error))
      .finally(
        closeAllPopups()
      )
  }

  // Закрыть все попапы
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard(null);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">

        <Header />

        <Main
          cards={cards}
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          onEditAvatar={handleEditAvatarClick}
          onCardClick={handleCardClick}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
        />

        <Footer />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onAddPlace={handleAddPlace}
          onClose={closeAllPopups}
        >
        </AddPlacePopup>

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
        />

      </div>

    </CurrentUserContext.Provider>
  );
}

export default App;
