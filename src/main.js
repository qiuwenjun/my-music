// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './vuex';
import Mint from 'mint-ui';
import './assets/css/empty.css';
import './assets/js/index.min.js';
import { SSL_OP_CIPHER_SERVER_PREFERENCE } from 'constants';
Vue.use(Mint)

Vue.config.productionTip = false

//轮播全局组件
Vue.component("swiper",{         
   props:{
    clearTime:{
        type:Boolean,
        default(){
          return false;
        }
    },
      Parentindex:{
         type:Number,
         default(){
           return 0
         }
      },
      Timers:{
         type:Boolean,
         default(){
           return true
         }
      },
      bannerList:{
        type:Array,
        default(){
          return [
            {
              picUrl:"https://qnwww2.autoimg.cn/newsdfs/g1/M0B/36/48/autohomecar__ChcCQ1sEvt2Aer-sAAqRNlgTkm4754.jpg?imageView2/1/w/720/h/360/format/webp"
            },
            {
              picUrl:"https://qnwww2.autoimg.cn/newsdfs/g3/M00/2E/C3/autohomecar__wKgHGlsD8BeAYPGAAAjjDoRgd1c667.jpg?imageView2/1/w/720/h/360/format/webp"
           },
           {
              picUrl:"https://qnwww2.autoimg.cn/newsdfs/g1/M01/2B/52/autohomecar__wKgHFVsDrgGAEUsNAAOIK29mcW0000.jpg?imageView2/1/w/720/h/360/format/webp"
           },
           {
              picUrl:"https://qnwww2.autoimg.cn/newsdfs/g1/M0A/16/D1/autohomecar__wKgHGFsBfeaAS5pAAAcBZmLEopg287.jpg?imageView2/1/w/720/h/360/format/webp"
           },
           {
              picUrl:"https://qnwww2.autoimg.cn/newsdfs/g24/M02/F6/D5/autohomecar__wKgHH1r-eO6Ae6giAAp5BE_FEto548.jpg?imageView2/1/w/720/h/360/format/webp"
           },
         ]
        }
      } 
  },
   data(){
     let Index=this.Parentindex;
     if(Index<=0){
        Index=1;
     }else if(Index>this.bannerList.length){
        Index=this.bannerList.length
     }
     return {
        width:0,
        index:Index,
        pagationIndex:--Index,
        active:"none",
        stopFlag:false,
        OuterTime:null,
        InterTime:null,
     }
   },
   watch:{
    bannerList(){
      for(let attr in this.bannerList){
            let Img=new Image();
            Img.src=this.bannerList[attr].picUrl;
            let Timers=setTimeout(Img.onerror,5000);
            Img.onerror=res=>{
              this.bannerList[attr].picUrl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHUAAABcCAMAAABneQpwAAAAPFBMVEX////e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7////39/fv7+/m5ube3t7m7ZQJAAAAD3RSTlMAESIzRFVmd4iZqrvM3e5GKvWZAAAChElEQVR42u3a23qbMAwAYEMoS9KEWNL7v+v2LRxsJMtefcjF7Lu2VD9GWFYgxmhjojrDdPX/VbHcSFfxVW5gV7va1Urq/Al1WD6gDk9qro63rVa3Uw+zneqardTp7u+GXIX3PyMUU6fv8x58VsH5GxRRPROtpCJlXH5JnZ9+PEll7UimejZFFSmWgH9SuSmpIPRekKEuQhiuii1fhnoVTp2pIKrwc3UQIjAVRRUz7qYbv1pMDXTVGerIz7uBau4sQgt1YoltoZrvc4gm6hxdOeXv4b1StFyvR3cGr+K1Cf58iISAej9fsEJ1GI4wXP21hbFh9Qd7jnWPY+qFxymxvwJp6rDwQAV6CSRVfS9W37HZfROSql7XjKI7WZvbIwKp6l4NrTsFm9kPA6nqO6nO74uolnT1cUQHZ7KZKurq1V2mzm2cpyKp6pdXG+D4KUu1pKrj4q8BtR92olqrqqSrD3FjUdV16WhrB3WVd2n7QQEVEoqTJVWd/YLvLR5RtZiy55CqXpZQhQdZtUm9BOjq17J9ahQma0PNapQlXd0m613krSxy1VJS5wQx1QwPnp91slzFQJcI0amyKnFjZ7yWxcRuLXA7RtT1PnbjB54QKG8QXrFz49WfJXed7ElFRcWk3Pv7K0vu+0CpjYqxQMkqSy4Is8DIaxqQaoiu7o0pnlOICVlNGIF+ePKSi8mXLk81o5dcplId1QxucpGCmS6resm1JxXrqW5yMXR7lVfNZU8ueCpUVc2wPR72VaqrOo/Z2IPMmuq+1bPDq6pHcvfDqYF6JLep6ia3pWrm5ROquTw/oW5bfWPVff/a1dpq/pdRoL/N7+rfrqLY6N8g62pbdbzWGb8BajFcm9Ofks8AAAAASUVORK5CYII=";
            };
            Img.onload=function(){
                clearTimeout(Timers);
            }
      }
    }
   },
   computed:{
      dataList(){
          let first=Object.assign({},this.bannerList[0]);
          let last=Object.assign({},this.bannerList[this.bannerList.length-1]);
          let newArr=this.bannerList.concat();
          newArr.unshift(last);
          newArr.push(first);
          return newArr
      }
   },
   methods:{
     resize(){
        this.width=-this.$el.offsetWidth;
     },
     pagation(i){    //点击小圆点
      this.index=i+1;
      clearTimeout(this.OuterTime);
      clearInterval(this.InterTime);
      this.iUl.style.transition=`transform 0.8s cubic-bezier(0.55, 0.055, 0.675, 0.19)`;
      this.pagationIndex=this.index-1>=this.bannerList.length?this.index-1-this.bannerList.length:this.index-1;
      setTimeout(this.ends.bind(this,this.iUl),800);
      this.OuterTime=setTimeout(res=>{
        this.time();
      },3000);
     },
     start(ev){      //开始滑动
        ev=ev||window.event;
        this.startX=ev.changedTouches[0].clientX;
        this.startTime=new Date().getTime();
        let re=/(\()(.+)(\))/;
        let num=ev.currentTarget.style.transform.match(re)[2];
        this.startPosition=parseFloat(num);
        if(this.stopFlag){
          this.ends.call(this,ev.currentTarget);
        }else{
          ev.currentTarget.style.transition="none";
        }
        this.moveX=this.moveTime=null;
        clearTimeout(this.OuterTime);
        clearInterval(this.InterTime);
     },
     move(ev){   //正在滑动
        ev=ev||window.event;
        this.moveX=ev.changedTouches[0].clientX;
        this.moveTime=new Date().getTime();
        ev.currentTarget.style.transform=`translateX(${this.startPosition+(this.moveX-this.startX)}px)`
     },
     end(ev){      //结束滑动
       ev=ev||window.event;
       this.endX=ev.changedTouches[0].clientX;
       ev.currentTarget.style.transition=`transform 0.8s cubic-bezier(0.55, 0.055, 0.675, 0.19)`
       if(Math.abs(this.moveTime-this.startTime)<100||Math.abs(this.endX-this.startX)>Math.abs(this.width/2)){
          let Index;
           if(this.endX>this.startX){  //上一张
                this.index--;
                Index=this.index;
                this.pagationIndex=Index-1<0?Index-1+this.bannerList.length:Index-1;
           }else{   //下一张
               this.index++;
               Index=this.index;               
               this.pagationIndex=Index-1>=this.bannerList.length?Index-1-this.bannerList.length:Index-1;
           }
           this.stopFlag=true;
           setTimeout(this.ends.bind(this,ev.currentTarget),800);
       }else{
           ev.currentTarget.style.transform=`translateX(${this.width*this.index}px)`
       }
       this.OuterTime=setTimeout(res=>{
         this.time();
       },3000);
     },
     ends(This){
         this.stopFlag=false;
         This.style.transition="none";
         if(this.index==this.dataList.length-1){
           this.index=1;
         }else if(this.index==0){
           this.index=this.dataList.length-2;
         }
     },
     removeEvent(el,event,fn){
       el.removeEventListener(event,fn,false);
     },
     time(){
         this.InterTime=setInterval(res=>{
             this.iUl.style.transition=`transform 0.8s cubic-bezier(0.55, 0.055, 0.675, 0.19)`;
             this.index++;
             this.pagationIndex=this.index-1>=this.bannerList.length?this.index-1-this.bannerList.length:this.index-1;
             setTimeout(this.ends.bind(this,this.iUl),800);
         }, 5000);
     }
   },
   mounted(){
      this.iUl=this.$el.querySelector(".zhi");
      document.addEventListener("visibilitychange",()=>{
         var hidden=document.hidden;
         if(hidden){
            clearTimeout(this.OuterTime);
            clearInterval(this.InterTime);
         }else{
            this.time();
         }
      },false);
      this.resize()
      this.index=1;
      this.time();
   },
   activated(){
    window.addEventListener("resize",this.resize,false);
  },
  deactivated(){
    this.removeEvent(window,'resize',this.resize);
  },
   template:`
      <div class="classList">
        <div class="classBanner">
              <ul class="zhi" @touchstart="start" @touchmove="move" @touchend="end" :style="{width:Math.abs(dataList.length*width)+'px',transform:'translateX('+(index*width)+'px)',transition:active}">
                  <li :style="{width:Math.abs(width)+'px'}" v-for="item,index in dataList"><a :href="item.linkUrl"><img :alt="item.title" :src="item.picUrl" width="100%" height="100%" :title="item.title"></a></li>
              </ul>
        </div>
        <dl>
            <dd :class="pagationIndex==i?'active':''" @touchend="pagation(i)" v-for="item,i in bannerList"></dd>
        </dl>
      </div>
   `
});
//注册一个滑动指令
  Vue.directive('scroll',{
    inserted(el,binding){
      el.iUl.addEventListener("touchstart",function(ev){
        this.startX=ev.changedTouches[0].clientX;
        this.disPrevTime=new Date().getTime();
        this.disPrev= this.startX;
        this.disTime=this.disX=null;
        this.moveX=this.nowTime=null;
        this.initX=parseInt(this.iUl.style.transform.replace(this.re,($0,$1,$2,$3)=>parseFloat($2)));
        this.maxTrans=this.offsetWidth-this.iUl.offsetWidth;  
        this.iUl.style.transition='none';
     }.bind(el),false);
     el.iUl.addEventListener("touchmove",function(ev){
        this.moveX=ev.changedTouches[0].clientX;
        let target=this.moveX-this.startX+this.initX;
        if(target>0){    //超出橡皮筋
           target=target*0.1;
        }else if(target<this.maxTrans){    //超出橡皮筋
          target=this.maxTrans+(this.moveX-this.startX)*0.1;
        }
        this.iUl.style.transform="translateX("+target+"px) translateZ(0px)";
        this.disX=this.moveX-this.disPrev;                           //获取路程差
        this.disPrev=this.moveX; 
        this.nowTime=new Date().getTime();
        this.disTime=this.nowTime-this.disPrevTime;
        this.disPrevTime=this.nowTime;
     }.bind(el),false);
     el.iUl.addEventListener("touchend",function(ev){
       this.endTime=new Date().getTime();
       let iSpeed=this.disX/this.disTime;
       if(this.disTime==0){   //说明你没有滑动
         iSpeed=0;
       }else if((this.endTime-this.nowTime)>300){                         //判断你是否长时间手指停留在元素上并没有继续滑动
         iSpeed=0;
       }
      let nowX=parseInt(this.iUl.style.transform.replace(this.re,($0,$1,$2,$3)=>parseFloat($2)));
      let target=iSpeed*20+nowX;      
      let Bessel="cubic-bezier(.1,.69,.1,1)";
      let Time=this.disTime*8;
      Time=Time<50?50:Time;
      if(target>0){
          target=0;
          Bessel="cubic-bezier(0, 0.76, 0.44, 2.15)";
      }else if(target<this.maxTrans){
          target=this.maxTrans;
          Bessel="cubic-bezier(0, 0.76, 0.44, 2.15)";
      }
      this.iUl.style.transition="transform " +Time+"ms "+Bessel;
      this.iUl.style.transform="translateX("+target+"px) translateZ(0px)";
     }.bind(el),false);
      
    },
    bind(el,binding,node){
        el.iUl=el.querySelector("ul");
        el.re=/([a-zA-Z]*\()(.*)(\))/;
        el.getWidthFn=function(){     //获取iUl总宽度函数
          this.aLi=Array.from(this.iUl.querySelectorAll("li"));
          this.iWidth=this.aLi.reduce((prev,now,index)=>{
                return prev+now.offsetWidth;
          },5);
          if(this.iWidth>this.offsetWidth){
            this.iUl.style.width=this.iWidth+'px';
          }else{
            this.iUl.style.width=this.offsetWidth+'px';
          }
          this.iUl.style.transform="translateX(0px) translateZ(0px)";
          this.maxTrans=this.offsetWidth-this.iUl.offsetWidth;   //算出最大上拉值
        }.bind(el);
        window.addEventListener("resize",el.getWidthFn,false);
    },
    componentUpdated(el,binding){
      if(binding.value!=binding.oldValue) el.getWidthFn();
    },
    unbind(el,binding,node){
      window.removeEventListener("resize",el.getWidthFn,false);    
    }
  });
//全局mixin
Vue.mixin({
 methods:{
    PlaySongs(music,playlist,ev){
        if(music){
            this.$store.commit("setNowList",{
              show:true,           //显不显示出来
              source:music.data.strMediaMid,          //播放源
              currentPlay:{       //当前播放歌曲
                songid:music.data.songid,
                title:music.data.songname,
                author:music.data.singer,
                src:music.data.albummid,
              },     
              playlist,            //当前播放列表
              isPlay:true           //是不是在播放
          },playlist);
        }else{
            this.$store.commit("setNowList",{
              show:false,           //显不显示出来
              source:null,          //播放源
              currentPlay:{
                  songid:"",
                  title:'',
                  author:[],
                  src:''
              },     //当前播放歌曲
              playlist:[],            //当前播放列表
              isPlay:false           //是不是在播放
          },[]);
      }
    },
    maps(defaults,name='name',inco="-"){    //循环出歌手名称
          if(!Array.isArray(defaults)) return
          if(!defaults.length) return ""
          if(defaults.length==1){
              return defaults[0][name]
          }else{
              let str=defaults.reduce((prev,now,index)=>{
                  if(index==1){
                      return prev[name]+inco+now[name]
                  }else{
                      return prev+inco+now[name]
                  }
              })
              return str
        }    
    },
  }
});
/* eslint-disable no-new */
new Vue({
  router,
  store,
  components: { App },
  template: '<App/>'
}).$mount("#app")
