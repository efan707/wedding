//添加缓动扩展
jQuery.extend(jQuery.easing,{
    easeOutBack: function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    }
})
 
    var pageArr;
 
    function rotateDown(index) {
        if (index < 0 || index >= pageArr.length) {
            return;
        }
        var ele = pageArr.eq(index);
        ele.children("a").css("background-color", "#fff");
        var obj = ele.data("obj");
        if (!obj) {
            ele.data("obj", { r: getNumByEle(ele) });
            obj = ele.data("obj");
        }
        else obj.r = getNumByEle(ele);
        $(obj).animate({ r: 0 }, {
            duration: 1000,
            easing: "easeOutBack",
            step: function () {
                ele.css({
                    "-moz-transform": "rotateX(" + this.r + "deg)",
                    "-webkit-transform": "rotateX(" + this.r + "deg)",
                    "-0-transform": "rotateX(" + this.r + "deg)",
                    "-ms-transform": "rotateX(" + this.r + "deg)",
                    "transform": "rotateX(" + this.r + "deg)"
                });
 
                //根据偏移量判断是否展开下一个
                if (ele.data("opening")) return;  //已经开始折叠下一个了
                var rotateOff = getNumByEle(ele);
                if (rotateOff > -120) {
                    ele.data("opening", true);
                    rotateDown(index + 1);
                }
            },
            complete: function () {
                ele.css({
                    "-moz-transform": "rotateX(0deg)",
                    "-webkit-transform": "rotateX(0deg)",
                    "-0-transform": "rotateX(0deg)",
                    "-ms-transform": "rotateX(0deg)",
                    "transform": "rotateX(0deg)"
                });
            }
        });
    }
 
    function rotateUp(index) {
        if (index < 0 || index >= pageArr.length) {
            return;
        }
        var ele = pageArr.eq(index);
        ele.children("a").css("background-color", "rgb(223,223,223)");
        var obj = ele.data("obj");
        if (!obj) {
            ele.data("obj", { r: getNumByEle(ele) });
            obj = ele.data("obj");
        }
        else obj.r = getNumByEle(ele);
        $(obj).animate({ r: -180 }, {
            duration: 600,
            easing: "linear",
            step: function () {
                ele.css({
                    "-moz-transform": "rotateX(" + this.r + "deg)",
                    "-webkit-transform": "rotateX(" + this.r + "deg)",
                    "-0-transform": "rotateX(" + this.r + "deg)",
                    "-ms-transform": "rotateX(" + this.r + "deg)",
                    "transform": "rotateX(" + this.r + "deg)"
                });
 
                //根据偏移量判断是否折叠上一个
                if (ele.data("closing")) return;  //已经开始折叠上一个了
                var rotateOff = getNumByEle(ele);
                if (rotateOff < -60) {
                    ele.data("closing", true);
                    rotateUp(index - 1);
                }
            },
            complete: function () {
                            ele.css({
                    "-moz-transform": "rotateX(-180deg)",
                    "-webkit-transform": "rotateX(-180deg)",
                    "-0-transform": "rotateX(-180deg)",
                    "-ms-transform": "rotateX(-180deg)",
                    "transform": "rotateX(-180deg)"
                });
            }
        });
    }
 
    function getNumByEle(ele) {
        var rotateStyle = ele.attr("style");
        return rotateStyle.match(/rotateX\(([-]?\d+)/)[1];
    }
 
    function stopAll() {
        for (var i = 0; i < pageArr.length; i++) {
            var ele = pageArr.eq(i);
            ele.data("opening", false);
            ele.data("closing", false);
            var obj = ele.data("obj");
            if (obj && $(obj).stop) {
                $(obj).stop(true, false);
            }
        }
    }
 
$(function(){
    pageArr = $("#fold .fold_pager"); 
    $("#fold").mousemove(function (e) {  //Y轴旋转
        var el = e.clientX - $(this).offset().left;
        var off = 60 * el / $(this).width() - 30;
        //this.style.transform = "rotateY(" + off + "deg)";
        $(this).css({
            "-webkit-transform":"rotateY(" + off + "deg)",
            "-moz-transform":"rotateY(" + off + "deg)",
            "-ms-transform":"rotateY(" + off + "deg)",
            "-o-transform":"rotateY(" + off + "deg)",
            "transform":"rotateY(" + off + "deg)"
        });
    }).mouseenter(function () {  //展开
        stopAll();
        rotateDown(0);
    }).mouseleave(function () {    //折叠
        stopAll();
        rotateUp(pageArr.length - 1);
    });
});