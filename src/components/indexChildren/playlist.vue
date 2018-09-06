<template>
    <div class="playList">
           <div class="main">
                <div v-for="item,i in musicList" v-show="item.id!=201" class="main_list" :id="item.id" @click="targetTopList(item.id)">
                    <div class="img_detail">
                        <img :src="item.flag?item.picUrl:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHUAAABcCAMAAABneQpwAAAAPFBMVEX////e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7////39/fv7+/m5ube3t7m7ZQJAAAAD3RSTlMAESIzRFVmd4iZqrvM3e5GKvWZAAAChElEQVR42u3a23qbMAwAYEMoS9KEWNL7v+v2LRxsJMtefcjF7Lu2VD9GWFYgxmhjojrDdPX/VbHcSFfxVW5gV7va1Urq/Al1WD6gDk9qro63rVa3Uw+zneqardTp7u+GXIX3PyMUU6fv8x58VsH5GxRRPROtpCJlXH5JnZ9+PEll7UimejZFFSmWgH9SuSmpIPRekKEuQhiuii1fhnoVTp2pIKrwc3UQIjAVRRUz7qYbv1pMDXTVGerIz7uBau4sQgt1YoltoZrvc4gm6hxdOeXv4b1StFyvR3cGr+K1Cf58iISAej9fsEJ1GI4wXP21hbFh9Qd7jnWPY+qFxymxvwJp6rDwQAV6CSRVfS9W37HZfROSql7XjKI7WZvbIwKp6l4NrTsFm9kPA6nqO6nO74uolnT1cUQHZ7KZKurq1V2mzm2cpyKp6pdXG+D4KUu1pKrj4q8BtR92olqrqqSrD3FjUdV16WhrB3WVd2n7QQEVEoqTJVWd/YLvLR5RtZiy55CqXpZQhQdZtUm9BOjq17J9ahQma0PNapQlXd0m613krSxy1VJS5wQx1QwPnp91slzFQJcI0amyKnFjZ7yWxcRuLXA7RtT1PnbjB54QKG8QXrFz49WfJXed7ElFRcWk3Pv7K0vu+0CpjYqxQMkqSy4Is8DIaxqQaoiu7o0pnlOICVlNGIF+ePKSi8mXLk81o5dcplId1QxucpGCmS6resm1JxXrqW5yMXR7lVfNZU8ueCpUVc2wPR72VaqrOo/Z2IPMmuq+1bPDq6pHcvfDqYF6JLep6ia3pWrm5ROquTw/oW5bfWPVff/a1dpq/pdRoL/N7+rfrqLY6N8g62pbdbzWGb8BajFcm9Ofks8AAAAASUVORK5CYII='" class="Publicity_figure">
                        <span><i></i>{{conversion(item.listenCount)}}</span>
                    </div>
                    <div class="detail">
                         <h3>{{item.topTitle}}</h3>
                         <ul>
                             <li v-for="items,l in item.songList">
                                    <span>{{l+1}}</span>{{items.songname}}-<span>{{items.singername}}</span>
                             </li>
                         </ul>
                    </div>    
                </div>    
           </div>  
           <!-- <button @click='show'>123123</button> -->
    </div>
</template>

<script>
   import {mapActions,mapMutations} from "vuex";
   import {Toast} from "mint-ui";
    export default {
         name:"playList",
         data(){
           return{
           }
         },
         computed:{
                musicList(){
                    this.$nextTick(res=>{
                        this.dropDown();
                    });
                   this.$store.state.musicList.forEach(item=>{
                     this.$set(item,'flag',false)
                   });
                    return this.$store.state.musicList;
                },
         },
         methods:{
             targetTopList(id){    //路由跳转
                this.$router.push({
                   path: '/topList',
                   query:{id}
                })
             },
             conversion(data){
                  data=(data/10000).toFixed(1)+"万";
                   return data
             },
             ...mapMutations({
                 setMusicList(commit,data){
                        commit("setMusicList",data.data.topList);
                 } 
             }),
             ...mapActions({
                getMusicList(dispatch){
                    return dispatch("getMusicList").then(success=>{
                            if(success.status==200){
                                this.setMusicList(success.data)
                            }else{
                                return Promise.reject("请求排行榜出错啦!!!")
                            }
                    })
                }
             }),
            dropDown(){     //下拉加载
               this.aImg=Array.from(this.$el.querySelectorAll(".Publicity_figure"));
               let iHeight=document.body.clientHeight||document.documentElement.clientHeight;
               this.aImg.forEach((item,index)=> {
                   if((!this.musicList[index].flag)&&item.getBoundingClientRect().top<iHeight){
                        item.flag=true;
                        let Img=new Image();
                        Img.src=this.musicList[index].picUrl;
                        Img.onload=res=>{
                            clearTimeout(Timer);
                            this.musicList[index].flag=true;
                        };
                        let Timer=setTimeout(res=>{
                             Img.onload=null;
                        },5000);
                   }
               }); 
             }
         },
         created(){
         	console.log("play created")
             Promise.all([this.getMusicList()]).then(success=>{
                     this.$store.commit("setHidden",false);
             },error=>{
                     this.$store.commit("setHidden",false);
                     Toast(error)
             });
         },
        activated(){   
            this.$root.$el.addEventListener("scroll",this.dropDown,false);    
        },
        deactivated(){
            this.$root.$el.removeEventListener("scroll",this.dropDown,false);    
        },
        updated(){   
          
        }
    }
</script>

<style lang="less" scoped>
   @rem:75rem;
   .playList{
        .main{
            padding: 15/@rem;
            background:#99999924;
            .main_list{
                display: flex;
                justify-content: center;
                align-items: center;
                height: 260/@rem;
                margin-bottom: 20/@rem;
                position: relative;
                &:after{
                    position:absolute;
                    display: block;
                    right: 2%;
                    top: 50%;
                    transform:rotateZ(-45deg) translateY(-50%);
                    content: "";
                    border-right: 1px solid #ccc;
                    border-bottom: 1px solid #ccc;
                    color: #ccc;
                    width:15/@rem;
                    height:15/@rem;
                    font-size: 20/@rem
                }
                .img_detail{
                    width: 260/@rem;
                    height: 260/@rem;
                    position: relative;
                    img{
                        width: 100%;
                        height: 100%
                    }
                    span{
                        display: block;
                        position:absolute;
                        bottom: 2%;
                        left: 0%;
                        right: 0%;
                        font-size: 20/@rem;
                        padding-left: 3/@rem;
                        text-align: left;
                        z-index: 9;
                        color: #fff;
                        i{
                            display: inline-block;
                            width: 20/@rem;
                            height: 20/@rem;
                            background: url(../../assets/img/list_sprite.png) no-repeat left bottom;
                            background-size: 48/@rem 120/@rem;
                            margin: 0 10/@rem;
                            vertical-align: middle;
                        }
                    }
                    &:after{
                        display: block;
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        content: "";
                        background: url(../../assets/img/shadow_rp_b.png) repeat center center;
                        background-size:100% 100%;
                        top: 0%;
                        z-index: 10;
                    }
                }
                .detail{
                    width: 400/@rem;
                    height: 240/@rem;
                    padding:10/@rem 30/@rem;
                    background: #fff;
                    display:flex;
                    flex-direction: column;
                    justify-content: space-between;
                    h3{
                        font-size:42/@rem;
                        color: #000;
                        text-align: left;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                    }
                    ul{
                        li{
                            font-size: 30/@rem;
                            text-align: left;
                            line-height: 2;
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: nowrap;
                            span:first-child{
                                color: #827e7e;
                                font-size: 26/@rem;
                                margin: 0 15/@rem 0 0;
                            }
                            span:last-child{
                                color: #827e7e;
                            }
                        }
                    }
                }
            }
        }
   }
</style>

