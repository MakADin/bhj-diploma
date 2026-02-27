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

  if (method === 'GET' && Object.keys(data).length > 0) {
    let params = [];

    for (const key in data) {
      params.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`,
      );
    }

    url += '?' + params.join('&');

  } else if (Object.keys(data).length > 0) {
    formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
  }
  xhr.open(method, url);

  xhr.send(formData);

  xhr.onload = function () {
      callback(null, xhr.response);
  };

  xhr.onerror = function () {
    callback(new Error(`Error connection: ${xhr.statusText}`));
  };
};
