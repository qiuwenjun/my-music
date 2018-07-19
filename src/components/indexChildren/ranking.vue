<template>
    <div class="ranking">
         <header class="ranking_header">
               <ul>
                    <li v-for="value,key in ranking.show">
                        <h2>{{classify[key]}}</h2>
                        <div v-scroll="update" :data-name="key" class="ranking_header_scroll" >
                                <ul class="scroll_body">
                                    <li v-for="item,index of  value" @click="Choice(key,item.id)" :data-id="item.id" :style="activeId[key]==item.id?style:''">{{item.name}}</li>
                                </ul>
                        </div>
                    </li>
               </ul>
               <div class="more" :class="isClose?'active':''" @click="changeClose"></div>
         </header>
         <div class="ranking_main" :style="{height}">
             <div class="showData">
                <div class="ranking_main_header">
                    <dl>
                        <dt>{{ranking.show.area | nowActive(activeId)}}</dt>
                        <dd  @click="Choice('sort',5)" :class="activeId.sort==5?'active':''">最热</dd>
                        <dd  @click="Choice('sort',2)" :class="activeId.sort==2?'active':''">最新</dd>
                    </dl>
                </div>
                <ul  v-if="musicList.length">
                    <li v-for="item of musicList" :id="item.album_id" @click="playMusic(item)">
                        <div><img :src="item.flag?'https://y.gtimg.cn/music/photo_new/T002R300x300M000'+item.album_mid+'.jpg?max_age=2592000':'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHUAAABcCAMAAABneQpwAAAAPFBMVEX////e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7////39/fv7+/m5ube3t7m7ZQJAAAAD3RSTlMAESIzRFVmd4iZqrvM3e5GKvWZAAAChElEQVR42u3a23qbMAwAYEMoS9KEWNL7v+v2LRxsJMtefcjF7Lu2VD9GWFYgxmhjojrDdPX/VbHcSFfxVW5gV7va1Urq/Al1WD6gDk9qro63rVa3Uw+zneqardTp7u+GXIX3PyMUU6fv8x58VsH5GxRRPROtpCJlXH5JnZ9+PEll7UimejZFFSmWgH9SuSmpIPRekKEuQhiuii1fhnoVTp2pIKrwc3UQIjAVRRUz7qYbv1pMDXTVGerIz7uBau4sQgt1YoltoZrvc4gm6hxdOeXv4b1StFyvR3cGr+K1Cf58iISAej9fsEJ1GI4wXP21hbFh9Qd7jnWPY+qFxymxvwJp6rDwQAV6CSRVfS9W37HZfROSql7XjKI7WZvbIwKp6l4NrTsFm9kPA6nqO6nO74uolnT1cUQHZ7KZKurq1V2mzm2cpyKp6pdXG+D4KUu1pKrj4q8BtR92olqrqqSrD3FjUdV16WhrB3WVd2n7QQEVEoqTJVWd/YLvLR5RtZiy55CqXpZQhQdZtUm9BOjq17J9ahQma0PNapQlXd0m613krSxy1VJS5wQx1QwPnp91slzFQJcI0amyKnFjZ7yWxcRuLXA7RtT1PnbjB54QKG8QXrFz49WfJXed7ElFRcWk3Pv7K0vu+0CpjYqxQMkqSy4Is8DIaxqQaoiu7o0pnlOICVlNGIF+ePKSi8mXLk81o5dcplId1QxucpGCmS6resm1JxXrqW5yMXR7lVfNZU8ueCpUVc2wPR72VaqrOo/Z2IPMmuq+1bPDq6pHcvfDqYF6JLep6ia3pWrm5ROquTw/oW5bfWPVff/a1dpq/pdRoL/N7+rfrqLY6N8g62pbdbzWGb8BajFcm9Ofks8AAAAASUVORK5CYII='"></div>
                        <h4>{{item.album_name}}</h4>
                        <p @click.stop>{{maps(item.singers,'singer_name')}}</p>   
                        <time>{{item.public_time}}</time>
                    </li>
                </ul>
                <p class="Prompt" v-show="(!scrollFlag)">{{loading}}</p>
             </div>
             <div class="noData"  v-if="!musicList.length">
                <i v-if="isRequest"></i>
                <h2 v-else>暂未查询到相关数据!!!</h2>   
             </div>
         </div>
         <div id="mask" @click="changeClose" :class="isClose?'show':'hide'"></div>
        <!--更多筛选内容-->
        <div class="screening" :class="isClose?'show':''">
              <h2>选择分类标签</h2>
              <div class="screening-list">
                  <ul>
                        <li v-for='values,keys in ranking.hide'>
                            <h3>{{classify[keys]}}( <span>{{values.length}}</span> )</h3>
                           <dl v-if="keys==='company'">
                               <dd v-for="item,index in filterCompany" :style="activeId[keys]==item.id?style:''" @click="Choice(keys,item.id),changeClose()">{{item.name}}</dd>
                           </dl>
                            <dl v-else>
                               <dd v-for="item,index in values" :style="activeId[keys]==item.id?style:''" @click="Choice(keys,item.id),changeClose()">{{item.name}}</dd>
                           </dl>
                        </li>
                  </ul>
              </div>
              <div class="close" @click="changeClose">关闭</div>
        </div>
    </div>
</template>

<script>
    import {mapActions,mapMutations} from "vuex";
    import {setStorage,getStorage} from "../../assets/js/common"
    import {Toast} from "mint-ui";
    export default {
         name:"ranking",
         filters:{
             nowActive(defaults,activeId){
                 if(!defaults) return "推荐";
                 return defaults.find(res=>res.id==activeId.area).name
             }
         },
         data(){
            return {
                isClose:false,  //默认不显示更多筛选
                style:{         //选中时候的样式
                        background:" #03A9F4",
                        color: "#fff",
                },
                update:0,    //触发指令更新
                classify:{    //分类名称
                    "area":"地区",
                    "genre":"流派",
                    "type":"类别",
                    "year":"年代",
                    "company":"发行"
                },
                activeId:{   //筛选歌曲对应的下标
                    "area":"1",
                    "company":"-1",
                    "genre":"-1",
                    "type":"-1",
                    "year":"-1",
                    "sort":"2",
                    "get_tags":"1",
                    "sin":"0",
                    "num":"20",
                },
                isRequest:true,    //判断是正在查询数据还是没有一开始就没查询到数据
                scrollFlag:true,    //判断是否正在下拉加载
                loading:'正在加载',    //正在加载显示或者加载到最后显示内容
                allPage:0,            //存储当前数据到底有多少页
                height:'auto'         //算出高度
             }
         },
         computed:{
             ranking(){        //查询菜单
                let json={
                    'show':{},      //直接显示出来的分类项
                    'hide':{}        //需要用户点击才能显示出来的分类项 
                };
                let data=this.$store.state.Classify.category;
                for(let attr in data){
                    if(attr!='company'){
                        if(attr!='year'){
                            json.show[attr]=data[attr];
                        }else{
                             json.hide[attr]=data[attr];
                        }
                    }else{
                        json.hide[attr]=data[attr];
                    }
                }
                this.$nextTick(res=>{
                    if(Object.keys(data).length){
                        this.update=this.update?0:1;
                    }
                });
                 return json
             },
             musicList(){     //查询到的歌曲
                if(this.$store.state.Classify.musicList.length){
                    this.$nextTick(res=>{
                        this.scrolls();
                        this.$nextTick(res=>this.setHeight())
                    });
                }else{
                     this.$nextTick(res=>this.setHeight())
                }
                return this.$store.state.Classify.musicList
             },
             filterCompany(){      //过滤出发行方
                let arr=this.ranking.hide.company;
                let newArr=[];
                for(var i=0;i<arr.length;i++){
                    let flag=true;
                    for(let l=0;l<newArr.length;l++){
                        if(newArr[l].id==arr[i].id){
                            flag=false;
                            break
                        }
                    }
                if(flag){
                    newArr.push(arr[i]);
                }
            }
                return newArr
             }
         },
         methods:{
             Choice(key,id){      //用户选择筛选函数
                this.activeId[key]=id;
                this.activeId["sin"]=0;
                this.setHash();   
                if(this.source&&this.source.qqClassify)  this.source.qqClassify.cancel("操作被用户取消");
                this.isRequest=true;
                this.scrollFlag=true;
                this.setMusicClassify({
                    "musicList":[],
                    "flag":false
                });
                this.getMusicClassify(this.activeId,true).then(res=>{
                    this.isRequest=false;
                },res=>{
                    // this.isRequest=false;
                });
             },
             changeClose(){        //点击打开更多筛选
                this.isClose=!this.isClose;
             },
             playMusic(item){                 //获取专辑跳转播放详情页
                   if(this.source&&this.source["qqAlbum"])  this.source["qqAlbum"].cancel("操作被用户取消");
                    this.getAlbum({
                        albumid:item.album_id
                    }).then(query=>{
                        this.$router.push({path:'/playsong',query});
                        console.log("获取专辑成功")
                    },reject=>{
                        console.log(reject)
                    })
             },
             setHash(){
                let str="?";
                let flag=true;
                for(let attr in this.activeId){
                    if(flag){
                        flag=false;
                          str+=attr+'='+this.activeId[attr];
                    }else{
                        str+=`&`+attr+'='+this.activeId[attr];
                    }
                }
                 this.$router.replace(str)
             },
            ...mapActions({
                    getMusicClassify(dispatch,data,category,musicList){
                       return  dispatch("getMusicClassify",{...data,el:this}).then(res=>{
                        //    console.log(res)
                            if(res.status==200){
                                let re=/^(\w*\()(.*)(\))$/;
                                // let data=JSON.parse(res.data.replace(re,($0,$1,$2,$3)=>$2));
                                let data=res.data;
                                 if(!musicList){  //算出总页数，如果是重新查询不同分类就算出总页数，如果是后续下拉加载就不用再重新计算了
                                   this.allPage=Math.floor(data.albumlib.data.total/this.activeId.num);
                                }
                                if(Math.floor(this.activeId.sin/this.activeId.num)!=this.allPage){
                                     data.albumlib.data.list.pop();
                                }
                                let config={
                                    "musicList":data.albumlib.data.list.map(item=>{
                                        item.flag=false;
                                        return item
                                    }),
                                    "flag":musicList
                                };
                                config.category=data.albumlib.data.tags;            //每次都重新渲染分类项目
                               
                                this.setMusicClassify(config);
                                return Promise.resolve()
                            }else{
                                return Promise.reject("请求出错!!!");
                            }
                       })
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
            }),
            ...mapMutations({
                setMusicClassify(commit,data){
                    commit("setMusicClassify",data);
                },
                setPlaylist(commit,data){
                    commit("setPlaylist",data);
                }
            }),
            scrolls(ev){
                if(!this.musicList.length) return
                this.height="auto";
                let clientHeight=document.documentElement.clientHeight||document.body.clientHeight;
                let aLi=this.$el.querySelectorAll(".showData li");
                //图片懒加载
               aLi.forEach((item,index)=>{
                   if(item.getBoundingClientRect().top<clientHeight&&(!this.musicList[index].flag)){
                       item.flag=true;
                       let Img=new Image();
                       Img.src='https://y.gtimg.cn/music/photo_new/T002R300x300M000'+this.musicList[index].album_mid+'.jpg?max_age=2592000';
                       Img.onload=res=>{
                            this.musicList[index].flag=true;
                       }
                       let Time=setTimeout(res=>{
                            Img.onload=null;
                       },5000);
                   }
               });
                //下拉加载
                let top=aLi[aLi.length-1].getBoundingClientRect().top;
                if(top<clientHeight&&this.scrollFlag){
                    this.scrollFlag=false;
                    clearInterval(this.timer);
                    this.loading="正在加载";
                    this.timer=setInterval(res=>{
                        if(this.loading.length==7){
                            this.loading=this.loading.substring(0,4);
                        }else{
                            this.loading+='.';
                        }
                    },300);
                    if(Math.floor(this.activeId.sin/this.activeId.num)==this.allPage){     //等于最后一页的时候
                        setTimeout(res=>{
                            clearInterval(this.timer);
                            this.loading="(╥╯^╰╥),没有更多数据了哟!!!";
                        },1500);
                        return "最后一页"
                    }
                    console.log('请求')
                    this.activeId.sin=parseInt(this.activeId.sin)+parseInt(this.activeId.num);
                    this.setHash();   
                     this.getMusicClassify(this.activeId,true,true).then(res=>{
                        this.scrollFlag=true;
                        clearInterval(this.timer);
                    },res=>{
                        this.scrollFlag=true;
                         clearInterval(this.timer);
                    });
                }
            },
           setHeight(){
                var iHeight=document.documentElement.clientHeight;
                var menuLlist=document.querySelector(".menu-list").offsetHeight;
                var singer=document.querySelector(".ranking_header").offsetHeight;
                var rankingMain=document.querySelector(".ranking_main").offsetHeight;
                var iFooter=document.querySelector("#footer").offsetHeight;
                if((menuLlist+singer+iFooter+rankingMain)<=iHeight){
                    this.height=iHeight-menuLlist-singer-iFooter+'px';
                }
           }
         },
         created(){
            let hash=location.hash;
            if(hash){
                let index=hash.indexOf('?');
                if(index!=-1){
                    hash=hash.substring(index+1);
                    hash=hash.split("&");
                    hash=hash.map(item=>{
                        return item.split("=");
                    }).forEach(element=>{
                      this.activeId[element[0]]=element[1];
                    });
                    // this.activeId=json;
                }
            }
             Promise.all([this.getMusicClassify(this.activeId)]).then(success=>{
                    this.$store.commit("setHidden",false);
                    this.isRequest=false;
             },error=>{
                    this.$store.commit("setHidden",false);
                    this.isRequest=false;
                    this.scrollFlag=false;
                   Toast(error);
             });
         },
         activated(){    //激活改组件时
            this.update=this.update?0:1;
            this.setHash();
            console.log(1)
            let aEl=Array.from(this.$el.querySelectorAll(".ranking_header_scroll"));
            console.log
            aEl.forEach(res=>{
                res.getWidthFn();
            });
            this.$root.$el.addEventListener('scroll',this.scrolls,false);
         },
         deactivated(){  //组件休眠时
            this.$root.$el.removeEventListener('scroll',this.scrolls,false);
         },
        updated(){
            console.log('更新');
        },
    }
</script>

<style lang="less" scoped>
@rem:75rem;
  .ranking{
      min-height: 100%;
      .ranking_header{
          padding: 6/@rem 12/@rem;
          >ul{
              display: flex;
              flex-direction: column;
              justify-content: space-around;
              >li{
                  display: flex;
                  padding: 8/@rem;
                  border-bottom: 2px solid rgba(189, 188, 188, 0.2);
                  h2{
                      width: 100/@rem;
                      font-size: 36/@rem;
                      color: #9e9e9e;
                  }
                  .ranking_header_scroll{
                        width:(750-24-16-100)/@rem;
                        overflow: hidden;
                      ul{
                          &:after{
                              display: block;
                              content: "";
                              clear: both;
                          }
                          li{
                              font-size: 36/@rem;
                              color: #000;
                              float: left;
                              padding: 0 16/@rem;
                              cursor: pointer;
                          }
                      }
                  }
              }
          }
        .more{
           width: 20/@rem;
           height: 20/@rem;
           border-top: 1px solid #000;
           border-right: 1px solid #000;
           transform: rotateZ(135deg);
           margin: 20/@rem auto;
           &.active{
               transform: rotateZ(-45deg);
           }
        }
      }
      .ranking_main{
        padding: 0 12/@rem;
        position: relative;
        .ranking_main_header{
            margin-bottom: 20/@rem;
            dl{
                &:after{
                    display: block;
                    content: "";
                    clear: both;
                }
                dt{
                    float:left;
                    font-size: 46/@rem
                }
                dd{
                    float: right;
                    border:1px solid #c9c9c9;
                    font-size: 30/@rem;
                    padding: 5/@rem 15/@rem
                }
                dd:last-child{
                    border-radius:5/@rem 0/@rem 0/@rem 5/@rem
                }
                dd:nth-child(2){
                    border-left:none;
                    border-radius:0/@rem 5/@rem 5/@rem 0 
                }
                dd.active{
                    color: #fff;
                    background: rgb(3, 169, 244)
                }
            }
        }
        ul{
            display: flex;
            justify-content:flex-start;
            flex-flow: wrap;
            &:after{
                content: "";
                clear: both;
                display: block;
            }
            li{
                width:345/@rem;
                margin-bottom:24/@rem;
                color: #333;           
                 text-align: left;     
                 font-family: "poppin,Tahoma,Arial,\5FAE\8F6F\96C5\9ED1,sans-serif";
                 div{
                     width: 100%;
                     height: 345/@rem;
                 }
                h4{
                    padding: 5/@rem 0;
                    font-size: 36/@rem;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: pre;
                    margin-top: 20/@rem;
                }
                p,time{
                    padding: 5/@rem 0;
                    font-size:32/@rem;
                    color:#999;
                    line-height: 1;
                    display: block;
                }
            }
            li:nth-child(2n){
                margin-right: 0;
                margin-left: 20/@rem
            }
        }
        .Prompt{
            font-size: 30/@rem;
            text-align: center;
            color: #333;
            padding: 20/@rem 0;
        }
        .noData{
            padding:120/@rem 0 200/@rem;            
            text-align: center;
            position: absolute;
            width: 100%;
            top:1rem;
            bottom: 0%;
            display: flex;
            justify-content: center;
            align-items: center;
            h2{
                color:#333 ;
                font-size: 36/@rem;
            }
            i{
                color: #333;
                font-size: 150/@rem;
                width: 300/@rem;
                height: 300/@rem;
                display: block;
                background: url(../../assets/img/loading.gif) no-repeat center center;
                 background-size: 300/@rem 300/@rem;
                margin:0 auto;
                &:after{
                    display: block;
                }
            }
        }
      }
      @keyframes rotate{
          0%{
              transform: rotateZ(0deg);
          }
          100%{
              transform: rotateZ(360deg);
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
         .screening{
             padding: 0 30/@rem;
             position: fixed;
             bottom: 0%;
             left: 0%;
             right: 0%;
             background: #fff;
             box-sizing: border-box;
             height:9rem;
             z-index: 1000;
             transform: translateY(100%);
             transition: all 400ms ease-in;
             opacity: 0;
             &.show{
                 transform: translateY(0%);
                 opacity: 1;
             }
             h2{
                 font-size: 36/@rem;
                 text-align: center;
                 padding: 26/@rem 0;
                 height: 1.4rem;
                 box-sizing: border-box;
                 border-bottom: 1px solid #f2f2f2;
             }
             .screening-list{
                 height: 6.2rem;
                 overflow-y: auto;
                 padding: 30/@rem;
                 box-sizing: border-box;
                 ul{
                     display: flex;
                     flex-direction: column;
                     justify-content: space-around;
                     li{
                         h3{
                             font-size: 30/@rem;
                             columns: #000;
                             font-weight: bolder;
                             text-align: left;
                             margin-bottom: 20/@rem;
                         }
                         dl{
                            display: flex;
                            justify-content: space-around;
                            align-items:flex-start;
                            flex-flow: wrap;
                            dd{
                                width: 200/@rem;
                                font-size: 30/@rem;
                                padding: 20/@rem 0;
                                border: 1px solid #f2f2f2;
                                border-radius: 5/@rem;
                                margin-bottom: 20/@rem;
                                overflow: hidden;
                                text-overflow:ellipsis;
                                white-space: nowrap;
                            }
                            
                         }
                     }
                 }
             }
             .close{
                  font-size: 32/@rem;
                 text-align: center;
                 padding: 26/@rem 0;
                 height: 1.4rem;
                 box-sizing: border-box;
                 border-top: 1px solid #f2f2f2;
             }
         }  
  }
</style>

