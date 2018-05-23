import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/'
import news from '@/components/indexChildren/news'

Vue.use(Router)

const router=new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      alias:"/index",
      component: index,
    }
  ]
})
router.beforeEach((to,from,next)=>{
  next();
});
export default router;