<template>
     <div class="playmusic" @click="targetRouter">
        <div id="player" v-show="nowSong.show">
            <div class="progress">
                <div class="" :style="{width}"></div>
            </div>
                <img :src="'https://y.gtimg.cn/music/photo_new/T002R90x90M000'+nowSong.currentPlay.src+'.jpg?max_age=2592000'"  :title="nowSong.currentPlay.title" :alt="nowSong.currentPlay.title" >
            <div class="song_name">
                    <h3>{{nowSong.currentPlay.title}}</h3>
                    <span>{{maps(nowSong.currentPlay.author)}}</span>
            </div>
            <div class="right">
                    <div class="iconfont" @click.stop="isPlay" :class="!nowSong.isPlay?'icon-bofang1':'icon-zanting'"></div>
                    <div class="iconfont icon-49xiayishou" @click.stop="following_piece"></div>
                    <div class="iconfont icon-gengduo-2" @click.stop="playList"></div>
            </div>
        </div>
        <div id="audio">
            <audio @timeupdate="audioChange" class="audio_music" :src="nowSong.source?'http://ws.stream.qqmusic.qq.com/C100'+nowSong.source+'.m4a?fromtag=0&guid=126548448':''" autoplay controls="controls"></audio>
        </div>
        <div id="mask" @click="playList" :class="isClose?'show':'hide'"></div>
        <playList :isClose="isClose" @changeClose="playList"></playList>
     </div>
</template>

<script>
import playList from '@/components/popUp/Pendinglist.vue';
export default {
  name: 'playmusic',
  data(){
    return {
      width:'0%',
      Timer:null,
      now:-1,
      isClose:false
    }
  },
  components:{
      playList
  },
  computed:{
   nowSong(){
       let nowSong= this.$store.state.indexs.nowSong;
       this.now=nowSong.playlist.findIndex(res=>res.data.songid==nowSong.currentPlay.songid);
       return nowSong
    },
  },
  watch:{
    width(){
      if(parseInt(this.width)!='100') return
      this.switch();
    }
  },
  methods:{
    switch(){
        this.width='0%';
        clearInterval(this.Timer);
        let nowSong=this.nowSong;
        let config={};
        if(nowSong.playlist.length-1==this.now)  this.now=-1;   //不等于播放列表中最后一首歌曲时
            let song=nowSong.playlist[++this.now];
            config={
              show:true,           //显不显示出来
              source:song.data.strMediaMid,          //播放源
              currentPlay:{
                  songid:song.data.songid,
                  title:song.data.songname,
                  author:song.data.singer,
                  src:song.data.albummid,
              },     //当前播放歌曲
              playlist:nowSong.playlist,            //当前播放列表
              isPlay:true           //是不是在播放
            }
        this.$store.commit("setNowList",config);
    },
     audioChange(){
            this.width=this.audio.currentTime/this.audio.duration*100+'%';
            if(parseInt(this.width)>100) this.width="100%"
      },
      isPlay(){    //点击那个播放按钮
        let song=this.nowSong.playlist[this.now];
        if(!this.nowSong.isPlay){
          this.audio.play();
        }else{
          this.audio.pause();
        }
          this.$store.commit("setNowList",{
            show:true,           //显不显示出来
            source:song.data.strMediaMid,          //播放源
            currentPlay:{
                songid:song.data.songid,
                title:song.data.songname,
                author:song.data.singer,
                src:song.data.albummid,
            },     //当前播放歌曲
            playlist:this.nowSong.playlist,            //当前播放列表
            isPlay:(!this.nowSong.isPlay)           //是不是在播放
          });
      },
      following_piece(){    //下一首
           this.switch()
      },
      playList(){        //查看播放列表
          this.isClose=!this.isClose;
      },
      targetRouter(){     //跳转播放详情页面
          let song=this.nowSong.playlist[this.now];
          this.$store.commit("setNowList",{
              show:false,           //显不显示出来
              source:song.data.strMediaMid,          //播放源
              currentPlay:{
                  songid:song.data.songid,
                  title:song.data.songname,
                  author:song.data.singer,
                  src:song.data.albummid,
              },     //当前播放歌曲
              playlist:this.nowSong.playlist,            //当前播放列表
              isPlay:true           //是不是在播放
          });
        this.$router.push('/playsong?songId='+this.nowSong.currentPlay.songid);
      }
  },
  mounted(){
    this.audio=this.$el.querySelector(".audio_music");
  }
}
</script>

<style lang="less" scoped>
   @rem:75rem;
        #audio{
            visibility: hidden;
            position: fixed;
            bottom: -50%;
            width: 100%
       }
       #player{
         position: fixed;
         bottom: 0%;
         width: 100%;
         background: #fff;
         height: 150/@rem;
         z-index: 99;
         padding: 15/@rem 20/@rem;
         box-sizing: border-box;
         display: flex;
         align-items:center;
         .progress{
           position:absolute;
           top: -3px;
           width: 100%;
           height: 3px;
           div{
             position: absolute;
             width: 0%;
             height: 100%;
             background: #03A9F4;
           }
         }
         img{
           width:120/@rem;
           height: 120/@rem;
         }
         .song_name{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            margin-left: 20/@rem;
            width: 320/@rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            h3{
              font-size: 36/@rem;
              color: #000;
              font-weight: 900;
            }
            span{
              font-size: 30/@rem;
             color: #999;
             margin-top: 8/@rem;
            }
         }
         .right{
           display: flex;
           justify-content: space-around;
           align-items: center;
           div{
             margin: 0 15/@rem
           }
           div:first-child{
             margin-left: 0
           }
           div:last-child{
             margin-right: 0
           }
         }
       }
        #mask{
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
</style>
