<template>
  <div class="ui-datepicker" :class="{ 'state--disabled': disabledPicker }">
    <div :class="[activeCalender]" @click.prevent="showCalendar">
      <!-- Input -->
      <input
        :type="inline ? 'hidden' : 'text'"
        :name="name"
        :id="id"
        :value="formattedValue"
        :open-date="openDate"
        :placeholder="placeholder"
        :disabled="disabledPicker"
        :required="required"
        readonly>
    </div>

    <!-- Day View -->
    <template v-if="allowedToShowView('day')">
      <div :class="[calendarClass, 'ui-datepicker_calendar']" v-show="showDayView" v-bind:style="calendarStyle" @click.prevent="preventOutside">
          <div class="ui-datepicker_calendarHeader">
              <span
                  @click.prevent="previousMonth()"
                  class="prev"
                  v-bind:class="{ 'disabled' : previousMonthDisabled(pageTimestamp) }">
                <span class="icon-arrow-left-white medium"></span></span>
              <span @click.prevent="showMonthCalendar" :class="['title', allowedToShowView('month') ? 'up' : '']">{{ currYear }} / {{ currMonth }}</span>
              <span
                  @click.prevent="nextMonth()"
                  class="next"
                  v-bind:class="{ 'disabled' : nextMonthDisabled(pageTimestamp) }">
                <span class="icon-arrow-right-white medium"></span></span>
          </div>
          <div class="ui-datepicker_calendarBody">
            <div class="calender-week">
              <span class="cell day-header" v-for="d in daysOfWeek" :key="d.timestamp">{{ d }}</span>
            </div>
            <div class="calender-list">
              <span class="cell day"
                  v-for="day in days"
                  :key="day.timestamp"
                  track-by="timestamp"
                  v-bind:class="dayClasses(day)"
                  @click.prevent="selectDate(day)"
              ><span>{{ day.date }}</span></span>
            </div>
          </div>
          <div class="ui-datepicker_calendarFooter">
            <span class="ui-datepicker_calendarFooter-today" @click.prevent="selectDate(today)">今日：<span class="footer-today">{{ today.date }}</span></span>
          </div>
      </div>
    </template>

    <!-- Month View -->
    <template v-if="allowedToShowView('month')">
      <div :class="[calendarClass, 'ui-datepicker_calendar']" v-show="showMonthView" v-bind:style="calendarStyle" @click.prevent="preventOutside">
          <div class="ui-datepicker_calendarHeader">
              <span
                  @click.prevent="previousYear"
                  class="prev"
                  v-bind:class="{ 'disabled' : previousYearDisabled(pageTimestamp) }">
                <span class="icon-arrow-left-white medium"></span></span>
              <span @click.prevent="showYearCalendar" :class="['title', allowedToShowView('year') ? 'up' : '']">{{ getPageYear() }}</span>
              <span
                  @click.prevent="nextYear"
                  class="next"
                  v-bind:class="{ 'disabled' : nextYearDisabled(pageTimestamp) }">
                <span class="icon-arrow-right-white medium"></span></span>
          </div>
          <div class="ui-datepicker_calendarBody">
            <div class="calender-list">
              <span class="cell month"
                  v-for="month in months"
                  :key="month.timestamp"
                  track-by="timestamp"
                  v-bind:class="{ 'selected': month.isSelected, 'disabled': month.isDisabled }"
                  @click.prevent="selectMonth(month)"><span>{{ month.month }}月</span></span>
            </div>
          </div>
          <div class="ui-datepicker_calendarFooter">
            <span class="ui-datepicker_calendarFooter-today" @click.prevent="selectDate(today)">今日：<span class="footer-today">{{ today.date }}</span></span>
          </div>
      </div>
    </template>

    <!-- Year View -->
    <template v-if="allowedToShowView('year')">
      <div :class="[calendarClass, 'ui-datepicker_calendar']" v-show="showYearView" v-bind:style="calendarStyle"  @click.prevent="preventOutside">
          <div class="ui-datepicker_calendarHeader">
              <span @click.prevent="previousDecade" class="prev"
                  v-bind:class="{ 'disabled' : previousDecadeDisabled(pageTimestamp) }">
                <span class="icon-arrow-left-white medium"></span></span>
              <span class="title">{{ getPageDecade() }}</span>
              <span @click.prevent="nextDecade" class="next"
                  v-bind:class="{ 'disabled' : nextMonthDisabled(pageTimestamp) }">
                <span class="icon-arrow-right-white medium"></span></span>
          </div>
          <div class="ui-datepicker_calendarBody">
            <div class="calender-list">
              <span
                  class="cell year"
                  v-for="year in years"
                  :key="year.timestamp"
                  track-by="timestamp"
                  v-bind:class="{ 'selected': year.isSelected, 'disabled': year.isDisabled }"
                  @click.prevent="selectYear(year)"><span>{{ year.year }}</span></span>
              </div>
          </div>
          <div class="ui-datepicker_calendarFooter">
            <span class="ui-datepicker_calendarFooter-today" @click.prevent="selectDate(today)">今日：<span class="footer-today">{{ today.date }}</span></span>
          </div>
      </div>
    </template>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  props: {
    value: {
      validator: function (val) {
        return val === null || val instanceof Date || typeof val === 'string' || typeof val === 'number';
      }
    },
    name: String,
    id: String,
    formatDate: {
      type: String,
      required: false,
      default: 'YYYY/MM/DD'
    },
    openDate: {
      validator: function (val) {
        return val === null || val instanceof Date || typeof val === 'string';
      }
    },
    disabled: Object,
    placeholder: String,
    inline: Boolean,
    calendarClass: [String, Object],
    mondayFirst: Boolean,
    initialView: String,
    disabledPicker: Boolean,
    required: Boolean,
    minimumView: {
      type: String,
      default: 'day'
    },
    maximumView: {
      type: String,
      default: 'year'
    },
    checkedValue: String
  },
  data () {
    const startDate = this.openDate ? new Date(this.openDate) : new Date();
    return {
      /*
       * Vue cannot observe changes to a Date Object so date must be stored as a timestamp
       * This represents the first day of the current viewing month
       * {Number}
       */
      pageTimestamp: startDate.setDate(1),
      /*
       * Selected Date
       * {Date}
       */
      selectedDate: null,
      /*
       * Flags to show calendar views
       * {Boolean}
       */
      showDayView: false,
      showMonthView: false,
      showYearView: false,
      activeCalender: 'ui-datepicker_contents'
    };
  },
  watch: {
    value (value) {
      this.setValue(value);
    },
    openDate () {
      this.setPageDate();
    },
    initialView () {
      this.setInitialView();
    }
  },
  computed: {
    computedInitialView () {
      if (!this.initialView) {
        return this.minimumView;
      }

      return this.initialView;
    },
    pageDate () {
      return new Date(this.pageTimestamp);
    },
    formattedValue () {
      if (!this.selectedDate) {
        return null;
      }

      return this.format(this.selectedDate);
    },
    currMonth () {
      return this.pageDate.getMonth()+1;
    },
    currYear () {
      return this.pageDate.getFullYear();
    },
    daysOfWeek () {
      return ['日', '月', '火', '水', '木', '金', '土'];
    },
    today () {
      let dObj = new Date();
      let today = {
        date: moment(dObj).format(this.formatDate),
        timestamp: dObj.getTime()
      };
      return today;
    },
    days () {
      const d = this.pageDate;
      let days = [];
      let dObj = new Date(d.getFullYear(), d.getMonth(), 1, d.getHours(), d.getMinutes());
      let daysInMonth = this.daysInMonth(dObj.getFullYear(), dObj.getMonth());
      for (let i = 0; i < daysInMonth; i++) {
        days.push({
          date: dObj.getDate(),
          timestamp: dObj.getTime(),
          isSelected: this.isSelectedDate(dObj),
          isDisabled: this.isDisabledDate(dObj),
          isToday: dObj.toDateString() === (new Date()).toDateString(),
          isWeekend: dObj.getDay() === 0 || dObj.getDay() === 6,
          isSaturday: dObj.getDay() === 6,
          isSunday: dObj.getDay() === 0
        });
        dObj.setDate(dObj.getDate() + 1);
      }
      return days;
    },
    months () {
      const d = this.pageDate;
      let months = [];
      let dObj = new Date(d.getFullYear(), 0, d.getDate(), d.getHours(), d.getMinutes());
      for (let i = 1; i <= 12; i++) {
        months.push({
          month: i,
          timestamp: dObj.getTime(),
          isSelected: this.isSelectedMonth(dObj),
          isDisabled: this.isDisabledMonth(dObj)
        });
        dObj.setMonth(dObj.getMonth() + 1);
      }
      return months;
    },
    years () {
      const d = this.pageDate;
      let years = [];
      let dObj = new Date(Math.floor(d.getFullYear() / 10) * 10, d.getMonth(), d.getDate(), d.getHours(), d.getMinutes());
      for (let i = 0; i < 10; i++) {
        years.push({
          year: dObj.getFullYear(),
          timestamp: dObj.getTime(),
          isSelected: this.isSelectedYear(dObj),
          isDisabled: this.isDisabledYear(dObj)
        });
        dObj.setFullYear(dObj.getFullYear() + 1);
      }
      return years;
    },
    calendarStyle () {
      return {
        position: this.isInline ? 'relative' : undefined
      };
    },
    isOpen () {
      return this.showDayView || this.showMonthView || this.showYearView;
    },
    isInline () {
      return !!this.inline;
    },
  },
  methods: {
    daysInMonth (year, month) {
      return /8|3|5|10/.test(month) ? 30 : month === 1 ? (!(year % 4) && year % 100) || !(year % 400) ? 29 : 28 : 31;
    },
    preventOutside() {
      return false;
    },
    format (date) {
      return moment(date).format(this.formatDate);
    },
    close (full) {
      this.showDayView = this.showMonthView = this.showYearView = false;
      if (!this.isInline) {
        if (full) this.$emit('closed');
        document.removeEventListener('click', this.clickOutside, false);
      }
    },
    resetDefaultDate () {
      if (this.selectedDate === null) {
        this.setPageDate();
        return;
      }
      this.setPageDate(this.selectedDate);
    },
    /**
     * Effectively a toggle to show/hide the calendar
     * @return {mixed} [description]
     */
    showCalendar () {
      if (this.disabledPicker || this.isInline) {
        this.activeCalender = 'ui-datepicker_contents';
        return false;
      }
      if (this.isOpen) {
        this.activeCalender = 'ui-datepicker_contents';
        return this.close(true);
      }
      this.setInitialView();
      if (!this.isInline) {this.activeCalender = 'ui-datepicker_contents active';
        this.$emit('opened');
      }
    },
    setInitialView () {
      const initialView = this.computedInitialView;

      if (!this.allowedToShowView(initialView)) {
        throw new Error(`initialView '${this.initialView}' cannot be rendered based on minimum '${this.minimumView}' and maximum '${this.maximumView}'`);
      }

      switch (initialView) {
      case 'year':
        this.showYearCalendar();
        break;
      case 'month':
        this.showMonthCalendar();
        break;
      default:
        this.showDayCalendar();
        break;
      }
    },
    allowedToShowView (view) {
      const views = ['day', 'month', 'year'];
      const minimumViewIndex = views.indexOf(this.minimumView);
      const maximumViewIndex = views.indexOf(this.maximumView);
      const viewIndex = views.indexOf(view);

      return viewIndex >= minimumViewIndex && viewIndex <= maximumViewIndex;
    },
    showDayCalendar () {
      if (!this.allowedToShowView('day')) return false;

      this.close();
      this.showDayView = true;
      this.addOutsideClickListener();
    },
    showMonthCalendar () {
      if (!this.allowedToShowView('month')) return false;

      this.close();
      this.showMonthView = true;
      this.addOutsideClickListener();
    },
    showYearCalendar () {
      if (!this.allowedToShowView('year')) return false;

      this.close();
      this.showYearView = true;
      this.addOutsideClickListener();
    },
    addOutsideClickListener () {
      if (!this.isInline) {
        setTimeout(() => {
          document.addEventListener('click', this.clickOutside, false);
        }, 100);
      }
    },
    setDate (timestamp) {
      const date = new Date(timestamp);
      this.selectedDate = date;

      this.setPageDate(date);
      this.$emit('selected', date);
      this.$emit('input', date);
    },
    clearDate () {
      this.selectedDate = null;
      this.$emit('selected', null);
      this.$emit('input', null);
      this.$emit('cleared');
    },
    /**
     * @param {Object} day
     */
    selectDate (day) {
      if (day.isDisabled) {
        this.$emit('selectedDisabled', day);
        return false;
      }
      this.setDate(day.timestamp);
      if (!this.isInline) {
        this.close(true);
      }
    },
    /**
     * @param {Object} month
     */
    selectMonth (month) {
      if (month.isDisabled) {
        return false;
      }

      const date = new Date(month.timestamp);
      if (this.allowedToShowView('day')) {
        this.setPageDate(date);
        this.$emit('changedMonth', month);
        this.showDayCalendar();
      } else {
        this.setDate(date);
        if (!this.isInline) {
          this.close(true);
        }
      }
    },
    /**
     * @param {Object} year
     */
    selectYear (year) {
      if (year.isDisabled) {
        return false;
      }

      const date = new Date(year.timestamp);
      if (this.allowedToShowView('month')) {
        this.setPageDate(date);
        this.$emit('changedYear', year);
        this.showMonthCalendar();
      } else {
        this.setDate(date);
        if (!this.isInline) {
          this.close(true);
        }
      }
    },
    /**
     * @return {Number}
     */
    getPageDate () {
      return this.pageDate.getDate();
    },
    /**
     * @return {Number}
     */
    getPageMonth () {
      return this.pageDate.getMonth();
    },
    /**
     * @return {Number}
     */
    getPageYear () {
      return this.pageDate.getFullYear();
    },
    /**
     * @return {String}
     */
    getPageDecade () {
      const decadeStart = Math.floor(this.pageDate.getFullYear() / 10) * 10;
      const decadeEnd = decadeStart + 9;
      return `${decadeStart} - ${decadeEnd}`;
    },
    changeMonth (incrementBy) {
      let date = this.pageDate;
      date.setMonth(date.getMonth() + incrementBy);
      this.setPageDate(date);
      this.$emit('changedMonth', date);
    },
    previousMonth () {
      if (!this.previousMonthDisabled()) {
        this.changeMonth(-1);
      }
    },
    previousMonthDisabled () {
      if (!this.disabled || !this.disabled.to) {
        return false;
      }
      let d = this.pageDate;
      return this.disabled.to.getMonth() >= d.getMonth() &&
        this.disabled.to.getFullYear() >= d.getFullYear();
    },
    nextMonth () {
      if (!this.nextMonthDisabled()) {
        this.changeMonth(+1);
      }
    },
    nextMonthDisabled () {
      if (!this.disabled || !this.disabled.from) {
        return false;
      }
      let d = this.pageDate;
      return this.disabled.from.getMonth() <= d.getMonth() &&
        this.disabled.from.getFullYear() <= d.getFullYear();
    },
    changeYear (incrementBy, emit = 'changedYear') {
      let date = this.pageDate;
      date.setYear(date.getFullYear() + incrementBy);
      this.setPageDate(date);
      this.$emit(emit, date);
    },
    previousYear () {
      if (!this.previousYearDisabled()) {
        this.changeYear(-1);
      }
    },
    previousYearDisabled () {
      if (!this.disabled || !this.disabled.to) {
        return false;
      }
      return this.disabled.to.getFullYear() >= this.pageDate.getFullYear();
    },
    nextYear () {
      if (!this.nextYearDisabled()) {
        this.changeYear(1);
      }
    },
    nextYearDisabled () {
      if (!this.disabled || !this.disabled.from) {
        return false;
      }
      return this.disabled.from.getFullYear() <= this.pageDate.getFullYear();
    },
    previousDecade () {
      if (!this.previousDecadeDisabled()) {
        this.changeYear(-10, 'changeDecade');
      }
    },
    previousDecadeDisabled () {
      if (!this.disabled || !this.disabled.to) {
        return false;
      }
      return Math.floor(this.disabled.to.getFullYear() / 10) * 10 >= Math.floor(this.pageDate.getFullYear() / 10) * 10;
    },
    nextDecade () {
      if (!this.nextDecadeDisabled()) {
        this.changeYear(10, 'changeDecade');
      }
    },
    nextDecadeDisabled () {
      if (!this.disabled || !this.disabled.from) {
        return false;
      }
      return Math.ceil(this.disabled.from.getFullYear() / 10) * 10 <= Math.ceil(this.pageDate.getFullYear() / 10) * 10;
    },
    /**
     * Whether a day is selected
     * @param {Date}
     * @return {Boolean}
     */
    isSelectedDate (dObj) {
      return this.selectedDate && this.selectedDate.toDateString() === dObj.toDateString();
    },
    /**
     * Whether a day is disabled
     * @param {Date}
     * @return {Boolean}
     */
    isDisabledDate (date) {
      let disabled = false;

      if (typeof this.disabled === 'undefined') {
        return false;
      }

      if (typeof this.disabled.dates !== 'undefined') {
        this.disabled.dates.forEach((d) => {
          if (date.toDateString() === d.toDateString()) {
            disabled = true;
            return true;
          }
        });
      }
      if (typeof this.disabled.to !== 'undefined' && this.disabled.to && date < this.disabled.to) {
        disabled = true;
      }
      if (typeof this.disabled.from !== 'undefined' && this.disabled.from && date > this.disabled.from) {
        disabled = true;
      }
      if (typeof this.disabled.ranges !== 'undefined') {
        this.disabled.ranges.forEach((range) => {
          if (typeof range.from !== 'undefined' && range.from && typeof range.to !== 'undefined' && range.to) {
            if (date < range.to && date > range.from) {
              disabled = true;
              return true;
            }
          }
        });
      }
      if (typeof this.disabled.days !== 'undefined' && this.disabled.days.indexOf(date.getDay()) !== -1) {
        disabled = true;
      }
      if (typeof this.disabled.daysOfMonth !== 'undefined' && this.disabled.daysOfMonth.indexOf(date.getDate()) !== -1) {
        disabled = true;
      }
      if (typeof this.disabled.customPredictor === 'function' && this.disabled.customPredictor(date)) {
        disabled = true;
      }
      return disabled;
    },
    /**
     * Whether the selected date is in this month
     * @param {Date}
     * @return {Boolean}
     */
    isSelectedMonth (date) {
      return (this.selectedDate &&
        this.selectedDate.getFullYear() === date.getFullYear() &&
        this.selectedDate.getMonth() === date.getMonth());
    },
    /**
     * Whether a month is disabled
     * @param {Date}
     * @return {Boolean}
     */
    isDisabledMonth (date) {
      let disabled = false;

      if (typeof this.disabled === 'undefined') {
        return false;
      }

      if (typeof this.disabled.to !== 'undefined' && this.disabled.to) {
        if (
          (date.getMonth() < this.disabled.to.getMonth() && date.getFullYear() <= this.disabled.to.getFullYear()) ||
          date.getFullYear() < this.disabled.to.getFullYear()
        ) {
          disabled = true;
        }
      }
      if (typeof this.disabled.from !== 'undefined' && this.disabled.from) {
        if (
          this.disabled.from &&
          (date.getMonth() > this.disabled.from.getMonth() && date.getFullYear() >= this.disabled.from.getFullYear()) ||
          date.getFullYear() > this.disabled.from.getFullYear()
        ) {
          disabled = true;
        }
      }
      return disabled;
    },
    /**
     * Whether the selected date is in this year
     * @param {Date}
     * @return {Boolean}
     */
    isSelectedYear (date) {
      return this.selectedDate && this.selectedDate.getFullYear() === date.getFullYear();
    },
    /**
     * Whether a year is disabled
     * @param {Date}
     * @return {Boolean}
     */
    isDisabledYear (date) {
      let disabled = false;
      if (typeof this.disabled === 'undefined' || !this.disabled) {
        return false;
      }

      if (typeof this.disabled.to !== 'undefined' && this.disabled.to) {
        if (date.getFullYear() < this.disabled.to.getFullYear()) {
          disabled = true;
        }
      }
      if (typeof this.disabled.from !== 'undefined' && this.disabled.from) {
        if (date.getFullYear() > this.disabled.from.getFullYear()) {
          disabled = true;
        }
      }

      return disabled;
    },
    /**
     * Set the datepicker value
     * @param {Date|String|Number|null} date
     */
    setValue (date) {
      if (typeof date === 'string' || typeof date === 'number') {
        let parsed = new Date(date);
        date = isNaN(parsed.valueOf()) ? null : parsed;
      }
      if (!date) {
        this.setPageDate();
        this.selectedDate = null;
        return;
      }
      this.selectedDate = date;
      this.setPageDate(date);
      this.activeCalender = 'ui-datepicker_contents';
    },
    setPageDate (date) {
      if (!date) {
        if (this.openDate) {
          date = new Date(this.openDate);
        } else {
          date = new Date();
        }
      }
      this.pageTimestamp = (new Date(date)).setDate(1);
    },
    /**
     * Close the calendar if clicked outside the datepicker
     * @param  {Event} event
     */
    clickOutside (event) {
      if (this.$el && !this.$el.contains(event.target)) {
        if (this.isInline) {
          return this.showDayCalendar();
        }
        this.resetDefaultDate();
        this.close(true);
        document.removeEventListener('click', this.clickOutside, false);
        this.activeCalender = 'ui-datepicker_contents';
      }
    },
    dayClasses (day) {
      return {
        'selected': day.isSelected,
        'disabled': day.isDisabled,
        'today': day.isToday,
        'weekend': day.isWeekend,
        'sat': day.isSaturday,
        'sun': day.isSunday
      };
    },
    init () {
      if (this.value) {
        this.setValue(this.value);
      }
      if (this.isInline) {
        this.setInitialView();
      }
    }
  },
  mounted () {
    this.init();
  }
};
</script>
