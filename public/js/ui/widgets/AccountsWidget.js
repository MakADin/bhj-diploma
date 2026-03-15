/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  static element;
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (!element) {
      throw new Error('Элемент не существует');
    }

    this.element = element;
    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const accountsPanel = document.querySelector('.accounts-panel');
    const createAccountBtn = document.querySelector('.create-account');

    accountsPanel.addEventListener('click', (e) => {
      const targetAcc = e.target.closest('.account');
      if (!targetAcc) {
        return;
      } else {
        this.onSelectAccount(targetAcc);
      }
    });

    createAccountBtn.addEventListener('click', (e) => {
      e.preventDefault();
      App.getModal('createAccount').open();
    });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItems()
   * */
  update() {
    if (User.current()) {
      Account.list(User.current(), (err, accounts) => {
        if (err) {
          throw new Error('Ошибка получения счетов:', err);
        }
        this.clear();
        this.renderItems(accounts);
      });
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const accounts = document.querySelectorAll('.account');
    accounts.forEach((acc) => {
      acc.remove();
    });
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active.
   * Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {
    const activeAccounts = this.element.querySelectorAll('.active');
    activeAccounts.forEach((acc) => acc.classList.remove('active'));

    element.classList.add('active');

    const id = element.dataset.id;

    App.showPage('transactions', { account_id: id });
    App.showHeaderContent();
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item) {
    return `
      <li class="account" data-id="${item.id}">
        <a href="#">
            <span>${item.name}</span> /
            <span>${item.sum} ₽</span>
        </a>
      </li>
    `;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItems(data) {
    if (data.success) {
      const accountsPanel = document.querySelector('.accounts-panel');

      const accounts = data.data;
      if (accounts.length > 0) {
        accounts.forEach((acc) => {
          const html = this.getAccountHTML(acc);
          accountsPanel.insertAdjacentHTML('beforeend', html);
        });
      }
    }
  }
}
