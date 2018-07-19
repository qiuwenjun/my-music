<template>
    <div class="singer">
           <header class="singer_header">
               <ul>
                    <li v-for="values,keys in singer.show">
                        <h2>{{classify[keys]}}</h2>
                        <div v-scroll="index" class="singer_header_scroll" >
                                <ul>
                                    <li :class="activerId[keys]==item.id?'active':''" @click="changed(keys,item.id)" v-for="item of values">{{item.name}}</li>
                                </ul>
                        </div>
                    </li>
               </ul>
         </header>
         <section class="singer_main">
                <div class="singer_main_header">
                       <h2>{{activerId.area | fanyi(singer.show)}}</h2>
                       <i class="iconfont icon-santiao" @click="options"></i>
                </div>
                <div class="singer_main_body" :style={height}>
                        <div v-if="singerList.length">
                            <ul>
                                    <li v-for="item,index in singerList" @click="playMusic(item)">
                                        <div class="singer_list">
                                            <h2><img :src="item.flag?'https://y.gtimg.cn/music/photo_new/T001R300x300M000'+item.singer_mid+'.jpg?max_age=2592000':'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHUAAABcCAMAAABneQpwAAAAPFBMVEX////e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7////39/fv7+/m5ube3t7m7ZQJAAAAD3RSTlMAESIzRFVmd4iZqrvM3e5GKvWZAAAChElEQVR42u3a23qbMAwAYEMoS9KEWNL7v+v2LRxsJMtefcjF7Lu2VD9GWFYgxmhjojrDdPX/VbHcSFfxVW5gV7va1Urq/Al1WD6gDk9qro63rVa3Uw+zneqardTp7u+GXIX3PyMUU6fv8x58VsH5GxRRPROtpCJlXH5JnZ9+PEll7UimejZFFSmWgH9SuSmpIPRekKEuQhiuii1fhnoVTp2pIKrwc3UQIjAVRRUz7qYbv1pMDXTVGerIz7uBau4sQgt1YoltoZrvc4gm6hxdOeXv4b1StFyvR3cGr+K1Cf58iISAej9fsEJ1GI4wXP21hbFh9Qd7jnWPY+qFxymxvwJp6rDwQAV6CSRVfS9W37HZfROSql7XjKI7WZvbIwKp6l4NrTsFm9kPA6nqO6nO74uolnT1cUQHZ7KZKurq1V2mzm2cpyKp6pdXG+D4KUu1pKrj4q8BtR92olqrqqSrD3FjUdV16WhrB3WVd2n7QQEVEoqTJVWd/YLvLR5RtZiy55CqXpZQhQdZtUm9BOjq17J9ahQma0PNapQlXd0m613krSxy1VJS5wQx1QwPnp91slzFQJcI0amyKnFjZ7yWxcRuLXA7RtT1PnbjB54QKG8QXrFz49WfJXed7ElFRcWk3Pv7K0vu+0CpjYqxQMkqSy4Is8DIaxqQaoiu7o0pnlOICVlNGIF+ePKSi8mXLk81o5dcplId1QxucpGCmS6resm1JxXrqW5yMXR7lVfNZU8ueCpUVc2wPR72VaqrOo/Z2IPMmuq+1bPDq6pHcvfDqYF6JLep6ia3pWrm5ROquTw/oW5bfWPVff/a1dpq/pdRoL/N7+rfrqLY6N8g62pbdbzWGb8BajFcm9Ofks8AAAAASUVORK5CYII='"></h2>
                                            <p>{{item.singer_name}}</p>
                                        </div>
                                    </li>
                            </ul>
                        <div class="loadingText" v-show='(!isScrollLa)'>{{loadingText}}</div>
                        </div>  
                       <div class="request_noData" v-else>
                               <i v-if="isRequest"></i>
                                <p v-else>暂未查询到相关数据!!!</p>
                       </div>
                </div>
         </section>
         <div class="mask" :class="isClose?'show':'hide'" @click="options"></div>
         <!--更多筛选内容-->
        <div class="screening" :class="isClose?'show':''">
              <h2>选择分类标签</h2>
              <div class="screening-list">
                  <ul  v-for="values,keys in singer.hide"> 
                        <li :class="activerId[keys]==item.id?'active':''" data-id="item.id" @click="changed(keys,item.id),options" v-for="item of values">{{item.name}}</li> 
                  </ul>
              </div>
              <div class="close" @click="options">关闭</div>
        </div>
    </div>    
</template>

<script>
    import {mapActions,mapMutations} from 'vuex'; 
    import {setStorage,getStorage} from "../../assets/js/common";
    import {Toast} from "mint-ui";
    export default {
         name:"singer",
         filters:{
             fanyi(defaults,json){
                if(Object.keys(json).length){
                    return json.area.filter(res=>{
                        return defaults==res.id
                    })[0].name
                }
                return "推荐"
             }
         },
         data(){
             return{
                 index:0,
                 isClose:false,
                 height:"auto",  //高度
                 activerId:{    //查询字符串
                     sex:"-100",
                     index:"-100",
                     genre:"-100",
                     page:"1",
                     area:"-100",
                 },
                 qtcs:{
                    sin:"0",
                    cur_page:"1"
                 },
                  classify:{    //分类名称
                    "area":"地区",
                    "genre":"流派",
                    "sex":"类别",
                },
                num:0,
                allPage:0,
                isRequest:true,
                loadingText:"正在加载",
                isScrollLa:true,
             }
         },
         computed:{
             singer(){
                 let data=this.$store.state.singerList.category;
                 let json={
                      show:{ },
                      hide:{ } 
                }
                 for(let attr in data){
                     if(attr==="index"){
                         json.hide[attr]=data[attr];
                     }else{
                         json.show[attr]=data[attr]
                     }
                 }
                 this.$nextTick(res=>{
                     if(Object.keys(json.show).length) this.index=this.index?0:1
                 });
                 return json;
             },
             singerList(){
                 let arr=this.$store.state.singerList.musicList;
                 if(arr.length){
                    this.$nextTick(res=>{
                        this.requestScroll();
                        this.$nextTick(res=>this.setHeight());
                    });
                 }else{
                    this.$nextTick(res=>this.setHeight());
                 }
                return arr;
             }
         },
         methods:{
             changed(keys,id){      //选择需要查询的分类
                 this.activerId[keys]=id;
                 this.qtcs.sin=0;
                 this.qtcs.cur_page=1;
                 this.activerId.page=1;
                 this.setHash();
                if(this.source&&this.source.qqSinger)  this.source.qqSinger.cancel("操作被用户取消")
                this.setMusicSinger({
                    musicList:[],   //歌手
                    flag:false
                });
                this.isRequest=true;
                this.isScrollLa=true;
                
                this.getMusicSinger().then(res=>{
                     this.isRequest=false;
                },res=>{});
             },
             options(){     //设置是否查询更多分类
                this.isClose=!this.isClose;
             },
             setHash(){
                let str="?";
                let flag=true;
                for(let attr in this.activerId){
                    if(flag){
                        flag=false;
                        str+=attr+'='+this.activerId[attr];
                    }else{
                      str+='&'+attr+'='+this.activerId[attr];
                    }
                };
                window.location.hash=str;
             },
            playMusic(item){                 //获取歌单跳转播放详情页
                   if(this.source&&this.source["qqSingerDetail"])  this.source["qqSingerDetail"].cancel("操作被用户取消");
                    this.getSingerDetail({
                        singerid:item.singer_id,
                        begin:0,
                        num:15
                    }).then(query=>{
                        this.$router.push({path:'/playsong',query});
                        console.log("获取歌手详情成功")
                    },reject=>{
                        console.log(reject)
                    })
             },
             ...mapActions({
                 getMusicSinger(dispatch,request){
                        return dispatch("getMusicSinger",{
                            show:this.activerId,
                            hide:this.qtcs,
                            el:this,
                        }).then(success=>{
                            if(success.status==200){
                                if(!request){
                                    this.num=success.data.singerList.data.singerlist.length;
                                    this.allPage=Math.ceil(success.data.singerList.data.total/this.num);
                                }
                                let config={
                                   category :success.data.singerList.data.tags,   //分类
                                   musicList:success.data.singerList.data.singerlist.map(item=>{
                                       item.flag=false;
                                       return item;
                                   }),   //歌手
                                   flag:request
                                };
                                this.setMusicSinger(config);
                                return Promise.resolve();
                            }else{
                                return Promise.reject("请求出错!!!");
                            }
                        });
                 },
                 getSingerDetail(dispatch,config){                    //获取歌手详情
                    return dispatch("getSingerDetail",{
                        ...config,
                        "_":new Date().getTime(),
                        el:this,
                    }).then(res=>{
                        if(res.status==200){
                            let data=res.data.data.list;
                            let SongId=[];      //歌曲ID
                            let SongList=[];    //歌曲列表
                            if(data.length){        //有数据
                                    for(let i=0;i<data.length;i++){
                                        SongId.push(data[i].musicData.songid);
                                        let json={
                                            songid:data[i].musicData.songid,
                                            name:data[i].musicData.songname,
                                            singer:data[i].musicData.singer,
                                            vid:data[i].musicData.vid,
                                            songmid:data[i].musicData.songmid,
                                        };
                                        SongList.push(JSON.stringify(json));
                                    }
                                setStorage("playList",SongList.join("&"));
                                this.setPlaylist(SongList);
                               return Promise.resolve({
                                    songId:SongId.join(",")
                               });
                            }else{      //没有数据
                                    Toast("当前歌手没有歌曲!!!")
                                    return Promise.reject();
                            }
                        }else{
                            return Promise.reject();
                        }
                    })
                }
             }),
             ...mapMutations({
                 setMusicSinger(commit,data){
                     commit("setMusicSinger",data);
                 },
                 setPlaylist(commit,data){
                    commit("setPlaylist",data);
                }
             }),
             requestScroll(){
                    if(!this.singerList.length) return
                    this.height="auto";
                    let aImg=Array.from(document.querySelector(".singer_main_body").querySelectorAll("img"));
                    let iHeight=document.documentElement.clientHeight;
                    aImg.forEach((res,index)=>{
                            if(!this.singerList[index].flag&&res.getBoundingClientRect().top<iHeight){
                                let Img=new Image();
                                Img.src='https://y.gtimg.cn/music/photo_new/T001R300x300M000'+this.singerList[index].singer_mid+'.jpg?max_age=2592000'
                                Img.onload=res=>{
                                    clearTimeout(Timers);
                                    this.singerList[index].flag=true;
                                }
                                let Timers=setTimeout(res=>Img.onload=null,5000);
                            }
                    });

                    let Img=aImg[aImg.length-1];
                    if(Img.getBoundingClientRect().top<iHeight+30&&this.isScrollLa){
                            this.loadingText="正在加载";
                            this.isScrollLa=false;
                            clearInterval(this.Timer);
                            this.Timer=setInterval(res=>{
                                if(this.loadingText.length>=7){
                                    this.loadingText=this.loadingText.substring(0,4);
                                }else{
                                    this.loadingText+='.';
                                }
                            },300);
                            if(this.qtcs.cur_page==this.allPage){
                                setTimeout(res=>{
                                    clearInterval(this.Timer);
                                   this.loadingText="(╥╯^╰╥),没有更多数据了哟!!!";
                                },1500);
                               return "最后一页"
                            }
                            this.qtcs.sin= this.qtcs.cur_page*this.num;
                            this.qtcs.cur_page++;
                            this.activerId.page=this.qtcs.cur_page;
                            this.setHash();
                            this.getMusicSinger(true).then(res=>{
                                this.isScrollLa=true;
                                clearInterval(this.Timer);
                            },res=>{
                                this.isScrollLa=true;
                                 clearInterval(this.Timer);
                            });
                    }
             },
             setHeight(){
                    this.height="auto";
                    var iHeight=document.documentElement.clientHeight;
                    var menuLlist=document.querySelector(".menu-list").offsetHeight;
                    var singer=document.querySelector(".singer_header").offsetHeight;
                    var iFooter=document.querySelector("#footer").offsetHeight;
                    var iMain=document.querySelector('.singer_main');
                    var singer_main_header=iMain.querySelector('.singer_main_header').offsetHeight;
                    if((menuLlist+singer+iFooter+iMain.offsetHeight)<=iHeight){
                         this.height=iHeight-menuLlist-singer-iFooter-singer_main_header-parseInt(getComputedStyle(iMain).paddingTop)+'px';
                    }
            }
         },
         created(){
             window.location.hash="";
             let hash=window.location.hash;
             let index=hash.indexOf("?");
             if(index!=-1){
                 let strArr=hash.substring(index+1).split("&");
                 strArr.forEach(res=>{
                    let arr=res.split("=");
                    this.activerId[arr[0]]=arr[1]
                 });
             }
             Promise.all([this.getMusicSinger()]).then(res=>{
                 this.$store.commit("setHidden",false);
                 this.isRequest=false;
             },error=>{
                 this.$store.commit("setHidden",false);
                 this.isRequest=false;
                 this.isScrollLa=false;
                 Toast(error);
             })
         },
         activated(){     //组件激活时调用
            this.index=this.index?0:1;
            this.setHash();
            let aEl=Array.from(this.$el.querySelectorAll(".singer_header_scroll"));
            aEl.forEach(res=>{
                res.getWidthFn();
            });
            this.$root.$el.addEventListener("scroll",this.requestScroll,false);
         },
         deactivated(){   //组件休眠时调用
            this.$root.$el.removeEventListener("scroll",this.requestScroll,false);
         },
         mounted(){
                     
         },
         updated(){

         },
    }
</script>

<style lang="less" scoped>
  @rem:75rem;
  .singer{
      .singer_header{
           padding:0 20/@rem;
          >ul{
              >li{
                  padding: 8/@rem 0;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  border-bottom:2px solid rgba(189, 188, 188, 0.2);
                  h2{
                      width: 100/@rem;
                      font-size: 36/@rem;
                      color: #9e9e9e;
                  }
                  .singer_header_scroll{
                      width: 610/@rem;
                      overflow:hidden;
                      ul{
                          &:after{
                              display: block;
                              content: "";
                              clear:both;
                          }
                          li{
                               float: left;
                               font-size: 36/@rem;
                               cursor: pointer;
                               padding: 0 10/@rem;
                               &.active{
                                  background:#03A9F4;
                                  color: #fff;
                               }
                           }
                      }
                  }
              }
          }
      }
      .singer_main{
           padding:30/@rem 20/@rem 0;
          .singer_main_header{
              padding: 0/@rem 0 20/@rem;
              display:flex;
              justify-content: space-between;
              align-items: center;
             color: #666;              
              h2{
                  font-size: 36/@rem;
                  width: 100/@rem;
              }
              i{
                  display: block;
                  font-size: 36/@rem;
              }
          }
          .singer_main_body{
              ul{
                  li{
                      cursor: pointer;
                      padding: 12/@rem 0;
                      border-bottom: 2/@rem solid rgba(189, 188, 188, 0.2);
                      div{
                          display:flex;
                          justify-content: flex-start;
                          align-items: center;
                        h2{
                            width: 120/@rem;
                            height: 120/@rem;
                             border-radius: 50%;
                            overflow:hidden;
                            border:2px solid #ccc;
                            img{
                                height: 100%;
                            }
                        }
                        p{
                            width: 600/@rem;
                            overflow: hidden;
                            font-size: 42/@rem;
                            color: #666;
                            text-align: left;
                            padding-left: 20/@rem;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                        }
                      }
                  }
              }
              .loadingText{
                  font-size: 36/@rem;
                  color: #666;
                  text-align: center;
                  padding: 14/@rem 0;
              }
              .request_noData{
                  width: 100%;
                  height: 100%;
                 display: flex;
                 justify-content: center;
                 align-items: center;
                 i{
                     width: 300/@rem;
                     height: 300/@rem;
                     display: block;
                     background: url(../../assets/img/loading.gif) no-repeat center center;
                     background-size: 300/@rem 300/@rem;
                 }
                 p{
                     font-size:36/@rem;
                     color: #ccc
                 }
              }
          }
      }
      .mask{
             position: fixed;
             top: 0%;
             right: 0%;
             left: 0%;
             bottom: 0%;
             background: rgba(0,0,0,0.6);
             z-index: 999;
             &.show{
               display: block;
             }
             &.hide{
               display: none;
             }
         }   
         .screening{
             padding: 0 30/@rem;
             position: fixed;
             bottom: 0%;
             left: 0%;
             right: 0%;
             background: #fff;
             box-sizing: border-box;
             height:9rem;
             z-index: 1000;
             transform: translateY(100%);
             transition: all 400ms ease-in;
             opacity: 0;
             &.show{
                 transform: translateY(0%);
                 opacity: 1;
             }
             h2{
                 font-size: 36/@rem;
                 text-align: center;
                 padding: 26/@rem 0;
                 height: 1.4rem;
                 box-sizing: border-box;
                 border-bottom: 1px solid #f2f2f2;
             }
             .screening-list{
                 height: 6.2rem;
                 overflow-y: auto;
                 box-sizing: border-box;
                 ul{
                     display: flex;
                     justify-content: flex-start;
                     flex-flow: wrap;
                     li{
                        padding: 42/@rem;
                        font-size: 38/@rem;
                        color: #000;
                        &.active{
                            background:#03A9F4;
                            color: #fff;
                        }
                     }
                 }
             }
             .close{
                  font-size: 32/@rem;
                 text-align: center;
                 padding: 26/@rem 0;
                 height: 1.4rem;
                 box-sizing: border-box;
                 border-top: 1px solid #f2f2f2;
             }
         }  
  }
</style>

