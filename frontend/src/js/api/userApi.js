export async function createUser(user) {
    const url = "http://localhost:3000/users/signup";    
    
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user)
    });
    
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message);
    }
    
    return result;
};

export async function readUser(user) {
    const url = "http://localhost:3000/users/signin";    
    
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user)
    });
    
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message);
    }

    return result;
};