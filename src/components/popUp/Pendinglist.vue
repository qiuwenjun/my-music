<template>
        <div class="playList" :class="isClose?'show':''" @click="iFcloseFn">
              <div class="playList_main" >
                <header class="pending_head">
                        <h4>播放列表<span>( {{nowSong.playlist.length}}首 )</span></h4>
                </header>
                <section class="pending_main" @scroll="scrollTop">
                    <ul class="mainlist">
                            <li v-for="item,i in nowSong.playlist" @click="playSong(i,item.songid==nowSongId)">
                                <i :class="item.songid==nowSongId?nowSong.isPlay?'play':'stop':''"></i>
                                <div>
                                    <h3>{{item.name}}</h3>
                                    <span>{{maps(item.singer)}}</span>
                                </div>
                                <a @click.stop v-if="item.vid" :href="'https://y.qq.com/n/yqq/mv/v/'+item.vid
    +'.html'" class="playVideo iconfont icon-bofang"></a>
                                <a class="iconfont icon-icon" download @click.stop :href="'http://ws.stream.qqmusic.qq.com/C100'+item.songmid+'.m4a?fromtag=0&guid=126548448'"></a>
                            </li>
                    </ul>
                    <div v-show="isDropRequest" class="loding">
                        <p v-if="noData"><img src="../../assets/img/icon_loading.png">正在加载</p>
                        <p v-else>拉到底啦!!!</p>
                    </div>
                </section>
                <footer class="pending_footer">
                    <span class="pending_footer_close">关闭</span>
                </footer>
              </div>
        </div>
</template>

<script>
//待播放列表组件
    export default {
        name:"playList",
        props:{
            isClose:{
                type:Boolean,
                default(){
                    return false;
                }
            },
            nowSong:{
                type:Object,
                default(){
                    return {}
                }
            },
            nowSongId:{
                type:[Number,String],
                default(){
                    return 0
                }
            },
            isDown:{
                type:Boolean,
                default(){
                    return false;
                }
            },
            isRequestSuccess:{
                type:Boolean,
                default(){
                    return true
                }
            },
            noData:{
                type:Boolean,
                default(){
                    return true;
                }
            }
        },
        data(){
           return{
                isDropRequest:false,
                time:null,
           }
        },
        watch:{
            isDown(){
                if(this.isDown){
                    setTimeout(res=>{
                        this.isDropRequest=false;
                    },3000);
                }
            }
        },
        methods:{
            iFcloseFn(ev){
               this.$emit("changeClose",false);
            },
            playSong(index,flag){
                if(flag){
                    this.$emit("getNowIndex",index,true,true);
                }else{
                    this.$emit("getNowIndex",index,true);
                }
            },
            scrollTop(ev){
                ev=ev||window.event;
                let This=ev.currentTarget;
                let scrollTop=This.scrollTop;
                let iHeight=This.offsetHeight;
                let iUl=This.children[0];
                if(this.isDown&&(scrollTop+iHeight)>=iUl.offsetHeight-5&&this.noData){
                    this.isDropRequest=true;
                    this.$emit("Allowed_Request",undefined,false);
                }
            }
        },
        updated(){
            console.log(1)
        }
    }
</script>

<style lang="less" scoped>
@rem:75rem;
.playList{
    padding: 15/@rem 0  0;
    position: fixed;
    bottom: 0%;
    left: 0%;
    right: 0%;
    top: 0%;
    transition: 0.8s ease-in-out transform;
    transform: translateY(100%);
    z-index: 999;
    &.show{
        transform: translateY(0%);
        .playList_main{
            bottom: 0rem;
        }
    }
    .playList_main{
        z-index: 9;
        position: absolute;
        height: 8rem;
        bottom: -8rem;
        left: 0%;
        right: 0%;
        background: #fff;
        transition: 0.8s ease-in-out bottom;
    }
    .pending_head{
        border-bottom:2px solid rgba(189, 188, 188, 0.2);
        padding: 15/@rem 30/@rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 0.6rem;
        h4{
            font-size:30/@rem;
            position: relative;
            height: 100%;
            &:after{
                display: block;
                content: "";
                position: absolute;
                bottom: -44%;
                width: 60%;
                left: 0%;
                height: 2px;
                background: dodgerblue
            }
            span{
                font-size: 20/@rem;
                margin: 0 5px;
            }
        }
    }
    .pending_main{
        height:5.6rem;
        padding: 0 30/@rem;
        overflow-y: auto;
        ul{
            li{
                padding: 16/@rem 0;
                border-bottom: 2px solid rgba(189,188,188,0.2);
                position:relative;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                i{
                    display: none;
                    width: 30/@rem;
                    height: 30/@rem;
                    margin-right: 30/@rem;
                    &.play{
                        background: url(../../assets/img/play-state-aa7.gif) no-repeat center center;
                        background-size: 30/@rem 30/@rem;
                        display: block;
                    }
                    &.stop{
                        background: url(../../assets/img/ui-list-912.png) no-repeat -228/@rem -340/@rem;
                        background-size: 486/@rem 401/@rem;
                        display: block;
                    }
                }
                div{
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: flex-start;
                    width: 540/@rem;
                    h3{
                        font-size: 36/@rem;
                        color: #000;
                        text-align: left;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                        width: 100%
                    }
                    span{
                        color: #999;
                        font-size: 30/@rem;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                        width: 100%;
                        text-align: left
                    }
                }
                .playVideo,a{
                    position: absolute;
                    display: block;
                    top: 50%;
                    color: #000;
                    transform: translateY(-50%);
                }
                .playVideo{right: 10%}
                a{ right: 0%; }
            }
        }
        .loding{
            font-size: 30/@rem;
            color: #000;
            padding: 20/@rem 0;
            p{
                display: flex;
                justify-content: center;
                align-items: center;
                img{
                    width: 50/@rem;
                    height: 50/@rem;
                    margin-right: 10/@rem;
                    animation: loding 1s linear infinite both;
                }
            }
           
        }
    }
    @keyframes loding{
        0%{
            transform: rotateZ(0deg)
        }
        100%{
            transform: rotateZ(360deg)
        }
    }
    .pending_footer{
        height:0.8rem;
        border-top: 2px solid rgba(189, 188, 188, 0.2);
        padding: 20/@rem 30/@rem;
        font-size: 40/@rem;
        line-height: 0.8rem;
        color:#000;
    }
}
</style>
