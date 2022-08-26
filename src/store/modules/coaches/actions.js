let timer;
export default {
  async registerCoach(data) {
    const userId = this.getUserId;
    const coachData = {
      firstName: data.first,
      lastName: data.last,
      description: data.desc,
      hourlyRate: data.rate,
      areas: data.areas,
    };
    const token = this.getToken;
    const response = await fetch(
      `https://fir-coaches-default-rtdb.europe-west1.firebasedatabase.app/coaches/${userId}.json?auth=${token}`,
      { method: 'PUT', body: JSON.stringify(coachData) }
    );
    if (!response.ok) {
      //error
    }
    this.coaches.push({
      ...coachData,
      id: userId,
    });
  },
  async addRequest(data) {
    const newRequest = {
      userEmail: data.email,
      message: data.message,
    };
    const response = await fetch(
      `https://fir-coaches-default-rtdb.europe-west1.firebasedatabase.app/requests/${data.coachId}.json`,
      { method: 'POST', body: JSON.stringify(newRequest) }
    );
    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(
        responseData.message || 'Failed to send request.'
      );
      throw error;
    }
    newRequest.id = responseData.name;
    newRequest.coachId = data.coachId;
    this.requests.push(newRequest);
  },
  async loadCoaches() {
    if (!this.shouldUpdate) {
      return;
    }
    const response = await fetch(
      `https://fir-coaches-default-rtdb.europe-west1.firebasedatabase.app/coaches.json`
    );
    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(responseData.message || 'Failed to fetch');
      throw error;
    }
    const coaches = [];
    for (const key in responseData) {
      const coach = {
        id: key,
        firstName: responseData[key].firstName,
        lastName: responseData[key].lastName,
        description: responseData[key].description,
        hourlyRate: responseData[key].hourlyRate,
        areas: responseData[key].areas,
      };
      coaches.unshift(coach);
    }
    this.coaches = coaches;
    this.fetchTimestamp();
  },
  async fetchRequests() {
    const coachId = this.userId;
    const token = this.getToken;
    const response = await fetch(
      `https://fir-coaches-default-rtdb.europe-west1.firebasedatabase.app/requests/${coachId}.json?auth=${token}`
    );

    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(
        responseData.message || 'Failed to send request.'
      );
      throw error;
    }

    const requests = [];
    for (const key in responseData) {
      const request = {
        id: key,
        coachId: coachId,
        userEmail: responseData[key].userEmail,
        message: responseData[key].message,
      };

      requests.push(request);
    }
    this.requests = requests;
  },
  fetchTimestamp() {
    this.lastFetch = new Date().getTime();
  },
  //Auth:
  async login(payload) {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBHrrKcBdcXVM005Mbrjr18DTvxthgXonI',
      {
        method: 'POST',
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        }),
      }
    );
    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(
        responseData.message || 'Failed to authenticate. Check your login data.'
      );
      throw error;
    }
    localStorage.setItem('token', responseData.idToken);
    localStorage.setItem('userId', responseData.localId);
    const expiresIn = +responseData.expiresIn * 1000;
    const expirationDate = new Date().getTime() + expiresIn;
    localStorage.setItem('tokenExpiration', expirationDate);
    this.setUser(responseData, expirationDate);
    timer = setTimeout(() => this.autoLogout(), expiresIn);
  },
  autoLogin() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    const expiresIn = +tokenExpiration - new Date().getTime();
    if (expiresIn < 0) {
      return;
    }

    setTimeout(() => this.logout(), expiresIn);

    if (token && userId) {
      this.setUser({
        idToken: token,
        localId: userId,
        expiresIn: null,
      });
    }
  },
  autoLogout() {
    this.logout();
    this.didAutoLogout = true;
  },
  async signup(payload) {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBHrrKcBdcXVM005Mbrjr18DTvxthgXonI',
      {
        method: 'POST',
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        }),
      }
    );
    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(
        responseData.message || 'Failed to authenticate. Check your login data.'
      );
      throw error;
    }
    this.userId = responseData.localId;
  },
  setUser(payload) {
    this.token = payload.idToken;
    this.userId = payload.localId;
    this.didAutoLogout = false;
  },
  logout() {
    this.token = null;
    this.userId = null;
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('tokenExpiration');
    clearTimeout(timer);
  },
  async auth(payload) {
    const mode = payload.mode;
    let url =
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBHrrKcBdcXVM005Mbrjr18DTvxthgXonI';
    if (mode === 'signup') {
      url =
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBHrrKcBdcXVM005Mbrjr18DTvxthgXonI';
    }
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        returnSecureToken: true,
      }),
    });
    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(
        responseData.message || 'Failed to authenticate. Check your login data.'
      );
      throw error;
    }
    this.setUser(responseData);
  },
};
