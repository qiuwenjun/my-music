import vue from "vue";
import vuex from "vuex";
import axios from "axios";

import news from '@/components/indexChildren/news';
import playlist from '@/components/indexChildren/playlist';
import ranking from '@/components/indexChildren/ranking';
import singer from '@/components/indexChildren/singer';
import search from '@/components/indexChildren/search';

import {Toast} from 'mint-ui';
import { stat } from "fs";
const newsLink="/proxy/?json=true";
function request(json){
    if(!json.url) return;
    let url=json.url.replace(/\/(.*)\//,($0,$1)=>$1);
    json.type=json.type?json.type:'get';
    if(json.type=='get'){
        if(json.flag=='classify'){                                  //查询分类拼接方式
            json.url+=classify(json.data);
        }else if(json.flag=='singer'){                     //查询歌手拼接方式
            json.url+=Singer(json.data);
        }else{                                                  //普通拼接方式
            json.url+=urlSplicing(json.data);   
        }
    }
    console.log(json);
    let jsons={};
    if( json.el){    //判断如果有组件实列对象传进来那就有可以短时间内有大量ajax进入，进行那就在这里进行处理，永远之请求最后一个ajax
        json.el.source||(json.el.source={});       //一个组件可能同时有好几个请求的情况下，那么就要对不同请求进行不同的记录
        json.el.source[url] = axios.CancelToken.source(); // 这里初始化source对象
        jsons.cancelToken=json.el.source[url].token;
    }
    let pro=axios({
        method:json.type,
        url:json.url,
        data:json.data?json.data:{},
        timeout:1000*60,
        ...jsons
     }).then(success=>{    //成功
        return Promise.resolve(success)
     },error=>{   //失败
        if(axios.isCancel(thrown)){
            console.log('Request canceled',thrown.message);
          }else {
            Toast({
                message:"网络出错了！！！",
                position:'fixed',
                duration:3000
            })
          }
    }).catch(function(thrown){
       
    });
    return pro
};

function urlSplicing(data){
     let str="";
     for(let attr in data){
         str+='&'+attr+'='+data[attr]
     }
     return str
};
function classify(data){      //获取歌曲分类
 /*
    //固定值
    "click_albumid":"%22%3A0%7D%2C%22",
    "module":"%22%3A%22",
    "music.web_album_library":"%22%7D%7D"
    //参数
    callback=getUCGI7574039741965515&g_tk=5381&jsonpCallback=getUCGI7574039741965515&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&data=%7B%22albumlib%22%3A%7B%22method%22%3A%22get_album_by_tags%22%2C%22param%22%3A%7B%22
    area%22%3A14%2C%22
    company%22%3A-1%2C%22
    genre%22%3A-1%2C%22
    type%22%3A-1%2C%22
    year%22%3A-1%2C%22
    sort%22%3A2%2C%22
    get_tags%22%3A1%2C%22
    sin%22%3A0%2C%22
    num%22%3A20%2C%22
 */
    let url="callback=getUCGI7574039741965515&g_tk=5381&jsonpCallback=getUCGI7574039741965515&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&data=%7B%22albumlib%22%3A%7B%22method%22%3A%22get_album_by_tags%22%2C%22param%22%3A%7B%22";
    for(let attr in data){
        url+=attr+'%22%3A'+data[attr]+'%2C%22';
    };
    url+="click_albumid%22%3A0%7D%2C%22module%22%3A%22music.web_album_library%22%7D%7D";
    return url;
};
function Singer(data){       //获取歌手分类
        /*
       callback=getUCGI5730581103163968&g_tk=1492238606&jsonpCallback=getUCGI5730581103163968&loginUin=1501480244&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&data=%7B%22comm%22%3A%7B%22ct%22%3A24%2C%22cv%22%3A10000%7D%2C%22singerList%22%3A%7B%22module%22%3A%22Music.SingerListServer%22%2C%22method%22%3A%22get_singer_list%22%2C%22param%22%3A%7B%22
           //参数
          sex=2&index=5&genre=4&page=1&area=4
        */
           let url="callback=getUCGI5730581103163968&g_tk=1492238606&jsonpCallback=getUCGI5730581103163968&loginUin=1501480244&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&data=%7B%22comm%22%3A%7B%22ct%22%3A24%2C%22cv%22%3A10000%7D%2C%22singerList%22%3A%7B%22module%22%3A%22Music.SingerListServer%22%2C%22method%22%3A%22get_singer_list%22%2C%22param%22%3A%7B%22";
           for(let attr in data){
               if(attr=='show'){
                   for(var keys in data.show){
                     url+=keys+'%22%3A'+data.show[keys]+'%2C%22';
                   }
               }else if(attr=='hide'){
                   for(var keys in data.hide){
                       if(keys=='sin'){
                         url+=keys+'%22%3A'+data.hide[keys]+'%2C%22';
                       }else{
                         url+=keys+'%22%3A'+data.hide[keys]+'%7D%7D%7D';
                       }
                  
                  }
               }
           };
           return url;
}

vue.use(vuex);

export default new vuex.Store({
     state:{
        menu:[
             {
                 "name":"新歌",
                 component:news
             },
             {
                "name":"排行榜",
                component:playlist
            },
            {
                "name":"分类",
                component:ranking
            },
            {
                "name":"歌手",
                component:singer
            },
            {
                "name":"搜索",
                component:search
            }
        ],
        hidden:true,                   //loading配置
        footerHide:true,           //底部是否显示
        indexs:{                        //首页数据
            nowSong:{               //当前歌曲配置
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
            }
        },
        news:{                          //新歌板块
            bannerList:[],               //banner图板块
            playList:[],                 //歌单板块
        },
        musicList:[],            //设置歌曲排行榜,
        topList:{
            "msg":{},
            "musicList":[]
        },                 //设置歌曲排行榜详情          
        Classify:{                //设置歌曲分类
            "category":{},      //分类
            "musicList":[]     //歌曲  
        },
        singerList:{             //设置歌手分类
            "category":{},      //分类
            "musicList":[]     //歌手  
        },
        lyrics:{},                 //当前歌词
        hotSearch:{             //热门搜索
            arr:[],
            special_key:"",
            special_url:""
        },
        searchList:[],            //查询歌曲           ,
        playsong:{               //播放列表
            detail:{                //当前歌曲播放详情
                track_info:{
                    album:'',
                    file:"",
                    mv:''
                }
            },              
            gedan:[],             //歌单
            simsongs:[],        //更多推荐歌曲
            singers:[]             //歌手  
        },
        comment:[],          //歌曲评论
        taoge:{                  //其他歌单
            taogeDetail:{},             //歌单信息
            playList:[]                    //歌曲列表
        }
     },
     getters:{

     },
     mutations:{
        setHidden(state,data){         //设置loading动画
             state.hidden=data;
        },   
        setFooter(state,data){         //设置底部栏
            state.footerHide=data;
       },   
        setNowList(state,data){      //设置当前播放歌曲和缓存当前播放列表
            state.indexs.nowSong=data
        },
        setBanner(state,data){          //设置banner图
            state.news.bannerList=data.data.slider;
        },
        setPlaylist(state,data){            //设置当前歌单
            state.news.playList=data;
        },
        setMusicList(state,data){     //设置歌曲排行榜
            state.musicList=data;
        },
        setMusicClassify(state,data){   //设置歌曲分类
            if(data.category){     //设置歌曲的分类列表，
                state.Classify.category=data.category;
            }
            if(data.flag){     //设置获取到的歌曲数据,false为重新查询了分类，true为继续向下查询同样分类歌曲的更多数据
                state.Classify.musicList=[...state.Classify.musicList,...data.musicList];                
            }else{
                state.Classify.musicList=data.musicList;    
            }
        },
        setMusicSinger(state,data){   //设置歌手分类
            if(data.category){     //设置歌手的分类列表，
                state.singerList.category=data.category;
            }
            if(data.flag){     //设置获取到的歌手数据,false为重新查询了分类，true为继续向下查询同样分类下的更多数据
                state.singerList.musicList=[...state.singerList.musicList,...data.musicList];                
            }else{
                state.singerList.musicList=data.musicList;    
            }
        },
        setToplist(state,data){          //设置歌曲排行榜详情
            for(let attr in data){
                state.topList[attr]=data[attr];
            }
        },
        setLyrics(state,data){          //设置当前歌词
            state.lyrics=data;
        },
        sethotSearch(state,data){    //设置热门搜索
            state.hotSearch=data;
        },
        setSearch(state,data){       //设置请求回来的数据         
            if(data.flag){              //为true的话合并对象
                state.searchList=state.searchList.concat(data.data);
            }else{                        //为false的话替换对象                          
                state.searchList=data.data;
            }
        },
        setPlaysong(state,data){    //设置当前歌曲数据
            state.playsong=data;
        },
        setComment(state,data){     //设置歌曲评论
            state.comment=data;
        },
        setTaoge(state,data){          //设置歌单     
            if(!data.flag){          //为false说明是第一次请求改歌单
                state.taoge.taogeDetail=data.taogeDetail;
                state.taoge.playList=data.playList;
            }else{
                state.taoge.playList=state.taoge.playList.concat(data.playList);
            }
        },
        setalbum(state,data){
            state.taoge.playList=state.taoge.playList.concat(data.playList);
        }
     },
     actions:{
        getBanner(store,config={}){         //获取banner图
            return request({
                type:"get",
                url:"/qqmusic/&_="+new Date().getTime(),
               data:config
            });
        },
        getPlaylist(store,config={}){            //获取新歌曲
            let el=config.el;
            delete config.el;
            return request({
                type:"get",
                url:"/qqPlaylist/",
                data:config
            });
        },
        getNowSong(store,config={}){     //获取当前播放歌曲详情
            return request({
                type:"get",
                url:"/qqSearch/",
                data:config
            });
        },
        getMusicList(store,config={}){       //获取歌曲排行榜
            return request({
                url:"/qqlist/",
                type:'get',
                data:config,
            });
        },
        getToplist(store,config={}){       //获取歌曲排行榜详情
            return request({
                url:"/qqToplist/",
                type:'get',
                data:config,
            });
        },
        getMusicClassify(store,config={}){                        //获取音乐分类数据
            let el=config.el;
            delete config.el;
            return request({
                url:"/qqClassify/",
                type:'get',
                data:config,
                flag:'classify',
                el
            });
        },
        getMusicSinger(store,config={}){                        //获取歌手数据
            let el=config.el;
            delete config.el;
            return request({
                url:"/qqSinger/",
                type:'get',
                data:config,
                flag:'singer',
                el
            });
        },
        getLyrics(store,config={}){                                    //获取歌曲歌词
            let el=config.el;
            delete config.el;
            return request({
                url:"/qqLyrics/",
                type:'get',
                data:config,
                el
            });
        },
        gethotSearch(store,config={}){                            //热门搜索
            return request({
                url:"/hotSearch/",
                type:'get',
                data:config,
            });
        },
        getSearch(store,config={}){                                 //搜索歌曲
            let el=config.el;
            delete config.el;
            return request({
                url:"/qqSearch/",
                type:'get',
                data:config,
                el
            });
        },
        getPlaysong(store,config={}){                              //当前播放歌曲详情
            let el=config.el;
            delete config.el;
            return request({
                url:"/qqPlaysong/",
                type:'post',
                data:config,
                el
            });
        },
        getComment(store,config={}){                              //获取当前播放歌曲的评论
            let el=config.el;
            delete config.el;
            return request({
                url:"/qqComment/",
                type:'get',
                data:config,
                el
            });
        },
        getTaoge(store,config={}){                                     //获取歌单
            let el=config.el;
            delete config.el;
            return request({                        
                url:"/qqTaoge/",
                type:'get',
                data:config,
                el
            })
        },
        getAlbum(store,config={}){                                     //获取歌单
            let el=config.el;
            delete config.el;
            return request({                        
                url:"/qqAlbum/",
                type:'get',
                data:config,
                el
            })
        },
        getSingerDetail(store,config={}){                           //获取歌手详情
            let el=config.el;
            delete config.el;
            return request({                        
                url:"/qqSingerDetail/",
                type:'get',
                data:config,
                el
            })
        }
     }
});