/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}, callback) => {
  const xhr = new XMLHttpRequest();

  let url = options.url || '';
  let method = options.method || 'GET';
  let data = options.data || {};

  xhr.responseType = options.responseType;
  xhr.withCredentials = true;

  if (method === 'GET' && Object.keys(data).length > 0) {
    let params = [];
    for (const key in data) {
      params.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`,
      );
    }
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
  }

  xhr.open(method, url);

  if (method === 'POST') {
    xhr.setRequestHeader('Content-Type', 'application/json');

    let body = '';

    for (let key in data) {
      body += `${key}=${encodeURIComponent(data[key])}&`;
    }

    body = body.slice(0, -1);

    xhr.send(body);
  } else {
    xhr.send();
  }

  xhr.onload = function () {
    if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status <= 299) {
      callback(null, xhr.response);
    } else {
      callback(new Error(`Ошибка запроса: ${xhr.status}`), null);
    }
  };

  xhr.onerror = function() {
    callback(new Error(`Error connection: ${xhr.statusText}`))
  }
};
