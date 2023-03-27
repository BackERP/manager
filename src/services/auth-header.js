export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.access_token) {
     return { Authorization: 'Bearer ' + user.access_token }; // for Spring Boot back-end
    //return { 'x-access-token': user.accessToken };       // for Node.js Express back-end
  } else {
    return {};
  }
}
