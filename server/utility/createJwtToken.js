import jwt from 'jsonwebtoken'
import reduce from 'lodash/reduce.js'

export default user => {
    let token = jwt.sign(
        {
            data: reduce(user, (result, value, key) => {
                if(result !== "password") {
                    result[key] = value;
                }
                return result;
            }, {})
        },
        process.env.JWT_SECRET || "",
        {
            expiresIn: process.env.JWT_MAX_AGE,
            algorithm: "HS512"
        }
    );

    return token;
}