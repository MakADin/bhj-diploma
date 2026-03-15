/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const selects = document.querySelectorAll('.accounts-select');

    Account.list(User.current(), (err, response) => {
      if (err) return console.error(err.message || 'Ошибка загрузки счетов.');
      if (response.success) {
        selects.forEach((selectEl) => {
          selectEl.innerHTML = '';

          response.data.forEach((acc) => {
            let option = document.createElement('option');
            option.value = acc.id;
            option.textContent = acc.name;
            selectEl.append(option);
          });
        });
      }
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (err)
        return console.error(err.message || 'Ошибка создания транзакции.');

      App.update();
      this.form.reset();

      data.type === 'income'
        ? App.getModal('newIncome').close()
        : App.getModal('newExpense').close();
    });
  }
}
