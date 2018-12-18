import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const SET_TEXT = "SET_TEXT";

export function createStore() {
  return new Vuex.Store({
    modules: {},
    state: {
      text: null
    },
    getters: {
      getText(state) {
        return state.text;
      }
    },
    actions: {
      setText({ commit }, text) {
        commit(SET_TEXT, text);
      }
    },
    mutations: {
      [SET_TEXT](state, payload) {
        state.text = payload;
      }
    }
  });
}
