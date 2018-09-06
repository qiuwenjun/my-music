<template>
  <div id="app" :class="nowSong.show?'active':''">
    <router-view/>
    <div class="loading"  v-show="hidden">            
         <div class="loading-list">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
         </div>
    </div>
    <footer id="footer" v-show="footerHide">
          MUSIC PLANET, 听到极致
    </footer>
    <!-- <playmusic v-show="nowSong.show"></playmusic> -->
    <returnTop></returnTop>
  </div>
</template>

<script>
// import playmusic from "@/components/playmusic.vue";   //音乐播放器
import returnTop from "@/components/returnTop.vue";    //返回顶部
export default {
  name: 'App',
  computed:{
     hidden(){
       return this.$store.state.hidden;
     },
     footerHide(){
       return this.$store.state.footerHide;
     },
    nowSong(){
        let nowSong= this.$store.state.indexs.nowSong;
        return nowSong
      },
  },
  components:{
    returnTop
  },
}
</script>
<style lang="less">
@rem:75rem;
.loading{
  position: fixed;
  top: 0%;
  right: 0%;
  bottom: 0%;
  left: 0%;
  background: #eee;;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items:center;
  .loading-list{
   display: flex;
   justify-content: center;
   align-items:center;
    div{
      width: 0.1rem;
      height: 0.6rem;
      border-radius: 10rem;
      background: #00a8ff;
      margin: 0 0.2rem;
      animation: loading 0.8s ease-in-out infinite alternate both;
    }
    div:first-child{
      animation-delay: 0s
    }
    div:nth-child(2){
      animation-delay: 0.2s
    }
    div:nth-child(3){
      animation-delay: 0.4s
    }
    div:last-child{
      animation-delay: 0.6s
    }
  }
}
@keyframes loading{
   0%{
     transform: scaleZ(1)
   }
   50%{
     transform: scale(2)
   }
   100%{
     transform: scale(1)
   }
}
 #app {
        font-family: "微软雅黑";
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        height: 100%;
        overflow-y: auto;
        &.active{
            padding-bottom: 160/@rem;          
        }
    .mint-header{
            height: 90/@rem;
            z-index: 99999;
            .mint-header-button{
                flex: none;
                height: 100%;
                .left{
                  display: flex;
                  height: 100%;
                  align-items:center;
                    a{                    
                      width: 185/@rem;
                    }
                    h2{
                      margin: 0;
                      font-weight: normal;
                      border: 1px solid #fff;
                      font-size: 24/@rem;
                      margin-left: 22/@rem;
                      padding: 10/@rem 20/@rem;
                      border-radius: 12/@rem;
                    }
                } 
                .right{
                    width:34/@rem;
                    height: 100%;
                    display:flex;
                    align-items:center;
                    a{
                      width: 100%;
                      display: block;
                    }
                }
            }
      }
      #footer{
         height: 160/@rem;
         padding: 30/@rem 0 30/@rem 30/@rem;
         font-size: 24/@rem;
         font-family:"微软雅黑";
         line-height: 100/@rem;
         box-sizing: border-box;
         background: url(./assets/img/logo.jpg) no-repeat 120/@rem center;
         background-size: 100/@rem 100/@rem
      }
}   
</style>
