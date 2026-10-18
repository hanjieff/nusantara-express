(function () {
    const USERS = 'nx.users';
    const SESSION = 'nx.session';
    const ORDERS = 'nx.orders';

    function read(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch {
            return fallback;
        }
    }

    function write(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function randomHex(bytes) {
        const buf = new Uint8Array(bytes);
        crypto.getRandomValues(buf);
        return [...buf].map((b) => b.toString(16).padStart(2, '0')).join('');
    }

    // Demo-only credential storage: accounts live in this machine's localStorage,
    // there is no server and no database behind it.
    async function hashPassword(password, salt) {
        const data = new TextEncoder().encode(`${salt}:${password}`);
        if (crypto.subtle) {
            const digest = await crypto.subtle.digest(`SHA-256`, data);
            return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
        }
        let h = 5381;
        for (const byte of data) h = ((h << 5) + h + byte) >>> 0;
        return `fallback-${h.toString(16)}`;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function normaliseEmail(email) {
        return email.trim().toLowerCase();
    }

    async function signup({ name, email, phone, password }) {
        const users = read(USERS, []);
        const cleanEmail = normaliseEmail(email);

        if (!name.trim()) return { ok: false, error: 'Nama lengkap masih kosong.' };
        if (!emailPattern.test(cleanEmail)) return { ok: false, error: 'Format email belum benar.' };
        if (!/^(\+62|62|0)8[1-9][0-9\s-]{6,}$/.test(phone.trim()))
            return { ok: false, error: 'Nomor telepon harus aktif, contoh 081234567890.' };
        if (password.length < 6) return { ok: false, error: 'Password minimal 6 karakter.' };
        if (users.some((u) => u.email === cleanEmail))
            return { ok: false, error: 'Email ini sudah terdaftar. Silakan masuk.' };

        const salt = randomHex(8);
        const user = {
            id: randomHex(6),
            name: name.trim(),
            email: cleanEmail,
            phone: phone.trim(),
            salt,
            hash: await hashPassword(password, salt),
            createdAt: new Date().toISOString(),
        };

        users.push(user);
        write(USERS, users);
        write(SESSION, user.id);
        return { ok: true, user: publicUser(user) };
    }

    async function login({ email, password }) {
        const users = read(USERS, []);
        const cleanEmail = normaliseEmail(email);
        const user = users.find((u) => u.email === cleanEmail);
        if (!user) return { ok: false, error: 'Email belum terdaftar.' };

        const hash = await hashPassword(password, user.salt);
        if (hash !== user.hash) return { ok: false, error: 'Password salah. ' };

        write(SESSION, user.id);
        return { ok: true, user: publicUser(user) };
    }

    function publicUser(user) {
        return { id: user.id, name: user.name, email: user.email, phone: user.phone, createdAt: user.createdAt };
    }

    function currentUser() {
        const id = read(SESSION, null);
        if (!id) return null;
        const user = read(USERS, []).find((u) => u.id === id);
        return user ? publicUser(user) : null;
    }

    function logout() {
        localStorage.removeItem(SESSION);
    }

    function listOrders(userId) {
        return read(ORDERS, [])
          .filter((o) => o.userId === userId)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }

    function saveOrder(order) {
        const orders = read(ORDERS, []);
        orders.push(order);
        write(ORDERS, orders);
        return order;
    }

    function updateOrder(orderId, userId, patch) {
        const orders = read(ORDERS, []);
        const index = orders.findIndex((o) => o.id === orderId && o.userId === userId);
        if (index === -1) return null;
        orders[index] = { ...orders[index], ...patch };
        write(ORDERS, orders);
        return orders[index];
    }

    // The booking flow spans several pages, so the in-progress order is kept here
    // instead of a JS variable that would be lost on every navigation
    function getDraft() {
        return read('nx.draft', null);
    }

    function setDraft(draft) {
        write('nx.draft', draft);
        return draft;
    }

    function setLastOrder(order) {
        write('nx.lastOrder', order);
        return order;
    }

    function getLastOrder() {
        return read('nx.lastOrder', null);
    }

    window.NX_STORE = {
        signup,
        login,
        logout,
        currentUser,
        listOrders,
        saveOrder,
        updateOrder,
        getDraft,
        setDraft,
        setLastOrder,
        getLastOrder,
        randomId: () => randomHex(5).toUpperCase(),
    };
})();