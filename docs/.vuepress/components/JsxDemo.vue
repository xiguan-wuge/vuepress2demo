<script lang="jsx">
export default {
  data() {
    return {
      msg: 'Hello World'
    }
  },
  render() {
    const { msg } = this
    return (
      <div>
        <h1 >{msg}</h1>
        <p class="btn">这是一行</p>
      </div>
    )
  }
}
</script>
<style lang="scss" scoped>
// @import './basic.scss';
.btn {
  color: red;
}
</style>