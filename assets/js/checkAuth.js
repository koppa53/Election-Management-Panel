function checkAuth() {

    if (!localStorage.hasOwnProperty('Token')) window.location.href = "auth-login.html"
}
window.onpaint = checkAuth();