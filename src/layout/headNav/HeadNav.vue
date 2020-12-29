<template>
  <div class="G_head">
    <header class="flexbox">
      <div class="logo-container flexbox align-center"></div>
      <div class="flexbox align-center adapt" id="menuContainer">
        <div class="menuContainer">
            <!-- 用于辅助计算宽度，不显示 -->
            <ul id="calculateDOM"></ul>
            <ul></ul>
        </div>
      </div>
      <div class="flexbox align-center messages"></div>
    </header>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
$bg-color: #fff;
$header-height: 50px;
$header-color: #202e55; //导航条颜色
$label-bg-color: #1e3350;
$menu-color: #2d83ec;
$popper-menu-color: #2c3c69;
$icon-size: 20px;
.G_head {
  user-select: none; // 不能选择文本
  width: 100%;
  min-width: 1080px;
  background: $header-color;
  position: fixed;
  box-sizing: border-box;
  top: 0;
  left: 0;
  z-index: 1999;
  header {
    height: $header-height;
    .menuContainer {
      height: 100%;
      #calculateDOM {
        visibility: hidden;
        position: fixed;
        top: -999px;
      }
      ul li {
        display: inline-block;
        margin: 0 10px;
        position: relative;
        text-align: center;
        line-height: 50px;
        font-style: 14px;
        color: #fff;
        box-sizing: border-box;
      }
    }
  }
}
</style>