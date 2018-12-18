<template>
  <div class="notification-container" v-if="notices && notices.length">
    <transition-group name="notice" appear>
      <div
        class="notification-list-item"
        :class="'notification-list-item--'+notice.type"
        v-for="(notice, index) in notices"
        @click="onNoticeClick(index)"
        :key="index">
        {{ notice.text }}
      </div>
    </transition-group>
  </div>
</template>

<script>
//import Vue from 'vue';

export default {
  mounted() {
    // Vue.$bus.$on('addNotification', (text, type) => {
    //   this.addNotification(text, type);
    // });
    // Vue.$bus.$on('callNotification', (code) => {
    //   this.callNotification(code);
    // });
  },
  watch: {
    notices(val, oldVal) {
      if (val.length !== oldVal.length) {
        this.hideNotification(5000, new Date().getTime());
      }
    }
  },
  destroyed() {
    //Vue.$bus.$off('addNotification');
    //Vue.$bus.$off('callNotification');
  },
  computed: {
    notices() {
      return this.$store.getters.getNotices;
    }
  },
  data() {
    return {
      timers: {}
    };
  },
  methods: {
    /**
     * onNoticeClick : dispatch deleteNotification on click handler
     * @index (integer) index of notifications Array in store
     * = dispatch deleteNotification
     */
    onNoticeClick(index) {
      this.$store.dispatch('deleteNotification', index);
    },

    /**
     * hideNotification : setTimeout to delete the oldest notification
     * @timeout (integer) duration of timeout
     * = setTimeout & dispatch deleteNotification
     */
    hideNotification(timeout, unique) {
      if (this.timers[unique]) {
        clearTimeout(this.timers[unique]);
      }
      this.timers[unique] = setTimeout(() => {
        this.$store.dispatch('deleteNotification', this.notices.length - 1);
      }, timeout);
    }
  }
};
</script>
