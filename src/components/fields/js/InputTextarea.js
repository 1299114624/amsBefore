export default {
  methods: {
    onClick(e) {
      this.events.click && this.events.click(e)
    },
    onBlur(e) {
      this.events.blur && this.events.blur(e)
    },
    onFocus(e) {
      this.events.focus && this.events.focus(e)
    },
    onChange(value) {
      this.events.change && this.events.change(value)
    },
  }
}