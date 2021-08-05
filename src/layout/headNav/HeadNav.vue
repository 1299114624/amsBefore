<template>
  <div class="G_head">
    <header class="flexbox">
      <div class="logo-container flexbox align-center">
        <img src="../../assets/client/logo.png" width="38" height="22" class="logo pointer" @click="onMenuClick({name:'welcome'})">
        <span class="system-name">{{ systemInfo.name }}</span>
        <span class="version">
          <span :class="[systemInfo.status === 2 ? 'red-dot' : 'blue-dot']"></span>
          <span :class="[systemInfo.status === 2 ? 'preStatusName' : 'preStatusName-distinct']">
            {{ systemInfo.preStatusName }}环境
          </span>
        </span>
        <div class="split"></div>
      </div>
      <div class="flexbox align-center flex1" id="menuContainer">
        <div class="menuContainer">
          <!-- calculateDOM 用于辅助计算宽度，不显示 -->
          <ul id="calculateDOM" class="flexbox">
            <li v-for="(menu,index) in navArr" :key="index" class="ml-10 mr-10">
              <p class="f-14">
                {{menu.meta.alias}}
              </p>
            </li>
          </ul>
          <ul class="flexbox menu-wrapper">
            <li
              v-for="(mainMenu,index) in cloneNavArr"
              :key="index"
              class="main-menu ml-10 mr-10"
              :class="{'click-active':[$route.meta.grandParentName,$route.meta.parentName,$route.name].includes(mainMenu.name)}">
              <p class="main-menu-name f-14" :class="{pointer:!mainMenu.meta.hasLeaf}" @click="handleMainClick(mainMenu)">
                {{ mainMenu.meta.alias }}
              </p>
              <!-- 小屏，超过三个二级菜单靠右定位，以免超出屏幕 -->
              <ul class="subMenu flexbox" :class="{'pos-right':index>3,'pos-left':index<=3}" v-if="mainMenu.meta.hasLeaf">
                <li class="subMenu-item" v-for="(subItem,subIndex) in mainMenu.children" :key="subIndex">
                  <div class="menu-item-wrapper" v-for="(menuItem,menuIndex) in subItem" :key="menuIndex">
                    <template v-if="menuItem.isShadowMenu">
                      <p class="f-12 shadow-menu">{{ menuItem.groupName }}</p>
                    </template>
                    <template v-if="!menuItem.isShadowMenu" >
                      <p class="f-12 pointer normal-menu" @click="onMenuClick(menuItem)"
                      :class="{'active-menu-item':[$route.meta.parentName,$route.name].includes(menuItem.name)}">
                        {{ menuItem.meta.alias }}
                      </p>
                    </template>
                  </div>
                </li>
              </ul>
            </li>  
            <li class="flexbox menu-more align-center main-align-center" v-if="boundIndex>0">
              <i class="el-icon-caret-bottom pointer" 
                :class="{'icon-active':menuMoreNames.includes($route.meta.parentName)||
                menuMoreNames.includes($route.meta.parentName)}"></i>
              <div class="flexbox subMenu-more">
                <div class="subMenu-more-item" v-for="(moreMenu,index) in menuMore" :key="index">
                  <ul class="subMenu-more-wrapper pb-10">
                    <li class="subMenu-inner" v-for="(moreItem,moreIndex) in moreMenu.children" :key="moreIndex">
                      <div class="subMenu-inner-menu" v-for="(menuItem,menuIndex) in moreItem" :key="menuIndex">
                        <template v-if="menuItem.isShadowMenu">
                          <p class="f-12 shadow-menu">{{ menuItem.groupName }}</p>
                        </template>
                        <template v-if="!menuItem.isShadowMenu" >
                          <p class="f-12 pointer normal-menu" @click="onMenuClick(menuItem)"
                          :class="{'active-menu-item':[$route.meta.parentName,$route.name].includes(menuItem.name)}">
                            {{ menuItem.meta.alias }}
                          </p>
                        </template>
                      </div>
                    </li>                      
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="flexbox align-center messages" @mouseleave="handleMouseLeave">
        <div class="message-list" :class="{'show-panel': showName,'hide-panel': !showName}">
          <div class="menu-item" @click="setDialogInfo('pass')" v-if="isShowPasswd">修改密码</div>
          <div class="menu-item" @click="setDialogInfo('logout')">退出</div>
        </div>
        <span class="user-name pointer" @click="handleToggle" :class="{'show-name': showName,'hide-name': !showName}">
          <div class="f-12 rel">
            {{this.username}}
          </div>
        </span>
        <div class="split"></div>
        <div class="datetime">
          <span class="systemtime">
            <span style="display:inline-block;width:68px;">系统时间</span>
            <span>{{serverOSInfo.currentTime}}</span>
          </span>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  data() {
    return {
      menuMoreNames: [],
      menuMore: [],
      navArr: [],
      cloneNavArr: [],
      boundIndex: 0,
      showName: false,
      username: this.$store.state.user.name[0],
    }
  },
  computed: {
    ...mapGetters(["menu_routers"]),
    ...mapState({
      systemInfo: state => state.global.systemInfo,
      serverOSInfo: state => state.global.serverOSInfo,
    }),
    isShowPasswd() {
      let loginType = window.sessionStorage.getItem("af_login_type")
      if (loginType == "0") {
        return true
      }
      return false
    }
  },
  created() {
    this.formatNavArr();
  },
  mounted() {
    this.$nextTick(() => {
      this.calculateMenuContainerWidth();
    })
    $(window).resize(() => {
      this.calculateMenuContainerWidth();
    })
    console.log("navArr",_.cloneDeep(this.navArr))
  },
  methods: {
    formatNavArr() {
      let navArr = _.cloneDeep(this.menu_routers[0].children).filter(menu=>!menu.hidden);   
      navArr.forEach((item,index) => {
        if (item.children) {
          item.meta.hasLeaf = true
          let groupedChildren = {}
          let newChildren = []
          if(item.meta.noGroup) {
            // 不分组的情况
            let filterChildren = item.children.filter(v => !v.hidden)
            newChildren.push(filterChildren)
          } else {
            groupedChildren = _.groupBy(item.children,"groupName");
            for(const key in groupedChildren) {
              if(groupedChildren.hasOwnProperty(key) && key !== "undefined") {
                const element = groupedChildren[key];
                const groupName = element[0].groupName;
                element.unshift({ isShadowMenu: true, groupName: groupName });
                newChildren.push(element);
              }
            }
          }
          item.children = newChildren;
        }
      })
      this.navArr = navArr
      this.cloneNavArr = _.cloneDeep(navArr)
    },
    calculateMenuContainerWidth: _.throttle(function() {
      const menuContainerWidth = $("#menuContainer").outerWidth(true);
      const calculateDOMs = $("#calculateDOM > li");
      const length = calculateDOMs.length;
      let sum = 0;
      let boundIndex = 0;
      calculateDOMs.each((index, el) => {
        sum = sum + $(el).outerWidth(true);
        if (sum > menuContainerWidth) {
          boundIndex = index;
          return false
        }
      });
      let cloneMenus = _.cloneDeep(this.cloneNavArr);
      if(boundIndex <= length - 1 && boundIndex > 0) {
        boundIndex = boundIndex - 1;
        this.menuMore  = cloneMenus.splice(boundIndex);
        this.navArr = cloneMenus;
        this.boundIndex = boundIndex;
        this.menuMoreNames = this.menuMore.map(item => item.name);
      } else {
        this.navArr = cloneMenus;
        this.boundIndex = 0;
        this.menuMore = [];
      }
    }, 300),
    onMenuClick(route) {
      this.$router.push({ name: route.name })
    },
    handleMainClick(menuItem) {
      if(!menuItem.children) {
        this.$router.push({ name: menuItem.name })
      }
    },
    handleMouseLeave() {
      if (!this.showName) return
      this.handleToggle()
    },
    handleToggle() {
      this.showName = !this.showName
      if (this.showName) {
        this.username = `  ${this.$store.state.user.name}  `
      } else {
        this.username = this.$store.state.user.name[0]
      }
      this.$nextTick(() => this.calculateMenuContainerWidth())
    },
    /**
     * 弹出框-修改密码或者系统设置
     */
    setDialogInfo(cmditem) {
      switch (cmditem) {
        case 'pass':
          this.showPass = true
          this.title = '修改密码'
          break
        case 'logout': {
          this.logout()
          break
        }
      }
    },
    logout() {
      this.$confirm('您确定退出登录吗?', "确认退出", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let loginType = window.sessionStorage.getItem("af_login_type")
        this.$$api_user_logout({
          fn: data =>{
            this.$store.dispatch("remove_userinfo").then(() => {
              // 退出websocket登录
              if (this.$socket && this.$socket.readyState === 1) {
                this.$socket.send("logout-" + this.$store.state.user.id + "")
              }
              if (!localStorage.getItem("af_sso_token")) {
                if (loginType == "0" || loginType == "2") {
                  this.$router.push({
                    name: "loginBos"
                  })
                }
              }
            })
          }
        })         
      })
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
    .logo-container {
      background: $header-color;
      .logo {
        margin-right: 16px;
        margin-left: 8px;
        min-width: auto;
      }
      .system-name {
        cursor: pointer;
        color: #fff;
        font-size: 16px;
        font-weight: bold;
        white-space: nowrap;
      }
      .version {
        font-size: 12px;
        padding: 0 16px 0 8px;
        white-space: nowrap;
        .red-dot {
          display: inline-block;
          background-color: #ff4d4d;
          width: 8px;
          height: 8px;
          border-radius: 4px;
        }
        .blue-dot {
          display: inline-block;
          background-color: #2d83ec;
          width: 8px;
          height: 8px;
          border-radius: 4px;          
        }
        .preStatusName {
          color: #a0aac8;
          font-size: 12px;
          margin-left: 4px;
        }
        .preStatusName-distinct {
          color: #fff;
          font-size: 12px;
          margin-left: 4px;
        }
      }
    }
    #menuContainer {
      background: $header-color;
      .menuContainer {
        height: 100%;   
        #calculateDOM {
          visibility: hidden;
          position: fixed;
          top: -999px;
        }
        .menu-wrapper {
          flex-wrap: wrap;
          .main-menu {
            height: 50px;
            position: relative;
            border-width: 0;
            &.click-active {
              .main-menu-name {
                color: #1e90ff;
              }
            }
            &::after {
              content: "";
              display: inline-block;
              width: 0;
              height: 3px;
              background: #1e90ff;
              position: absolute;
              bottom: 0;
              left: 50%;
              transition: all .4s cubic-bezier(0.46, 1, 0.23, 1.52);
            }
            &:hover {
              &::after {
                width: 100%;
                left: 0;
              }
              .main-menu-name {
                color: #1e90ff;
              }
              .subMenu {
                transform: translateY(0);
              }
            }
            .main-menu-name {
              color: #fff;
              height: 50px;
              line-height: 50px;
              white-space: nowrap;
            }
            .subMenu {
              background: #2c3c69;
              position: absolute;
              z-index: -1;
              padding: 10px 0;
              transform: translateY(-100%);
              transition: all .2s linear;
              white-space: nowrap;
              &.pos-left {
                left: -20px;
              }
              &.po-right {
                right: -85px;
              }
              .subMenu-item {
                min-width: 160px;
                border-right: 1px solid #253359;
                .menu-item-wrapper {
                  height: 30px;
                  line-height: 30px;
                  p {
                    padding: 0 20px;
                  }
                  .normal-menu {
                    color: #fff;
                  }
                  .shadow-menu {
                    color: rgba(160, 170, 200, 0.698);
                  }
                }
                .pointer:hover {
                  background: #56a6f7;
                }
                .active-menu-item {
                  background: #1e90ff !important;
                }
              }
            }
          }
        }
      }
    }
    .messages {
      min-width: 260px;
      position: relative;
      background: $header-color;
      .message-list {
        position: absolute;
        left: 0;
        top: 50px;
        right: 0;
        z-index: -1;
        padding: 10px 0 20px;
        background: #2c3c69;
        .menu-item {
          font-size: 12px;
          padding: 0 20px;
          height: 30px;
          line-height: 30px;
          color: #fff;
          &:hover {
            background: #2d83ec;
          }
        }
        &.show-panel {
          transform: translateY(0);
          transition: all 0.1s linear 0.1s;
        }
        &.hide-panel {
          transform: translateY(-100%);
          transition: all 0.1s linear;
        }
      }
      .user-name {
        position: relative;
        background: #2d83ec;
        height: 24px;
        line-height: 24px;
        border-radius: 12px;
        margin: 0 10px;
        padding: 3px;
        .rel {
          height: 18px;
          line-height: 18px;
          border-radius: 9px;
          text-align: center;
          white-space: nowrap;
          background: #2d83ec;
          color: #fff;
        }
        &.show-name {
          background: rgba(45, 131, 236, 0.5);
          margin-right: 10px;
          transition: all 0.1s linear;
          width: 120px;
          .rel {
            padding: 0 5px;
          }
        }
        &.hide-name {
          transition: all 0.1s linear 0.1s;
          width: 24px;
        }
      }
      .datetime {
        min-width: 196px;
        margin-left: 10px;
        margin-right: 8px;
        .systemtime {
          font-size: 12px;
          color: #a0abc7;
          span {
            color: #fff;
            font-size: 12px;
          }
        }
      }
    }
  }
  .split {
    border-left: 1px solid #394367;
    height: 18px;
  }  
}
</style>