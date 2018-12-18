<template>
  <div class="ui-input--password">
    <input type="password" v-model="model" :name="name" :placeholder="placeholder" :disabled="disabled" @change="onChange" @keyup="onKeyup" />
    <span></span>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      required: false
    },
    name: {
      type: String,
      required: false
    },
    placeholder: {
      type: String,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      model: undefined
    };
  },
  watch: {
    value (value) {
      this.model = value;
    },
  },
  methods: {
    onChange() {
      this.$emit('input', this.model);
    },
    onKeyup() {
      this.$emit('input', this.model);
    }
  }
};
</script>
