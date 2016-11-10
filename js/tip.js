/*  name 提示框
    author ziwei.zhang
    email ziwei.zhang@renren-inc.com
    return null
    @option {
        direct:"bottom center",        //第一个是提示框相对于元素的位置top right bottom left,第二个是小三角符号相对于元素的位置，默认为'bottom left'
        type:"normal",      //目前有两种样式normal(默认),default,guide,hover
        content:"name error",   //html字符串
        time:"2000"         //显示的时长，默认2000毫秒,
        distance:"10"
        id:"",    //提示框id
        class:"", //提示框类名
        parent:""   //提示框的父元素
    }
    detail 父元素默认为body，若父元素含有fixed元素，自动将fixed元素作为提示框父元素
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
        parent: $this.data("parent")
    });
}).off("mouseout", ".tip-hover").on("mouseout", ".tip-hover", function() {
    $(".site-tip-hover").remove();
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
SiteTip.prototype.resize = function(element, option) {
    option.direct = $.trim(option.direct) ? $.trim(option.direct) : "bottom";

    $parent = option.parent;

    var rect = element[0].getBoundingClientRect(); //元素相对于视口的位置以及宽高

    var _parentnode = $parent || this.getParent(element),
        _scrollTop = this.getScrollTop(element),
        position,
        Pposition,
        _style,
        style;
    if (option.parent) {
        position = element.offset(); //元素相对于文档的left、top
        Pposition = $parent.offset();
        position.left -= Pposition.left;
        position.top -= Pposition.top; //元素相对于父元素的left、top
        position.top += _scrollTop.scrollTop;
    } else if (_parentnode[0].tagName != "BODY") {
        position = element.offset(); //元素相对于文档的left、top
        Pposition = _parentnode.offset();
        _style = this.getComputedStyle(_parentnode[0]);

        _scrollTop.height = _scrollTop.element[0].offsetHeight;
        _scrollTop.top = _scrollTop.element.offset().top;

        style = (_style.position == "fixed" ? "position:fixed;" : "") +
            (_style["z-index"] ? ("z-index:" + _style["z-index"]) : "z-index:1000");
    } else {
        position = element.offset(); //元素相对于文档的left、top
    }

    var id = option.id || this.getUID("siteTip");
    option.id = id;
    var type = option.type || "normal",
        panelDirect = option.direct.split(" ")[0],
        triangleDirect = option.direct.split(" ")[1];
    if (!triangleDirect) {
        if (panelDirect == "left" || panelDirect == "right") {
            triangleDirect = "center";
        } else {
            triangleDirect = "left";
        }
    }

    var html = '<div id="' + id + '" ' + (style ? 'style="' + style + '"' : '') + 'class="site-tip site-tip-' + type + ' site-tip-' + panelDirect + ' ' + triangleDirect + ' ' + (option.clickable ? 'clickable' : '') + ' ' + (option.trianglePosition ? ('triangle-' + option.trianglePosition) : '') + (option.class ? option.class : '') + '">' + option.content + '</div>';
    var xDistance = option.xDistance || 0,
        distance = option.distance || 10,
        yDistance = option.yDistance || 0;
    var tipRect = {}; //提示框的真实宽高

    position.width = rect.width || rect.right - rect.left;
    position.height = rect.height || rect.bottom - rect.top;
    var _this = this;
    _parentnode.append(html);

    var $tip = $("#" + id);
    if ($tip.length == 0) {
        return false;
    }

    tipRect.width = $tip[0].offsetWidth;
    tipRect.height = $tip[0].offsetHeight;
    if (element[0].tagName == "INPUT" || element[0].tagName == "TEXTAREA") {
        element.focus();
    }

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
            if (position.top < _scrollTop.top) {
                $tip.css({
                    top: _scrollTop.top + position.height + _top + "px",
                    left: _left + "px"
                });
                _scrollTop.element.scrollTop(_scrollTop.scrollTop - _scrollTop.top + position.top - position.height);

            } else if (position.top - _scrollTop.top > _scrollTop.height) {
                $tip.css({
                    top: _scrollTop.top + _scrollTop.height - position.height + _top + "px",
                    left: _left + "px"
                });
                _scrollTop.element.scrollTop(position.top - _scrollTop.top - _scrollTop.height + position.height + _scrollTop.scrollTop);

            } else {

                $tip.css({
                    top: position.top + _top + "px",
                    left: _left + "px"
                });

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
            if (position.top < _scrollTop.top) {
                $tip.css({
                    top: _scrollTop.top + position.height + _top + "px",
                    left: _left + "px"
                });
                _scrollTop.element.scrollTop(_scrollTop.scrollTop - _scrollTop.top + position.top - position.height);

            } else if (position.top - _scrollTop.top > _scrollTop.height) {
                $tip.css({
                    top: _scrollTop.top + _scrollTop.height - position.height + _top + "px",
                    left: _left + "px"
                });
                _scrollTop.element.scrollTop(position.top - _scrollTop.top - _scrollTop.height + position.height + _scrollTop.scrollTop);

            } else {
                $tip.css({
                    top: position.top + _top + "px",
                    left: _left + "px"
                });

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

            if (position.top < _scrollTop.top) {
                $tip.css({
                    top: _scrollTop.top + position.height + _top + "px",
                    left: _left + "px"
                });
                _scrollTop.element.scrollTop(_scrollTop.scrollTop - _scrollTop.top + position.top - position.height);

            } else if (position.top - _scrollTop.top > _scrollTop.height) {
                $tip.css({
                    top: _scrollTop.top + _scrollTop.height - position.height + _top + "px",
                    left: _left + "px"
                });
                _scrollTop.element.scrollTop(position.top - _scrollTop.top - _scrollTop.height + position.height + _scrollTop.scrollTop);

            } else {
                $tip.css({
                    top: position.top + _top + "px",
                    left: _left + "px"
                });
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
            if (position.top < _scrollTop.top) {
                $tip.css({
                    top: _scrollTop.top + position.height + _top + "px",
                    left: _left + "px"
                });
                _scrollTop.element.scrollTop(_scrollTop.scrollTop - _scrollTop.top + position.top - position.height);

            } else if (position.top - _scrollTop.top > _scrollTop.height) {
                $tip.css({
                    top: _scrollTop.top + _scrollTop.height - position.height + _top + "px",
                    left: _left + "px"
                });
                _scrollTop.element.scrollTop(position.top - _scrollTop.top - _scrollTop.height + position.height + _scrollTop.scrollTop);

            } else {
                $tip.css({
                    top: position.top + _top + "px",
                    left: _left + "px"
                });

            }
            break;
    }

    if (option.type == "hover") {
        return false;
    }
    $tip.show();
    setTimeout(function() {
        $tip.remove();
    }, option.time || 2000);
}
SiteTip.prototype.getUID = function(prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix;
}
SiteTip.prototype.getParent = function($element) {
    var element = $element[0];

    if (!element.parentNode) {
        return $("body");
    }
    if (element.parentNode.tagName == "BODY") {
        return $element.parent();
    }
    if (this.getComputedStyle(element.parentNode).position == "fixed") {
        return $element.parent();
    } else {
        return this.getParent($element.parent());
    }

}
SiteTip.prototype.getScrollTop = function($element) {
    var element = $element[0],
        scrollTop = $element.scrollTop(),
        limitHeight = this.getComputedStyle(element)["max-height"];
    if (this.getComputedStyle(element).position == "fixed") {
        return {
            element: $element,
            scrollTop: 0,
            height: element.getBoundingClientRect().height
        }
    }
    if (element.tagName == "BODY") {
        return {
            element: $element,
            scrollTop: scrollTop,
            height: element.getBoundingClientRect().height
        };
    } else if (scrollTop > 0 || limitHeight.substring(0, 1) > 0) {
        return {
            element: $element,
            scrollTop: scrollTop,
            height: element.getBoundingClientRect().height
        };
    } else {
        return this.getScrollTop($element.parent());
    }
}
SiteTip.prototype.getComputedStyle = function(obj) {
    if (window.getComputedStyle) {
        style = window.getComputedStyle(obj, null); // 非IE
    } else {
        style = obj.currentStyle; // IE
    }
    return style;
}
$.fn.extend({
    Tip: Tip
});
