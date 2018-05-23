<template>
  <div class="main">
          <nav class="menu-list" >
               <div :class="tabIndex===index?'active':''" v-for="item,index in  menu" @click="switchTab(index)">{{item.name}}</div>
          </nav>
          <div class="">
            <keep-alive>
                <component :is="tabComponent"></component>
            </keep-alive>
          </div>
  </div>
</template>

<script>
export default {
  name: 'mains',
  data () {
    return {
     tabIndex:0,
     menu:this.$store.state.menu
    }
  },
  computed:{
     tabComponent(){
        return this.menu[this.tabIndex].component
     }
  },
  methods:{
    switchTab(index){
       this.tabIndex=index;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    @rem:75rem;
     .main{
       width: 100%;
       .menu-list{
         width:100%;
        display: flex;
        justify-content:space-around;
        border-bottom:2px solid rgba(189, 188, 188, 0.2);
        div{
           position: relative;
           padding: 20/@rem 0/@rem;
           font-size: 18/@rem ;
         }
         div.active{
           color: #03A9F4;
          &:after{
                position:absolute;
                content: "";
                display: block;
                width: 140%;
                transform: translateX(-10%);
                background: #03A9F4;
                 height: 2px;
                 bottom: -2px;
            }
         }
       }
     }
      @media screen and (max-width: 400px){
          .main{
              .menu-list{
               
                div{
                  
                }
                div.active{
                  &:after{
                       
                    }
                }
              }
            }
        }
        @media screen and (min-width: 401px) and (max-width: 480px){
            .main{
              .menu-list{
                border-bottom:2px solid rgba(189, 188, 188, 0.2);
                div{
                  padding: 15px 0px;
                  font-size: 16px;
                }
                div.active{
                  &:after{
                        height: 2px;
                        bottom: -2px;
                    }
                }
              }
            }
        }
        @media screen and (min-width: 481px) and (max-width: 540px){
          .main{
              .menu-list{
                border-bottom:2px solid rgba(189, 188, 188, 0.2);
                div{
                  padding: 15px 0px;
                  font-size: 16px;
                }
                div.active{
                  &:after{
                        height: 2px;
                        bottom: -2px;
                    }
                }
              }
            }
        }
        @media screen and (min-width: 541px) and (max-width: 640px){
           .main{
              .menu-list{
                border-bottom:2px solid rgba(189, 188, 188, 0.2);
                div{
                  padding: 15px 0px;
                  font-size: 16px;
                }
                div.active{
                  &:after{
                        height: 2px;
                        bottom: -2px;
                    }
                }
              }
            }
        }
        @media screen and  (min-width: 641px) and (max-width: 720px){
             .main{
              .menu-list{
                border-bottom:3px solid rgba(189, 188, 188, 0.2);
                div{
                  padding: 18px 0px;
                  font-size: 24px;
                }
                div.active{
                  &:after{
                        height: 3px;
                        bottom: -3px;
                    }
                }
              }
            }
        }
        @media screen and  (min-width: 721px)  and (max-width: 980px){
                  .main{
              .menu-list{
                border-bottom:3px solid rgba(189, 188, 188, 0.2);
                div{
                  padding: 18px 0px;
                  font-size: 24px;
                }
                div.active{
                  &:after{
                        height: 3px;
                        bottom: -3px;
                    }
                }
              }
            }
        }
        @media screen and  (min-width: 981px)  and (max-width: 1024px){
              .main{
              .menu-list{
                border-bottom:3px solid rgba(189, 188, 188, 0.2);
                div{
                  padding: 18px 0px;
                  font-size: 24px;
                }
                div.active{
                  &:after{
                        height: 3px;
                        bottom: -3px;
                    }
                }
              }
            }   
        }
        @media screen and  (min-width: 1025px) {
                 .main{
              .menu-list{
                border-bottom:3px solid rgba(189, 188, 188, 0.2);
                div{
                  padding: 18px 0px;
                  font-size: 24px;
                }
                div.active{
                  &:after{
                        height: 3px;
                        bottom: -3px;
                    }
                }
              }
            }
        }
</style>

