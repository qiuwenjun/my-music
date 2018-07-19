<template>
    <div class="playsong" @touchmove="moves(),targetMove()" @touchend="ends">
         <header class="header">
               <h1>星球音乐</h1>
         </header>
         <div class="songbody">
              <div class="bg" :style="{'background':`url(${getSongdetail.track_info.album.mid?'https://y.gtimg.cn/music/photo_new/T002R150x150M000'+getSongdetail.track_info.album.mid+'.jpg?max_age=2592000':'https://y.gtimg.cn/mediastyle/global/img/playlist_150.png?max_age=2592000'}) no-repeat center center / 130% 130%`} "></div>
              <div class="songbody_main">
                  <!--歌曲信息-->
                <div class="title">
                        <div class="title_name">
                            <h2>{{getSongdetail.track_info.name}}</h2>
                             <i class="label" @touchend="showMusicList" v-if="nowSongs.playlist.length>1"></i>
                        </div>
                        <span class="title_singer">{{maps(getSongdetail.track_info.singer,undefined,'/')}}</span>
                </div>
                <!--歌曲歌词以及歌曲图标等-->
                <div class="song_main">
                     <!--滚动歌词-->
                    <audio id="playautos" autoplay @durationchange="getAudioMsg" v-if="getSongdetail.track_info.file['media_mid']" @timeupdate="autoplay" :src="'http://ws.stream.qqmusic.qq.com/C100'+getSongdetail.track_info.file['media_mid']+'.m4a?fromtag=0&guid=126548448'"></audio>
                    <div :class="'song_main_lyrics '+toggle" @touchend="popUp" @touchstart="starts">
                        <div class="mask" v-if="getLyric" :style="'height:'+liH+'px'">
                            <ul :style="targetY">
                                <li class="lytrics" v-for="item,index in getLyric.lyrics" :data-time="getLyric.timeArr[index]">{{item}}</li>
                            </ul>
                        </div>
                        <div class="mask" v-if="getLyric" :style="'height:'+liH+'px'">
                            <ul :style="targetY">
                                <li class="lytrics" :index="index" v-for="item,index in getLyric.lyrics" :data-time="getLyric.timeArr[index]">{{item}}</li>
                            </ul>
                            <span class="targetPlay" v-show="touchFlag" @touchend="getTime"> </span>
                        </div>
                       <p class="noData" v-else>当前播放歌曲暂无歌词!!!</p>
                    </div>
                    <!--歌曲图片-->
                    <div class="song_main_album" :class="playFlag?'active':''" @touchend="popUp" :style="{opacity:isOpacity?1:0,display:isHide?'block':'none'}">
                            <div class="needle">
                                <div class="needle_T"></div>
                            </div>
                            <div class="disc_F">
                                 <div class="disc_M">
                                        <img v-if="getSongdetail.flag" @error="error(getSongdetail)" :src="getSongdetail.track_info.album.mid?'https://y.gtimg.cn/music/photo_new/T002R150x150M000'+getSongdetail.track_info.album.mid+'.jpg?max_age=2592000':'https://y.gtimg.cn/mediastyle/global/img/playlist_150.png?max_age=2592000'" />
                                 </div>
                                 <div class="High_light"> </div>
                            </div>
                    </div>
                </div>
                <div class="progress">
                        <span changeTime>{{changeTime}}</span>
                        <div class="progress_allLen" @touchend="targetTime">
                            <div class="progress_mouse" :style="progressMouse"  @touchstart="targetStart"></div>
                        </div>
                        <span endTime>{{endTime}}</span>
                </div>
                <div class="song_do">
                    <a class="canvas"  v-if="getSongdetail.track_info.mv.vid" data-fn="drawMv" @click.stop :href="'https://y.qq.com/n/yqq/mv/v/'+getSongdetail.track_info.mv.vid
    +'.html'">
                        <canvas v-if="style.width" :width="style.width" :height="style.width"></canvas>
                    </a>
                    <a class="canvas" data-fn="drawPlay" @click="isPlay">
                        <canvas v-if="style.width" :width="style.width" :height="style.width"></canvas>
                    </a>
                    <a :class="'canvas iconfont '+incoJosn.inco" @click="playSong">
                    </a>
                </div>
              </div>
         </div>
         <div class="comments">
                <h3>精彩评论</h3>
                <ul class="comments_list" v-if="getComments">
                    <li v-for="item,index in getComments">
                        <h4>
                            <img v-if="item.flag" @error="error(item)"  :src="item.avatarurl">
                            <img v-else src="https://y.gtimg.cn/mediastyle/global/img/person_120.png?max_age=2592000">
                        </h4>
                        <div class="Thetext">
                                <h5>{{item.nick}}</h5>
                                <time>{{item.time | getDate}}</time>
                                <p v-html="getLydrics(item.rootcommentcontent)"></p>
                        </div>
                        <p class="zan iconfont icon-good">{{item.praisenum}}</p>
                    </li>
                </ul>
                <p class="noData" v-else>当前播放歌曲暂无评论!!!</p>
         </div>
         <div class="singer" >
                <h3>相关歌手</h3>
                <ul class="singer_list" v-if="getSinger.length">
                    <li v-for="item,index in getSinger" @click="setalbum(item,(index==getSinger.length-1?false:true))">   
                         <img v-if="item.flag" @error="error(item)" :src="index===getSinger.length-1?'https://y.gtimg.cn/music/photo_new/T002R300x300M000'+item.mid+'.jpg?max_age=2592000':' https://y.gtimg.cn/music/photo_new/T001R150x150M000'+item.mid+'.jpg?max_age=2592000'">
                        <img v-else src="https://y.gtimg.cn/mediastyle/global/img/person_120.png?max_age=2592000">
                        <p>
                            <span>{{index==getSinger.length-1?'专辑':"歌手"}}</span>
                            <span>{{item.name}}</span>
                        </p>
                    </li>
                </ul>
                <p class="noData" v-else>当前播放歌曲暂无相关歌手!!!</p>
        </div>
        <div class="singer like">
                <h3>喜欢这首歌的人也听</h3>
                <ul class="singer_list"  v-if="getSimsongs.length">
                    <li v-for="item,index in getSimsongs" @click="addMusic(item)">    
                        <img v-if="item.flag" @error="error(item)" :src="'https://y.gtimg.cn/music/photo_new/T002R300x300M000'+item.album.mid+'.jpg?max_age=2592000'">
                        <img v-else src="https://y.gtimg.cn/mediastyle/global/img/playlist_150.png?max_age=2592000">
                        <p>
                            <span>{{item.name}}</span>
                            <span>{{maps(item.singer,undefined,'/')}}</span>
                        </p>
                    </li>
                </ul>
                <p class="noData" v-else>当前播放歌曲暂无相关推荐歌曲!!!</p>
        </div>
        <div class="playlist">
                <h3>包含这首歌的歌单</h3>
                <ul class="play_list" v-if="getSimgedan.length">
                    <li v-for="item,index in getSimgedan" @click="Switch_sheet(item)">    
                        <img v-if="item.flag" @error="error(item)" :src="item.imgurl">
                        <img v-else src="https://y.gtimg.cn/mediastyle/global/img/playlist_150.png?max_age=2592000">
                        <p>
                            <span>{{item.dissname}}</span>
                            <span>{{item.creator}}</span>
                        </p>
                    </li>
                </ul>
                <p class="noData" v-else>当前播放歌曲暂无相关推荐歌单!!!</p>
        </div>
        <pendingList  :isDown="isDown" :noData="noData" :isClose="isClose" @Allowed_Request="isRequest" :nowSongId="songId[index]" :nowSong="nowSongs" @changeClose="showMusicList" @getNowIndex="nextPiece"></pendingList>
    </div>
</template>

<script>
let config={
    "comm": {
        "g_tk": 5381,
        "uin": 0,
        "format": "json",
        "inCharset": "utf-8",
        "outCharset": "utf-8",
        "notice": 0,
        "platform": "h5",
        "needNewCode": 1
    },
    "detail": {
        "module": "music.pf_song_detail_svr",
        "method": "get_song_detail",
        "param": {
            "song_id": undefined
        }
    },
    "simsongs": {
        "module": "rcmusic.similarSongRadioServer",
        "method": "get_simsongs",
        "param": {
            "songid": undefined
        }
    },
    "gedan": {
        "module": "music.mb_gedan_recommend_svr",
        "method": "get_related_gedan",
        "param": {
            "sin": 0,
            "last_id": 0,
            "song_type": 1,
            "song_id": undefined
        }
    }
}
let mixin={
    methods:{
        starts(ev){
            ev=ev||window.event;
            ev.preventDefault();
            if(ev.target.className.toLowerCase()=="lytrics"){
                clearTimeout(this.timer);
                this.startY=ev.changedTouches[0].pageY;
                this.startTime=new Date().getTime();
                this.initY=parseFloat(this.H);
                this.isScroll=false;
                this.iPrevY=parseFloat(this.H);
                this.iPrevTime=this.startTime;
                this.iSpeedY=this.iSpeedTime=null;
                this.targetY={
                    "transform-origin": "0px 0px 0px",
                    "transform": 'translate3d(0px,'+this.initY+'px , 0px)',
                    "transition":'none'
                };
                this.touchFlag=true;
            }
        },
        moves(ev){
            ev=ev||window.event;
            if(ev.target.className.toLowerCase()=="lytrics"&&this.startY!=ev.changedTouches[0].pageY){     //判断事件源和解决安卓下大面积触发BUG
                this.isScroll=true;
                this.moveY=ev.changedTouches[0].pageY;
                let iSpeedY=this.moveY-this.startY;
                let time=new Date().getTime();
                let targetY=this.initY+iSpeedY;
                let maxScrollY=ev.target.parentNode.offsetHeight-this.liH;
                if(targetY>0){
                    targetY*=0.3;
                }else if(Math.abs(targetY)>Math.abs(maxScrollY)){           //超过最大上拉直
                    targetY=this.initY+iSpeedY*0.3;
                }
                this.H=targetY;
                this.targetY={
                    "transform-origin": "0px 0px 0px",
                    "transform": 'translate3d(0px,'+targetY+'px , 0px)',
                    "transition":'none'
                };
                if( this.iPrevY!=targetY){
                    this.iSpeedY=targetY- this.iPrevY;
                    this.iPrevY=targetY;
                    this.iSpeedTime=time-this.iPrevTime;
                    this.iPrevTime=time;
                }
            }
        },
        ends(ev){
            ev=ev||window.event;
            if(ev.target.className.toLowerCase()=="lytrics"){
                this.isScroll=false;
                let iSpeedY=this.iSpeedY*5/this.iSpeedTime;
                let time=new Date().getTime();
                if(!this.iSpeedTime||(time-this.iPrevTime)>500){
                    this.timer=setTimeout(res=>this.touchFlag=false,1000);
                    return ""
                }
               let targetY=this.initY+iSpeedY*30;
                let maxScrollY=ev.target.parentNode.offsetHeight-this.liH;
                let Bessel="cubic-bezier(.1,.69,.1,1)";
                let times=Math.round(Math.abs(targetY-this.H)*0.8);
                times=times<200?200:times>800?800:times;
                if(targetY>0){
                    targetY=0;
                    Bessel="cubic-bezier(0, 0.76, 0.44, 2.15)";
                }else if(Math.abs(targetY)>Math.abs(maxScrollY)){           //超过最大上拉直
                    targetY=-maxScrollY;
                    Bessel="cubic-bezier(0, 0.76, 0.44, 2.15)";
                }
                this.H=targetY;
                this.targetY={
                    "transform-origin": "0px 0px 0px",
                    "transform": 'translate3d(0px,'+targetY+'px , 0px)',
                    "transition":'transform '+times+'ms '+Bessel,
                };
                this.timer=setTimeout(res=>this.touchFlag=false,3000);
            }
        }
    }
}
import {mapActions,mapMutations} from "vuex";
import pendingList from '@/components/popUp/Pendinglist';
import {getStorage,setStorage} from "@/assets/js/common.js";
import {Toast} from "mint-ui";
let json;
function makeUp(num){
    return num>10?num+'':'0'+num
};
export default {
    name:"playsong",
    data(){
        let str=this.$route.query.songId;    //先判断有没有传参
        if(!str) this.target();
        let songId=str.split(',').filter(res=>res);
        if(!songId.length) this.target();      //如果传的参数为空也返回
        let taogeConfig={                   //歌单请求配置
            disstid:null,     //请求歌单ID
            song_begin:0,                     //请求初始位置
            song_num:15                     //请求歌曲数量
        },
        albumConfig={                     //专辑请求配置                       
            "albumid":null,
        },
        SingerIdConfig={
            singerid:null,
            begin:0,
            num:15
        },
        isDown=false;                        //能不能下拉加载参数              
        if(this.$route.query.disstid){    //歌单ID存在
            this.disstid=this.$route.query.disstid;
            taogeConfig={
                disstid:this.disstid,     //请求歌单ID
                song_begin:0,                     //请求初始位置
                song_num:15                     //请求歌曲数量
            }
            isDown=true;
        }else if(this.$route.query.singerid){         //歌手ID存在
            this.singerid=this.$route.query.singerid;
            SingerIdConfig={
                singerid:this.singerid,
                begin:0,
                num:15
            }
            isDown=true;
        }
        return {
            index:0,                //初始歌曲下标
            style:{},               //记录宽高
            playFlag:false,     //初始化暂停
            flag:true,             //判断歌曲是否已经加载完毕
            config,                 //请求配置
            songId,                //歌曲总量
            liH:0,                  //当前这行歌词的高度
            indexs:0,            //当前是哪行歌词了
            changeTime:"00:00",     //初始化时间
            endTime:"00:00",           //结束时间
            allTime:0,                       //总时长
            bfb:0,                              //百分比
            toggle:'show',                  //判断歌词显示不显示
            isOpacity:false,                //专辑图片渐显
            isHide:false,                     //专辑图片渐显
            isScroll:false,                    //是不是滑动了,用来判断专辑图片的状态
            timer:null,                        //为定时器而生
            isClose:false,                   //播放列表是否显示
            nowSongs:{                      //播放队列
                playlist:[],
                isPlay:false
            },
            incoJosn:{                        //循环列表
                method:1,                     //播放方式   1.顺序播放 2单曲循环 3随机播放
                inco:"icon-xunhuanbofang01"
            },
            progressMouse:{             //设置进度条
                left:"-10px"
            },
            targetY:{                           //设置歌词滑动到哪里了
                "transform-origin": "0px 0px 0px",
                "transform": 'translate3d(0px,0px , 0px)'
            },
            touchFlag:false,                 //用来判断是否滑动歌词了
            noData:true,                     //没有数据了
            taogeConfig,                     //歌单参数
            albumConfig,                    //专辑参数
            SingerIdConfig,                //歌手参数
            isDown,                            //传给歌曲列表用来判断是否下拉加载
        }
    },
    filters:{
        getDate(defaults){      //转化时间
            let Time=new Date(defaults*1000);
            let getFullYear=Time.getFullYear();
            let getMonth=makeUp(Time.getMonth()+1);
            let getDate=makeUp(Time.getDate());
            let getHours=makeUp(Time.getHours());
            let getMinutes=makeUp(Time.getMinutes());
            let getSeconds=makeUp(Time.getSeconds());
            return getFullYear+'-'+getMonth+'-'+getDate+' '+getHours+':'+getMinutes+':'+getSeconds
        }
    },
    mixins:[mixin],
    computed:{
        getComments(){      //拿到歌曲评论数据
            return this.$store.state.comment;
        },
        getSongdetail(){       //拿到歌曲详细数据
            if(!this.$store.state.playsong.detail) return ""
            return this.$store.state.playsong.detail
        },
        getSimsongs(){         //获取推荐歌曲
            return this.$store.state.playsong.simsongs
        },
        getSimgedan(){         //获取推荐歌单
            return this.$store.state.playsong.gedan;
        },
        getSinger(){              //获取歌手
            return this.$store.state.playsong.singers
        },
        getLyric(){                //获取当前播放歌曲的歌词
            if(this.$store.state.lyrics.lyrics){                //初始化获取元素的
                this.$nextTick(res=>{
                   this.aLi=this.$el.querySelector(".mask").querySelectorAll("li");
                   this.liH=this.aLi[this.indexs].offsetHeight;
                });
            }
            return this.$store.state.lyrics
        }
    },
    watch:{
        playFlag(){
            this.aCan=this.$el.querySelectorAll(".canvas");
            this.resize();
        },
        $route(){
            console.log(this.$route)
        }
    },
    methods:{
        autoplay(ev){                                 //拿到歌曲播放时间
            if(this.flag) return 
            ev=ev||window.event;
            this.changeTime=this.ConversionTime(ev.currentTarget.currentTime);
            this.bfb=ev.currentTarget.currentTime/ev.currentTarget.duration;
            if(this.getLyric&&!this.touchFlag){                                 //如果有歌词并且没有手动操作才可以走自动同步歌词
                this.getIndexs(ev.currentTarget.currentTime);          //获取当前位置的下标
                this.getElementH();                                                   //根据当前位置的下标获取值
            }
            this.timeTarget();
            if(this.bfb>=1){
                let index=this.index==undefined?-1:this.index;
                if(this.incoJosn.method==1){     //歌曲循环
                    index++;  
                }else if(this.incoJosn.method==3){          //随机播放
                    if(this.songId.length!=1){   //只有不止一首歌曲存在与播放列表的时候不用查找了
                        while(index==this.index){
                            index=Math.floor(Math.random()*this.songId.length)
                        }
                    }
                };
                this.nextPiece(index);
            }
        },
        getAudioMsg(ev){                //开始播放
            ev=ev||window.event;
            this.audio=ev.currentTarget;
            this.flag=false;
            this.playFlag=true;
            this.allTime=ev.currentTarget.duration;
            this.endTime=this.ConversionTime(ev.currentTarget.duration);
        },
        getIndexs(time){                             //获取当前位置
            let flag=false;
            for(let i=this.indexs;i<this.aLi.length;i++){
                    if(this.getLyric.timeArr[i]<=time&&time<this.getLyric.timeArr[i+1]){
                        this.indexs=i;
                        break
                    }else if(time>=this.getLyric.timeArr[i+1]){
                        this.indexs=i+1
                    }else{
                        flag=true;
                        break
                    }
            };
            if(flag){
                for(let i=this.indexs;i>0;i--){
                    if(this.getLyric.timeArr[i]>time){
                        this.indexs=i-1;
                    }else{
                        break
                    }
                }
            }
            this.liH=this.aLi[this.indexs].offsetHeight;        //矫正高度
        },
        getElementH(){                       //获取当前距离顶部的位置
            let H=0;
            for(let i=this.indexs-1;i>=0;i--){
                H+=this.aLi[i].offsetHeight
            }
            this.H=-(H);
            this.targetY={
                "transform-origin": "0px 0px 0px",
                "transform": 'translate3d(0px,-'+H+'px , 0px)'
            }
        },
        nextPiece(index,flag){                            //下一首
            if(this.flag&&!flag) return;            //防止重复的去进行下一首
            if(index==this.songId.length||index<0) index=0;
            this.indexs=0;                  //歌词还原
            this.flag=true;                //播放状态还原
            this.isPlay();
            if(this.incoJosn.method==2&&!flag){        //单曲循环
                this.audio.load();
            }else{  
                    this.index=index;           //当前播放歌曲还原
                    if(this.songId.length==1){              //只有一首歌曲存在与播放列表的时候自动重播
                         this.audio.load();
                    }else{
                        this.setConfig();              
                        if(this.source) {              //取消之前的请求，可能网速不济的情况下重复请求
                            for(let attr in this.source){
                                this.source[attr].cancel("操作被用户取消");
                            }
                        };
                        Promise.all([this.getPlaysong(),this.getComment(Number(this["songId"][this.index])),this.getLyrics(Number(this["songId"][this.index]))]).then(res=>{
                            this.setPlaysong(res[0]);
                            this.setComment(res[1]);
                            this.setLyrics(res[2]);
                        },res=>{
                            console.log(res)
                        });
                }
            }
        },
        popUp(ev){                                       //设置专辑图片
            ev=ev||window.event;
            if(this.isScroll) return
            if(!this.isOpacity){
                this.isHide=true;
                this.toggle="hide";
                setTimeout(res=>{
                    this.isOpacity=true;
                },30);
            }else{
                this.isOpacity=false;
                setTimeout(res=>{
                    this.toggle="show"; 
                    this.isHide=false;
                },600);
            }
        },
        showMusicList(flag){                              //打开或者关闭播放列表
            this.isClose=!flag.type?flag:!this.isClose;
            this.nowSongs={
               playlist:this.nowSong(),
               isPlay:this.playFlag
            }
        },
        isPlay(){                                           //暂停或者播放 
            this.playFlag=!this.playFlag;
            if(this.playFlag){
                this.audio.play();
            }else{
                this.audio.pause();
            }
        },
        playSong(){                             //判断播放方式
            let Index=this.incoJosn.method;
            Index++
            if(Index>3) Index=1;
            switch(Index){
                case 2:
                this.incoJosn.inco="icon-danquxunhuan";
                Toast("单曲循环")
                break
                case 3:
                this.incoJosn.inco="icon-suijibofang01";
                Toast("随机播放")
                break
                default: 
                this.incoJosn.inco="icon-xunhuanbofang01";
                Toast("循环播放")
            }
            this.incoJosn.method=Index;
        },
        getTime(ev){                        //直接播放对应歌词所在位置
            let prevEl=ev.currentTarget.previousElementSibling;
            let aLi=prevEl.children;
            let h=0;
            for(let i=0;i<aLi.length;i++){
                h+=aLi[i].offsetHeight;
                if(Math.abs(this.H)<=h){
                    let index=(i+1)>=aLi.length?aLi.length-1:i+1;
                    this.audio.currentTime=aLi[index].dataset.time;
                    this.indexs=index;
                    this.getElementH();
                    break
                }
            }
        },
        timeTarget(){                       //通过获取当前时间算出位置
            let X=this.bfb*this.progress.offsetWidth;
            if(X<0){
                 X=0;
            }else  if(X>this.progress.offsetWidth){
                X=this.progress.offsetWidth;
            }
            this.progressMouse={
                left:X-this.progress.children[0].offsetWidth/2+'px'
            }
        },
        targetTime(ev){                   //通过获取当前位置算出当前播放
            ev=ev||window.event;
            if(ev.target!=ev.currentTarget) return
            let X=ev.changedTouches[0].pageX-this.progress.getBoundingClientRect().left;
            let iLeft=this.progress.children[0].offsetWidth/2;
            if(X<0){
                X=0;
            }else if(X>this.progress.offsetWidth){
                X=this.progress.offsetWidth;
            }
            this.progressMouse={
                left:X-iLeft+'px'
            };
            let bfb=X/this.progress.offsetWidth;
            this.audio.currentTime=bfb*this.allTime;
        },
        targetStart(ev){              //点击那个滚动条按钮
            ev=ev||window.event;
            this.startX=ev.changedTouches[0].pageX;
            this.initX= parseFloat(this.progressMouse.left);
        },
        targetMove(ev){                //滚动滚动条
            ev=ev||window.event;
            if(ev.target.className.toLowerCase()=="progress_mouse"){
                this.moveX=ev.changedTouches[0].pageX;
                let iSpeedx=this.moveX-this.startX;
                let target=this.initX+iSpeedx;
                let iLeft=this.progress.children[0].offsetWidth/2;
                if(target<0){
                    target=0;
                }else if(target>this.progress.offsetWidth){
                    target=this.progress.offsetWidth;
                }
            this.progressMouse={
                    left:target-iLeft+'px'
                };
                let bfb=target/this.progress.offsetWidth;
                this.audio.currentTime=bfb*this.allTime;
            }
        },
        nowSong(){                              //获取播放列表
            let nowSong;
            if(this.$store.state.news.playList.length){
                nowSong=this.$store.state.news.playList.map(res=>{
                        return JSON.parse(res)
                });
            }else{
                let getStorages=getStorage("playList");
                if(getStorages){
                    try {
                        nowSong=getStorages.split("&").map(res=>{
                            return JSON.parse(res)
                        });
                    } catch (error) {
                        console.log(error)
                        return []
                    }
                    if(nowSong.length!=this.songId.length) this.$router.replace("/");
                    if(!nowSong.every((res,index)=>{
                        return res.songid==this.songId[index];
                    })){
                        this.$router.replace("/");
                    }
                }else{
                    this.$router.replace("/");
                }
            }
            return nowSong
        },
        ConversionTime(time){                   //将歌曲时间转化为分钟数
            let min=makeUp(time/60).split('.')[0];
            let seconds=makeUp(time%60).split('.')[0];
            return min+':'+seconds;
        },
        getLydrics(defaults){               //修改评论
            defaults=defaults.replace(/\\n|\n/g,'<br>');
            return defaults
        },
        success(item){
           item.flag=true;
        },
        error(item){
           item.flag=false;
        },
        target(){                                       //不满足条件时放回上一页
            let parent=Object.keys(json.params).length?{params:json.params}:Object.keys(json.query).length?{query:json.query}:{};
            this.$router.push({
                    path:json.path,
                    ...parent
            });
        },
        isRequest(X,Y){
            if(this.$route.query.disstid){    //歌单ID存在
                this.Switch_sheet(X,Y)
            }else if(this.$route.query.singerid){         //歌手ID存在
                this.setalbum(X,true,Y)
            }
        },
        Switch_sheet(item,flag){                 //点击歌单
            if(this.source&&this.source.qqTaoge) this.source.qqTaoge.cancel("操作被用户取消");
            if(!item){       //下拉加载获取歌单
               this.isDown=flag;
               this.taogeConfig={
                disstid:this.disstid,          //请求歌单ID
                song_begin:this.nowSong().length,               //请求初始位置
                song_num:15                     //请求歌曲数量
               }
               flag=true;
            }else{          //第一次获取该该歌单
               this.taogeConfig={
                disstid:item.tid,                         //请求歌单ID
                song_begin:0,                     //请求初始位置
                song_num:15                     //请求歌曲数量
               }
            }
            this.getTaoge(this.taogeConfig,flag).then((res)=>{
                console.log("获取歌单成功!!!")
                this.showMusicList(true);
                this.isDown=true;
            },function(res){
                console.log("获取歌单失败!!!")
                console.log(res)
            });
        },
        addMusic(item){         //添加音乐到播放列表
            this.config.detail.param.song_id=item.id;       //设置请求的歌曲ID；
            this.config.simsongs.param.songid=item.id;
            this.config.gedan.param.songid=item.id;
            this.index=undefined;
            this.indexs=0;                  //歌词还原
            this.flag=true;                //播放状态还原
            this.isPlay();
            if(this.source) {              //取消之前的请求，可能网速不济的情况下重复请求
                for(let attr in this.source){
                    this.source[attr].cancel("操作被用户取消");
                }
            };
            Promise.all([this.getPlaysong(),this.getComment(Number(item.id)),this.getLyrics(Number(item.id))]).then(res=>{
                this.setPlaysong(res[0]);
                this.setComment(res[1]);
                this.setLyrics(res[2]);
            },res=>{
            });
        },
        setalbum(item,type,flag){     //获取歌手或者专辑type是类型
            if(type){                   //为true是歌手
                if(this.source&&this.source["qqSingerDetail"])  this.source["qqSingerDetail"].cancel("操作被用户取消");
                if(!item){           //为true是下拉加载
                    this.SingerIdConfig.begin=this.nowSong().length;
                    this.isDown=false;
                    flag=true;
                }else{              //false第一次获取
                    this.SingerIdConfig.singerid=item.id;
                }
                 this.getSingerDetail(this.SingerIdConfig,flag).then(resolve=>{
                    this.isDown=true;
                    this.showMusicList(true);
                },reject=>{
                    console.log(reject)
                });
            }else{                      //为false为专辑
                if(this.source&&this.source["qqAlbum"])  this.source["qqAlbum"].cancel("操作被用户取消");
                this.getAlbum({
                    albumid:item.id
                }).then(resolve=>{
                    console.log("获取专辑成功")
                },reject=>{
                    console.log(reject)
                })
            }
        },
        resize(){   //设置canvas的大小
            this.style={
                width:this.aCan[0].offsetWidth,
                height:this.aCan[0].offsetHeight
            };
            this.$nextTick(res=>{
                for(let i=0;i<this.aCan.length;i++){
                   this.aCan[i].dataset.fn&&this[this.aCan[i].dataset.fn](this.aCan[i]);
                }
            });
        },
        drawMv(el){     //MV
            let iCan=el.children[0].getContext("2d");
            iCan.clearRect(0,0,this.style.width,this.style.height)
            iCan.textAlign="center";
            iCan.font=this.style.width/2.5+'px Arial bold';
            iCan.fillText("MV",this.style.width/2,this.style.height/1.6);
            iCan.fill()
        },
        drawPlay(el){    //播放
            let iCan=el.children[0].getContext("2d");
            iCan.clearRect(0,0,this.style.width,this.style.height)
            iCan.lineWidth=2;
            iCan.strokeStyle="#505050";
            if(this.playFlag){    //暂停的按钮
                iCan.fillRect(this.style.width/3,this.style.height/3.4,this.style.width/20,this.style.height/2.2);
                iCan.fillRect(this.style.width/1.8,this.style.height/3.4,this.style.width/20,this.style.height/2.2);
            }else{    //播放按钮
                 iCan.beginPath();
                iCan.moveTo(this.style.width/2.6,this.style.height/2.2/2);
                iCan.lineTo(this.style.width/2.6,this.style.height/1.4);
                iCan.lineTo(this.style.width/1.5,this.style.height/2);
                iCan.closePath();
                iCan.stroke();                
            }
        },
        setConfig(){                      //设置当前播放歌曲的id
            this.copy(this.config,"song_id",Number(this["songId"][this.index]));
            this.copy(this.config,"songid",Number(this["songId"][this.index]));
        },
        copy(el,key,value){                                    //设置要传参的参数
            for(let attr in el){
                if(typeof el[attr] ==='object'){
                     if(!(el[attr] instanceof Array)){     //不是数组
                         this.copy(el[attr],key,value);
                     }
                }else{
                    if(attr===key){
                        el[attr]=value
                    }
                }
            }
        },        
        ...mapActions({
                getPlaysong(dispatch){    //获取详情
                    return dispatch("getPlaysong",{
                        ...this.config,
                        el:this
                    }).then(res=>{
                        if(res.status==200){
                            let json={};
                            json.detail={...res.data.detail.data,flag:true};
                            json.gedan=res.data.gedan.data.vec_gedan.splice(0,3).map(res=>{
                                res.imgurl=res.imgurl.includes("https")?res.imgurl.includes("https"):res.imgurl.replace(/http/,'https');
                                return {...res, flag:true  };
                            });
                            json.simsongs=res.data.simsongs.data.songInfoList.map(res=>({...res,flag:true}));
                            let arr=res.data.detail.data.track_info.singer;
                            let data=res.data.detail.data.track_info.album;
                            arr.push(data);
                            json.singers=arr.map(res=>({...res,flag:true}));
                            return Promise.resolve(json);
                        }else{
                            return Promise.reject();
                        }
                    });
                },
                getComment(dispatch,songId){       //获取评论
                    return dispatch("getComment",{
                        topid:songId,
                        "_":new Date().getTime(),
                        el:this
                    }).then(res=>{
                        if(res.status==200){
                            let comment=res.data["hot_comment"].commentlist;
                            if(comment){
                                return Promise.resolve(comment.splice(0,3).map(res=>({...res,flag:true})));
                            }else{
                                return Promise.resolve(false);
                            }
                        }else{
                            return Promise.reject();
                        }
                    });
                },
                getLyrics(dispatch,songId){   //获取歌词
                    return dispatch("getLyrics",{
                        musicid:songId,
                        "_":new Date().getTime(),
                        el:this
                    }).then(res=>{
                        if(res.status==200){
                            let re=/[a-z]*\((.*)\)/gi;
                            let json=JSON.parse(res.data.replace(re,($0,$1)=>$1));
                            json=json.lyric;
                            if(json.includes("offset")){ //有歌词
                                let split=/(.*)(\[offset&#58;0\]&#10;)(.*)/;
                                json=json.replace(split,($0,$1,$2,$3)=>$3);   //通过split正则分割字符
                                json=json.split("&#10;");      //讲歌词分段
                                let LyricsArr=[];   //歌词数组
                                let timeArr=[];      //时间数组
                                let re=/(\[.*\])(.*)/;
                               
                                json.forEach(element => {
                                    let lyricStr="";    //歌词
                                    let timeStr=0;    //时间
                                    if(!re.test(element)) return true
                                    lyricStr=element.match(re)[2].replace(/&#(\d*);/g,' ');//匹配歌词
                                    lyricStr=lyricStr.replace(/\s+/g,' ');
                                    lyricStr=lyricStr.trim();
                                    element.match(re)[1].replace(/(\d*)&#58;(\d*)&#46;(\d*)/,($0,$1,$2,$3)=>{    //匹配歌词
                                        timeStr=Number($1*60)+Number($2)+'.'+Number($3)
                                    });
                                   LyricsArr.push(lyricStr);
                                   timeArr.push(timeStr)
                                });
                                let arrIndex=[];    //记录有歌词的地方的下标
                                LyricsArr=LyricsArr.filter((res,index)=>{
                                    if(res){
                                        arrIndex.push(index)
                                        return res
                                    }
                                });
                                timeArr=timeArr.filter((res,index)=>{
                                        if(!arrIndex.length) return false
                                        if(index==arrIndex[0]){
                                            arrIndex.shift();
                                            return true
                                        }
                                        return false;
                                });
                                return Promise.resolve({
                                    lyrics:LyricsArr,   //歌词
                                    timeArr   //歌词对应时间
                                });
                            }else{      //没歌词
                                //
                                return Promise.resolve(false);
                            }
                        }else{
                            return Promise.reject();
                        }
                    })
                },
                getTaoge(dispatch,config,flag){       //获取歌单
                        return dispatch("getTaoge",{
                            ...config,
                            _:new Date().getTime(),
                            el:this
                        }).then(res=>{
                            if(res.status==200){
                                let arr=[],
                                songList=res.data.cdlist[0].songlist,
                                arrId=[];
                                if(songList.length){
                                    if(flag){   //下拉获取合并对象
                                        arr=this.nowSong().map(res=>JSON.stringify(res));
                                        arr.forEach(res=>arrId.push(res.songid));
                                        arrId=this.songId;
                                        for(let i=0;i<songList.length;i++){
                                            arrId.push(songList[i].id);
                                            let json={
                                                songid:songList[i].id,
                                                name:songList[i].name,
                                                singer:songList[i].singer,
                                                vid:songList[i].mv.vid,
                                                songmid:songList[i].file.media_mid,
                                            };
                                            arr.push(JSON.stringify(json));
                                        }
                                    }else{    //第一次获取
                                        for(let i=0;i<songList.length;i++){
                                            arrId.push(songList[i].id);
                                            let json={
                                                songid:songList[i].id,
                                                name:songList[i].name,
                                                singer:songList[i].singer,
                                                vid:songList[i].mv.vid,
                                                songmid:songList[i].file.media_mid,
                                            };
                                            arr.push(JSON.stringify(json));
                                        }
                                    }
                                    this.setPlaylist(arr);
                                    setStorage("playList",arr.join('&'));
                                    location.href=location.href.split("?")[0]+'?songId='+arrId.join(",")+'&disstid='+config.disstid;
                                    if(!flag){     //如果是flag是false说明是换歌单了
                                        this.$router.go(0)
                                    }                                   
                                }else{     //没有更多数据了!!!
                                    this.noData=false; 
                                    if(!flag){              //第一次没有数据
                                        Toast("当前歌单为空!!!")
                                        return Promise.reject();
                                    }
                                }
                                return Promise.resolve();
                            }else{
                                return Promise.reject();
                            }
                        });
                },
                getAlbum(dispatch,config){     //获取专辑
                    return dispatch('getAlbum',{
                        ...config,
                        "_":new Date().getTime(),
                        el:this
                    }).then(res=>{
                        if(res.status==200){
                            let data=res.data.data.list;
                            let SongId=[];      //存储歌曲ID
                            let SongList=[];      //存储所有歌曲
                            if(data.length){
                                for(let i=0;i<data.length;i++){
                                    SongId.push(data[i].songid);
                                    let json={
                                            songid:data[i].songid,
                                            name:data[i].songname,
                                            singer:data[i].singer,
                                            vid:data[i].vid,
                                            songmid:data[i].songmid,
                                        };
                                    SongList.push(JSON.stringify(json));
                                };
                                setStorage("playList",SongList.join("&"));
                                this.setPlaylist(SongList);
                                location.href=location.href.split("?")[0]+'?songId='+SongId.join(",");
                                this.$router.go(0);
                            }else{
                                Toast("当前专辑没有歌曲!!!")
                            }
                            return Promise.resolve();
                        }else{
                            return Promise.reject();
                        }
                    })
                },
                getSingerDetail(dispatch,config,flag){                    //获取歌手详情
                    return dispatch("getSingerDetail",{
                        ...config,
                        "_":new Date().getTime(),
                        el:this,
                    }).then(res=>{
                        console.log(res);
                        if(res.status==200){
                            let data=res.data.data.list;
                            let SongId=[];      //歌曲ID
                            let SongList=[];    //歌曲列表
                            if(data.length){        //有数据
                                if(flag){
                                    SongId=this.songId;
                                    SongList=this.nowSong().map(res=>JSON.stringify(res))
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
                                }else{  
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
                                }
                                setStorage("playList",SongList.join("&"));
                                this.setPlaylist(SongList);
                                location.href=location.href.split("?")[0]+'?songId='+SongId.join(",")+'&singerid='+config.singerid;
                                if(!flag){
                                    this.$router.go(0);
                                }
                            }else{      //没有数据
                                this.noData=false;
                                if(!flag){
                                    Toast("当前歌手没有歌曲!!!")
                                    return Promise.reject();
                                }
                            }
                            return Promise.resolve();
                        }else{
                            return Promise.reject();
                        }
                    })
                }
        }),
        ...mapMutations({
                setPlaysong(commit,data){
                    commit("setPlaysong",data);
                },
                setComment(commit,data){
                    commit("setComment",data);
                },
                setLyrics(commit,data){
                    commit("setLyrics",data);
                },
                setTaoge(commit,data){
                    commit("setTaoge",data);
                },
                setPlaylist(commit,data){
                    commit("setPlaylist",data);
                }
        })
    },
    beforeRouteEnter(to,from,next){
            json=from;
            next()
    },
    created(){
        this.showMusicList(false);   //查看歌曲列表是否存在        
        this.setConfig();
        Promise.all([this.getPlaysong(),this.getComment(Number(this["songId"][this.index])),this.getLyrics(Number(this["songId"][this.index]))]).then(res=>{
            this.setPlaysong(res[0]);
            this.setComment(res[1]);
            this.setLyrics(res[2]);
            this.$store.commit("setHidden",false);
        },res=>{
            this.$store.commit("setHidden",false);
            this.nextPiece(++this.index);
        })
        
    },
    updated(){

    },
    mounted(){
        this.progress=this.$el.querySelector(".progress_allLen");
        window.addEventListener("resize",this.resize.bind(this),false);
    },
    destroyed(){
        this.setPlaysong({
            detail:{                
                track_info:{
                    album:'',
                    file:"",
                    mv:''
                }
            },              
            gedan:[],           
            simsongs:[],        
            singers:[]          
        });
        this.setComment([]);
        this.setLyrics([]);
    },
    components:{
        pendingList
    }
}
</script>

<style lang="less" scoped>
@rem:75rem;
.playsong{
    width: 100%;
    .noData{
        font-size: 30/@rem;
        color: #777;
        padding: 20/@rem 0;                                                                            
    }
    .header{
        padding: 12/@rem 25/@rem;
        box-shadow: 0px 0px 20/@rem rgba(0,0,0,0.1);
        position: relative;
        z-index: 9;
        h1{
            height: 60/@rem;
            background: url(../assets/img/logo.jpg) no-repeat left center;
            background-size: 60/@rem 60/@rem;
            font-size: 36/@rem;
            text-align: left;
            line-height: 60/@rem;
            padding-left: 70/@rem;
        }
    }
    .songbody{
        height:800/@rem;
        position: relative;
        margin-bottom: 80/@rem;
        .bg{
            height: 100%;
            background-size: 100%
        }
        .songbody_main{
            padding-top: 50/@rem;
            position: absolute;
            left: 0%;
            top: 0%;
            right: 0%;
            bottom: 0%;
            background:linear-gradient(top,rgba(255,255,255,0.8) 0%,rgba(255,255,255,0.8) 60%, rgba(255,255,255,1) 100%),linear-gradient(top,rgba(255,255,255,0.4) 0%,rgba(255,255,255,0.4) 60%, rgba(255,255,255,1) 100%);
            .title{
                height: 150/@rem;
                text-align: center;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                .title_name{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 40/@rem;
                    color: #000;
                    i{
                        margin-left: 8/@rem;
                        width: 36/@rem;
                        height: 36/@rem;
                        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkBAMAAAATLoWrAAAAKlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKE86IAAAADXRSTlMAEd3MZu6qM5l3VUQiBVde7AAAANdJREFUKM9jgIAjybFXzXwYkMDiu2BghRDZdDfMXYCxJPWuNkyE466KAIhmdLrbABFhtL0Jk5x7WQBMC10qgAmx6ypCFBkiTBUGK+O4JIAQYtQFmbb3OrJzam8DCd0JyEKclxgYuIAYGeguYGC+girka8BwNhBI80I8dAHIFL3D4JuAKsR2hSHXAVUjyzUG2wJUIfbLDLECqEKMVxnuMqCaBRTAFMKmEdN4bI7AdCo2D2F6G0vgYAtChr3hyEKlt7FFB2akYUYtrgTAIIGRTDATE2aSw0yYADrIdAMLgVOsAAAAAElFTkSuQmCC) no-repeat 0 0/cover;
                    }
                }
                .title_singer{
                    font-size: 26/@rem;
                    margin-top: 10/@rem
                }
            }
            .song_main{
                position: relative;
                height: 300/@rem;
                box-sizing: border-box;
                .song_main_lyrics{
                    &.hide{
                        visibility: hidden;
                    }
                    &.show{
                        visibility:initial;
                    }
                    position: relative;
                    overflow: hidden;
                    height: 100%;
                    width:100%;
                    box-sizing: border-box;
                    padding: 100/@rem 60/@rem 0;
                    -webkit-mask: -webkit-linear-gradient(top,rgba(0,0,0,0),#fff 25%,#fff 75%,rgba(0,0,0,0));
                    .mask:first-child{
                        overflow:visible;
                        li{
                            color: #777
                        }
                    }
                    .mask{
                        transition: transform 0.6s linear;
                        height: 100%;
                        position: absolute;
                        width: 100%;
                        height: 90/@rem;
                        top: 50%;
                        left: 0%;
                        padding: 0 60/@rem;
                        box-sizing: border-box;
                        overflow: hidden;
                        transform: translateY(-50%);
                        ul{
                            transition: transform 0.6s linear;
                            li{
                                height:auto;
                                white-space:normal;
                                font-size: 24/@rem;
                                color:#03A9F4;
                                padding: 10/@rem 0;
                                line-height: 1.5
                            }
                        }
                        .targetPlay{
                            right: 10%;
                            top: 50%;
                            transform: translateY(-50%);
                            position: absolute;
                            background: url(../assets/img/ui-list-912.png) no-repeat -130/@rem -108/@rem;
                            background-size: 486/@rem 401/@rem;
                            width:55/@rem;
                            height:55/@rem
                        }
                    }
                }
                .song_main_album{
                    width: 380/@rem;
                    height: 380/@rem;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                    opacity: 0;
                    display: none;
                    transition: opacity 0.6s linear;
                    background:rgba(0,0,0,0.2) ;
                    border-radius: 50%;
                    &.active{
                       .needle{
                           .needle_T{
                                transform: translateY(-3%) rotateZ(0deg);
                           }
                       }
                       .disc_F{
                           animation-play-state:running;
                       }
                    }
                    .needle{
                        display: block;
                        width: 50%;
                        height: 100%;
                        position: absolute;
                        top: 0%;
                        left: -20%;
                        .needle_T{
                            width: 140/@rem;
                            height: 200/@rem;
                            background: url(../assets/img/needle-ip6.png) no-repeat center center;
                            background-size: 100% 100%;
                            transition:transform 0.8s;
                            transform: translateY(-3%) rotateZ(20deg);
                            transform-origin: 20/@rem top;
                        }
                        z-index: 99;
                        overflow: hidden;
                    }
                    .disc_F{
                        position: relative;
                        width: 100%;
                        height: 100%;
                        background: url(../assets/img/disc-ip6.png) no-repeat center center;
                        background-size: 100% 100%;
                        display:flex;
                        justify-content: center;
                        align-items: center;
                        transform-origin: center center;
                        animation: rotateZ 16s linear infinite;
                        animation-fill-mode: both;
                        animation-play-state: paused;
                        .disc_M{
                            width:63%;
                            height:63%;
                            background: url(../assets/img/disc_default.png) no-repeat center center;
                            background-size: 100% 100%;
                            border-radius: 50%;
                             img{
                               width: 100%;
                               height: 100%;
                               border-radius: 50%;
                            }
                        }
                        @keyframes rotateZ{
                           0%{
                               transform: rotateZ(0deg)
                           }
                           100%{
                               transform: rotateZ(360deg)
                           }
                       }
                        .High_light{
                            position: absolute;
                            width: 100%;
                            height: 100%;
                            left: 0%;
                            top: 0%;
                            background: url(../assets/img/disc_light.png) no-repeat center center;
                            background-size: 100% 100%;
                        }
                    }
                }
            }
            .progress{
                padding: 50/@rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                span{
                    color: #ccc;
                    font-size: 30/@rem
                }
                .progress_allLen{
                    width: 450/@rem;
                    height: 2px;
                    position: relative;
                    background: #999;
                    cursor: pointer;
                    .progress_mouse{
                        width: 20/@rem;
                        height: 20/@rem;
                        border-radius: 50%;
                        top: 50%;
                        left: 0%;
                        transform: translateY(-50%);
                        position: absolute;
                        background: #333
                    }
                }
            }
            .song_do{
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 400/@rem;
                margin:0/@rem auto 60/@rem;
                a{
                    width: 80/@rem;
                    height: 80/@rem;
                    border-radius: 50%;
                    border: 1px solid #ccc;
                    overflow: hidden;
                    color: #777;
                    position: relative;
                    &:after{
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%,-50%);
                        font-size: 60/@rem;
                    }
                }
            }
            .download{
                width:400/@rem;
                padding: 15/@rem 20/@rem;
                border-radius: 50/@rem;
                background: #03A9F4;
                font-size: 36/@rem;
                margin: 0 auto;
                color: #fff;
                letter-spacing: 10/@rem
            }
        }
    }
    .comments{
        >h3{
            text-align: center;
            font-size: 36/@rem;
        }
        .comments_list{
            padding: 0 25/@rem;
            li{
                display: flex;
                justify-content: center;
                align-items:flex-start;
                position: relative;
                margin-top: 30/@rem;
                h4{
                    width: 80/@rem;
                    height: 80/@rem;
                }
                .Thetext{
                    width: 600/@rem;
                    margin-left: 20/@rem;
                    padding-bottom: 20/@rem;
                    border-bottom: 1px solid rgba(0,0,0,.08);
                    h5{
                        font-size: 28/@rem;
                        color: #777;
                        text-align: left;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    time{
                        font-size: 24/@rem;
                        color: #777;
                        text-align: left;
                        display:block
                    }
                    p{
                        margin-top: 10/@rem;
                        line-height: 1.5;
                        font-size: 26/@rem;
                        color: #000;
                        text-align: left
                    }
                }
                .zan{
                    position: absolute;
                    font-size: 24/@rem;
                    color: #777;
                    right:0%;
                    top: 0%;
                    &:after{
                        display: inline-block;
                        margin-left: 5/@rem;
                        vertical-align: middle;
                    }
                }
            }
            li:last-child{
                .Thetext{
                     border-bottom:none
                }
            }
        }
    }
    .singer{
        margin-top: 30/@rem;
        >h3{
            text-align: center;
            font-size: 36/@rem
        }
        .singer_list{
            padding: 0 25/@rem;
            li{
                &.gray{
                    -webkit-filter: grayscale(100%);
                    -moz-filter: grayscale(100%);
                    -ms-filter: grayscale(100%);
                    -o-filter: grayscale(100%);
                    filter: grayscale(100%);
                    filter: gray;
                    background: #cecece6e;
                    transition: 1s;
                    transform-origin: left center;
                    transform: translateX(100%);
                    opacity: 0;
                    *{
                        color: gray !important
                    }
                }
                &::after{
                    position: absolute;
                    right: 0%;
                    top: 50%;
                    transform: translateY(-50%);
                    content: ">";
                    font-style: normal;
                    font-size: 44/@rem;
                    color: #ccc
                }
                position:relative;
                margin-top: 20/@rem;
                padding:0;
                display: flex;
                img{
                    width:130/@rem;
                    height: 130/@rem;
                }
                p{
                    margin-left: 20/@rem;
                    width:550/@rem;
                    border-bottom: 1px solid rgba(0,0,0,.08);
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    span{
                        font-size: 30/@rem;
                        color: #000;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                        text-align: left;
                        display: block;
                    }
                    span:first-child{
                        width: 100/@rem;
                    }
                    span:last-child{
                        width: 450/@rem;
                    }
                }
            }
            li:last-child{
                p{
                    border: none
                }
            }
        }
    }
    .like{
        .singer_list{
            li{
                p{
                    flex-direction: column;
                    justify-content: center;
                    align-items: flex-start;
                    span:first-child{
                        color: #000;
                        width: 100%
                    }
                    span:last-child{
                        color: #777;
                        font-size: 22/@rem;
                        width: 100%
                    }
                }
            }
        }
    }
   .playlist{
       margin-top: 30/@rem;
        >h3{
            text-align: center;
            font-size: 36/@rem
        }
        .play_list{
            margin-top: 30/@rem;
            padding: 0 25/@rem;
            display: flex;
            justify-content: space-between;
            li{
                width: 33%;
                img{
                    width: 100%;
                }
                p{
                    margin-top: 12/@rem;
                    span{
                        display: block;
                        text-align: left;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;      
                        line-height: 1.5                 
                    }
                    span:first-child{
                        font-size: 30/@rem;
                        color: #000;
                    }
                    span:last-child{
                        font-size:22/@rem;
                        color: #777;
                    }
                }
            }
        }
    }
}
</style>
