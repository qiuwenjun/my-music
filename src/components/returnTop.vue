<template>
    <div class="returnTop" :style="{opacity:tween}">
         <ul>
           <li class="iconfont icon-fanhuidingbu" @click="returnTop"></li>
         </ul>
    </div>
</template>

<script>
    export default {
       data(){
           return{
               tween:0
           }
       },
       computed:{
           message(){
               return this.$store.state
           }
       },
       methods:{
           returnTop(){
               this.flag=false;
               let iTop=this.$root.$el.scrollTop;
                setTimeout(res=>{
                    if(this.flag)return 
                    let iSpeed=Math.floor((0-iTop)/8);
                    this.$root.$el.scrollTop=iSpeed+iTop;
                    if(iTop==0)return
                    setTimeout(res=>{
                        this.returnTop();
                    },30);
                },0);
           },
       },
       mounted(){
           this.$root.$el.addEventListener("scroll",res=>{
                this.flag=true;
                if(this.$root.$el.scrollTop<=document.documentElement.clientHeight/2){
                     this.tween=0;
                }else{
                     this.tween=1;
                }
           },false); 
       }
    }
</script>

<style lang="less" scoped>
    @rem:75rem;
    .returnTop{
        position: fixed;
        right: 5%;
        bottom: 5%;
        transition:opacity 0.8s;
        ul{
            display: flex;
            flex-direction:column;
            justify-content: space-between;
            li{
                font-size: 66/@rem;
                color: rgb(54, 197, 223)
            }
        }
    }
</style>