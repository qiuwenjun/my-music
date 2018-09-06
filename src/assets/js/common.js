function getStorage(key){
    return localStorage.getItem(key);
};
function setStorage(key,value){
    localStorage.setItem(key,value);
};
function getOffsetTop(el){
    let num=0;
    while(el.offsetParent){
        num+=el.offsetTop;
        el=el.offsetParent;
    }
    return num
}










export {getStorage,setStorage,getOffsetTop}