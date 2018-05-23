import vue from "vue";
import vuex from "vuex";
import axios from "axios";

import news from '@/components/indexChildren/news';
import playlist from '@/components/indexChildren/news';
import ranking from '@/components/indexChildren/news';
import singer from '@/components/indexChildren/news'

import {Toast} from 'mint-ui';
const newsLink="/proxy/?json=true";
function request(json){
    if(!json.url) return;
   return axios({
        method:json.type?json.type:'get',
        url:json.url,
        data:json.data?json.data:{},
     }).then(success=>{    //成功
            return Promise.resolve(success)
     },error=>{   //失败
            Toast({
                message:"网络出错了！！！",
                position:'fixed',
                duration:3000
            })
     });
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
            }
        ],
        bannerList:[],
        newsList:[]
     },
     getters:{

     },
     mutations:{
        setBanner(state,data){          //设置banner图
            state.bannerList=data.banner;
        },
        setNews(state,data){            //设置新歌曲  
            
        }
     },
     actions:{
        getBanner(store,config){      //获取banner图
            return request(config);
        },
        getNews(store,config){            //获取新歌曲                        
            return request(config);
        }
     }
});