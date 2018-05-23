<template>
     <div class="news">
          <swiper :bannerList="banner"></swiper>
          <div class="newList">
                <h2 class="title"><strong>新歌榜</strong><router-link to="/">更多</router-link></h2>
                <ul class="list" v-if="newsList.bannerList.length">
                    <li  v-for="item,i in newsList.bannerList">
                        <div class="music iconfont icon-icon">
                            <img src="../../assets/img/1.jpg">
                            <span></span>
                            <div class="right" :class="'play'">
                                <span class="play"><img src="../../assets/img/play-state-aa7.gif"></span>
                                 <div>
                                     <h3>我们不一样</h3>
                                     <span>王菲</span>
                                 </div>
                                 <i class="iconfont icon-bofang" v-show="item.flag"></i>
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="noData" v-else>{{newsList.title}}</div>
          </div>
     </div>
</template>

<script>
   import {mapActions,mapMutations} from "vuex";
   import {Toast} from "mint-ui";
    export default {
          name:'news',
          data(){
                return {
                    newFlag:true
                }
          },
          computed:{
                newsList(){
                    return {
                        title:"新歌榜",
                        bannerList:this.$store.state.newsList
                    }
                },
                banner(){
                    return this.$store.state.bannerList
                }
          },
          methods:{
                ...mapActions({
                    getBanner(dispatch){
                         dispatch("getBanner",{
                              type:"get",
                              url:"/kugou/?json=true",
                         }).then(res=>{
                             if(res.status==200){
                                 this.setBanner(res.data);
                             }else{
                                Toast("请求失败")
                             }
                          })
                    }
              }),
              ...mapMutations({
                   setBanner(commit,data){
                       commit('setBanner',data);
                   }
              })
          },
          mounted(){
              console.log(this)
              this.getBanner();
          }
    }
</script>

<style lang="less" scoped>
   @rem:75rem;
   .newList{
       padding: 0 25/@rem;
       .title{
           display: flex;
           justify-content: space-between;
           padding: 20/@rem 0/@rem;
           align-items:center;
           strong{
               font-weight: 600;
               font-size: 50/@rem;
           }
           a{
               font-size: 30/@rem;
               color: #000
           }
       }
       li{
           border-bottom: 1/@rem solid #eee;
           .music{
               padding: 16/@rem 0/@rem;
               display: flex;
               align-items:center;
               >img{
                   width: 120/@rem;
                   height:120/@rem
               }
               >span{
                   display:block;
                   width: 30/@rem;
                   height: 5/@rem;
                   margin: 0 15/@rem;
                   background: #d0cece;
               }
               .right{
                    position: relative;
                   width: 450/@rem;
                   overflow: hidden;                  
                   &.play{
                       >div{
                           transform: translateX(20px)
                       }
                   }
                   >i{
                       display: block;
                        position:absolute;
                        right: 2%;
                        top: 50%;
                        z-index: 10;
                        transform: translateY(-50%)
                    }
                   .play{
                        position: absolute;
                        left: 2%;
                        top: 50%;
                        transform: translateY(-50%);
                        width:23/@rem;
                        height: 23/@rem;
                        z-index: 1;
                   }
                   >div{
                       transition: transform 0.6s;
                        background: #fff;
                        position: relative;
                        z-index: 9;
                   }
                   h3{
                       font-size: 36/@rem;
                       text-align: left;
                       color: #000;
                       margin-bottom: 5/@rem
                   }
                   span{
                       display: block;
                       text-align: left;
                       font-size: 30/@rem;
                       color: #999
                   }
               }
           }
       }
       .noData{
           text-align:center;
           font-size: 20/@rem;
           color: #999
       }
   }
</style>

