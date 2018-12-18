<template>
  <div class="ui-input--radio" :class="{ 'state--disabled': disabled }">
    <input type="radio" :name="name" v-model="model" @change="onChange" :value="inputValue" :disabled="disabled" />
    <span></span>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      required: false,
      default: false
    },
    name: {
      type: String,
      required: false
    },
    inputValue: {
      required: false,
      default: true
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    change: {
      type: Function,
      required: false,
      default: () => {}
    }
  },
  data() {
    return {
      model: false
    };
  },
  watch: {
    value (value) {
      this.model = value;
    },
  },
  mounted() {
    this.model = this.value;
  },
  methods: {
    onChange() {
      this.$emit('input', this.model);
      this.change(this.model);
    }
  }
};
</script>
