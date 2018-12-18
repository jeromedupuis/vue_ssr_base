<template>
  <div class="ui-input--switch-checkbox" :class="[switchClass, { 'state--disabled': disabled }]" @click.prevent="onToggle()">
    <div class="switch-bar_circle"></div>
    <div class="switch-bar"></div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      required: false,
      default: false
    },
    selectOnVal: {
      type: Boolean,
      required: false,
      default:true
    },
    inputValue: {
      required: false
    },
    inputValues: {
      type: Array,
      required: false,
      validator(value) {
        return value instanceof Array && value.length == 2;
      }
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
  data () {
    return {
      onVal: true,
      offVal: false,
      model: false,
      hiddenInput: 0
    };
  },
  mounted() {
    this.model = this.value;
  },
  watch: {
    value (value) {
      this.model = value;
    }
  },
  computed: {
    switchClass() {

      let turn;
      if (this.inputValues !== undefined) {
        turn = this.model === this.inputValues[1] ? true : false;
      }
      else if (this.inputValue !== undefined) {
        turn = this.model === this.inputValue ? true : false;
      }
      else {
        turn = !!this.model;
      }

      if (turn) {
        return 'turn--on';
      }
      return 'turn--off';
    }
  },
  methods: {
    onToggle() {
      if (this.inputValues !== undefined) {
        this.model = this.model === this.inputValues[1] ? this.inputValues[0] : this.inputValues[1];
      }
      else if (this.inputValue !== undefined) {
        this.model = this.model === this.inputValue ? false : this.inputValue;
      }
      else {
        this.model = !this.model;
      }
      this.$emit('input', this.model);
      this.change(this.model);
    }
  }
};
</script>
