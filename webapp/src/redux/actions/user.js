import { userApi } from '../../utils/api'
import { OpenNotification } from '../../utils/helpers'

const actions = {
    setUserData: data => ({
        type: "USER:SET_DATA",
        payload: data
    }),
    setIsAuth: bool => ({
        type: "USER:SET_IS_AUTH",
        payload: bool
    }),
    fetchUserData: () => dispatch => {
        userApi
            .getim()
            .then(({ data }) => {
                dispatch(actions.setUserData(data))
            })
            .catch(err => {
                if (err.response.status === 403) {
                    dispatch(actions.setIsAuth(false))
                    delete window.localStorage.token
                }
            })
    },
    fetchUserLogout: () => dispatch => {
        dispatch(actions.setIsAuth(false));
        delete window.localStorage.token;
    },
    fetchUserUpdate: postData => dispatch => {
        return userApi.update(postData)
            .then(({ data }) => {
                const {
                    token,
                    status,
                    message
                } = data;

                window.localStorage['token'] = token;
                window.axios.defaults.headers.common["token"] = token;

                dispatch(actions.fetchUserData());

                OpenNotification({
                    type: status,
                    text: message
                })

                return data;
            })
            .catch(err => {

                OpenNotification({
                    type: "error",
                    text: "Incorrect password!"
                })

                return new Error(err);
            })
    },
    fetchUserLogin: postData => dispatch => {
        return userApi.login(postData).then(({ data }) => {
            const {
                token,
                status,
                message
            } = data;

            window.localStorage['token'] = token;
            window.axios.defaults.headers.common["token"] = token;

            dispatch(actions.fetchUserData());
            dispatch(actions.setUserData(data));

            OpenNotification({
                type: status,
                text: message,
                is_validation: true
            })

            return data;
        }).catch(err => {

        })
    },
    fetchUserRegister: postData => () => {
        return userApi.register(postData);
    }
}

export default actions