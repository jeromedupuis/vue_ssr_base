<template>

  <div class="ui-input--checkbox" :class="{ 'state--disabled': disabled }">

    <input type="checkbox" :name="name" v-model="model" :value="inputValue" @change="onChange" :disabled="disabled" />
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
      required: false
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
      model: false,
    };
  },
  watch: {
    value (value) {
      this.model = value;
    }
  },
  mounted() {
    this.model = this.value;
  },
  methods: {
    onChange() {
      switch(typeof this.model) {
      case 'boolean':
        if (this.inputValue !== undefined) {
          this.model = this.model ? this.inputValue : this.model;
        }
        break;
      }
      this.$emit('input', this.model);
      this.change(this.model);
    }
  }
};
</script>
