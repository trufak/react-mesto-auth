class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }
  //запрос
  _fetch(childUrl, method = "GET", body = null) {
    return fetch(this._baseUrl + childUrl, {
      headers: this._headers,
      method: method,
      body: body,
    }).then((res) => {
      if (res.ok) return res.json();
      return Promise.reject(`Ошибка: ${res.status}`);
    });
  }

  signup (email, password) {
    return this._fetch('/signup', 'POST', JSON.stringify({
      password: password,
      email: email
    }));
  }

  signin (email, password) {
    return this._fetch('/signin', 'POST', JSON.stringify({
      password: password,
      email: email
    }));
  }



}

//Создание объекта Api
const apiAuth = new Api({
  baseUrl: "https://auth.nomoreparties.co",
  headers: {"Content-Type": "application/json" }
});

export default apiAuth;
