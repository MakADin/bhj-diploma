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
    this.element.addEventListener('click', (event) => {
      event.preventDefault();

      const targetButton = event.target.closest(
        '.remove-account, .transaction__remove',
      );

      if (targetButton) {
        if (targetButton.classList.contains('remove-account')) {
          this.removeAccount();
        } else if (targetButton.classList.contains('transaction__remove')) {
          this.removeTransaction(targetButton.dataset.id);
        }
      }
    });
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
      Account.remove({ id: this.lastOptions.account_id }, (err, response) => {
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
    const accountID = this.lastOptions.account_id;

    Account.get(accountID, (err, response) => {
      if (err) {
        throw new Error(err.message || 'Счет не найден.');
      }
      this.renderTitle(response.data.name);
    });

    Transaction.list(this.lastOptions, (err, response) => {
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
    const formattedDate = new Date(date);
    return formattedDate.toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
