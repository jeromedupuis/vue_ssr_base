<template>
  <div class="ui-input--number">
    <input type="number" :min="min" :max="max" :step="step" v-model="model" :name="name" :placeholder="placeholder" :disabled="disabled" @change="onChange" @keyup="onKeyup" />
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
    },
    max: {
      type: Number,
      required: false
    },
    min: {
      type: Number,
      required: false
    },
    step: {
      type: Number,
      required: false
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
  mounted() {
    this.model = this.value;
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
