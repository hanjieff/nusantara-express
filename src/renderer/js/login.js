(function () {
    const store = window.NX_STORE;
    if (store.currentUser()) {
        window.location.replace('index.html');
        return;
    }

    const tabs = { login: document.getElementById('tab-login'), signup: document.getElementById('tab-signup') };
    const forms = { login: document.getElementById('form-login'), signup: document.getElementById('form-signup') };
    const title = document.getElementById('auth-title');
    const sub = document.getElementById('auth-sub');
    const errorBox = document.getElementById('auth-error');

    function show(which) {
        tabs.login.classList.toggle('active', which === 'login');
        tabs.signup.classList.toggle('active', which === 'signup');
        forms.login.hidden = which !== 'login';
        forms.signup.hidden = which !== 'signup';
        title.textContent = which === 'login' ? 'Selamat datang kembali' : 'Buat akun kamu';
        sub.textContent = which === 'login' ? 'Masuk untuk melanjutkan perjalanan.' : 'Isi datamu, akun tersimpan di perangkat ini saja.';
        errorBox.hidden = true;
    }

    function fail(message) {
        errorBox.textContent = message;
        errorBox.hidden = false;
    }

    tabs.login.addEventListener('click', () => show('login'));
    tabs.signup.addEventListener('click', () => show('signup'));
    document.getElementById('to-signup').addEventListener('click', () => show('signup'));
    document.getElementById('to-login').addEventListener('click', () => show('login'));

    forms.login.addEventListener('submit', async (event) => {
        event.preventDefault();
        const result = await store.login({
            email: document.getElementById('login-email').value,
            password: document.getElementById('login-password').value,
        });
        if (!result.ok) return fail(result.error);
        window.location.href = 'index.html';
    });

    forms.signup.addEventListener('submit', async (event) => {
        event.preventDefault();
        const result = await store.signup({
            name: document.getElementById('signup-name').value,
            email: document.getElementById('signup-email').value,
            phone: document.getElementById('signup-phone').value,
            password: document.getElementById('signup-password').value,
        });
        if (!result.ok) return fail(result.error);
        window.location.href = 'index.html';
    });
})();