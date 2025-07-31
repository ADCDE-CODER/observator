async function signupUser(email, password) {
    try {
        const response = await fetch("http://localhost:3000/user/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                data: {
                    email: email, 
                    password: password
                }
            })
        });

        const result = await response.json();

        return {ok: response.ok, status: response.status, ...result};
    } catch (error) {
        return {ok: false, status: 0, success: false, error: `Sign up error: ${error.message}`};
    }
};

async function signinUser(email, password) {
    try {
        const response = await fetch("http://localhost:3000/user/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                data: {
                    email: email, 
                    password: password
                } 
            })
        });

        const result = await response.json();

        return {ok: response.ok, status: response.status, ...result};
    } catch (error) {
        return {ok: false, status: 0, success: false, error: `Sign in error: ${error.message}`};
    }
};

export { signupUser, signinUser };