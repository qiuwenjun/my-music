<template>
    <div class="search_more" :style="{height}">
        <div class="search_more_header">
            <div>
                <input type="text" @keyup="searchRequest('',$event)" @focus="getFocus" v-model="search" placeholder="搜索歌曲、歌单、专辑">
                <span class="cha" v-show="search" @click="removeSearch"></span>
                <div :style="{display:isSearch?'flex':'none'}" @click="loseFocus(),removeSearch()">取消</div>
            </div>
        </div>
        <div class="search_more_body">
                <!--显示获取焦点后的状态 -->
                <div class="searchPage"  v-if="isSearch">     
                        <!--历史记录-->
                        <div class="historical_record" v-if="flag" v-show="history.length">
                            <ul>
                                <li v-for="item,index in history" @click="searchRequest(item,$event)">
                                    <span></span>
                                    <span>{{item}}</span>
                                    <span @click.stop="removeStorage(index)"></span>
                                </li>
                            </ul>
                            <p @click="removeStorage([])">清空历史记录</p>
                        </div>
                        <!--查询结果--> 
                        <div class="query_results" v-else>
                                <!--有数据的情况-->
                                <div class="yResultsOf" v-if="getResultsOf.length">
                                    <ul>
                                        <li v-for="item,index in getResultsOf" @click="getDetail(item,index)">
                                             <div v-if="item.type">
                                                <i class="inco"  :style="{borderRadius:'50%',background:'url('+item.Pic+') no-repeat center center',backgroundSize:'100% 100%'}"></i>
                                                <div class="detaile">
                                                    <h3>{{item.singerName}}</h3>
                                                    <span>单曲:{{item.songNum}}     专辑:{{item.albumNum}}</span>
                                                </div>
                                           </div>
                                           <div v-else>
                                                <i class="inco"></i>
                                                <div class="detaile">
                                                    <h3>{{item.title}}</h3>
                                                    <span>{{maps(item.singer,undefined,'/')}}</span>
                                                </div>
                                           </div>
                                        </li>
                                    </ul>
                                    <p v-show="!drop">
                                        <img v-if="allPage>=page" src="../../assets/img/icon_loading.png">
                                        <span v-if="allPage>=page"> 正在载入更多...</span>
                                        <span v-if="allPage<page">没有更多相关数据了</span>
                                    </p>
                                </div>
                                <!--没有数据的情况-->
                                <div class="nResultsOf" v-else>
                                        <img src="../../assets/img/search_null.png">
                                        <p>很抱歉，没有找到与“{{search}}”相关的结果。</p>
                                </div>
                        </div>
                </div>
                <!--获取焦点前的状态 -->
                <div class="hotSearch" v-else>
                      <h2>热门搜索</h2>
                      <div class="hotSearch_list">
                            <a :href="item.link?item.link:'javascript:;'" @click="item.link?'':searchRequest(item.k,$event),getFocus()" v-for="item,index in hotSearch" :class="item.link?'active':''">{{item.k}}</a>
                      </div>
                </div>
        </div>
    </div>
</template>

<script>
import {getStorage,setStorage} from "@/assets/js/common.js";
import {mapActions,mapMutations} from "vuex";
import {Toast} from "mint-ui";
export default {
    name:'search',
    data(){
        return {
            search:'',                 //查询字符串
            isSearch:false,        //是否获取到焦点
            history:[],               //历史记录
            timer:null,             //倒计时定时器
            flag:true,               //判断是否查询结束
            allPage:-1,              //总页数
            page:-1,                 //页数
            n:20,                     //一次请求多少条数据       
            drop:true,             //判断是否要开始下拉加载了
            height:'auto',         //设置该组件的高度
       }
    },
    computed:{
        getResultsOf(){
            if(this.$store.state.searchList.length){
                this.$nextTick(res=>{
                    this.dropDown();
                    this.resizeHeight();
                });
            }
            return this.$store.state.searchList
        },
        hotSearch(){
            let arr=this.$store.state.hotSearch.arr;
            let numArr=[19,15,17,9,28,4];
            let newArr;
            newArr=numArr.map(res=>{
                return arr[res];
            }).filter(res=>{
                return res?true:false
            });
            newArr.unshift({
                k:this.$store.state.hotSearch.special_key,
                link:this.$store.state.hotSearch.special_url
            })
            return newArr
        }
    },
    methods:{
        getHistory(){
            let history=getStorage("historyRecord");
            this.history=history?history.split(',').filter(res=>res):[];
        },
        removeStorage(index){               //删除历史记录
            if(index instanceof Array){
                setStorage("historyRecord","");
                this.history=index;
            }else{
                let arr=this.history.filter((res,i)=>i!=index);
                setStorage("historyRecord",arr.join(','));
                this.history=arr;
            }
        },
        setHistory(){
            let Index=this.history.findIndex(res=>res==this.search);
            if(Index==-1){
                this.history.unshift(this.search);
                setStorage("historyRecord",this.history.join(","));
            }else{
                let str=this.history.splice(Index,1);
                this.history.unshift(str[0]);
                 setStorage("historyRecord",this.history.join(","));
            }
            this.getHistory();
        },
        ...mapActions({
            getSearch(dispatch,data,flag){
                return dispatch("getSearch",{
                    el:this,
                    ...data
                }).then(res=>{
                    console.log(res)
                        if(res.status==200){
                            let re=/(\w+)\((.+)\)/;
                            let json={flag}
                            let data=JSON.parse(res.data.replace(re,($0,$1,$2)=>$2));
                            json.data=data.data.song.list;
                            if(!flag){          //说明你是重新查询请求
                                this.allPage=Math.ceil(data.data.song.totalnum/this.n);
                                if(data.data.zhida.type){
                                    if(data.data.zhida.type==1){                   //歌手
                                        json.data.unshift({
                                            type:1,
                                            singerName:data.data.zhida.zhida_singer.singerName,
                                            Pic:data.data.zhida.zhida_singer.singerPic,
                                            albumNum:data.data.zhida.zhida_singer.albumNum,
                                            songNum:data.data.zhida.zhida_singer.songNum,
                                            mvNum:data.data.zhida.zhida_singer.mvNum,
                                            singerID:data.data.zhida.zhida_singer.singerID,
                                        })
                                    }
                                }
                            }
                            this.flag=false;
                            json.el=this;
                            this.setSearch(json)
                            return Promise.resolve();
                        }else{
                            return Promise.reject();
                        }
                });
            },
            gethotSearch(dispatch){
                return dispatch("gethotSearch",{
                    "_":new Date().getTime()
                }).then(res=>{
                    if(res.status==200){
                        let arr=res.data.data.hotkey;
                        let special={
                            special_key:res.data.data.special_key,
                            special_url:res.data.data.special_url
                        }
                        this.sethotSearch(Object.assign({arr},special))
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
                            if(data&&data.length){
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
                                return Promise.resolve({
                                    songId:SongId.join(",")
                                });
                            }else{
                                Toast("当前专辑没有歌曲!!!");
                                return Promise.reject();
                            }
                        }else{
                            return Promise.reject();
                        }
                    })
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
                                    songId:SongId.join(","),
                                    singerid:config.singerid
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
            sethotSearch(commit,data){
                commit("sethotSearch",data);
            },
            setSearch(commit,data){
                commit("setSearch",data);
            },
            setPlaylist(commit,data){
                commit("setPlaylist",data);
            }
        }),
        getFocus(){                                //准备查询
            this.isSearch=true;
            this.$nextTick(res=>{
                this.resizeHeight();
            });
        },
        loseFocus(){                               //取消查询
            this.isSearch=false;
        }, 
        removeSearch(){                         //删除查询值
            this.search="";
            if(this.source&&this.source.qqSearch)  this.source.qqSearch.cancel("操作被用户取消");
            this.setSearch({
                flag:false,
                data:[]
            });
            this.flag=true;
        },
        resquest(){
            this.getSearch({
                w:this.search,
                p:this.page,
                n:this.n
            }).then(res=>{
               this.setHistory();
            },res=>{
               this.setHistory();
            })
        },
        searchRequest(text,ev){             //开始查询
            ev=ev||window.event;
            if(ev.type==="click"){         //历史查询
                this.search=text;
            }
            // this.search=this.search.replace(/\s/g,'');
            this.page=1;         //初始化查询页数归1
             this.drop=true;
            if(this.source&&this.source.qqSearch)  this.source.qqSearch.cancel("操作被用户取消");
            if(ev.type==='keyup'){          //输入查询
                clearTimeout(this.timer);
                if(ev.keyCode==13){
                    this.resquest();
                }else{
                    this.timer=setTimeout(res=>{
                         if(!this.search){
                            this.removeSearch();
                            return
                        }
                        this.resquest();
                    },1000);
                }
            }else{                                    //历史查询
               this.resquest();
            }
        },
        resizeHeight(){                //计算高度
            this.height="auto";
             this.$nextTick(res=>{
               let iHeight=this.$root.$el.clientHeight;
                let searchMore=this.$el.offsetHeight;
                let iHeader=this.$parent.$el.querySelector(".menu-list").offsetHeight;
                let iFooter=this.$root.$el.querySelector("#footer").offsetHeight;
                if((searchMore+iFooter+iHeader)<=iHeight){
                this.height=iHeight-iFooter-iHeader+'px';
                }
            });
        },
        dropDown(){                 //下拉加载
            let scrollTop=this.$root.$el.scrollTop;
            let ClientHeight=document.documentElement.clientHeight;
            let offsetHeight=this.$parent.$el.offsetHeight;
            let scroll=(offsetHeight-ClientHeight)<0?0:offsetHeight-ClientHeight;
           if(scroll<=scrollTop&&this.drop){
               this.drop=false;
               this.page++;
               if(this.allPage>=this.page){
                    this.getSearch({
                        w:this.search,
                        p:this.page,
                        n:this.n
                    },true).then(res=>{
                        this.drop=true;
                    },res=>{
                        this.drop=true;
                    })
               }
           }
        },
        getDetail(item,index){        //跳转详情
            if(!item.type){    //获取单曲
                let arr=[item.id];
                setStorage("playList",JSON.stringify({
                    songid:item.id,
                    name:item.title,
                    singer:item.singer,
                    vid:item.mv.vid,
                    songmid:item.file.media_mid,
                }));
                this.setPlaylist(arr);
                this.$router.push({
                    path:'/playsong',
                    query:{
                        songId:arr.join("")
                    }
                });
            }else{          //获取专辑
                if(this.source&&this.source["qqAlbum"])  this.source["qqAlbum"].cancel("操作被用户取消");
                this.getSingerDetail({
                    singerid:item.singerID,
                    begin:0,
                    num:15
                }).then(query=>{
                    this.$router.push({path:'/playsong',query});
                    console.log("获取专辑成功")
                },reject=>{
                    console.log(reject)
                })
            }
        }
    },
    updated(){
    },
    activated(){       
        this.resizeHeight();   
        this.$root.$el.addEventListener('scroll',this.dropDown,false);
    },
    deactivated(){
        this.$root.$el.removeEventListener('scroll',this.dropDown,false)
    },
    created(){
        Promise.all([this.gethotSearch()]).then(res=>{
             this.$store.commit("setHidden",false);
        },res=>{
             this.$store.commit("setHidden",false);
        })
    },
    mounted(){
        this.getHistory();       //历史记录
        this.resizeHeight();    //设置高度
    }
}
</script>

<style lang="less" scoped>
@rem:75rem;
.search_more{
    .search_more_header{
        padding: 20/@rem;
        background:#f4f4f4;
        >div{
            position: relative;            
            padding: 15/@rem;
            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJlSURBVFhH7ZfRShRRHMb3Jkqzm7wJSrqIIDBxX6C0a62H6C7oqq4ixYreQMmMHkXbjLQeIYgyQuqiyIuotKDt923fyLCszv/MzF5EDnzs2T3/7zffOXNm5myjcXDUOAOtVquJ7qOn6AP6ZamtQ33NGk/ZG8VJJtEaagf1XJ7agwEdRI9zIT7RnkdT6Iz7VaO2flPf51z9I9oDtQQDNIxeGv6Nz9voaBFcNa79bu8LsYp8+/Z75FmYN3w/nwqUB204lFiDqYzd+txlek37RFkQ3pNIjDZaKsXBeMkATfloKUjOBGMMifUbXUzmYVp3oFvJ5j0M8GbNXEtiYtJzRtOru6lwAUfhsIZQdveNR30NTPccaD5sChbCXTD7btDSUCAdmqGpsClYCHPa7CdBSyeQXgEKNBI2BQthnjX7Y9DSCfTTpkNhU7AQ7jGzd4KWvgc67EDbKYH6eclOO9BmSqBsUU+HTcFCwJcdaCVo6Vyy7LZfCJuChbAfONCdoKUTKHsw6iE2FDYWFIqFthxoLImLSZsr3fqzScZ9isUyczWZiXEC6UWoF2LaaHqcDcY4+mHmheRAMmBe8oje8nmqFOQvZwS9N2uxLEcgbUuzDdpGmZnyzLxzGG3yqm1lARxH2VZEUz6DChc6NXoia83I087pRukZyozAjqCHvv6Cf0GL6Ao655MrgNr6TX1bDqF1qO/Xcv7qobymJoA+6xpxfvTd7VVqdxcw7au1h3IwbUfn0DJ6hb6ibbSJVtzX8w9B30JVWQf/QqibVQZYm7drpg5C7TmzuZnSI6JZ2yWoAnKo61UY/5f3Dy7dC4CdAEhQAAAAAElFTkSuQmCC) no-repeat 20/@rem center,#fff;
            background-size: 46/@rem 46/@rem;
            font-size: 26/@rem;
            input{
                outline: none;
                border: none;
                width: 80%;
            }
            .cha{
                position: absolute;
                right:12%;
                top: 50%;
                transform: translateY(-50%);
                width: 50/@rem;
                height:50/@rem;
                background: #ccc;
                border-radius: 50%;
                &::before{
                    content: "";
                    position: absolute;
                    width: 3/@rem;
                    height: 30/@rem;
                    left: 30%;
                    top: 50%;
                    transform:rotateZ(35deg) translateX(-50%) translateY(-55%);
                    display: block;
                    background: #fff
                }
                &::after{
                    content: "";
                    position: absolute;
                    width: 3/@rem;
                    height: 30/@rem;
                    left: 65%;
                    top: 46%;
                    transform:rotateZ(-35deg) translateX(-50%) translateY(-55%);
                    display: block;
                    background: #fff
                }
            }
             div{
                position:absolute;
                right: 0%;
                display: flex;
                justify-content: center;
                align-items: center;
                top: 0%;
                background: #f4f4f4;
                width: 12%;
                height: 100%
            }
        }
    }
    .search_more_body{
        .searchPage{
            .historical_record{
                ul{
                    li:last-child{border: none}
                    li{
                        padding: 25/@rem 30/@rem;
                        border-bottom: 1px solid #ccc;
                        position: relative;
                        span{display: block}
                        span:first-child{
                            width: 50/@rem;
                            height: 50/@rem;
                            background: url(../../assets/img/clock_ic.png) no-repeat center center;
                            background-size: 50/@rem 50/@rem; 
                            float: left;
                        }
                        span:nth-child(2){
                            font-size: 36/@rem;
                            color: #777;
                            margin-left: 100/@rem;
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: nowrap;
                            text-align: left
                        }
                        span:last-child{
                            position: absolute;
                            right: 5%;
                            top: 50%;
                            height: 40%;
                            transform: translateY(-50%);
                            &::before{
                                display: block;
                                content: "";
                                width: 3/@rem;
                                height: 100%;
                                background: #777;
                                position: absolute;
                                left: 0%;
                                top: 0%;
                                transform: rotateZ(-45deg)
                            }
                            &::after{
                                display: block;
                                content: "";
                                width: 3/@rem;
                                height: 100%;
                                background: #777;
                                position: absolute;
                                 left: 0%;
                                 top: 0%;
                                 transform: rotateZ(45deg)
                            }
                        }
                    }
                }
                p{
                    font-size: 36/@rem;
                    color: #2196F3;
                }
            }
            .query_results{
                .yResultsOf{
                    ul{
                        li{
                            padding: 20/@rem 25/@rem;
                            border-bottom: 1px solid #ccc;
                            >div{
                                 display: flex;
                            }
                            i{
                                width: 80/@rem;
                                height: 80/@rem;
                                background:url(../../assets/img/search_sprite.png) no-repeat center 25/@rem;
                                background-size: 50/@rem 80/@rem;
                                overflow: hidden
                            }
                            .detaile{
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                margin-left: 25/@rem;
                                width: 595/@rem;
                                text-align: left;
                                h3{
                                    overflow: hidden;
                                    text-overflow:ellipsis;
                                    white-space: nowrap;
                                    font-size: 36/@rem;
                                    color: #000;
                                }
                                span{
                                    overflow: hidden;
                                    text-overflow:ellipsis;
                                    white-space: nowrap;
                                    font-size: 26/@rem;
                                    margin-top: 10/@rem;
                                    color: #808080
                                }
                            }
                        }
                    }
                    p{
                        font-size: 36/@rem;
                        color: #808080;
                        justify-content: center;
                        display: flex;
                        padding: 25/@rem 0;
                        img{
                            width: 50/@rem;
                            height: 50/@rem;
                            animation: rotateZ 0.8s linear infinite;
                            margin-right: 15/@rem;
                        }
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
                .nResultsOf{
                    img{
                        width: 50%;
                        margin: 120/@rem auto;
                    }
                    p{
                        padding: 0 20/@rem;
                        font-size: 36/@rem;
                        text-align: center;
                        color: #777;
                    }
                }
            }
        }
        .hotSearch{
            padding: 30/@rem;
            h2{
                text-align: left;
                font-size: 36/@rem;
                font-weight: bolder;
                color: #777
            }
            .hotSearch_list{
                display: flex;
                flex-flow: wrap;
                justify-content:flex-start;
                a{
                    border-radius: 50/@rem;
                    padding: 10/@rem 20/@rem;
                    font-size: 36/@rem;
                    border:1px solid #777;
                    margin: 12/@rem 10/@rem;
                    color: #777;
                    display: block
                }
                a.active{
                    border:1px solid #f00;
                    color: #f00
                }
            }
        }
    }
}
</style>
