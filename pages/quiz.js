import { userService } from '../services';

const QUIZ_URLS = {
    get: 'https://pure-caverns-82881.herokuapp.com/api/v54/quizzes',
};
export const getAll = async () => {
    const res = await userService.getQuizzes();
    // return await res.json();
    // console.log(JSON.stringify(res));
    // return await JSON.stringify(res.body);
    return await res;
};

export const getById = async (id) => {
    const res = await userService.getQuiz(id);
    console.log(JSON.stringify(res));
    return await res;
};

export const getScore = async (quiz_id, question_id, user_id, answer) => {

    const res = await userService.submitResponse(quiz_id, question_id, user_id, answer);
    console.log(JSON.stringify(res));
    return res;
};