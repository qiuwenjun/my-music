<template>
  <div class="main">
          <nav class="menu-list" >
               <h1 id="logo"></h1>
               <div :class="tabIndex==index?'active':''" v-for="item,index in  menu" v-if="index!=menu.length-1" @click="switchTab(index)">{{item.name}}</div>
               <div id="search" @click="switchTab(menu.length-1)" ></div>
          </nav>
          <div class="">
            <keep-alive>
                <component :is="tabComponent"></component>
            </keep-alive>
          </div>
  </div>
</template>

<script>
import {getStorage,setStorage} from "@/assets/js/common.js";
export default {
  name: 'mains',
  data () {
    this.flagArr=this.$store.state.menu.map(res=>true);
    let index=getStorage("nowIndex");
    return {
     tabIndex:(!index)||(index>=this.$store.state.menu.length||index<0)?0:index,
     menu:this.$store.state.menu,
    }
  },
  computed:{
     tabComponent(){
        this.$router.replace("");
        return this.menu[this.tabIndex].component;
     }
  },
  methods:{
    switchTab(index){
       this.tabIndex=index;
       setStorage("nowIndex",index);
        if(this.flagArr[index]){
            this.flagArr[index]=false;
            this.$store.commit("setHidden",true);
        }
    },
  },
  created(){
    console.log(this)
    this.flagArr[this.tabIndex]=false;
  },
  destroyed(){
    this.$store.commit("setHidden",true);
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    @rem:75rem;
     .main{
       width: 100%;
       padding-top: 80/@rem;
       .menu-list{
         position: fixed;
         width:100%;
         top: 0%;
        display: flex;
        justify-content:space-around;
        border-bottom:2px solid rgba(189, 188, 188, 0.2);
        padding: 0 100/@rem;
        box-sizing: border-box;
        z-index: 999;
        background: #fff;
        height: 80/@rem;
        #logo,#search{
           position:absolute;
           top: 50%;
           transform: translateY(-50%);
           width: 80/@rem;
           height: 80/@rem
         }
         #logo{
           left: 2%;
           background: url(../assets/img/logo.jpg) no-repeat center center;
           background-size:80/@rem 80/@rem
         } 
        #search{
          right: 2%;
          background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJlSURBVFhH7ZfRShRRHMb3Jkqzm7wJSrqIIDBxX6C0a62H6C7oqq4ixYreQMmMHkXbjLQeIYgyQuqiyIuotKDt923fyLCszv/MzF5EDnzs2T3/7zffOXNm5myjcXDUOAOtVquJ7qOn6AP6ZamtQ33NGk/ZG8VJJtEaagf1XJ7agwEdRI9zIT7RnkdT6Iz7VaO2flPf51z9I9oDtQQDNIxeGv6Nz9voaBFcNa79bu8LsYp8+/Z75FmYN3w/nwqUB204lFiDqYzd+txlek37RFkQ3pNIjDZaKsXBeMkATfloKUjOBGMMifUbXUzmYVp3oFvJ5j0M8GbNXEtiYtJzRtOru6lwAUfhsIZQdveNR30NTPccaD5sChbCXTD7btDSUCAdmqGpsClYCHPa7CdBSyeQXgEKNBI2BQthnjX7Y9DSCfTTpkNhU7AQ7jGzd4KWvgc67EDbKYH6eclOO9BmSqBsUU+HTcFCwJcdaCVo6Vyy7LZfCJuChbAfONCdoKUTKHsw6iE2FDYWFIqFthxoLImLSZsr3fqzScZ9isUyczWZiXEC6UWoF2LaaHqcDcY4+mHmheRAMmBe8oje8nmqFOQvZwS9N2uxLEcgbUuzDdpGmZnyzLxzGG3yqm1lARxH2VZEUz6DChc6NXoia83I087pRukZyozAjqCHvv6Cf0GL6Ao655MrgNr6TX1bDqF1qO/Xcv7qobymJoA+6xpxfvTd7VVqdxcw7au1h3IwbUfn0DJ6hb6ibbSJVtzX8w9B30JVWQf/QqibVQZYm7drpg5C7TmzuZnSI6JZ2yWoAnKo61UY/5f3Dy7dC4CdAEhQAAAAAElFTkSuQmCC) no-repeat center center;
          background-size:50/@rem 50/@rem
        }
        div{
           position: relative;
           padding: 20/@rem 0/@rem;
           font-size: 36/@rem ;
         }
         div.active{
           color: #03A9F4;
          &:after{
                position:absolute;
                content: "";
                display: block;
                width: 140%;
                transform: translateX(-10%);
                background: #03A9F4;
                 height: 2px;
                 bottom: -2px;
            }
         }
       }
     }
      
</style>

