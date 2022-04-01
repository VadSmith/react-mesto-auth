import success from '../images/successRegistration.png';
import fail from '../images/failRegistration.png';

function InfoTooltip(props) {

  return (
    <section className={`popup ${props.isOpen && 'popup_opened'}`}>
      <div className="popup__overlay"></div>
      <div className="popup__content popup__reg-content">
        <button onClick={props.onClose} type="button" className="popup__close-button">
        </button>
        <img
          // className="popup__title"
          src={props.isRegistered ? success : fail}
          alt="Иконка результата авторизации" />
        <h3 className="popup__reg-message">{props.isRegistered ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.'}</h3>
      </div>
    </section>
  );
}

export default InfoTooltip;