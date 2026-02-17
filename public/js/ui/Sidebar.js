/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const bodyElement = document.body;

    document.querySelector('.sidebar-toggle').addEventListener('click', () => {
      bodyElement.classList.toggle('sidebar-open');
      bodyElement.classList.toggle('sidebar-collapse');
    });
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const sidebarMenu = document.querySelector('.sidebar-menu');

    sidebarMenu.addEventListener('click', (event) => {
      let clickedBtn = event.target.closest('.menu-item');

      if (!clickedBtn) return;

      if (clickedBtn.classList.contains('menu-item_login')) {
        App.getModal('login').open();

      } else if (clickedBtn.classList.contains('menu-item_register')) {
        App.getModal('register').open();

      } else if (clickedBtn.classList.contains('menu-item_logout')) {
        /* 
        User.logout()
          .then(() => {
            // После успешного выхода устанавливаем состояние приложения
            App.setState('init');
            console.log('Пользователь успешно вышел из системы');
          })
          .catch((err) => {
            console.error('Ошибка выхода:', err);
          });
        */
      }
    });
  }
}
