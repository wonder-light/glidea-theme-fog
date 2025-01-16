let fadeTime = 50;

class JqueryGlobal {
  #functions = [];
  #pjaxFunctions = [];
  #loads = [];
  
  constructor() {
    $(() => this.exe.call(this));
    $(document).pjax("a[data-pjax]", "#wl-main", { fragment: "#wl-main", timeout: 8e3 })
               .on("pjax:complete", () => {this.pjax.call(this)})
               .on("pjax:start", function () {Utils.updateLoading(!0)})
               .on("pjax:end", function () {Utils.updateLoading(!1)});
    window.onload && this.addLoad(window.onload);
    window.onload = () => this.load.call(this);
  }
  
  add(...funs) {
    this.#functions.push(...funs)
  }
  
  exe() {
    for (let e of this.#functions) {
      try {
        e?.call()
      }
      catch (t) {
        Utils.log("JQG.exe : ", t.message, e.toString(), t)
      }
    }
  }
  
  addPjax(...funs) {
    this.#pjaxFunctions.push(...funs)
  }
  
  pjax() {
    for (let fun of this.#pjaxFunctions) {
      try {fun?.call()}
      catch (t) {Utils.log("JQG.pjax : ", t.message, fun.toString(), t)}
    }
  }
  
  addLoad(...t) {this.#loads.push(...t)}
  
  load() {
    for (let e of this.#loads) {
      try {e?.call()}
      catch (t) {Utils.log("JQG.loads : ", t.message, e.toString(), t)}
    }
  }
}

const JQG = new JqueryGlobal;

class SiteMenu {
  static sideState = !1;
  static menuPosition = "left";
  static icons = [];
  
  static init(position, icons) {
    SiteMenu.menuPosition = position ?? "left";
    SiteMenu.icons = icons ?? {};
    if ("left" === SiteMenu.menuPosition) {
      $("#wl-side-tabs").on("click", SiteMenu.openAndClose);
      if (!Utils.isMobile()) {
        SiteMenu.open();
      }
    }
    SiteMenu.setIcons();
  }
  
  static open() {
    "left" === SiteMenu.menuPosition && ($("#wl-side-all").removeAttr("style"), $("#wl-main").removeAttr("style"), SiteMenu.sideState = !0, $("#wl-side-tabs")
      .addClass("active"))
  }
  
  static close() {
    if ("left" === SiteMenu.menuPosition) {
      $("#wl-side-all").css("left", "-30%");
      $("#wl-main").css("width", "60vw").css("margin-left", "20vw");
      SiteMenu.sideState = false;
      $("#wl-side-tabs").removeClass("active");
    }
  }
  
  static openAndClose() {
    SiteMenu.sideState ? SiteMenu.close() : SiteMenu.open();
  }
  
  static setIcons() {
    let el = $(".wl-menu-icon");
    let length = el.length;
    for (let t = 0; t < length; t++) {
      let name = el.eq(t).attr("alt");
      let icon = SiteMenu.icons[name];
      if (icon) {
        el.eq(t).attr("src", icon);
        el.eq(t).show();
      }
    }
  }
}

class SiteSearch {
  static enable = !1;
  static searchValue = "";
  static arrLinks = [];
  static arrTitles = [];
  static arrContents = [];
  static arrResults = [];
  static indexItem = [];
  static itemLength = 0;
  static searchInput;
  static searchResults;
  static tmpDiv;
  
  static init(t = !1) {SiteSearch.enable = t, SiteSearch.enable && (SiteSearch.searchInput = document.querySelector("#search-input"), SiteSearch.searchResults = document.querySelector(".search-results"), SiteSearch.tmpDiv = document.createElement("div"), SiteSearch.tmpDiv.className = "wl-bg-white wl-p-1 wl-rounded-sm wl-cursor-pointer", Utils.checkPostCache() && SiteSearch.getPostStorageContent(), SiteSearch.searchInput.oninput = SiteSearch.searchConfirm, SiteSearch.searchInput.onfocus = () => SiteSearch.searchResults.style.display = "block")}
  
  static searchInit(t = !0) {SiteSearch.enable && (t && (SiteSearch.searchInput.value = ""), SiteSearch.arrResults = [], SiteSearch.indexItem = [], SiteSearch.searchResults.innerHTML = "", SiteSearch.searchResults.style.display = "block")}
  
  static getPostStorageContent() {
    if (SiteSearch.enable) {
      var e = JSON.parse(localStorage.getItem("ContentsCache")).posts;
      for (let t = 0; t < e.length; t++) {
        SiteSearch.arrLinks[t] = e[t].link, SiteSearch.arrTitles[t] = e[t].title, SiteSearch.arrContents[t] = e[t].content, SiteSearch.itemLength++
      }
    }
  }
  
  static searchConfirm(...t) {
    Utils.log("search confirm", ...t), "" === SiteSearch.searchInput.value ? SiteSearch.searchResults.style.display = "none"
                                                                           : 0 <= SiteSearch.searchInput.value.search(/^\s+$/)
                                                                             ? (SiteSearch.searchInit(), (t = SiteSearch.tmpDiv.cloneNode(!0)).innerText = "请输入有效内容...", SiteSearch.searchResults.appendChild(t))
                                                                             : (SiteSearch.searchInit(!1), SiteSearch.searchValue = SiteSearch.searchInput.value, Utils.log("search confirm loading", SiteSearch.searchValue), SiteSearch.searchMatching(SiteSearch.arrTitles, SiteSearch.arrContents, SiteSearch.searchValue))
  }
  
  static searchMatching(a, i, s) {
    s = new RegExp(s, "i");
    var o = 10;
    for (let e = 0; e < SiteSearch.itemLength; e++) {
      var n, l = i[e].search(s);
      let t = 0;
      -1 !== a[e].search(s) ? (SiteSearch.indexItem.push(e), -1 !== l ? (t = 0 <= l - o ? l - o
                                                                                        : 0, n = i[e].slice(l - o, l + 5), SiteSearch.arrResults.push("....." + n + "....."))
                                                                      : SiteSearch.arrResults.push(""))
                            : -1 !== l && (SiteSearch.indexItem.push(e), t = 0 <= l - o ? l - o
                                                                                        : 0, n = i[e].slice(l - o, l + 5), SiteSearch.arrResults.push("....." + n + "....."))
    }
    var t = SiteSearch.tmpDiv.cloneNode(!0);
    t.innerHTML = "<b>总匹配：" + SiteSearch.indexItem.length + " 项<hr></b>", SiteSearch.searchResults.appendChild(t), 0 === SiteSearch.indexItem.length && ((t = SiteSearch.tmpDiv.cloneNode(!0)).innerText = "未匹配到内容...", SiteSearch.searchResults.appendChild(t));
    for (let t = 0; t < SiteSearch.arrResults.length; t++) {
      var e = SiteSearch.tmpDiv.cloneNode(!0);
      e.innerHTML = `
            <a data-pjax class="wl-text-black" href="${ SiteSearch.arrLinks[SiteSearch.indexItem[t]] }">
                <b class="wl-line-clamp-1">[${ SiteSearch.arrTitles[SiteSearch.indexItem[t]] }]</b>
                <p class="wl-line-clamp-1">[${ SiteSearch.arrResults[t] }]</p>
                <hr>
            </a>
            `, SiteSearch.searchResults.appendChild(e)
    }
  }
}

class SitePost {
  static #postNumChoice = !0;
  static #commentsChoice;
  static #commentId;
  static #commentKey;
  static #shareChoice = !1;
  static #readingMode = !1;
  
  static initValue(t, e, a, i) {
    SitePost.#postNumChoice = t, SitePost.#commentsChoice = e, SitePost.#commentId = a, SitePost.#commentKey = i
  }
  
  static isPost() {return -1 !== window.location.pathname.indexOf("post")}
  
  static getHot() {
    if (SitePost.#postNumChoice && "default" !== SitePost.#commentsChoice) {
      let t = window.location.pathname;
      if (-1 === t.search("post")) return !1;
      t.endsWith("/") || (t += "/"), "twikoo" === SitePost.#commentsChoice ? SitePost._twikooHot(t) : SitePost._valineHot(t)
    }
  }
  
  static update() {
    SitePost.isPost() && (SitePost.getHot(), SitePost.#shareChoice && Utils.shareInit(), "default" === SitePost.#commentsChoice && $("#wl-comment")
      .hide(), Utils.imgLazyLoad(), Utils.codeCopyInit(), SitePost._code(), SitePost._renderMath(), Utils.backToTopInit(), "default" === SitePost.#commentsChoice) && (setTimeout(Utils.replaceAvatar, 3e3), setTimeout(Utils.replaceAvatar, 8e3))
  }
  
  static readingMode() {
    if (SitePost.#readingMode) {
      SiteMenu.open();
      $("#wl-side-tabs").fadeIn(4 * fadeTime);
      $("#wl-bg").fadeIn(4 * fadeTime);
      $("#wl-side-all").fadeIn(4 * fadeTime);
      $(".markdownIt-TOC a").css("color", "antiquewhite");
      SitePost.#readingMode = false;
    }
    else {
      SiteMenu.close();
      $("#wl-side-tabs").fadeOut(4 * fadeTime);
      $("#wl-bg").fadeOut(4 * fadeTime);
      $("#wl-side-all").fadeOut(4 * fadeTime);
      $(".markdownIt-TOC a").css("color", "black");
      SitePost.#readingMode = true;
    }
  }
  
  static _code() {
    hljs.initHighlightingOnLoad(), hljs.initLineNumbersOnLoad({ singleLine: !0 }), document.querySelectorAll("pre code")
                                                                                           .forEach(t => {hljs.highlightBlock(t), hljs.lineNumbersBlock(t)})
  }
  
  static _renderMath() {
    "function" == typeof renderMathInElement && renderMathInElement(document.body, {
      delimiters: [
        {
          left: "$$", right: "$$", display: !0,
        }, { left: "$", right: "$", display: !1 },
      ],
    })
  }
  
  static _valineHot(t) {
    var e = SitePost.#commentId, a = SitePost.#commentKey, e = (AV.init({ appId: e, appKey: a }), new AV.Query("Counter"));
    e.equalTo("url", t);
    let i;
    e.find().then(function (t) {
      var e;
      0 === t.length ? (new (AV.Object.extend("Counter"))).save({ time: 1, title: p_title, url: pl, xid: pl }).then(function (t) {
        var e = $("#wl-hot-num");
        e.eq(0).html(1), e.eq(1).html(1)
      }) : (e = t[0].id, e = AV.Object.createWithoutData("Counter", e), i = t[0].attributes.time + 1, e.set("time", i), e.save(), (t = $("#wl-hot-num")).eq(0)
                                                                                                                                                        .html(1), t.eq(1)
                                                                                                                                                                   .html(1))
    }, function (t) {Utils.log("valine get hot error", t)})
  }
  
  static _twikooHot(t) {
    $.ajax({
      url: SitePost.#commentId, type: "POST", timeout: 3e3, data: JSON.stringify({ url: t, href: window.location.href }), dataType: "json",
      success: function (t) {
        var e = $("#wl-hot-num");
        e.eq(0).html(t.hot), e.eq(1).html(t.hot)
      }, error: function (t) {Utils.log("twikoo get hot error", t)},
    })
  }
  
  /**
   * 更新复刻统计
   * @param {boolean} updateTotal
   * @param {boolean} updateView
   */
  static updateTotalView(updateTotal = true, updateView = true) {
    $.ajax({
      url: "https://api-nianian.netlify.app/.netlify/functions/site-visits",
      type: "POST",
      timeout: 3e3,
      data: JSON.stringify({
        url: window.location.origin,
        updateTotal: updateTotal,
        updateView: updateView,
      }), dataType: "json",
      success: function (t) {
        $("#value_site_pv").html(t.total);
        $("#value_site_uv").html(t.view);
      },
      error: (t) => Utils.log("twikoo get hot error", t),
    })
  }
}

class Utils {
  static words = [];
  
  static one() {
    var t;
    Utils.updateLoading(), Utils.switchTheme(!0), SitePost.updateTotalView(!0, !0), Utils.update(), Utils.isMobile() && (t = $("#wl-bg")).attr("src", t.attr("mobile-src")), Utils.dragLive2d()
  }
  
  static update() {Utils.updateTagColor(), Utils.updateWordAnim("#wordAnim1"), Utils.updateWordAnim("#wordAnim2"), SitePost.update()}
  
  static isMobile() {return Math.min(window.screen.width, window.visualViewport.width, window.innerWidth) <= 1200}
  
  static randomColor() {return "#" + Math.floor(16777215 * Math.random()).toString(16)}
  
  static updateTagColor() {$(".wl-tag").each(function () {$(this).css("color", Utils.randomColor())})}
  
  static updateWordAnim(t) {
    let c = document.querySelector(t);
    if (null != c) {
      let r = JSON.parse(c.getAttribute("data-text"));
      if (-1 === Utils.words.indexOf(t)) {
        Utils.words.push(t);
        let i = 0, s = 1, o = 500, n = null, l = !1;
        window.requestAnimationFrame(function t(e) {
          var a;
          window.requestAnimationFrame(t), e - (n = n || e) > o && (a = r[i], l ? c.innerHTML = "&nbsp;" + a.slice(0, s--)
                                                                                : (c.innerHTML = "&nbsp;" + a.slice(0, ++s), o = 500 - 400 * Math.random()), n = e, s === a.length && (l = !0, o = 100, n = e + 1e3), s < 0) && (l = !1, n = e + 200, i = ++i % r.length)
        })
      }
    }
  }
  
  /**
   * 更新站点时间
   * @param {string} str
   */
  static updateSiteTime(str) {
    let el = document.getElementById("site-go-times");
    if (!el) return;
    setInterval(function () {
      let date = new Date(str + " 00:00:00");
      let sec = (new Date - date) / 1e3;
      let day = Math.floor(sec / 86400);
      let hor = Math.floor(sec % 86400 / 3600);
      let min = Math.floor(sec % 3600 / 60);
      sec = Math.floor(sec % 60);
      hor = (hor + "").padStart(2, "0");
      min = (min + "").padStart(2, "0");
      sec = (sec + "").padStart(2, "0");
      el.innerHTML = `本站已安全运行 ${ day } 天 ${ hor } 小时 ${ min } 分 ${ sec } 秒`
    }, 250);
  }
  
  static updateLoading(t = !1) {
    var e = $("#wl-loading");
    e.length <= 0 || (t ? e.fadeIn(8 * fadeTime)
                        : e.fadeOut(8 * fadeTime), null == e.attr("content") && (JQG.addLoad(() => Utils.updateLoading(!1)), e.attr("content", "init")))
  }
  
  static addScript(t, e) {$.getScript(t, e)}
  
  static call(t, e) {return () => t.call(e ?? t)}
  
  static log() {window.location.hostname.includes("localhost")}
  
  static sleep(e) {return new Promise(t => setTimeout(t, e))}
  
  static checkPostCache() {
    let postNUm = parseInt(localStorage.getItem("posts-num"));
    let el = $("#side-post-title");
    let title = parseInt(el.attr("title"));
    let content = parseInt(el.attr("content"));
    let len = parseInt(localStorage.getItem("posts-title-len"));
    let result = postNUm === title && content === len;
    if (!result) Utils.log("checkCache 更新缓存");
    return result;
  }
  
  static getApi(t = "get", e, a, i) {
    let s = new XMLHttpRequest;
    s.open(t, e, !0), s.send(null), s.onreadystatechange = function () {4 === s.readyState && (200 === s.status ? a(s.responseText) : i(s.status))}
  }
  
  static apiGetPostContent(t) {
    var e, a;
    Utils.checkPostCache() || (e = t, (a = document.createElement("link")).href = e, a.rel = "preload", a.as = "fetch", a.crossOrigin = "anonymous", document.head.appendChild(a), Utils.getApi("get", t, function (t) {
      var e, a;
      e = JSON.parse(t), localStorage.setItem("posts-num", "" + e.posts.length), a = e.posts.reduce((t, e) => t + e.title.length, 0), Utils.log("content 获取成功", e.posts, a), localStorage.setItem("posts-title-len", "" + a), localStorage.setItem("ContentsCache", t), SiteSearch.getPostStorageContent()
    }, function (t) {Utils.log(t)}))
  }
  
  static topShareBgSwitch() {
    var t = $("#social-menu");
    "none" === t.css("display") ? t.show().animate({ zoom: "1", opacity: "1" }, 300, "linear") : t.animate({
      zoom: "0", opacity: "0",
    }, 300, "linear", function () {$(this).hide()})
  }
  
  static backToTopInit() {
    $("#wk-toggle").click(function () {$("html,body").animate({ scrollTop: "0px" }, 800)}), $(window)
      .scroll(function () {30 < $(window).scrollTop() ? $("#wk-toggle").fadeIn(8 * fadeTime) : $("#wk-toggle").fadeOut(2 * fadeTime)})
  }
  
  static replaceAvatar() {
    var e = $(".tk-avatar-img");
    for (let t = 0; t < e.length; t++) {
      -1 !== e.eq(t).attr("src")?.search("cn.gravatar.com") && e.eq(t)
                                                                .attr("src", window.location.origin + "/media/images/comavatar.png%>")
    }
  }
  
  static showQQ(t) {"" !== t ? window.location.href = "tencent://message/?uin=" + t + "&Site=&Menu=yes" : alert("博主暂未设置QQ联系方式")}
  
  static showWechat(t) {return alert("博主微信号：" + t), !1}
  
  static showAplayer() {
    var t = $(".aplayer");
    t.length <= 0 || ("block" === t.css("display") ? t.fadeOut(4 * fadeTime) : t.fadeIn(4 * fadeTime))
  }
  
  static aplayerPlay() {
    var t, e = document.querySelectorAll("meting-js")[0]?.aplayer;
    e && (t = $("#wl-m-aplayer"), !0 === e.paused ? (e.play(), e.lrc.hide(), t.removeClass("fa-circle-play"), t.addClass("fa-circle-pause"))
                                                  : (e.pause(), t.addClass("fa-circle-play"), t.removeClass("fa-circle-pause")))
  }
  
  static shareInit() {
    new Share("#share-post", {
      title: $("#p-title").html(), initialized: !0, description: $('meta[name="description"]').attr("content"), image: $("#wl-avatar").attr("src"),
      sites: ["weibo", "qq", "wechat", "douban", "qzone", "facebook", "twitter", "google"], wechatQrcodeTitle: "微信扫一扫：分享",
      wechatQrcodeHelper: "<p>微信里扫一下二维码</p><p>便可将本文分享至朋友圈。</p>", disabled: ["google", "linkedin"], wechatQrcodePosition: "bottom",
    })
  }
  
  static donateSwitch() {
    var t = Utils.donateSwitch.open ?? !1, e = $("#wl-donate");
    t ? e.fadeOut(4 * fadeTime) : e.fadeIn(4 * fadeTime), Utils.donateSwitch.open = !t
  }
  
  static codeCopyInit() {
    var t = $("pre code");
    t.length <= 0 || (t.each(function (t) {
      var e = $(this), t = "code_id_" + t, a = (e.attr("id", t), Math.round(e.height() / parseFloat(e.css("line-height"))));
      a <= 0 || e.before(`<button class="copy-bt wl-w-24 wl-absolute wl-right-16 wl-rounded wl-text-white wl-bg-sky-400 wl-m-0 wl-font-kaiti wl-transition-all wl-duration-300" data-clipboard-target="#${ t }">复制代码</button>`)
    }), (t = new ClipboardJS(".copy-bt")).on("success", async function (t) {
      var e = $(t.trigger);
      e.html("复制成功~"), e.removeClass("wl-bg-sky-400")
                            .addClass("wl-bg-purple-400"), t.clearSelection(), await Utils.sleep(8e3), e.html("复制代码"), e.removeClass("wl-bg-purple-400")
                                                                                                                            .addClass("wl-bg-sky-400")
    }), t.on("error", function (t) {alert("矮油，复制失败了...手动复制吧勇士！"), t.clearSelection()}))
  }
  
  static imgLazyLoad(e = null) {
    let a = $("img").filter(function () {
      var t = $(this).attr("class");
      return null == t || t === e
    });
    
    function i() {
      let t = $(this).height() + $(document).scrollTop();
      a.each(function () {$(this).offset().top < t && ($(this).trigger("appear"), a = a.not(this))}), a.length <= 0 && $(window).unbind("scroll", i)
    }
    
    Utils.log("imgLazyLoad loads", a), a.each(function () {
      let t = $(this), e = (t.attr("class", "lazy-load"), t.attr("src"));
      t.attr("data-original", e), t.addClass("img-loading"), t.attr("src", "/media/images/imgloading.gif"), t.wrap(`<span data-fancybox="images" href="${ e }"></span>`), t.one("appear", function () {t.attr("src", e), t.on("load", function () {t.removeClass("img-loading")})})
    }), $(window).bind("scroll", i), i()
  }
  
  static loadOhLive2D(config) {
    if (typeof wlLive2d != 'undefined' && wlLive2d != null) {
      Utils.loadOhLive2D.config = config ?? Utils.loadOhLive2D.config;
      Utils.loadOhLive2D.live2d = wlLive2d(Utils.loadOhLive2D.config);
    }
  }
  
  static dragLive2d() {
    let r = $("#oml-stage"), c = (r.addClass("oml-right"), !0), d = {
      w: Math.min(window.screen.width, window.visualViewport.width, window.innerWidth),
      h: Math.min(window.screen.height, window.visualViewport.height, window.innerHeight),
    };
    Utils.log("dragLive2d - gl", d), r.mousedown(function (t) {
      let e = t.clientX, a = t.clientY, i = $(this), s = i.width(), o = i.height(), n = i.position();
      
      function l() {i.unbind("mousemove").unbind("mouseup").unbind("mouseover")}
      
      i.mousemove(function (t) {
        n.left = Math.max(0, Math.min(n.left + t.clientX - e, d.w - s)), n.top = Math.max(0, Math.min(n.top + t.clientY - a, d.h - o)), e = t.clientX, a = t.clientY, n.left < .4 * d.w && c && (i.removeClass("oml-right"), c = !1);
        n.left > .6 * d.w && !c && (r.addClass("oml-right"), c = !0);
        i.css("left", n.left).css("top", n.top)
      }), i.mouseup(l), i.mouseover(l)
    })
  }
  
  static switchTheme(t = !1) {
    let e = localStorage.getItem("theme-mode") ?? "light";
    t || (e = "light" === e ? "dark" : "light"), $("html").attr("theme", e);
    t = Utils.isMobile() ? $("#wl-bg-m") : $("#wl-bg");
    "dark" === e ? (t.fadeOut(8 * fadeTime), $("#wl-moon").attr("src", "/media/images/sun.png")) : (t.fadeIn(8 * fadeTime), $("#wl-moon")
      .attr("src", "/media/images/moon.png")), localStorage.setItem("theme-mode", e)
  }
}