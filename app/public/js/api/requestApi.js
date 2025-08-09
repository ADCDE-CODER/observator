async function requestApi(url, method = "GET", token = null, data = null, errorMessage = "Request failed:") {
    try {
        const headers = {
            "Content-Type": "application/json"
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        
        const options = {
            method: method, 
            headers: headers
        };
        
        if (method !== "GET" && data) {
            options.body = JSON.stringify({data: data});
        }
          
        const response = await fetch(url, options);
        const result = await response.json();

        return {ok: response.ok, status: response.status, ...result};
    } catch (error) {
        return {ok: false, status: 0, success: false, error: `${errorMessage} ${error.message}`};
    }  
};

export { requestApi };