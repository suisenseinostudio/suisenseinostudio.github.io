function mediaQueriesWin(){$(window).width()<=960?($(".has-child>a").off("click"),$(".has-child>a").on("click",function(){var e=$(this).parent();return $(e).toggleClass("active"),$(e).children("ul").stop().slideToggle(500),!1})):($(".has-child>a").off("click"),$(".has-child>a").removeClass("active"),$(".has-child").children("ul").css("display",""))}function tabClicked(e){e.preventDefault();e=(e=$(e.target).attr("href")).replace("#","");$("#wrapper").removeClass().addClass(e)}function FixedAnime(){var e=$("#about,#title").offset().top,a=$(window).scrollTop();a<=20?$("#header").addClass("DownMove"):e<=a?($("#header").removeClass("UpMove"),$("#header").addClass("DownMove")):$("#header").hasClass("DownMove")&&($("#header").removeClass("DownMove"),$("#header").addClass("UpMove"))}function setFadeElement(){var e=$(window).height(),a=$(window).scrollTop();($("#contact").length?Math.round($("#contact").offset().top):$("#footer").length?Math.round($("#footer").offset().top):a+e+1)<=a+e?($("#page-top").addClass("LeftMove"),$("#page-top").removeClass("RightMove"),$(".hide-btn").removeClass("hide-btn")):$(".hide-btn").length||($("#page-top").addClass("RightMove"),$("#page-top").removeClass("LeftMove"))}function GethashID(a){a&&$(".tab li").find("a").each(function(){var e;$(this).attr("href")==a&&(e=$(this).parent(),$(".tab li").removeClass("active"),$(e).addClass("active"),$(".area").removeClass("is-active"),$(a).addClass("is-active"))})}function fadeAnime(){$(".bgappearTrigger").each(function(){var e=$(this).offset().top-50,a=$(window).scrollTop();e-$(window).height()<=a?$(this).addClass("bgappear"):$(this).removeClass("bgappear")}),$(".bgLRextendTrigger").each(function(){var e=$(this).offset().top-50,a=$(window).scrollTop();e-$(window).height()<=a?$(this).addClass("bgLRextend"):$(this).removeClass("bgLRextend")}),$(".bgRLextendTrigger").each(function(){var e=$(this).offset().top-50,a=$(window).scrollTop();e-$(window).height()<=a?$(this).addClass("bgRLextend"):$(this).removeClass("bgRLextend")}),$(".contents-area").each(function(){var e=$(this).offset().top-50,a=$(window).scrollTop();e-$(window).height()<=a?$(this).addClass("startwd"):$(this).removeClass("startwd")}),$(".marker").each(function(){var e=$(this).offset().top+100,a=$(window).scrollTop();e-$(window).height()<=a?$(this).addClass("marker-on"):$(this).removeClass("marker-on")})}$(".tab_nav a").click(tabClicked),$(".g-nav-openbtn").click(function(){$(this).toggleClass("active"),$("#g-nav").toggleClass("panelactive")}),$("#g-nav a").click(function(){$(".g-nav-openbtn").removeClass("active"),$("#g-nav").removeClass("panelactive")}),$("#page-top").click(function(){return $("body,html").animate({scrollTop:0},500),!1}),$(".tab a").on("click",function(){return GethashID($(this).attr("href")),!1}),$(window).on("load",function(){$(".tab li:first-of-type").addClass("active"),$(".area:first-of-type").addClass("is-active"),GethashID(location.hash)}),$(".tab a").on("click",function(){return GethashID($(this).attr("href")),!1}),$(window).resize(function(){mediaQueriesWin()}),$(window).scroll(function(){FixedAnime(),setFadeElement(),fadeAnime()}),$(window).on("load",function(){$("#splash-logo").delay(1200).fadeOut("slow"),$("#splash").delay(1500).fadeOut("slow",function(){$("body").addClass("appear"),mediaQueriesWin(),FixedAnime(),setFadeElement(),GethashID(location.hash)}),$(".splashbg").on("animationend",function(){fadeAnime()})});