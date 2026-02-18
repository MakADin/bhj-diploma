/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = options.responseType || 'json';

  let formData = null;
  let url = options.url || '';
  let method = options.method || 'GET';
  let data = options.data || {};

  if (Object.keys(data).length > 0) {
    if (method === 'GET') {
      let params = [];

      for (const key in data) {
        params.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`,
        );
      }

      if (params.length > 0) {
        url += '?' + params.join('&');
      }

      xhr.open(method, url);
    } else if (method === 'POST') {
      formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
      xhr.open(method, url);
    } else {
      xhr.open(method, url);
    }
  } else {
    xhr.open(method, url);
  }

  if (formData) {
    xhr.send(formData);
  } else {
    xhr.send();
  }

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      callback(null, xhr.response);
    } else {
      callback(new Error(`Ошибка запроса: ${xhr.status}`), null);
    }
  };

  xhr.onerror = function () {
    callback(new Error(`Error connection: ${xhr.statusText}`));
  };
};
