<template>
  <div class="ui-input--submit">
    <input type="submit" :value="inputValue" :name="name" :disabled="disabled" @click="onClick" @submit="onSubmit" />
    <span></span>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      required: false,
      default: 'Submit'
    },
    name: {
      type: String,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    inputValue() {
      return this.label || this.value;
    }
  },
  methods: {
    onClick() {
      this.$emit('click');
    },
    onSubmit() {
      this.$emit('submit');
    }
  }
};
</script>
