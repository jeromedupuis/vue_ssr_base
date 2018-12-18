import cookie from 'node_modules/js-cookie';
import _ from 'lodash';

let createStorage;
let createCookie;

if (process.client) {
  createStorage = storageName => {
    const storage = window[storageName];

    return {
      get(key, defaultValue) {
        try {
          const item = storage.getItem(key);

          if (!item) {
            return defaultValue;
          }

          return JSON.parse(item);
        } catch (err) {
          // ignore error
          return defaultValue;
        }
      },
      set(key, value) {
        try {
          storage.setItem(key, JSON.stringify(value));
        } catch (err) {
          // ignore error
        }
      },
      remove(key) {
        try {
          storage.removeItem(key);
        } catch (err) {
          // ignore error
        }
      },
      clear() {
        storage.clear();
      }
    };
  };

  createCookie = () => {
    return {
      constructor(expires) {
        this.expires = expires ? expires : 7;
      },

      set(name, value) {
        cookie.set(name, value, {
          expires: this.expires,
          secure: false
        });
      },
      get(name) {
        return cookie.get(name);
      },

      remove(name) {
        return cookie.remove(name);
      },

      clear() {
        _.each(cookie.get(), (value, name) => {
          this.remove(name);
        });
      }
    };
  };
} else {
  createStorage = () => ({
    get(key, defaultValue) {
      return defaultValue;
    },
    set() {
      // do nothing
    },
    remove() {
      // do nothing
    },
    clear() {
      // do nothing
    }
  });

  createCookie = () => ({
    get(key, defaultValue) {
      return defaultValue;
    },
    set() {
      // do nothing
    },
    remove() {
      // do nothing
    },
    clear() {
      // do nothing
    }
  });
}

export default {
  local: createStorage("localStorage"),
  session: createStorage("sessionStorage"),
  cookie: createCookie()
};
