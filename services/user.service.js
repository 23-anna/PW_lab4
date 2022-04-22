import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/users`;
const userSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('user')));

export const userService = {
    user: userSubject.asObservable(),
    get userValue () { return userSubject.value },
    login,
    logout,
    register,
    getAll,
    getById,
    update,
    delete: _delete,
    getQuizzes,
    getQuiz,
    submitResponse
};

function login(name, surname) {
    return fetchWrapper.get("https://pure-caverns-82881.herokuapp.com/api/v54/users")
        .then(user => {
            // publish user to subscribers and store in local storage to stay logged in between page refreshes
            // console.log(user);

            let id = user.filter( function(user) { if (user.name == name && user.surname == surname) return user.id});
            // console.log(id);
            
            userSubject.next(user);
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        });
}

function logout() {
    // remove user from local storage, publish null to user subscribers and redirect to login page
    localStorage.removeItem('user');
    userSubject.next(null);
    Router.push('/account/login');
}

function register(user) {
    return fetchWrapper.post("https://pure-caverns-82881.herokuapp.com/api/v54/users", JSON.stringify({
        // body
        "data": {
            "name": user.name,
            "surname": user.surname
        }
    }));
}

function getAll() {
    return fetchWrapper.get(baseUrl);
}

function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}

function update(id, params) {
    return fetchWrapper.put(`${baseUrl}/${id}`, params)
        .then(x => {
            // update stored user if the logged in user updated their own record
            if (id === userSubject.value.id) {
                // update local storage
                const user = { ...userSubject.value, ...params };
                localStorage.setItem('user', JSON.stringify(user));

                // publish updated user to subscribers
                userSubject.next(user);
            }
            return x;
        });
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(id) {
    return fetchWrapper.delete(`${baseUrl}/${id}`);
}

function getQuizzes() {
    return fetchWrapper.get('https://pure-caverns-82881.herokuapp.com/api/v54/quizzes');
}

function getQuiz(id) {
    const url = 'https://pure-caverns-82881.herokuapp.com/api/v54/quizzes/' + id;
    return fetchWrapper.get(url);
}

function submitResponse(quiz_id, question_id, user_id, answer) {

    const url = 'https://pure-caverns-82881.herokuapp.com/api/v54/quizzes/' + quiz_id + '/submit';
    console.log(url);

    const body = JSON.stringify({"data": {
        "question_id": question_id,
        "answer": answer,
        "user_id": user_id
    }})

    return fetchWrapper.post(url, body);
}