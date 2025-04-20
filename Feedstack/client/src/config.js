const API_URL =
    process.env.REACT_APP_API_URL ||
    (process.env.NODE_ENV === 'production'
     ? 'https://feedstack.fly.dev/api'
     : 'http://localhost:3000/api');
export default API_URL;