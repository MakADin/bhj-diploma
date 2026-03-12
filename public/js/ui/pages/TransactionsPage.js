/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  static element;
  static lastOptions;
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    this.element = element;
    if (!element) {
      throw new Error('Элемент не существует!');
    }

    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render();
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const removeAccountBtn = this.element.querySelector('.remove-account');
    const accountsPanel = document.querySelector('.accounts-panel');

    removeAccountBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.removeAccount();
    });

    this.element.addEventListener('click', (e) => {
      const targetBtn = e.target.closest('.transaction__remove');
      if (targetBtn) {
        e.preventDefault();
        this.removeTransaction(targetBtn.dataset.id);
      }
    });

    accountsPanel.addEventListener('click', (e) => {
      const targetAcc = e.target.closest('.account');
      if (targetAcc) {
        App.showHeaderContent();
        this.render(targetAcc);
      }
    });

    // accountsPanel.addEventListener('click', (e) => {
    //   this.render(e.target.closest('.account'));
    // });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (!this.lastOptions) return;

    const isRemovedAccount = confirm('Вы действительно хотите удалить счет?');
    if (isRemovedAccount) {
      Account.remove({ id: this.lastOptions.dataset.id }, (err, response) => {
        if (err) {
          return console.error(err.message || 'ошибка удаления счета');
        }
      });
      this.clear();
      App.update();
      App.hideHeaderContent();
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    const isRemovedTransaction = confirm(
      'Вы действительно хотите удалить транзакцию?',
    );
    if (isRemovedTransaction) {
      Transaction.remove({ id }, (err, response) => {
        if (err) {
          return console.error(err.message || 'ошибка удаления транзакции');
        }
        console.log(response);

        App.update();
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options = this.lastOptions) {
    if (!options) {
      return;
    }

    this.lastOptions = options;
    const accountID = this.lastOptions.dataset.id;

    Account.get(accountID, (err, response) => {
      if (err) {
        throw new Error(err.message || 'неизвестная ошибка');
      }

      const foundAccount = response.data.find((acc) => acc.id === accountID);
      if (foundAccount) {
        this.renderTitle(foundAccount.name);
      } else {
        console.warn('Аккаунт не найден');
      }
    });

    Transaction.list({ account_id: accountID }, (err, response) => {
      if (err) {
        throw new Error(err.message || 'неизвестная ошибка');
      }
      this.renderTransactions(response.data);
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = '';
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    document.querySelector('.content-title').innerText = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    const dateObj = new Date(date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('ru-RU', options);
    const time = dateObj.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${formattedDate}, ${time}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    return `
      <div class="transaction transaction_${item.type === 'income' ? 'income' : 'expense'} row">
        <div class="col-md-7 transaction__details">
          <div class="transaction__icon">
              <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
              <h4 class="transaction__title">${item.name}</h4>
              <div class="transaction__date">${this.formatDate(item.created_at)}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="transaction__summ">
              ${item.sum} <span class="currency">₽</span>
          </div>
        </div>
        <div class="col-md-2 transaction__controls">
            <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                <i class="fa fa-trash"></i>  
            </button>
        </div>
      </div>
    `;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    const contentSection = this.element.querySelector('.content');
    let htmlContent = '';

    data.forEach((item) => {
      htmlContent += this.getTransactionHTML(item);
    });

    contentSection.innerHTML = htmlContent;
  }
}
