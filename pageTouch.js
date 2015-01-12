    browser = {
        addEventListener: !!window.addEventListener,
        gravity: !!window.DeviceOrientationEvent,
        cssCore: function(testCss) {
            switch (true) {
                case testCss.webkitTransition === '': return 'webkit';
                    break;
                case testCss.MozTransition === '': return 'Moz';
                    break;
                case testCss.msTransition === '': return 'ms';
                    break;
                case testCss.OTransition === '': return 'O';
                    break;
                default:
                    return '';
            }
        } (document.createElement('Gardenliu').style),
        Y: function() {
            return document.documentElement.clientHeight || window.innerHeight;
        } ()
    };
    function setDuration(obj, speed) {
        var style = obj && obj.style;
        if (!style) return;
        if (browser.cssCore === 'webkit') {
            style.webkitTransitionDuration = speed + 'ms';
            return;
        }
        style.transitionDuration= style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = speed + 'ms';
    }

    function translate(obj, distx, disty) {

        var style = obj && obj.style;
        if (!style) return;

        switch (browser.cssCore) {
            case 'webkit':
                style.webkitTransform = 'translate(' + distx + 'px,' + disty + 'px)' +
                        'translateZ(0)';
                break;
            case 'Moz':
                style.MozTransform = 'translate(' + distx +'px,' + disty + 'px)';
                break;
            case 'ms':
                style.msTransform = 'translate(' + distx +'px,' + disty + 'px)';
                break;
            case 'O':
                style.OTransform = 'translate(' + distx +'px,' + disty + 'px)';
                break;
            default:
                style.trannform = 'translate(' + distx +'px,' + disty + 'px)';
                break;
        }
    }
    function transYPostion(cssText){
        var idx= cssText.indexOf(",")>-1?cssText.indexOf(",")+1:0;
        if(idx){
            return parseInt(cssText.slice(idx))
        }else{
            return 0;
        }
    }
    function noScroll(ev){
        ev.preventDefault();
    }
    var section=document.querySelector(".section"),
            pages=document.querySelectorAll(".page");
    window.addEventListener("load",init,false);
    function init(){
        document.body.addEventListener("scroll",noScroll,false);
        for(var i=0;i<pages.length;i++){
            pages[i].style.height=browser.Y+"px"
        }
        pageTouch({
            oTouch:section
        })
    };

    function pageTouch(option){
        var index=0;
        var events = {
            startPot:{},
            distance:{},
            postion:0,
            handleEvent:function(ev){
                switch (ev.type){
                    case "touchstart":
                        this.start(ev);break;
                    case "touchmove":
                        this.move(ev);break;
                    case "touchend":
                        this.end(ev);break;
                }
            },
            start:function(ev){
                ev.preventDefault();
                this.startPot={
                    X:ev.touches[0].clientX,
                    Y:ev.touches[0].clientY,
                    time:+new Date()
                }

                this.postion=transYPostion(ev.currentTarget.style.cssText);
                document.addEventListener("touchmove",events,false);
                document.addEventListener("touchend",events,false);
            },
            move:function(ev){
                if(ev.touches.length>1 || ev.scale & ev.scale !==1) return;
                var touches=ev.touches[0];
                this.distance={
                    disX:touches.clientX-this.startPot.X,
                    disY:touches.clientY-this.startPot.Y,
                    disT:+new Date()-this.startPot.time
                };
//            do something
            },
            end:function(ev){
                var dY=this.distance.disY,
                        childEleNum=section.children.length,
                        sectionH=childEleNum*browser.Y;
                console.log(index)
                showPage(index)
                if(Math.abs(dY)>50 && dY<0 && this.postion>browser.Y-sectionH){
                    translate(section,0,this.postion-browser.Y);
                    index++;
                }else if(Math.abs(dY)>50 && dY>0 && this.postion<0){
                    translate(section,0,this.postion+browser.Y);
                    index--;
                }
                document.removeEventListener("touchmove",events,false)
                document.removeEventListener("touchend",events,false)
            }
        }
        option.oTouch.addEventListener("touchstart",events,false);
        function showPage(idx){
            var oPage=option.oTouch.children[idx],
                    pageNum=option.oTouch.children.length;
            if(idx==0){
                oPage.nextElementSibling.classList.add("topPage");
            }else if(idx==pageNum-1){
                oPage.previousElementSibling.classList.add("topPage");
            }else{
                oPage.nextElementSibling.classList.add("topPage");
                oPage.previousElementSibling.classList.add("topPage");
            }
            oPage.classList.remove("topPage");
            oPage.classList.add("topPage");
        }
    }
