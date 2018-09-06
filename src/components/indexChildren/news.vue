<template>
     <div class="news" :style="{height}">
          <swiper :bannerList="banner" :clearTime="flag"></swiper>
          <div class="newList">
                <h2 class="title">电台</h2>
                <ul>
                    <li @click="target(item.id)" v-for="item,index in playlist">
                        <img :src="item.img">
                        <p>{{item.text}}</p>
                    </li>
                </ul>
          </div>
     </div>
</template>

<script>
   import {mapActions,mapMutations} from "vuex";
   import {getStorage,setStorage} from "@/assets/js/common.js";
   import {Toast} from "mint-ui";
    export default {
          name:'news',
          data(){
                return {
                    flag:false,
                    playlist:[
                        {
                            id:199,
                            text:"热歌",
                            img:'https://y.gtimg.cn/music/photo/radio/track_radio_199_13_1.jpg?max_age=2592000'
                        },
                        {
                            id:307,
                            text:"一个人一首招牌歌",
                            img:'https://y.gtimg.cn/music/photo/radio/track_radio_307_13_1.jpg?max_age=2592000'
                        }
                    ],
                    height:'auto'
                 }
          },
          computed:{
                banner(){
                    return this.$store.state.news.bannerList
                },
          },
          methods:{
                target(id){
                    this.getPlaylist({
                        "_":new Date().getTime(),
                        "labelid":id
                    }).then(res=>{
                        let query=this.$store.state.news.playList.map(res=>{
                             return JSON.parse(res).songid
                        });
                        this.$router.push({
                            path:'/playsong',
                            query:{
                                songId:query.join(',')
                            }
                        })
                    },res=>{
                        Toast("歌单丢失了请重试下!!!")
                    })
                },
                ...mapActions({
                    getBanner(dispatch){
                         return dispatch("getBanner").then(res=>{
                             if(res.status===200){
                                 this.setBanner(res.data);
                                 return Promise.resolve()
                             }else{
                                Toast("请求失败")
                                 return Promise.reject("获取banner图有误!!!")
                             }
                          })
                    },
                    getPlaylist(dispatch,data){
                        return dispatch("getPlaylist",{
                           ...data,
                           el:this
                        }).then(res=>{
                            if(res.status===200){
                                    let arr=[];
                                    for(let i=0;i<res.data.data.length;i++){
                                        let json={
                                            songid:res.data.data[i].id,
                                            name:res.data.data[i].name,
                                            singer:res.data.data[i].singer,
                                            vid:res.data.data[i].mv.vid,
                                            songmid:res.data.data[i].file.media_mid,
                                        };
                                        arr.push(JSON.stringify(json));
                                    }
                                    this.setPlaylist(arr);
                                    setStorage("playList",arr.join('&'));
                                    return Promise.resolve();
                            }else{
                                    Toast("请求失败");
                                    return Promise.reject("获取歌单有误!!!");
                            }
                        })
                    }
              }),
              ...mapMutations({
                   setBanner(commit,data){
                       commit('setBanner',data);
                   },
                    setPlaylist(commit,data){
                       commit("setPlaylist",data);
                    }
              }),
              setHeight(){
                  let ClientHeight=document.documentElement.clientHeight;
                  let NewHeight=this.$el.offsetHeight;
                  let iFooter=this.$root.$el.querySelector("#footer").offsetHeight;
                  let Menu=this.$root.$el.querySelector(".menu-list").offsetHeight;
                  if(ClientHeight-NewHeight-iFooter-Menu>0){
                      this.height=ClientHeight-iFooter-Menu+'px';
                  }
              }
          },
	    created(){
	      	console.log("news created")
	        this.flag=true;
	        Promise.all([this.getBanner()]).then(res=>{
	            this.$store.commit("setHidden",false);
	        },res=>{
	            this.$store.commit("setHidden",false);
	            Toast(res);
	        })   
	    },
        mounted(){
            this.setHeight();
        },
        activated(){
        	console.log("news activated")
              this.flag=false;
        },
	    deactivated(){
	     	console.log("news deactivated")
	        this.flag=true;
	    },
	    beforeDestroy(){
	    	console.log(11111)
	    },
	    destroyed(){
	    	console.log(2222)
	    }
    }
</script>

<style lang="less" scoped>
   @rem:75rem;
   .newList{
       padding:25/@rem;
       .title{
           display: flex;
           justify-content: space-between;
           padding: 20/@rem 0/@rem;
           align-items:center;
           font-size: 36/@rem;
           strong{
               font-weight: 600;
               font-size: 50/@rem;
           }
           a{
               font-size: 30/@rem;
               color: #000
           }
       }
       ul{
           display: flex;
           justify-content: space-between;
           li{
               width:340/@rem;
               height:430/@rem;
               p{
                   text-align: left;
                   font-size: 30/@rem;
                   color: #000;
                   padding: 10/@rem 0
               }
           }
       }
   }
</style>

