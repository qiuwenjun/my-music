<template>
  <div id="app">
    <mt-header fixed>
      <div class="left" slot="left"><router-link to="/" ><img src="./assets/img/logo.png"></router-link><h2>下载酷狗</h2></div>
      <div class="right" slot="right"><router-link to="/" ><img src="./assets/img/search.png"></router-link></div>
    </mt-header>
    <router-view/>
    <div class="loading">            //loading加载
         <div class="">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
         </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  components:{
  }
}
</script>
<style lang="less">
@rem:75rem;
body{
    padding-top: 90/@rem;
}
 #app {
        font-family: "微软雅黑";
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    .mint-header{
            height: 90/@rem;
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
}   
</style>
