<template>
  <div class="ui-select" :class="[selectClass, selectClassMultiple]">
    <template v-if="multiple">
      <select v-model="modelMultiple" :name="name" @change="onChange" multiple :disabled="disabled" ref="selectMultiple">
        <option v-for="(option, index) in optionListNative" :value="option.value"  :key="index">{{ option.label }}</option>
      </select>
    </template>
    <template v-else>
      <select v-model="model" :name="name" @change="onChange" :disabled="disabled" ref="select">
        <option v-for="(option, index) in optionListNative" :value="option.value"  :key="index">{{ option.label }}</option>
      </select>
    </template>

    <div @click="onClick">
      <i class="ui-select_dropdown"></i>
      <template v-if="!multiple && currentValue">
        <div class="ui-select_text">{{ currentValue }}</div>
      </template>
      <template v-else-if="multiple && currentValue.length">
        <div class="ui-select_multiple">
          <div class="ui-select_multipleItem" v-for="(oneValue, index) in currentValue" :key="index">
            <span @click.prevent="removeMultipleValue($event, oneValue)">{{ oneValue.label }} <span class="ui-select_multipleItem_close">×</span></span>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="ui-select_placeholder">{{ placeholder }}</div>
      </template>
    </div>
    <div class="ui-select_menu" @click.prevent="preventOutside" v-if="hasOptionsToDisplay">
      <template v-for="(option, index) in optionListDisplay">
        <div
          class="ui-select_menuItem"
          :class="{ 'ui-select_menuItem--active': option.value === isSelected(option) }"
          :data-value="option.value"
          :key="index"
          @click.prevent="toggleSelect(option)"
        >{{ option.label }}</div>
      </template>
    </div>
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
      required: false,
      default: '',
      type: String
    },
    drop: {
      type: String,
      default: 'down',
      required: false,
      validator(value) {
        let values = ['down', 'up'];
        return values.indexOf(value) > -1;
      }
    },
    options: {
      type: Array,
      required: false,
      default: () => {
        return [];
      }
    },
    multiple: {
      type: Boolean,
      required: false,
      default: false
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
      model: undefined,
      modelMultiple: [],
      visible: false
    };
  },
  computed: {
    currentValue() {
      if (this.multiple) {

        let currentValue = [];
        this.optionListNative.forEach(x => {
          if (this.modelMultiple.indexOf(x.value) > -1) {
            currentValue.pushx;
          }
        });
        return currentValue;
      } else {
        let option = this.optionListNative.find(x => {
          return x.value === this.model;
        });
        if (option) {
          return option.label;
        }
        return '';
      }
    },
    selectClass() {
      if (this.disabled) {
        return 'state--disabled';
      }
      if (this.visible && this.hasOptionsToDisplay) {
        return 'visible--'+this.drop;
      }
      return '';
    },
    selectClassMultiple() {
      return { 'ui-select--multiple': this.multiple };
    },
    hasOptionsToDisplay() {
      return this.optionListDisplay && this.optionListDisplay.length;
    },
    optionListNative() {
      return this.optionList(true);
    },
    optionListDisplay() {
      return this.optionList();
    }
  },
  watch: {
    value (value) {
      if (this.multiple) {
        if (!(value instanceof Array)) {
          value = [];
        }
        this.modelMultiple = value;
      } else {
        this.model = value;
      }
    },
  },
  mounted() {
    if (this.multiple) {
      if (!(this.value instanceof Array)) {
        this.value = [];
      }
      this.modelMultiple = this.value;
    } else {
      this.model = this.value;
    }
  },
  methods: {
    optionList(native) {
      let options = [];
      let obj = '';
      this.options.forEach(x => {
        obj = x;
        if (typeof x == 'string') {
          obj = {
            value: x,
            label: x
          };
        }
        options.push(obj);
      });

      if (this.multiple && !native) {
        options = options.filter(x => {
          return this.modelMultiple.indexOf(x.value) === -1;
        });
      }

      return options;
    },
    onChange() {
      if (this.multiple) {
        this.$emit('input', this.modelMultiple);
        this.change(this.modelMultiple);
      } else {
        this.$emit('input', this.model);
        this.change(this.model);
      }
    },
    toggleSelect(option) {
      let value = option.value;
      if (this.multiple) {
        let index = this.modelMultiple.findIndex(x => {
          return x === value;
        });
        if (index > -1) {
          this.modelMultiple.splice(index, 1);
        } else {
          this.modelMultiple.push(value);
        }
        this.$emit('input', this.modelMultiple);
      }
      else {
        if (this.model === value) {
          this.model = null;
        } else {
          this.model = value;
        }
        this.close();
        this.$emit('input', this.model);
      }
    },
    removeMultipleValue(event, oneValue) {
      this.toggleSelect(oneValue);
      event.stopImmediatePropagation();
    },
    onClick() {
      if (!this.hasOptionsToDisplay) return false;
      if (this.visible) {
        this.close();
      } else {
        this.open();
      }
    },
    close() {
      this.visible = false;
      this.removeOutsideClickListener();
    },
    open() {
      this.visible = true;
      this.addOutsideClickListener();
    },
    preventOutside() {
      return false;
    },
    addOutsideClickListener () {
      if (!this.isInline) {
        setTimeout(() => {
          document.addEventListener('click', this.clickOutside, false);
        }, 100);
      }
    },
    removeOutsideClickListener () {
      if (!this.isInline) {
        setTimeout(() => {
          document.addEventListener('click', this.clickOutside, false);
        }, 100);
      }
    },
    clickOutside (event) {
      if (this.$el && !this.$el.contains(event.target)) {
        this.close();
      }
    },
    isSelected(option) {
      if (this.multiple) {
        return !!this.modelMultiple.find(x => {
          return x === option.value;
        });
      } else {
        return option.value === this.model;
      }
    }
  }
};
</script>
