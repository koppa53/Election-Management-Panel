function checkAuth() {

    if (!localStorage.hasOwnProperty('hasLoggedIn')) window.location.href = "auth-login.html"
}
window.onpaint = checkAuth();