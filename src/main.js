// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './vuex';
import Mint from 'mint-ui';
import './assets/css/empty.css';
import './assets/js/index.min.js';
Vue.use(Mint)

Vue.config.productionTip = false

Vue.component("swiper",{
   props:{
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
              imgurl:"https://qnwww2.autoimg.cn/newsdfs/g1/M0B/36/48/autohomecar__ChcCQ1sEvt2Aer-sAAqRNlgTkm4754.jpg?imageView2/1/w/720/h/360/format/webp"
            },
            {
              imgurl:"https://qnwww2.autoimg.cn/newsdfs/g3/M00/2E/C3/autohomecar__wKgHGlsD8BeAYPGAAAjjDoRgd1c667.jpg?imageView2/1/w/720/h/360/format/webp"
           },
           {
              imgurl:"https://qnwww2.autoimg.cn/newsdfs/g1/M01/2B/52/autohomecar__wKgHFVsDrgGAEUsNAAOIK29mcW0000.jpg?imageView2/1/w/720/h/360/format/webp"
           },
           {
              imgurl:"https://qnwww2.autoimg.cn/newsdfs/g1/M0A/16/D1/autohomecar__wKgHGFsBfeaAS5pAAAcBZmLEopg287.jpg?imageView2/1/w/720/h/360/format/webp"
           },
           {
              imgurl:"https://qnwww2.autoimg.cn/newsdfs/g24/M02/F6/D5/autohomecar__wKgHH1r-eO6Ae6giAAp5BE_FEto548.jpg?imageView2/1/w/720/h/360/format/webp"
           },
         ]
        }
      } 
  },
   data(){
     let Index=this.Parentindex;
     if(Index<=0){
        Index=1;
     }else if(Index>=this.bannerList.length){
        Index=this.bannerList.length
     }
     return {
        width:0,
        index:Index,
        pagationIndex:--Index,
        active:"none",
        stopFlag:false,
        OuterTime:null,
        InterTime:null
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
           ev.currentTarget.addEventListener("transitionend",this.ends.bind(this,ev.currentTarget),false);
       }else{
           ev.currentTarget.style.transform=`translateX(${this.width*this.index}px)`
       }
       this.OuterTime=setTimeout(res=>{
         this.time();
       },3000);
     },
     ends(This){
         this.stopFlag=false;
         this.removeEvent(This,'transitionend',this.ends);
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
              this.$el.querySelector(".zhi").style.transition=`transform 0.8s cubic-bezier(0.55, 0.055, 0.675, 0.19)`;
              this.$el.querySelector(".zhi").addEventListener("transitionend",this.ends.bind(this,this.$el.querySelector(".zhi")),false);
             this.index++;
             this.pagationIndex=this.index-1>=this.bannerList.length?this.index-1-this.bannerList.length:this.index-1;
         }, 5000);
     }
   },
   mounted(){
      window.addEventListener("resize",this.resize,false);
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
   template:`
      <div class="classList">
        <div class="classBanner">
              <ul class="zhi" @touchstart="start" @touchmove="move" @touchend="end" :style="{width:Math.abs(dataList.length*width)+'px',transform:'translateX('+(index*width)+'px)',transition:active}">
                  <li :style="{width:Math.abs(width)+'px'}" v-for="item,index in dataList"><img :alt="item.title" :src="item.imgurl" width="100%" height="100%" :title="item.title"></li>
              </ul>
        </div>
        <dl>
            <dd :class="pagationIndex==i?'active':''" @touchend="pagation(i)" v-for="item,i in bannerList"></dd>
        </dl>
      </div>
   `
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
