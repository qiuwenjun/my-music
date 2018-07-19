import Vue from 'vue'
import Router from 'vue-router'

const index = () => import( '@/components/');          //首页
const topList = () => import('@/components/toplist.vue');   //排行榜详情  
const playsong = () => import('@/components/playsong.vue');   //电台
const taoge= () => import( '@/components/taoge.vue');    //歌单   
const noPage= () => import( '@/components/noPage.vue');    //页面不存在

Vue.use(Router)

const router=new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      alias:"/index",
      component: index,
    },
    {
      path: '/topList',
      name: 'topList',
      component: topList,
    },
    {
      path:'/playsong',
      name:"playsong",
      component:playsong,
    },
    {
      path:'/taoge',
      name:"taoge",
      props:true,
      component:taoge,
    },
    {
      path:'/noPage',
      name:"noPage",
      component:noPage,
    }
  ]
})
router.beforeEach((to,from,next)=>{
  next();
});
export default router;