<template>
    <div class="Page_doesn" :style="style">
        <h1>404,抱歉当前页面不存在</h1>
        <div class="timeScroll">
            {{time}}秒后跳转首页!!!
        </div>
    </div>
</template>

<script>
import {getStorage,setStorage} from "@/assets/js/common.js";
export default {
    name:'Page_doesn',
    data(){
        return {
            style:{},
            time:5
        }
    },
    beforeCreate(){
        this.$store.commit("setFooter",false);
    },
    created(){
        this.$store.commit("setHidden",false);
    },
    mounted(){
        this.style={
            height:this.$root.$el.offsetHeight+'px'
        };
        this.timer=setInterval(res=>{
            this.time--;
            if(this.time==0){
                clearInterval(this.timer);
                setStorage("nowIndex",0);
                this.$store.commit("setFooter",true);
                this.$router.replace("/index");
            }
        },1000);
    }
}
</script>

<style lang="less" scoped>
@rem:75rem;
.Page_doesn{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    perspective: 800px;
    perspective-origin: center top;
    h1{
        font-size:46/@rem;
        color: #ccc
    }
    .timeScroll{
        font-size: 36/@rem;
        color: #ccc
    //    width:150/@rem;
    //    height:420/@rem;
    //    position: relative;
    //    transform-style:preserve-3d;
    //    transform-origin:center center 0px;
    //    transform: rotateY(80deg) translateX(120px);
    //    div{
    //        position: absolute;
    //         top: 0%;
    //         left: 0%;
    //         right: 0%;
    //         bottom: 0%;
    //         transform-origin:center top;
    //         background: rgba(0,0,0,0.4);
    //         transform-style:preserve-3d;
    //    }
    //    >div{
    //        transform: rotateX(0deg);
    //         >div{
    //             transform: rotateX(-90deg);
    //             >div{
    //                 transform-origin:center bottom;
    //                 transform: rotateX(-90deg);
    //                 >div{
    //                     transform-origin:center top;
    //                     transform: rotateX(-90deg)
    //                 }
    //             }
    //         }
    //    }
    }
}
</style>
