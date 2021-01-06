<template>
  <div class="G_head">
    <header class="flexbox">
      <div class="logo-container flexbox align-center"></div>
      <div class="flexbox align-center adapt" id="menuContainer">
        <div class="menuContainer">
            <!-- calculateDOM 用于辅助计算宽度，不显示 -->
            <ul id="calculateDOM">
              <li v-for="(menu,index) in navArr" v-if="!menu.hidden" :key="index">
                <span>{{menu.meta.alias}}</span>
              </li>
            </ul>
            <ul>
              <li
                v-for="(menu,index) in navArrPlain"
                :key="index"
                v-if="!menu.hidden"
                :style="{cursor:menu.leaf?'auto':'pointer',height:'50px'}"
                :class="{active: currentMainMenu.indexOf(menu.path) !== -1}"
                @click="onMenuClick(menu)">
                <span>{{menu.meta.alias}}</span>  
                <!-- 普通菜单 -->
                <div class="menuContent" v-if="menu.leaf&&!menu.meta.isClassify">
                  <ul class="childArr">
                    <li v-for="(subMenu,index) in menu.children" :key="index" v-if="!menu.hidden">
                      <span v-if="subMenu.index===1">{{subMenu.subTitle?sunMenu.subTitle:''}}</span>
                      <p @click.stop="onMenuClick(subMenu)">{{subMenu.meta.alias}}</p>
                    </li>
                  </ul>
                </div>
                <!-- 三级菜单 -->
                <div class="menuContent" v-for="(classifyMenu,i) in classifyMenuObj" :key="i" 
                v-if="menu.leaf&&menu.meta.isClassify">
                  <ul class="childArr" v-for="(classify,n) in classifyMenu.children" :key="n">
                    <li><span>{{menuClassifyEnum[classify]}}</span></li>
                    <li v-for="(subMenu,index) in menu.children" :key="index"
                    v-if="!menu.hidden&&sunMenu.meta.type===classify">
                      <p @click.stop="onMenuClick(subMenu)">{{subMenu.meta.alias}}</p>
                    </li>
                  </ul>                  
                </div>
              </li>  
              <li class="menuMore" v-if="navArrPlain.length-1!==navArr.length&&navArrMore.length!==0"
              style="border-bottom:0px">
                <i class="el-icon-caret-bottom"></i>
                <div class="menuContent plain-scrollbar">
                  <!-- 普通菜单 -->
                  <ul class="childArr" v-for="(menu,index) in navArrMore" :key="index"
                  v-if="!menu.hidden&&!menu.meta.isClassify">
                    <li v-if="!menu.leaf">
                      <p @click.stop="onMenuClick(menu)">{{menu.meta.alias}}</p>
                    </li>
                    <li v-for="(subMenu,index) in menu.children" :key="index" v-if="!subMenu.hidden&&subMenu.leaf">
                      <span v-if="index===0">{{menu.meta.alias}}</span>
                      <p @click.stop="onMenuClick(subMenu)">{{subMenu.meta.alias}}</p>                      
                    </li>
                  </ul>
                </div>
              </li>              
            </ul>
        </div>
      </div>
      <div class="flexbox align-center messages"></div>
    </header>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  data() {
    return {
      navArr: [],
      navArrPlain: [],
      navArrMore: [],
      classifyMenuObj: {},
      menuClassifyEnum: []
    }
  },
  computed: {
    ...mapGetters(["menu_routers"]),
  },
  created() {
    this.formatNavArr();
  },
  mounted() {
    console.log("menu_routers",_.cloneDeep(this.menu_routers))
  },
  methods: {
    formatNavArr() {
      
    }
  }
};
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