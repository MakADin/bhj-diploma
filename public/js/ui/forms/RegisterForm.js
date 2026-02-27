/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    try {
      User.register(data, () => {
        this.form.reset();
        App.setState('user-logged');
        App.getModal('register').close();
      });
    } catch (error) {
      throw new Error('ERROR: ', error);
    }
  }
}
