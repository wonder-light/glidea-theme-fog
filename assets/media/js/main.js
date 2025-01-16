// 淡入淡出的基础时间
const fadeTime = 50;

/**
 * 全局 JQuery 函数
 */
class JqueryGlobal {
  #functions = [];
  #pjaxFunctions = [];
  #loads = [];

  constructor() {
    $(() => this.exe.call(this));
    $(document).pjax('a[data-pjax]', '#wl-main', { fragment: '#wl-main', timeout: 8e3 })
               .on('pjax:complete', () => this.pjax.call(this))
               .on('pjax:start', () => Utils.updateLoading(true))
               .on('pjax:end', () => Utils.updateLoading(false));
    window.onload && this.addLoad(window.onload);
    window.onload = () => this.load.call(this);
  }

  // 添加函数
  add(...funs) {
    this.#functions.push(...funs);
    console.log('add');
  }

  // 执行
  exe() {
    console.log('exe', this.#functions);
    for(let e of this.#functions) {
      try {
        e?.call();
      }
      catch(t) {
        Utils.log('JQG.exe : ', t.message, e.toString(), t);
      }
    }
  }

  // 添加 pjax 方法
  addPjax(...items) {
    this.#pjaxFunctions.push(...items);
  }

  // pjax 完成时执行
  pjax() {
    for(let fun of this.#pjaxFunctions) {
      try {
        fun?.call();
      }
      catch(t) {
        Utils.log('JQG.pjax : ', t.message, fun.toString(), t);
      }
    }
  }

  // 天极爱加载后执行的函数
  addLoad(...t) {
    this.#loads.push(...t);
  }

  // 执行加载
  load() {
    console.log('load', this.#loads);
    for(let e of this.#loads) {
      try {
        e?.call();
      }
      catch(t) {
        Utils.log('JQG.loads : ', t.message, e.toString(), t);
      }
    }
  }
}

// 全局 JQG
const JQG = new JqueryGlobal;

// 站点菜单
class SiteMenu {
  // 菜单状态, true: 打开, false: 关闭
  static sideState = false;
  // 菜单位置
  static menuPosition = 'left';
  // 菜单图标 {名称: 链接}
  static icons = [];

  // 初始化
  static init(position, icons) {
    SiteMenu.menuPosition = position ?? 'left';
    SiteMenu.icons = icons ?? {};
    if('left' === SiteMenu.menuPosition) {
      $('#wl-side-tabs').on('click', SiteMenu.openAndClose);
      if(!Utils.isMobile()) {
        SiteMenu.open();
      }
    }
    SiteMenu.setIcons();
  }

  // 菜单打开
  static open() {
    if('left' !== SiteMenu.menuPosition) return;
    $('#wl-side-all').removeAttr('style');
    $('#wl-main').removeAttr('style');
    SiteMenu.sideState = true;
    $('#wl-side-tabs').addClass('active');
  }

  // 菜单关闭
  static close() {
    if('left' !== SiteMenu.menuPosition) return;
    $('#wl-side-all').css('left', '-30%');
    $('#wl-main').css('width', '60vw').css('margin-left', '20vw');
    SiteMenu.sideState = false;
    $('#wl-side-tabs').removeClass('active');
  }

  // 菜单打开和关闭
  static openAndClose() {
    SiteMenu.sideState ? SiteMenu.close() : SiteMenu.open();
  }

  // 设置图标
  static setIcons() {
    let el = $('.wl-menu-icon');
    let length = el.length;
    for(let t = 0; t < length; t++) {
      let name = el.eq(t).attr('alt');
      let icon = SiteMenu.icons[name];
      if(icon) {
        el.eq(t).attr('src', icon);
        el.eq(t).show();
      }
    }
  }
}

// 站点搜索
class SiteSearch {
  // 启用
  static enable = false;
  // 搜索值
  static searchValue = '';
  // 搜索到的链接
  static arrLinks = [];
  // 搜索到的标题
  static arrTitles = [];
  // 搜索到的内容
  static arrContents = [];
  // 搜索结果
  static arrResults = [];
  // 每个项目的索引
  static indexItem = [];
  // 长度
  static itemLength = 0;
  // 输入值
  static searchInput;
  // 搜索结果
  static searchResults;
  // 呈现的容器元素
  static tmpDiv;
  // posts 存储键
  static storageKey = 'ContentsCache';

  // 初始化
  static init(enable = false) {
    SiteSearch.enable = enable;
    if(!SiteSearch.enable) return;
    SiteSearch.searchInput = document.querySelector('#search-input');
    SiteSearch.searchResults = document.querySelector('.search-results');
    SiteSearch.tmpDiv = document.createElement('div');
    SiteSearch.tmpDiv.className = 'wl-bg-white wl-p-1 wl-rounded-sm wl-cursor-pointer';
    Utils.checkPostCache() && SiteSearch.getPostStorageContent();
    SiteSearch.searchInput.oninput = SiteSearch.searchConfirm;
    SiteSearch.searchInput.onfocus = () => SiteSearch.searchResults.style.display = 'block';
  }

  // 搜索初始化
  static searchInit(init = true) {
    if(!SiteSearch.enable) return;
    init && (SiteSearch.searchInput.value = '');
    SiteSearch.arrResults = [];
    SiteSearch.indexItem = [];
    SiteSearch.searchResults.innerHTML = '';
    SiteSearch.searchResults.style.display = 'block';
  }

  // 获取 post 存储内容
  static getPostStorageContent() {
    if(!SiteSearch.enable) return;
    var posts = JSON.parse(localStorage.getItem(SiteSearch.storageKey)).posts;
    for(let i = 0; i < posts.length; i++) {
      SiteSearch.arrLinks[i] = posts[i].link;
      SiteSearch.arrTitles[i] = posts[i].title;
      SiteSearch.arrContents[i] = posts[i].content;
      SiteSearch.itemLength++;
    }
  }

  // 搜索确认
  static searchConfirm(...value) {
    Utils.log('search confirm', ...value);
    if('' === SiteSearch.searchInput.value) {
      SiteSearch.searchResults.style.display = 'none';
      return;
    }
    if(0 <= SiteSearch.searchInput.value.search(/^\s+$/)) {
      SiteSearch.searchInit();
      (value = SiteSearch.tmpDiv.cloneNode(true)).innerText = '请输入有效内容...';
      SiteSearch.searchResults.appendChild(value);
    }
    else {
      SiteSearch.searchInit(!1);
      SiteSearch.searchValue = SiteSearch.searchInput.value;
      Utils.log('search confirm loading', SiteSearch.searchValue);
      SiteSearch.searchMatching(SiteSearch.arrTitles, SiteSearch.arrContents, SiteSearch.searchValue);
    }
  }

  // 搜索匹配
  static searchMatching(titles, contents, str) {
    str = new RegExp(str, 'i');
    var num = 10;
    for(let i = 0; i < SiteSearch.itemLength; i++) {
      let value, search = contents[i].search(str);
      let t = 0;
      if(-1 !== titles[i].search(str)) {
        SiteSearch.indexItem.push(i);
        if(-1 !== search) {
          t = 0 <= search - num ? search - num : 0;
          value = contents[i].slice(search - num, search + 5);
          SiteSearch.arrResults.push('.....' + value + '.....');
        }
        else {
          SiteSearch.arrResults.push('');
        }
      }
      else if(-1 !== search) {
        SiteSearch.indexItem.push(i);
        t = 0 <= search - num ? search - num : 0;
        value = contents[i].slice(search - num, search + 5);
        SiteSearch.arrResults.push('.....' + value + '.....');
      }
    }
    let node = SiteSearch.tmpDiv.cloneNode(true);
    node.innerHTML = '<b>总匹配：' + SiteSearch.indexItem.length + ' 项<hr></b>';
    SiteSearch.searchResults.appendChild(node);
    if(0 === SiteSearch.indexItem.length) {
      (node = SiteSearch.tmpDiv.cloneNode(true)).innerText = '未匹配到内容...';
      SiteSearch.searchResults.appendChild(node);
    }
    for(let i = 0; i < SiteSearch.arrResults.length; i++) {
      let el = SiteSearch.tmpDiv.cloneNode(true);
      el.innerHTML = `
            <a data-pjax class="wl-text-black" href="${ SiteSearch.arrLinks[SiteSearch.indexItem[i]] }">
                <b class="wl-line-clamp-1">[${ SiteSearch.arrTitles[SiteSearch.indexItem[i]] }]</b>
                <p class="wl-line-clamp-1">[${ SiteSearch.arrResults[i] }]</p>
                <hr>
            </a>
            `;
      SiteSearch.searchResults.appendChild(el);
    }
  }
}

// post 数据
class SitePost {
  // 显示 post 热度数量
  static #postNumChoice = true;
  /**
   * 开启评论的评论类型
   *
   * @link Fog.commentChoice
   *
   * @type {'default' | 'valine' | 'twikoo'}
   */
  static #commentsChoice;
  // 评论 ID
  static #commentId;
  // 兰纳键
  static #commentKey;
  // 开启分享
  static #shareChoice = false;
  // 开启阅读模式
  static #readingMode = false;

  // 初始化
  static initValue(postNumChoice, comment, commentId, commentKey) {
    SitePost.#postNumChoice = postNumChoice;
    SitePost.#commentsChoice = comment;
    SitePost.#commentId = commentId;
    SitePost.#commentKey = commentKey;
  }

  // 是 post 页面
  static isPost() {
    return -1 !== window.location.pathname.indexOf('post');
  }

  // 获取 post 热度
  static getHot() {
    if(SitePost.#postNumChoice && 'default' !== SitePost.#commentsChoice) {
      let pathname = window.location.pathname;
      if(-1 === pathname.search('post')) return false;
      if(!pathname.endsWith('/')) {
        pathname += '/';
      }
      if('twikoo' === SitePost.#commentsChoice) {
        SitePost._twikooHot(pathname);
      }
      else {
        SitePost._valineHot(pathname);
      }
    }
  }

  // 更新 post
  static update() {
    if(!SitePost.isPost()) return;
    SitePost.getHot();
    if(SitePost.#shareChoice) Utils.shareInit();
    if('default' === SitePost.#commentsChoice) $('#wl-comment').hide();
    Utils.imgLazyLoad();
    Utils.codeCopyInit();
    SitePost._code();
    SitePost._renderMath();
    Utils.backToTopInit();
    if('default' === SitePost.#commentsChoice) {
      setTimeout(Utils.replaceAvatar, 3e3);
      setTimeout(Utils.replaceAvatar, 8e3);
    }
  }

  // 阅读模式
  static readingMode() {
    if(SitePost.#readingMode) {
      SiteMenu.open();
      $('#wl-side-tabs').fadeIn(4 * fadeTime);
      $('#wl-bg').fadeIn(4 * fadeTime);
      $('#wl-side-all').fadeIn(4 * fadeTime);
      $('.markdownIt-TOC a').css('color', 'antiquewhite');
      SitePost.#readingMode = false;
    }
    else {
      SiteMenu.close();
      $('#wl-side-tabs').fadeOut(4 * fadeTime);
      $('#wl-bg').fadeOut(4 * fadeTime);
      $('#wl-side-all').fadeOut(4 * fadeTime);
      $('.markdownIt-TOC a').css('color', 'black');
      SitePost.#readingMode = true;
    }
  }

  // 高亮代码
  static _code() {
    hljs.initHighlightingOnLoad();
    hljs.initLineNumbersOnLoad({ singleLine: true });
    document.querySelectorAll('pre code').forEach(el => {
      hljs.highlightBlock(el);
      hljs.lineNumbersBlock(el);
    });
  }

  // 渲染数学公式
  static _renderMath() {
    if('function' != typeof renderMathInElement) return;
    renderMathInElement(document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false }
      ]
    });
  }

  // valine 评论热度
  static _valineHot(url) {
    let id = SitePost.#commentId;
    let key = SitePost.#commentKey;
    AV.init({ appId: id, appKey: key });
    let av = new AV.Query('Counter');
    av.equalTo('url', url);
    av.find().then(function(elements) {
      if(0 === elements.length) {
        let av = new (AV.Object.extend('Counter'));
        av.save({ time: 1, title: p_title, url: pl, xid: pl })
          .then(function(t) {
            let el = $('#wl-hot-num');
            el.eq(0).html(1);
            el.eq(1).html(1);
          });
      }
      else {
        let id = elements[0].id;
        let av = AV.Object.createWithoutData('Counter', id);
        let time = elements[0].attributes.time + 1;
        av.set('time', time);
        av.save();
        let el = $('#wl-hot-num');
        el.eq(0).html(1);
        el.eq(1).html(1);
      }
    }, function(t) {
      Utils.log('valine get hot error', t);
    });
  }

  // twikoo 评论热度
  static _twikooHot(urlPath) {
    $.ajax({
      url: SitePost.#commentId,
      type: 'POST',
      timeout: 3e3,
      data: JSON.stringify({ url: urlPath, href: window.location.href }),
      dataType: 'json',
      success: function(result) {
        let el = $('#wl-hot-num');
        el.eq(0).html(result.hot);
        el.eq(1).html(result.hot);
      },
      error: function(t) {
        Utils.log('twikoo get hot error', t);
      }
    });
  }

  /**
   * 更新复刻统计
   * @param {boolean} updateTotal
   * @param {boolean} updateView
   */
  static updateTotalView(updateTotal = true, updateView = true) {
    $.ajax({
      url: 'https://api-nianian.netlify.app/.netlify/functions/site-visits',
      type: 'POST',
      timeout: 3e3,
      data: JSON.stringify({
        url: window.location.origin,
        updateTotal: updateTotal,
        updateView: updateView
      }), dataType: 'json',
      success: function(t) {
        $('#value_site_pv').html(t.total);
        $('#value_site_uv').html(t.view);
      },
      error: (t) => Utils.log('twikoo get hot error', t)
    });
  }
}

class Utils {
  static words = [];

  // 开始时调用一次
  static one() {
    Utils.updateLoading();
    Utils.switchTheme(!0);
    SitePost.updateTotalView(!0, !0);
    Utils.update();
    if(Utils.isMobile()) {
      let el = $('#wl-bg');
      el.attr('src', el.attr('mobile-src'));
    }
    Utils.dragLive2d();
  }

  static update() {
    Utils.updateTagColor();
    Utils.updateWordAnim('#wordAnim1');
    Utils.updateWordAnim('#wordAnim2');
    SitePost.update();
  }

  // 是 手机端
  static isMobile() {
    return Math.min(window.screen.width, window.visualViewport.width, window.innerWidth) <= 1200;
  }

  // 随机颜色
  static randomColor() {
    return '#' + Math.floor(16777215 * Math.random()).toString(16);
  }

  // 更新标签颜色
  static updateTagColor() {
    $('.wl-tag').each(function() {
      $(this).css('color', Utils.randomColor());
    });
  }

  // 左侧面板上的数字变化
  static updateWordAnim(selector) {
    // 获取显示文字的span元素
    let textEl = document.querySelector(selector);
    if(null == textEl) return;
    // 获取并解析要展示的文本数组
    let words = JSON.parse(textEl.getAttribute('data-text'));
    // 判断是否已经包含在内了
    if(-1 !== Utils.words.indexOf(selector)) return;
    // 添加到 words 中
    Utils.words.push(selector);
    /// 当前显示文本数组中的第几个
    let index = 0;
    // 当前显示第几个字
    let charIndex = 1;
    // 每个字显示间隔默认是500毫秒
    let delta = 500;
    // 记录动画执行开始时间
    let start = null;
    // 是否为删除动画
    let isDeleting = false;

    // 动画回调函数
    function animaCall(time) {
      window.requestAnimationFrame(animaCall);
      // 初始化开始时间
      if(!start) start = time;
      // 获取时间间隔
      var progress = time - start;
      // 每隔一定的时间，打印出一个新的字符
      if(progress > delta) {
        // 获取完整的字符
        let text = words[index];
        // 如果是打字效果
        if(!isDeleting) {
          // 给展示文字的span新增一个字符，使用innerHTML来替换，charIndex自增1，然后返回新的字符串子串
          textEl.innerHTML = '&nbsp;' + text.slice(0, ++charIndex);
          delta = 500 - Math.random() * 400;
        }
        else {
          // 如果是删除效果，则把文字一个一个减掉
          textEl.innerHTML = '&nbsp;' + text.slice(0, charIndex--);
        }
        // 把star更新为当前时间，进行下一个周期
        start = time;
        // 如果文字已经全部打印完毕
        if(charIndex === text.length) {
          // 下次开始删除文字
          isDeleting = true;
          // 删除文字的间隔为200毫秒
          delta = 100;
          // 额外等待1.2秒后再删除
          start = time + 1000;
        }
        // 如果文字删除完毕
        if(charIndex < 0) {
          isDeleting = false;
          // 额外增加200毫秒延迟
          start = time + 200;
          // 把index移动到下一个文本，并且在文本数组元素个数中循环
          index = ++index % words.length;
        }

      }
    }

    window.requestAnimationFrame(animaCall);
  }

  /**
   * 更新站点时间
   * @param {string} str
   */
  static updateSiteTime(str) {
    let el = document.getElementById('site-go-times');
    if(!el) return;
    setInterval(function() {
      let date = new Date(str + ' 00:00:00');
      let sec = (new Date - date) / 1e3;
      let day = Math.floor(sec / 86400);
      let hor = Math.floor(sec % 86400 / 3600);
      let min = Math.floor(sec % 3600 / 60);
      sec = Math.floor(sec % 60);
      hor = (hor + '').padStart(2, '0');
      min = (min + '').padStart(2, '0');
      sec = (sec + '').padStart(2, '0');
      el.innerHTML = `本站已安全运行 ${ day } 天 ${ hor } 小时 ${ min } 分 ${ sec } 秒`;
    }, 250);
  }

  // 显示是否在加载中
  static updateLoading(isLoading = false) {
    var e = $('#wl-loading');
    if(e.length <= 0) return;
    isLoading ? e.fadeIn(8 * fadeTime) : e.fadeOut(8 * fadeTime);
    if(null == e.attr('content')) {
      JQG.addLoad(() => Utils.updateLoading(false));
      e.attr('content', 'init');
    }
  }

  // 添加脚本
  static addScript(url, callback) {
    $.getScript(url, callback);
  }

  // 调用
  static call(call, thisObject) {
    return () => call.call(thisObject ?? call);
  }

  // 打印
  static log() {
    window.location.hostname.includes('localhost');
  }

  // 睡眠
  static sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  // 检查 Post 缓存
  static checkPostCache() {
    let postNUm = parseInt(localStorage.getItem('posts-num'));
    let el = $('#side-post-title');
    let title = parseInt(el.attr('title'));
    let content = parseInt(el.attr('content'));
    let len = parseInt(localStorage.getItem('posts-title-len'));
    let result = postNUm === title && content === len;
    if(!result) Utils.log('checkCache 更新缓存');
    return result;
  }

  static getApi(t = 'get', e, a, i) {
    let s = new XMLHttpRequest;
    s.open(t, e, !0), s.send(null), s.onreadystatechange = function() {4 === s.readyState && (200 === s.status ? a(s.responseText) : i(s.status));};
  }

  static apiGetPostContent(t) {
    var e, a;
    Utils.checkPostCache() ||
    (e = t, (a = document.createElement('link')).href = e, a.rel = 'preload', a.as = 'fetch', a.crossOrigin = 'anonymous', document.head.appendChild(a), Utils.getApi('get', t, function(t) {
      var e, a;
      e = JSON.parse(t), localStorage.setItem('posts-num', '' + e.posts.length), a = e.posts.reduce((t, e) => t +
                                                                                                              e.title.length, 0), Utils.log('content 获取成功', e.posts, a), localStorage.setItem('posts-title-len', '' +
                                                                                                                                                                                                                     a), localStorage.setItem(SiteSearch.storageKey, t), SiteSearch.getPostStorageContent();
    }, function(t) {Utils.log(t);}));
  }

  static topShareBgSwitch() {
    var t = $('#social-menu');
    'none' === t.css('display') ? t.show().animate({ zoom: '1', opacity: '1' }, 300, 'linear') : t.animate({
      zoom: '0', opacity: '0'
    }, 300, 'linear', function() {$(this).hide();});
  }

  static backToTopInit() {
    $('#wk-toggle').click(function() {$('html,body').animate({ scrollTop: '0px' }, 800);}), $(window)
      .scroll(function() {30 < $(window).scrollTop() ? $('#wk-toggle').fadeIn(8 * fadeTime) : $('#wk-toggle').fadeOut(2 * fadeTime);});
  }

  static replaceAvatar() {
    var e = $('.tk-avatar-img');
    for(let t = 0; t < e.length; t++) {
      -1 !== e.eq(t).attr('src')?.search('cn.gravatar.com') && e.eq(t)
                                                                .attr('src', window.location.origin + '/media/images/comavatar.png%>');
    }
  }

  static showQQ(t) {'' !== t ? window.location.href = 'tencent://message/?uin=' + t + '&Site=&Menu=yes' : alert('博主暂未设置QQ联系方式');}

  static showWechat(t) {return alert('博主微信号：' + t), !1;}

  static showAplayer() {
    var t = $('.aplayer');
    t.length <= 0 || ('block' === t.css('display') ? t.fadeOut(4 * fadeTime) : t.fadeIn(4 * fadeTime));
  }

  static aplayerPlay() {
    var t, e = document.querySelectorAll('meting-js')[0]?.aplayer;
    e && (t = $('#wl-m-aplayer'), !0 === e.paused ? (e.play(), e.lrc.hide(), t.removeClass('fa-circle-play'), t.addClass('fa-circle-pause'))
                                                  : (e.pause(), t.addClass('fa-circle-play'), t.removeClass('fa-circle-pause')));
  }

  static shareInit() {
    new Share('#share-post', {
      title: $('#p-title').html(), initialized: !0, description: $('meta[name="description"]').attr('content'), image: $('#wl-avatar').attr('src'),
      sites: ['weibo', 'qq', 'wechat', 'douban', 'qzone', 'facebook', 'twitter', 'google'], wechatQrcodeTitle: '微信扫一扫：分享',
      wechatQrcodeHelper: '<p>微信里扫一下二维码</p><p>便可将本文分享至朋友圈。</p>', disabled: ['google', 'linkedin'], wechatQrcodePosition: 'bottom'
    });
  }

  static donateSwitch() {
    var t = Utils.donateSwitch.open ?? !1, e = $('#wl-donate');
    t ? e.fadeOut(4 * fadeTime) : e.fadeIn(4 * fadeTime), Utils.donateSwitch.open = !t;
  }

  static codeCopyInit() {
    var t = $('pre code');
    t.length <= 0 || (t.each(function(t) {
      var e = $(this), t = 'code_id_' + t, a = (e.attr('id', t), Math.round(e.height() / parseFloat(e.css('line-height'))));
      a <= 0 ||
      e.before(`<button class="copy-bt wl-w-24 wl-absolute wl-right-16 wl-rounded wl-text-white wl-bg-sky-400 wl-m-0 wl-font-kaiti wl-transition-all wl-duration-300" data-clipboard-target="#${ t }">复制代码</button>`);
    }), (t = new ClipboardJS('.copy-bt')).on('success', async function(t) {
      var e = $(t.trigger);
      e.html('复制成功~'), e.removeClass('wl-bg-sky-400')
                            .addClass('wl-bg-purple-400'), t.clearSelection(), await Utils.sleep(8e3), e.html('复制代码'), e.removeClass('wl-bg-purple-400')
                                                                                                                            .addClass('wl-bg-sky-400');
    }), t.on('error', function(t) {alert('矮油，复制失败了...手动复制吧勇士！'), t.clearSelection();}));
  }

  static imgLazyLoad(e = null) {
    let a = $('img').filter(function() {
      var t = $(this).attr('class');
      return null == t || t === e;
    });

    function i() {
      let t = $(this).height() + $(document).scrollTop();
      a.each(function() {$(this).offset().top < t && ($(this).trigger('appear'), a = a.not(this));}), a.length <= 0 && $(window).unbind('scroll', i);
    }

    Utils.log('imgLazyLoad loads', a), a.each(function() {
      let t = $(this), e = (t.attr('class', 'lazy-load'), t.attr('src'));
      t.attr('data-original', e), t.addClass('img-loading'), t.attr('src', '/media/images/imgloading.gif'), t.wrap(`<span data-fancybox="images" href="${ e }"></span>`), t.one('appear', function() {t.attr('src', e), t.on('load', function() {t.removeClass('img-loading');});});
    }), $(window).bind('scroll', i), i();
  }

  static loadOhLive2D(config) {
    if(typeof wlLive2d != 'undefined' && wlLive2d != null) {
      Utils.loadOhLive2D.config = config ?? Utils.loadOhLive2D.config;
      Utils.loadOhLive2D.live2d = wlLive2d(Utils.loadOhLive2D.config);
    }
  }

  static dragLive2d() {
    let r = $('#oml-stage'), c = (r.addClass('oml-right'), !0), d = {
      w: Math.min(window.screen.width, window.visualViewport.width, window.innerWidth),
      h: Math.min(window.screen.height, window.visualViewport.height, window.innerHeight)
    };
    Utils.log('dragLive2d - gl', d), r.mousedown(function(t) {
      let e = t.clientX, a = t.clientY, i = $(this), s = i.width(), o = i.height(), n = i.position();

      function l() {i.unbind('mousemove').unbind('mouseup').unbind('mouseover');}

      i.mousemove(function(t) {
        n.left = Math.max(0, Math.min(n.left + t.clientX - e, d.w - s)), n.top = Math.max(0, Math.min(n.top + t.clientY - a, d.h -
                                                                                                                             o)), e = t.clientX, a = t.clientY, n.left <
                                                                                                                                                                .4 *
                                                                                                                                                                d.w &&
                                                                                                                                                                c &&
                                                                                                                                                                (i.removeClass('oml-right'), c = !1);
        n.left > .6 * d.w && !c && (r.addClass('oml-right'), c = !0);
        i.css('left', n.left).css('top', n.top);
      }), i.mouseup(l), i.mouseover(l);
    });
  }

  static switchTheme(t = !1) {
    let e = localStorage.getItem('theme-mode') ?? 'light';
    t || (e = 'light' === e ? 'dark' : 'light'), $('html').attr('theme', e);
    t = Utils.isMobile() ? $('#wl-bg-m') : $('#wl-bg');
    'dark' === e ? (t.fadeOut(8 * fadeTime), $('#wl-moon').attr('src', '/media/images/sun.png')) : (t.fadeIn(8 * fadeTime), $('#wl-moon')
      .attr('src', '/media/images/moon.png')), localStorage.setItem('theme-mode', e);
  }
}
