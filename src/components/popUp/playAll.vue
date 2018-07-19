<template>
     <div class="playAll" @touchmove="moves" @touchend="ends">
            <div class="left">
                <div class="canvas" @click="changAuto()">
                     <canvas v-if="style" id="play" :width="style.width" :height="style.height"></canvas>
                     <audio id="playautos" autoplay @timeupdate="autoplay" :src="'http://ws.stream.qqmusic.qq.com/C100'+msg.songMid+'.m4a?fromtag=0&guid=126548448'"></audio>
                </div>
                <div class="song">
                    <h2 class="songName">{{msg.songName}}</h2>
                    <div class="songLyrics" @touchstart.prevent="starts">
                        <ul v-if="lyrics" :style="{transform:'translateY('+i*h+'px) translateZ(0px)',transition:'transform 0.4s'}">
                             <li v-for="item,index in  lyrics" :style="{opacity:i==index?1:0.5,height:Math.abs(h)+'px'}" :data-time="lyricsTime[index]">{{item}}</li>
                        </ul>
                        <p v-else>本歌曲暂无歌词!!!</p>
                    </div>
                </div>
            </div>
            <div class="right"><a class="iconfont icon-icon" download @click.stop :href="'http://ws.stream.qqmusic.qq.com/C100'+msg.songMid+'.m4a?fromtag=0&guid=126548448'"></a></div>
     </div>
</template>

<script>
let scrollSwiper={                    //移动端滑动歌词函数组
    methods:{
        starts(ev){
          this.isScroll=true;
          this.startY=ev.changedTouches[0].pageY;
          let Y=ev.currentTarget.children[0].style.transform;
          let re=/^([a-zA-Z]*)\((.*)\)/;
          this.initY=parseInt(Y.replace(re,($0,$1,$2)=>$2));
        },
        moves(ev){
            if(!this.isScroll) return;
            this.moveY=ev.changedTouches[0].pageY;
            let iSpeedY=this.moveY-this.startY;
            this.target=iSpeedY+this.initY;
            this.i=Math.floor(this.target/this.h);
        },
        ends(ev){
            if(!ev.target.dataset.time) return
            let H=this.bfb*this.$el.querySelector(".songLyrics").children[0].offsetHeight;
            setTimeout(res=>{
                this.i=Math.abs(Math.floor(H/this.h));
                this.isScroll=false;
            },1000);
        }
    }
};
export default {
    name:"playAll",
    props:{
        index:{
            type:Number,
            default(){
                return undefined;
            }
        },
        indexId:{
            type:Number,
            default(){
                return undefined;
            }
        }
    },
    data(){
        return{
            style:"",
            bfb:0,
            flags:true,
            i:0,
            h:-0,
            isScroll:false
        }
    },
    watch:{
        index(news,old){
            if(news!=old) this.i=0;
            this.indexs=this.index;
        },
        indexId(){       //监听当前播放歌曲ID
            if(this.indexId==undefined){
                this.flags=false;
            }else{
                this.flags=true;
            }
            this.draw({
                bfb:this.bfb,
                play: this.flags
            });
        },
        flags(){                         //判断当前是否在播放
            if(this.flags){
                this.audio.play();
            }else{
                this.audio.pause();
            }
        },
        bfb(){                          //监听当前播放的情况,当播放完毕时切换下一首
            if(this.bfb==1){   //播放完毕下一首
                if(this.indexs==this.musicList.length-1){
                    this.indexs=0;
                }
                this.indexs++;
                this.changAuto();
            }
        }
    },
    mixins:[scrollSwiper],
    computed:{
        musicList(){    //播放列表
            return this.$store.state.topList.musicList
        },
        msg(){     //歌曲信息
            let flag=this.$store.state.lyrics;
            if(flag.songName){
                return {
                        songName:flag.songName,
                        songMid:flag.songMid
                    }
            }else{
                return {
                    songName:"音乐排行榜",
                    songMid:0
                }        
            }
        },
        lyrics(){     //歌词
            let flag=this.$store.state.lyrics.lyrics;
            return flag;
        },
        lyricsTime(){    //歌词对应时间
            let flag=this.$store.state.lyrics.timeArr;
            return flag;
        },
    },
    methods:{
        changAuto(){                        //监听歌曲状态
            let song=this.musicList[this.indexs];
            this.$emit("changeds",song,this.indexs);
        },
        autoplay(){                            //监听正在播放的歌曲
            // if(this.audio.currentTime<200){
            //     this.audio.currentTime=200
            // }
            // console.log(this.audio.currentTime)
            if(!this.isScroll) this.getNowIndex(this.audio.currentTime);
            let bfb=(this.audio.currentTime/this.audio.duration).toFixed(2);
            bfb=bfb>1?1:bfb;
            this.bfb=bfb;
            this.draw({
                bfb:this.bfb,
                play: this.flags
            });
        },
        getNowIndex(time){                   //获取当前正在唱的歌词
        console.log(time)
            let flag=flag;
            for(let i=this.i+1;i<this.lyricsTime.length;i++){
                    if(this.lyricsTime[i]==time||(this.lyricsTime[i]<time&&time<this.lyricsTime[i+1])){
                      this.i=i;
                      break
                  }else if(time >this.lyricsTime[i+1]){
                      this.i=i+1;
                  }else{
                      flag=true;
                      break
                  }
            }
            if(flag){
                for(let i=this.i;i>0;i--){
                    if(this.lyricsTime[i]>time){
                        this.i--
                    }else{
                        break
                    }
                }
            }
        },
        draw(config={                                                //画进度
            bfb:0,
            play:false
        }){
            let width=this.style.width;
            let height=this.style.height;    
            this.Drawing=this.Canvas.getContext("2d");   
            this.Drawing.clearRect(0,0,width,height);   //先清除画布
            this.Drawing.lineJoin="round";
             //正在播放的数量
            this.Drawing.beginPath();
            this.Drawing.lineWidth="2";   
            this.Drawing.strokeStyle="#03f4e6";
            let deg=config.bfb*360;
            this.Drawing.arc(width/2,height/2,width/2-2-2,(0-90)*Math.PI/180,(deg-90)*Math.PI/180);
            this.Drawing.stroke();
            this.Drawing.closePath();
            //最外层的线
            this.Drawing.beginPath();
            this.Drawing.lineWidth="1";   
            this.Drawing.strokeStyle="#03f4e6";
            this.Drawing.arc(width/2,height/2,width/2-2,0*Math.PI/180,360*Math.PI/180);
            this.Drawing.stroke();
            this.Drawing.closePath();
            //是播放还是暂停状态
            this.Drawing.beginPath();
            this.Drawing.fillStyle="#03f4e6";
            if(config.play){        //正在播放
                this.Drawing.fillRect(width/2-width/2*0.1,height/2-height/2/3,width/2*0.3-width/2/2,height/2-height/2/3);
                this.Drawing.fillRect(width/2+width/2*0.3,height/2-height/2/3,width/2*0.3-width/2/2,height/2-height/2/3); 
            }else{                       //停止播放
                this.Drawing.moveTo(width/2-width/4*0.4,height/2-height/2*0.5);
                this.Drawing.lineTo(width/2+width/4,height/2);
                this.Drawing.lineTo(width/2-width/4*0.4,height/2+height/3*0.8);
                this.Drawing.fill();
            }
             this.Drawing.closePath();
        },
        resizeFn(){                                                     //组件初始化的样子
            this.h='-'+this.$el.querySelector(".songLyrics").offsetHeight;
            this.style="";
            this.styleFn();
            setTimeout(res=>{
                this.Canvas=this.$el.querySelector("#play");
                this.draw({
                    bfb:this.bfb,
                    play: this.flags
                });
            },30);
        },
        styleFn(){
            this.style={
                width:this.$el.querySelector(".canvas").offsetWidth,
                height:this.$el.querySelector(".canvas").offsetHeight,
            }
        }
    },
    mounted(){
       this.indexs=this.index;
       this.audio=this.$el.querySelector("#playautos");
       this.resizeFn();
       window.addEventListener('resize',this.resizeFn.bind(this),false);
    }
}
</script>

<style lang="less" scoped>
@rem:75rem;
.playAll{
    height: 1.7rem;
    padding: 0 30/@rem;
    .left{
        float: left;
        width: 560/@rem;
        height: 100%;
        display: flex;
        justify-content:flex-start;
        .canvas{
            width: 1.5rem;
            height: 1.5rem;
           #playautos{
                overflow: visible;
            }
        }
        .song{
            width: 5.8rem;
            color: #fff;
            text-align: left;
            padding-left:20/@rem; 
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 1.5rem;
            .songName{
                font-size: 36/@rem;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
            .songLyrics{
                margin-top: 10/@rem;
                height:50/@rem;
                font-size: 24/@rem;
                overflow: hidden;
                ul{
                    li{
                        height: 50/@rem;
                        line-height: 50/@rem;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                        color:#fff;
                        opacity: 0.5;
                        transition:'opacity 0.6s'
                    }
                }
            }
        }
    }
    .right{
        float:right;
        width: 100/@rem;
        height: 100%;
        display: flex;
        justify-content: flex-end;
       align-items: center;
        a{
            color:#03f4e6;
            &::after{
                font-size: 100/@rem
            }
        }
    }
}
</style>
