const bcrypt = require('bcryptjs');

import { apiHandler, usersRepo } from 'helpers/api';

export default apiHandler({
    post: register
});

function register(req, res) {
    // split out password from user details 
    const user = req.body;

    // validate
    if (usersRepo.find(x => x.name === user.name))
        throw `User with the username "${user.name}" already exists`;

    // // hash password
    // user.hash = bcrypt.hashSync(password, 10);    

    usersRepo.create(user);
    return res.status(200).json({});
}