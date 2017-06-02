# Tip
##  提示框组件
##  功能
    支持点击或者hover的时候显示提示框
##  参数
    @option {
        direct:"bottom center",        //第一个是提示框相对于元素的位置top right bottom left,第二个是小三角符号相对于元素的位置，默认为'bottom left'
        type:"normal",      //目前有两种样式normal(默认),default,hover
        content:"name error",   //html字符串
        time:"2000"         //显示的时长，默认2000毫秒,
        distance:"10"
        id:"",    //提示框id
        class:"", //提示框类名
        parent:""   //提示框的父元素
    }
    提示 父元素默认为元素的父元素
##  使用方式：
    $element.Tip(option);
    警告：$element不能是display:none的元素

    hover类型的提示框的另一种使用方式：
    <span class="tip-hover" data-content="<p>第一行</p><p>第二行</p>" data-direct="top center" data-tip-id="tip83274" data-class="classname"></span>
    必填项：class="tip-hover" data-content
