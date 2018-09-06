<template>
      <div class="toplist">
            <header class="toplist_top">
                  <div class="toplist_top_img" :style="{background:`url(${msg.pic_album}) no-repeat center top`, backgroundSize:'cover' }"
                  ></div>
                  <div class="toplist_top_content">
                        <hgroup class="toplist_logo">
                              <h1> <img src="../assets/img/logo.jpg"> </h1>
                              <h2 @click="targetRouter" class="iconfont icon-gengduo">更多</h2>
                        </hgroup>
                        <div class="toplist_top_main">
                              <figure class="">
                                    <img :src="msg.pic_album">
                                    <figcaption>
                                          <h2>{{msg.ListName}}</h2>
                                          <span v-if="weeks(msg.date)">第{{week}}周</span>
                                          <span v-if="msg.day_of_year">第{{msg.day_of_year}}天</span>
                                          <time>{{msg.update_time}}   更新</time>
                                    </figcaption>
                              </figure>
                              <div class="music">
                                    <div v-if="!flag" class="playMusic" @click="requestLyrics(musicList[0],0)">播放全部</div>
                                    <playAll v-else :indexId="indexId" @changeds="requestLyrics" :index="index"></playAll>
                              </div>
                        </div>                  
                  </div>
            </header>
            <section class="toplist_main">
                  <h2>排行榜  <span>共{{msg.cur_song_num}}首</span></h2>
                  <ul class="musicList">
                        <li v-for="item,i in musicList" @click="requestLyrics(item,i)">
                              <div class="left">
                                    <h5 :style="{color:i<3?'#f00':indexId==item.data.songid?'#03f4e6':'#000'}">{{i+1}}</h5>
                                    <div v-if='false'>
                                          <span></span>
                                          <span>29</span>
                                    </div>
                              </div>
                              <div class="right">
                                    <h5 :style="{color:indexId==item.data.songid?'#03f4e6':'#000'}" >{{item.data.songname}}</h5>
                                    <span :style="{color:indexId==item.data.songid?'#03f4e6':'#000'}" >{{maps(item.data.singer,undefined,'/')}}</span>
                              </div>
                        </li>
                  </ul>
                  <aside class="Introduction">
                        <h2>简介</h2>
                        <p v-html="msg.info"></p>
                  </aside>
            </section>
      </div>
</template>

<script>
      import {getStorage,setStorage} from "@/assets/js/common.js";
      import {mapActions,mapMutations} from "vuex";
      import playAll from "@/components/popUp/playAll.vue";
      let json;
      export default {
            name:'toplist',
            data(){
                  return{
                        id:this.$route.query.id,
                        week:'',
                        flag:false,
                        index:undefined,
                        indexId:undefined,
                  }
            },
            computed:{
                  msg(){
                        return this.$store.state.topList.msg
                  },
                  musicList(){
                        return this.$store.state.topList.musicList
                  }                
            },
            components:{
                  playAll
            },
            methods:{
                  weeks(date){
                        if(!date) return false;
                        let re=/(\d*)-(\d*)-(\d*)/
                        if(re.test(date)) return false;
                        this.week=date.replace(/(\d*)_(\d*)/,($0,$1,$2)=>$2);
                        return true
                  },
                  targetRouter(){
                        let parent=Object.keys(json.params).length?{params:json.params}:Object.keys(json.query).length?{query:json.query}:{};
                        this.$router.push({
                              path:json.path,
                              ...parent
                        });
                  },
                  requestLyrics(song,index){
                        if(this.indexId!=song.data.songid){
                              if(this.index==index){
                                    this.indexId=song.data.songid;
                              }else{
                                   if(this.source&&this.source.qqLyrics)  this.source.qqLyrics.cancel("操作被用户取消");
                                    this.getLyrics(song).then(res=>{
                                          this.flag=true;
                                          this.indexId=song.data.songid;
                                          this.index=index;
                                    },res=>{
                                          console.log(res)
                                          console.log("获取歌曲详细信息失败!!!")
                                          this.flag=false;
                                    })
                              }
                        }else{
                              this.indexId=undefined;
                        }
                  },
                  setHeight(){
                        let iClient=this.$root.$el.clientHeight;
                        let iMusicH=this.$el.querySelector(".music").offsetHeight;
                        let iFooterH=this.$root.$el.querySelector("#footer").offsetHeight;
                        this.$el.querySelector(".toplist_main").style.height=iClient-iMusicH-iFooterH+'px';
                  },
                  ...mapActions({
                        getToplist(dispatch){       //获取排行榜
                              return dispatch("getToplist",{
                                   topid:this.id,
                                   _:new Date().getTime()
                              }).then(res=>{
                                    if(res.status==200){
                                          this.setToplist({
                                                "msg":{
                                                      ...res.data.topinfo,
                                                      date:res.data.date,
                                                      "day_of_year":res.data.day_of_year,
                                                      "update_time":res.data.update_time,
                                                      "cur_song_num":res.data.cur_song_num
                                                },
                                                "musicList":res.data.songlist
                                          });
                                          return Promise.resolve();
                                    }else{
                                          return Promise.reject();
                                    }
                              });
                        },
                        getLyrics(dispatch,song){
                              return dispatch("getLyrics",{
                                    musicid:song.data.songid,
                                    '_':new Date().getTime(),
                                    el:this
                              }).then(res=>{
                                    if(res.status==200){
                                          let re=/^([a-zA-Z]*\()({.*})(\))$/;
                                          let data=JSON.parse(res.data.replace(re,($0,$1,$2,$3)=>$2)).lyric;
                                          let json={};
                                          json.songName=song.data.songname;   //歌曲名
                                          json.songMid=song.data.strMediaMid;   //歌曲源
                                          if(data.includes("offset")){     //有歌词
                                                let splits=/^(.*)(\[offset&#58;0\]&#\d*;)(.*)$/;
                                                data=data.replace(splits,($0,$1,$2,$3)=>$3);
                                                data=data.split("&#10;");
                                                let re=/(\[\d*&#58;\d*&#46;\d*\])(.*)/g;
                                                let arr=[];
                                                data=data.filter(res=>res);
                                               arr=data.map((item,index)=>{
                                                      return item.replace(re,($0,$1,$2)=>$2).replace(/(\w*)&#32;|([\u4e00-\u9fa5]*)&#32;|(&#\d*;)/g,($0,$1,$2)=>{
                                                            if($1){
                                                                  return $1+" "
                                                            }else if($2){
                                                                  return $2+" "
                                                            }else{
                                                                  return ""
                                                            }
                                                     });  
                                                })
                                                let timeArr=[];
                                                data.forEach((item,index)=>{
                                                     return item.replace(re,($0,$1,$2)=>$1).replace(/(\d*)&#58;(\d*)&#46;(\d*)/,($0,$1,$2,$3)=>{
                                                           let minutes=$1*60;
                                                           let seconds=$2;
                                                           let ms=$3
                                                           timeArr.push(Number(minutes)+Number(seconds)+'.'+ms)
                                                           return $0;
                                                     });
                                                });
                                                let newArr=[];
                                                arr=arr.filter((res,index)=>{
                                                      if(res){
                                                            newArr.push(timeArr[index]);
                                                            return true;
                                                      }
                                                });
                                                json.lyrics=arr;   //歌词
                                                json.timeArr=newArr;    //歌词对应时间
                                                this.setLyrics(json);
                                          }else{         //没歌词
                                                this.setLyrics(json);
                                          }
                                          return Promise.resolve();
                                    }else{
                                          return Promise.reject();
                                    }
                              });
                        }
                  }),
                  ...mapMutations({
                        setToplist(commit,data){
                             commit("setToplist",data)
                        },
                        setLyrics(commit,data){
                             commit("setLyrics",data);
                        }
                  }),
            },
            beforeRouteEnter(to,from,next){
                  json=from;
                  next()
            },
            created(){
                  Promise.all([this.getToplist()]).then(success=>{
                        this.$store.commit("setHidden",false);
                  },error=>{
                        this.$store.commit("setHidden",false);
                  })    
            },
            mounted(){
                  this.setHeight();
            },
            updated(){
                  this.setHeight();
            },
            destroyed(){
                  this.$store.commit("setHidden",true);
            },
      }
</script>

<style lang="less" scoped>
@rem:75rem;
.toplist{
      .toplist_top{
            height: 600/@rem;
            position: relative;
            overflow: hidden;
            .toplist_top_img{
                  position: absolute;
                  top: 0%;
                  bottom: 0%;
                  width: 100%;
                  z-index: 1;
                  -webkit-filter: blur(30px); 
                  -moz-filter: blur(30px);
                  -ms-filter: blur(30px);    
                  filter: blur(30px);
                  filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=30, MakeShadow=false);
            }
            .toplist_top_content{
                  background:rgba(0,0,0,0.4);     
                  position: relative;
                  height: 100%;
                  z-index: 9; 
                  .toplist_logo{
                        display: flex;
                        justify-content: space-between;
                        padding: 15/@rem 30/@rem;
                        background: rgba(0,0,0,0.2);
                        height: 110/@rem;
                        box-sizing: border-box;
                        h1{
                              width: 80/@rem;
                              height: 80/@rem;
                              border-radius:20/@rem;
                              overflow: hidden;
                        }
                        h2{
                              display: flex;
                              flex-direction: column;
                              justify-content: center;
                              align-items: center;
                              font-size: 26/@rem;
                              color: #fff;
                              cursor: pointer;
                              &::after{
                                    font-size: 26/@rem;
                                    margin-top: 10/@rem;
                              }
                        }
                  }
                  .toplist_top_main{
                        height: 490/@rem;
                        figure{
                              height: 300/@rem;
                              display: flex;
                              justify-content: space-between;
                              padding: 30/@rem;
                              img{
                                 width: 45%; 
                              }
                              figcaption{
                                 padding-left: 2%;
                                 display: flex;
                                 flex-direction: column;
                                 justify-content: center;
                                 width: 52%;
                                 color: #fff;
                                 align-items: flex-start;
                                 h2{
                                       font-size: 42/@rem;
                                       font-weight: bolder
                                 }
                                 span{
                                       font-size: 26/@rem;
                                       margin: 15/@rem 0;
                                 }
                                 time{
                                        font-size: 30/@rem;
                                 }
                              }
                        }
                        .music{
                              height:130/@rem;
                              .playMusic{
                                    width: 420/@rem;
                                    padding: 20/@rem 0;
                                    background: #03a9f4;
                                    color: #fff;
                                    margin: 0 auto;
                                    font-size: 42/@rem;
                                    border-radius: 75/@rem;
                                    cursor: pointer;
                                    &:before{
                                          content: "";
                                          display: inline-block;
                                          vertical-align: -2px;
                                          border:20/@rem solid transparent;
                                          border-left: 20/@rem solid #fff;
                                    }
                              }
                        }
                  }
            }
      }
      .toplist_main{
            padding: 50/@rem 30/@rem;
            overflow-y: auto;
            box-sizing: border-box;
            h2{
                  font-size: 24/@rem;
                  color: #777;
                  text-align: left
            }
            .musicList{
                  li{
                        display:flex;
                        justify-content: center;
                        padding: 30/@rem 0;
                        .left{
                              width:70/@rem;
                              display: flex;
                              flex-direction: column;
                              justify-content:center;
                              h5{
                                    font-size:42/@rem;
                                    color: #666
                              }
                              div{
                                    display:flex;
                                    justify-content: center;
                                    align-items: center;
                                    margin-top: 20/@rem;
                                    span{
                                          display: block;
                                    }
                                    span:first-child{
                                          color: #666;
                                          background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAABQCAMAAABPhocHAAAAA3NCSVQICAjb4U/gAAAAilBMVEX////ExMTCwsK/v7+FhYV/f3//Sin/SST/SCj/RiO/v7+7u7uDg4N/f3//Sin/SCiBgYF/f3+BgYF/f39/f39/f39/f39/f39/f3+9vb1/f3//QiJ/f3//QiK/v7+9vb1/f3//QiK/v7+9vb1/f3//QiK9vb1/f3/7TCT7SyS7u7t/f3/8TCT/QiLTXx5aAAAALnRSTlMAERERERERERERIiIiIiIiMzNERFVmd4iZqqqqu7vMzMzM3d3d3e7u7u7/////6BADoAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAyMDE2LjcuNnW1PtgAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAABG0lEQVRIie3Qi06DQBAF0LGo+IBKrY/ylFp02x32/3/PmQUSY3YGTUw01psWEu5hZxcAzrKuY1CyfHFuqwjuNUH9lnpRcH/uXCwJ34NzIImaewYsygC4Kan3AOLyUjyIB1qOBPyGWHvs4CqPJhDliwBo7FM0gGhn8wC4fmVBgPpdFJrB4sTahdR70Vj7LPZeUOR+EFpPomnU/qfT99P9oh8zPPOX/X4GHA7gn0zg/apfADD+xRGfAOAHKSNkMC334Zj+hfEyD/7z7dk8zvSIqiiQstF6g/STxFmFZoW4NliEQYVdkiJCJol1m8A9tgBJuxJ3UWlbpPAWtP604wlyso6OIb6c3tFXMrdSb/gTYpGKq3emqx4ybf5fyBsDGDzSw5BuqAAAAABJRU5ErkJggg==) no-repeat left 0;
                                          background-size: 64/@rem 120/@rem;
                                          width:32/@rem;
                                          height: 30/@rem;
                                    }
                                    span:last-child{
                                          color: #666;
                                          font-size: 24/@rem;
                                          margin-left: 10/@rem;
                                          background-size: 32/@rem 80/@rem;
                                    }
                              }
                        }
                        .right{
                              width: 590/@rem;
                              display: flex;
                              margin-left: 30/@rem;
                              flex-direction: column;
                              justify-content: space-between;
                              align-items: flex-start;
                               h5{
                                    font-size:40/@rem;
                                    overflow: hidden;
                                    text-overflow:ellipsis;
                                    white-space: nowrap;
                                    text-align: left;
                                    width: 100%;
                                    color: #000
                              }
                              span{
                                    font-size: 24/@rem;
                                    color: #777
                              }
                        }
                  }
            }
            .Introduction{
                  padding: 20/@rem 0;
                  h2{
                        color: #000;
                        font-size:46/@rem;
                        text-align: center;
                        letter-spacing: 16/@rem;
                        font-weight: normal;
                        line-height: 1.2
                  }
                  p{
                        margin-top: 40/@rem;
                        font-size: 32/@rem;
                        color: #666;
                        line-height: 1.4;
                        text-align: justify
                  }
                  p:nth-child(4){
                        margin-top: 5/@rem
                  }
            }
      }      
}
</style>