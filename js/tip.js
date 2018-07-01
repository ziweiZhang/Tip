/*  name 提示框
    author ziwei.zhang
    email ziwei.zhang@renren-inc.com
    return null
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
    detail 父元素默认为元素的父元素
    使用方式：
    $element.Tip(option);
    警告：$element不能是display:none的元素

    hover类型的提示框的另一种使用方式：
    <span class="tip-hover" data-content="<p>第一行</p><p>第二行</p>" data-direct="top center" data-tip-id="tip83274" data-class="classname"></span>
    必填项：class="tip-hover" data-content
*/
//hover提示监听事件
$("body").off("mouseover", ".tip-hover").on("mouseover", ".tip-hover", function() {
    var $this = $(this);
    $this.Tip({
        type: "hover",
        content: $this.data("content"),
        direct: $this.data("direct"),
        class: $this.data("class"),
        id: $this.data("tipid"),
        parent: $this.data("parent")?$($this.data("parent")):""
    });
});
var Tip = function(option) {
    new SiteTip(this, option);
}
var SiteTip = function(element, option) {
    if (option.type == "normal" || !option.type) {
        $(".site-tip").remove();
    }
    this.resize(element, option, true);
}
var $parent;
SiteTip.prototype.isRelative = function($element) {
    var position = $element.css("position");
    if (position == "relative" || position == "absolute" || position == "fixed") {
        return true;
    }
    return false;
}
SiteTip.prototype.resize = function(element, option) {
    option.direct = $.trim(option.direct) ? $.trim(option.direct) : "bottom";
    $parent = option.parent;
    var rect = element[0].getBoundingClientRect(), //元素相对于视口的位置以及宽高
        _parentnode = $parent || (element[0].tagName == "HTML" ? element : element.parent()), //||this.getParent(element),
        position,
        relativeParent = this.isRelative(_parentnode) ? _parentnode : this.getRelativeParent(_parentnode),
        Pposition,
        Rrect = relativeParent[0].getBoundingClientRect(),
        id = option.id || this.getUID("siteTip"),
        type = option.type || "normal",
        panelDirect = option.direct.split(" ")[0],
        triangleDirect = option.direct.split(" ")[1];

    option.id = id;
    position = element.offset(); //元素相对于文档的left、top
    Pposition = relativeParent.offset();
    position.left -= Pposition.left;
    position.top -= Pposition.top; //元素相对于父元素的left、top
    position.top += relativeParent.scrollTop();

    if (!triangleDirect) {
        if (panelDirect == "left" || panelDirect == "right") {
            triangleDirect = "center";
        } else {
            triangleDirect = "left";
        }
    }

    var html = '<div id="' + id + '" ' + 'class="site-tip site-tip-' + type + ' site-tip-' + panelDirect + ' ' + triangleDirect + ' ' + (option.clickable ? 'clickable' : '') + ' ' + (option.trianglePosition ? ('triangle-' + option.trianglePosition) : '') + (option.class ? option.class : '') + '">' + option.content + '</div>';
    var xDistance = option.xDistance || 0,
        distance = option.distance || 10,
        yDistance = option.yDistance || 0;
    var tipRect = {}; //提示框的真实宽高

    position.width = rect.width || rect.right - rect.left;
    position.height = rect.height || rect.bottom - rect.top;
    Pposition.width = Rrect.width || Rrect.right - Rrect.left;
    Pposition.height = Rrect.height || Rrect.bottom - Rrect.top;
    _parentnode.append(html);

    var $tip = $("#" + id);
    if ($tip.length == 0) {
        return false;
    }

    tipRect.width = $tip[0].offsetWidth;
    tipRect.height = $tip[0].offsetHeight;

    switch (panelDirect) {
        case "top":
            triangleDirect = triangleDirect ? triangleDirect : "left";
            var _left = position.left,
                _top = -tipRect.height - distance;
            if (triangleDirect == "center") {
                _left += (position.width - tipRect.width) / 2;
            } else if (triangleDirect == "right") {
                _left += position.width - tipRect.width;
            }

            break;
        case "bottom":
            triangleDirect = triangleDirect ? triangleDirect : "left";
            var _left = position.left,
                _top = position.height + distance;

            if (triangleDirect == "center") {
                _left += (position.width - tipRect.width) / 2;
            } else if (triangleDirect == "right") {
                _left += position.width - tipRect.width;
            }

            break;
        case "left":
            triangleDirect = triangleDirect ? triangleDirect : "center";

            var _left = position.left - tipRect.width - distance,
                _top = position.height / 2 - tipRect.height / 2;

            if (triangleDirect == "top") {
                _top = 0;
            } else if (triangleDirect == "bottom") {
                _top = position.height - tipRect.height;
            }
            break;
        case "right":
            triangleDirect = triangleDirect ? triangleDirect : "center";
            var _left = position.left + position.width + distance,
                _top = position.height / 2 - tipRect.height / 2;
            if (triangleDirect == "top") {
                _top = 0;
            } else if (triangleDirect == "bottom") {
                _top = position.height - tipRect.height;
            }
            break;
    }

    $tip.css({
        top: position.top + _top - document.documentElement.scrollTop + "px",
        left: _left + "px"
    });

    if (position.top < relativeParent.scrollTop()) {
        relativeParent.scrollTop(position.top);
    } else if (position.top - relativeParent.scrollTop() + _top + tipRect.height> Pposition.height) {
        relativeParent.scrollTop(position.top - Pposition.height + _top + tipRect.height)
    }
    
    if (option.type == "hover") {
        element.one("mouseout", function() {
            $tip.remove();
        });
        return false;
    }
    setTimeout(function() {
        $tip.remove();
    }, option.time || 2000);
}
SiteTip.prototype.getUID = function(prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix;
}

SiteTip.prototype.getRelativeParent = function($element) {
    if (this.isRelative($element) || $element[0].tagName == "HTML") {
        return $element;
    }
    return this.getRelativeParent($element.parent());
}

$.fn.extend({
    Tip: Tip
});
