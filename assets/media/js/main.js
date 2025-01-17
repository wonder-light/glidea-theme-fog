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
    $(() => this.#exe.call(this));
    $(document).pjax('a[data-pjax]', '#wl-main', { fragment: '#wl-main', timeout: 8e3 })
               .on('pjax:complete', () => this.#exePjaxFun.call(this))
               .on('pjax:start', () => Utils.updateLoading(true))
               .on('pjax:end', () => Utils.updateLoading(false));
    window.onload && this.addLoad(window.onload);
    window.onload = () => this.#exeLoadFun.call(this);
  }
  
  // 添加函数
  add(...items) {
    this.#functions.push(...items);
  }
  
  // 添加 pjax 方法
  addPjax(...items) {
    this.#pjaxFunctions.push(...items);
  }
  
  // 天极爱加载后执行的函数
  addLoad(...items) {
    this.#loads.push(...items);
  }
  
  // 执行
  #exe() {
    for (let e of this.#functions) {
      try {
        e?.call();
      }
      catch (t) {
        Utils.log('JQG.exe : ', t.message, e.toString(), t);
      }
    }
  }
  
  // 网页加载完成后执行
  #exeLoadFun() {
    for (let e of this.#loads) {
      try {
        e?.call();
      }
      catch (t) {
        Utils.log('JQG.loads : ', t.message, e.toString(), t);
      }
    }
  }
  
  // 触发 pjax 后执行
  #exePjaxFun() {
    for (let fun of this.#pjaxFunctions) {
      try {
        fun?.call();
      }
      catch (t) {
        Utils.log('JQG.pjax : ', t.message, fun.toString(), t);
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
    if ('left' === SiteMenu.menuPosition) {
      $('#wl-side-tabs').on('click', SiteMenu.openAndClose);
      if (!Utils.isMobile()) {
        SiteMenu.open();
      }
    }
    SiteMenu.setIcons();
  }
  
  // 菜单打开
  static open() {
    if ('left' !== SiteMenu.menuPosition) return;
    $('#wl-side-all').removeAttr('style');
    $('#wl-main').removeAttr('style');
    SiteMenu.sideState = true;
    $('#wl-side-tabs').addClass('active');
  }
  
  // 菜单关闭
  static close() {
    if ('left' !== SiteMenu.menuPosition) return;
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
    for (let t = 0; t < length; t++) {
      let name = el.eq(t).attr('alt');
      let icon = SiteMenu.icons[name];
      if (icon) {
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
    if (!SiteSearch.enable) return;
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
    if (!SiteSearch.enable) return;
    init && (SiteSearch.searchInput.value = '');
    SiteSearch.arrResults = [];
    SiteSearch.indexItem = [];
    SiteSearch.searchResults.innerHTML = '';
    SiteSearch.searchResults.style.display = 'block';
  }
  
  // 获取 post 存储内容
  static getPostStorageContent() {
    if (!SiteSearch.enable) return;
    var posts = JSON.parse(localStorage.getItem(SiteSearch.storageKey)).posts;
    for (let i = 0; i < posts.length; i++) {
      SiteSearch.arrLinks[i] = posts[i].link;
      SiteSearch.arrTitles[i] = posts[i].title;
      SiteSearch.arrContents[i] = posts[i].content;
      SiteSearch.itemLength++;
    }
  }
  
  // 搜索确认
  static searchConfirm(...value) {
    Utils.log('search confirm', ...value);
    if ('' === SiteSearch.searchInput.value) {
      SiteSearch.searchResults.style.display = 'none';
      return;
    }
    if (0 <= SiteSearch.searchInput.value.search(/^\s+$/)) {
      SiteSearch.searchInit();
      (value = SiteSearch.tmpDiv.cloneNode(true)).innerText = '请输入有效内容...';
      SiteSearch.searchResults.appendChild(value);
    } else {
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
    for (let i = 0; i < SiteSearch.itemLength; i++) {
      let value, search = contents[i].search(str);
      let t = 0;
      if (-1 !== titles[i].search(str)) {
        SiteSearch.indexItem.push(i);
        if (-1 !== search) {
          t = 0 <= search - num ? search - num : 0;
          value = contents[i].slice(search - num, search + 5);
          SiteSearch.arrResults.push('.....' + value + '.....');
        } else {
          SiteSearch.arrResults.push('');
        }
      } else if (-1 !== search) {
        SiteSearch.indexItem.push(i);
        t = 0 <= search - num ? search - num : 0;
        value = contents[i].slice(search - num, search + 5);
        SiteSearch.arrResults.push('.....' + value + '.....');
      }
    }
    let node = SiteSearch.tmpDiv.cloneNode(true);
    node.innerHTML = '<b>总匹配：' + SiteSearch.indexItem.length + ' 项<hr></b>';
    SiteSearch.searchResults.appendChild(node);
    if (0 === SiteSearch.indexItem.length) {
      (node = SiteSearch.tmpDiv.cloneNode(true)).innerText = '未匹配到内容...';
      SiteSearch.searchResults.appendChild(node);
    }
    for (let i = 0; i < SiteSearch.arrResults.length; i++) {
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
  /**
   * 开启评论的评论类型
   *
   * @link Fog.commentChoice
   *
   * @type {'default' | 'valine' | 'twikoo'}
   */
  static #commentsChoice;
  // 兰纳键
  static #commentKey;
  // 开启阅读模式
  static #readingMode = false;
  
  // 初始化文章的相关数据
  /**
   *
   * @param {boolean} postNumChoice 是否开启文章阅读量统计
   * @param {boolean} commentsChoice 是否开启评论
   * @param commentKey
   */
  static initValue(postNumChoice, commentsChoice, commentKey) {
    SitePost.#commentsChoice = commentsChoice;
    SitePost.#commentKey = commentKey;
  }
  
  // 是 post 页面
  static isPost() {
    return -1 !== window.location.pathname.indexOf('post');
  }
  
  // 获取 post 热度
  static getHot(url) {
    if (!SitePost.isPost() || !url) return;
    let pathname = window.location.pathname;
    if (!pathname.endsWith('/')) {
      pathname += '/';
    }
    SitePost._twikooHot(url, pathname);
  }
  
  // 更新 post
  static update() {
    if (!SitePost.isPost()) return;
    if ('default' === SitePost.#commentsChoice) $('#wl-comment').hide();
    Utils.imgLazyLoad();
    Utils.codeCopyInit();
    SitePost._code();
    SitePost._renderMath();
    Utils.backToTopInit();
    if ('default' === SitePost.#commentsChoice) {
      setTimeout(Utils.replaceAvatar, 3e3);
      setTimeout(Utils.replaceAvatar, 8e3);
    }
  }
  
  // 阅读模式
  static readingMode() {
    if (SitePost.#readingMode) {
      SiteMenu.open();
      $('#wl-side-tabs').fadeIn(4 * fadeTime);
      $('#wl-bg').fadeIn(4 * fadeTime);
      $('#wl-side-all').fadeIn(4 * fadeTime);
      $('.markdownIt-TOC a').css('color', 'antiquewhite');
      SitePost.#readingMode = false;
    } else {
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
    /*document.querySelectorAll('pre code').forEach(el => {
      hljs.highlightBlock(el);
      hljs.lineNumbersBlock(el);
    });*/
  }
  
  // 渲染数学公式
  static _renderMath() {
    window.MathJax = {
      tex: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
      svg: { fontCache: 'global' },
    };
  }
  
  // twikoo 评论热度
  static _twikooHot(postHotUrl, postUrlPath) {
    $.ajax({
      url: postHotUrl,
      type: 'POST',
      timeout: 3e3,
      data: JSON.stringify({ url: postUrlPath, href: window.location.href }),
      dataType: 'json',
      success: function (result) {
        let el = $('#wl-hot-num');
        el.eq(0).html(result.hot);
        el.eq(1).html(result.hot);
      },
      error: function (t) {
        Utils.log('twikoo get hot error', t);
      },
    });
  }
  
  /**
   * 更新总访问量，访问人数
   * @param {string} url 获取访问数量的 URL
   * @param {boolean} updateTotal
   * @param {boolean} updateView
   */
  static updateTotalView(url, updateTotal = true, updateView = true) {
    $.ajax({
      url: url,
      type: 'POST',
      timeout: 3e3,
      data: JSON.stringify({
        url: window.location.origin,
        updateTotal: updateTotal,
        updateView: updateView,
      }), dataType: 'json',
      success: function (t) {
        $('#value_site_pv').html(t.total);
        $('#value_site_uv').html(t.view);
      },
      error: (t) => Utils.log('twikoo get hot error', t),
    });
  }
}

class Utils {
  static words = [];
  
  // 开始时调用一次
  static one() {
    Utils.updateLoading();
    Utils.switchTheme(true);
    Utils.update();
    Utils.updateBgImage();
    //Utils.dragLive2d();
  }
  
  static update() {
    Utils.updateTagColor();
    Utils.updateWordAnim('#wordAnim1');
    Utils.updateWordAnim('#wordAnim2');
    SitePost.update();
    Utils.updateBanner();
  }
  
  // 更新横幅的高度
  static updateBanner() {
    let el = $('#wl-banner');
    if (!el) return;
    // 首页
    if (window.location.pathname === '' || window.location.pathname === '/') {
      el.removeClass('wl-h-[40dvh] wl-pt-24');
      el.addClass('wl-min-h-dvh');
    } else {
      el.removeClass('wl-min-h-dvh');
      el.addClass('wl-h-[40dvh] wl-pt-24');
    }
  }
  
  // 是 手机端
  static isMobile() {
    return Math.min(window.screen.width, window.visualViewport.width, window.innerWidth) < 1200;
  }
  
  // 随机颜色
  static randomColor() {
    return '#' + Math.floor(16777215 * Math.random()).toString(16);
  }
  
  // 更新背景图片
  static updateBgImage() {
    let el = $('#wl-bg');
    if (!el) return;
    el.attr('src', Utils.isMobile() ? el.attr('mobile-src') : el.attr('pc-src'));
  }
  
  // 更新标签颜色
  static updateTagColor() {
    $('.wl-tag').each(function () {
      $(this).css('color', Utils.randomColor());
    });
  }
  
  // 左侧面板上的数字变化
  static updateWordAnim(selector) {
    // 获取显示文字的span元素
    let textEl = document.querySelector(selector);
    if (null == textEl) return;
    // 获取并解析要展示的文本数组
    let words = JSON.parse(textEl.getAttribute('data-text'));
    // 判断是否已经包含在内了
    if (-1 !== Utils.words.indexOf(selector)) return;
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
      if (!start) start = time;
      // 获取时间间隔
      var progress = time - start;
      // 每隔一定的时间，打印出一个新的字符
      if (progress > delta) {
        // 获取完整的字符
        let text = words[index];
        // 如果是打字效果
        if (!isDeleting) {
          // 给展示文字的span新增一个字符，使用innerHTML来替换，charIndex自增1，然后返回新的字符串子串
          textEl.innerHTML = '&nbsp;' + text.slice(0, ++charIndex);
          delta = 500 - Math.random() * 400;
        } else {
          // 如果是删除效果，则把文字一个一个减掉
          textEl.innerHTML = '&nbsp;' + text.slice(0, charIndex--);
        }
        // 把star更新为当前时间，进行下一个周期
        start = time;
        // 如果文字已经全部打印完毕
        if (charIndex === text.length) {
          // 下次开始删除文字
          isDeleting = true;
          // 删除文字的间隔为200毫秒
          delta = 100;
          // 额外等待1.2秒后再删除
          start = time + 1000;
        }
        // 如果文字删除完毕
        if (charIndex < 0) {
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
    if (!el) return;
    setInterval(function () {
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
    let el = $('#wl-loading');
    if (el.length <= 0) return;
    isLoading ? el.fadeIn(8 * fadeTime) : el.fadeOut(8 * fadeTime);
    if (null == el.attr('content')) {
      JQG.addLoad(() => Utils.updateLoading(false));
      el.attr('content', 'init');
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
    if (!result) Utils.log('checkCache 更新缓存');
    return result;
  }
  
  // get API
  static getApi(method = 'get', url, call, statusCall) {
    let request = new XMLHttpRequest;
    request.open(method, url, true);
    request.send(null);
    request.onreadystatechange = function () {
      if (4 === request.readyState) {
        200 === request.status ? call(request.responseText) : statusCall(request.status);
      }
    };
  }
  
  // API 获取 post 内容
  static apiGetPostContent(url) {
    if (Utils.checkPostCache()) return;
    let el = document.createElement('link');
    el.href = url;
    el.rel = 'preload';
    el.as = 'fetch';
    el.crossOrigin = 'anonymous';
    document.head.appendChild(el);
    Utils.getApi(
      'get', url,
      function (text) {
        let json = JSON.parse(text);
        localStorage.setItem('posts-num', '' + json.posts.length);
        let length = json.posts.reduce((t, e) => t + e.title.length, 0);
        Utils.log('content 获取成功', json.posts, length);
        localStorage.setItem('posts-title-len', '' + length);
        localStorage.setItem(SiteSearch.storageKey, text);
        SiteSearch.getPostStorageContent();
      },
      function (status) {
        Utils.log(status);
      },
    );
  }
  
  // 顶部背景切换
  static topShareBgSwitch() {
    var el = $('#social-menu');
    if ('none' === el.css('display')) {
      el.show().animate({ zoom: '1', opacity: '1' }, 300, 'linear');
    } else {
      el.animate({ zoom: '0', opacity: '0' }, 300, 'linear', function () {
        $(this).hide();
      });
    }
  }
  
  // 回到顶部
  static backToTopInit() {
    $('#wk-toggle').click(function () {
      $('html,body').animate({ scrollTop: '0px' }, 800);
    });
    $(window).scroll(function () {
      let toggle = $('#wk-toggle');
      if (30 < $(window).scrollTop()) {
        toggle.fadeIn(8 * fadeTime);
      } else {
        toggle.fadeOut(2 * fadeTime);
      }
    });
  }
  
  // 替换头像
  static replaceAvatar() {
    let el = $('.tk-avatar-img');
    for (let i = 0; i < el.length; i++) {
      if (-1 !== el.eq(i).attr('src')?.search('cn.gravatar.com')) {
        el.eq(i).attr('src', window.location.origin + '/media/images/comavatar.png%>');
      }
    }
  }
  
  /**
   * 打开设计网站
   * @param {string} type 社交类型
   * @param {string} url 社交 URL
   */
  static openSocial(type, url) {
    switch (type) {
      case 'QQ':
        if(!url) {
          alert('博主暂未设置QQ联系方式');
          return;
        }
        if(!url.startsWith('http')) {
          // QQ 号
          url = 'tencent://message/?uin=' + url + '&Site=&Menu=yes';
        }
        break;
      case 'wechat':
        if(!url) {
          alert('博主暂未设置微信联系方式');
          return;
        }
        if(!url.startsWith('http')) {
          // QQ 号
          url = 'weixin://contacts/profile/' + url;
        }
        break;
    }
    window.open(url);
  }
  
  // 显示音乐播放器
  static showAplayer() {
    let el = $('.aplayer');
    if (el.length <= 0) return;
    if ('block' === el.css('display')) {
      el.fadeOut(4 * fadeTime);
    } else {
      el.fadeIn(4 * fadeTime);
    }
  }
  
  // 音乐播放器
  static aplayerPlay() {
    let nodes = document.querySelectorAll('meting-js');
    if (nodes.length === 0) return;
    let aplayer = nodes[0].aplayer;
    if (!aplayer) return;
    let el = $('#wl-m-aplayer');
    if (true === aplayer.paused) {
      aplayer.play();
      aplayer.lrc.hide();
      el.removeClass('fa-circle-play');
      el.addClass('fa-circle-pause');
    } else {
      aplayer.pause();
      el.addClass('fa-circle-play');
      el.removeClass('fa-circle-pause');
    }
  }
  
  // 分享初始化
  static shareInit(baseUrl) {
    //Sharer.init();
    let share = $('#share-post');
    if (!share) return;
    jsSocials.shares.qq = {
      label: "qq",
      logo: "fa fa-qq",
      shareUrl: "https://connect.qq.com/widget/shareqq/iframe_index.html?url={url}&text={text}&via={via}&hashtags={hashtags}",
    };
    jsSocials.shares.qzone = {
      label: "qzone",
      logo: `${ baseUrl }/media/images/qzone.png`,
      shareUrl: "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={url}&text={text}&via={via}&hashtags={hashtags}",
    };
    share.jsSocials({
      shares: ["qq", "qzone", "email", "twitter", "facebook", "whatsapp"],
      text: $('#post-title').text(),
      showLabel: false,
      showCount: false,
    });
  }
  
  // 赞赏开关
  static donateSwitch() {
    let open = Utils.donateSwitch.open ?? false;
    let donate = $('#wl-donate');
    open ? donate.fadeOut(4 * fadeTime) : donate.fadeIn(4 * fadeTime);
    Utils.donateSwitch.open = !open;
  }
  
  // 代码复制初始化
  static codeCopyInit() {
    let nodes = $('pre code');
    if (nodes.length <= 0) return;
    nodes.each(function (node) {
      let el = $(this);
      let id = 'code_id_' + node;
      el.attr('id', id);
      let num = Math.round(el.height() / parseFloat(el.css('line-height')));
      if (num <= 0) return;
      el.before(`<button class="clipboard-button wl-w-24 wl-absolute wl-right-16 wl-rounded wl-text-white wl-bg-sky-400 wl-m-0 wl-font-kaiti wl-transition-all wl-duration-300" data-clipboard-target="#${ id }">复制代码</button>`);
    });
    let clipboardJS = new ClipboardJS('.clipboard-button');
    clipboardJS.on('success', async function (copy) {
      let el = $(copy.trigger);
      el.html('复制成功~');
      el.removeClass('wl-bg-sky-400').addClass('wl-bg-purple-400');
      copy.clearSelection();
      await Utils.sleep(8e3);
      el.html('复制代码');
      el.removeClass('wl-bg-purple-400').addClass('wl-bg-sky-400');
    });
    clipboardJS.on('error', function (copy) {
      alert('矮油，复制失败了...手动复制吧勇士！');
      copy.clearSelection();
    });
  }
  
  // 图片懒加载
  static imgLazyLoad(clasAttr = null) {
    let nodes = $('img').filter(function () {
      let attr = $(this).attr('class');
      return null == attr || attr === clasAttr;
    });
    
    function loadImg() {
      let height = $(this).height() + $(document).scrollTop();
      nodes.each(function () {
        if ($(this).offset().top < height) {
          $(this).trigger('appear');
          nodes = nodes.not(this);
        }
      });
      if (nodes.length <= 0) {
        $(window).unbind('scroll', loadImg);
      }
    }
    
    Utils.log('imgLazyLoad loads', nodes);
    nodes.each(function () {
      let el = $(this);
      el.attr('class', 'lazy-load');
      let src = el.attr('src');
      el.attr('data-original', src);
      el.addClass('img-loading');
      el.attr('src', '/media/images/img-loading.gif');
      el.wrap(`<span data-fancybox="images" href="${ src }"></span>`);
      el.one('appear', function () {
        el.attr('src', src);
        el.on('load', function () {
          el.removeClass('img-loading');
        });
      });
    });
    $(window).bind('scroll', loadImg);
    loadImg();
  }
  
  // 加载 Live2d
  static loadOhLive2D(config) {
    if (typeof wlLive2d != 'undefined' && wlLive2d != null) {
      Utils.loadOhLive2D.config = config ?? Utils.loadOhLive2D.config;
      Utils.loadOhLive2D.live2d = wlLive2d(Utils.loadOhLive2D.config);
    }
  }
  
  // 拖拽 Live2d
  static dragLive2d() {
    let stage = $('#oml-stage');
    stage.addClass('oml-right');
    let isLeft = true;
    let size = {
      w: Math.min(window.screen.width, window.visualViewport.width, window.innerWidth),
      h: Math.min(window.screen.height, window.visualViewport.height, window.innerHeight),
    };
    Utils.log('dragLive2d - gl', size);
    stage.mousedown(function (event) {
      let clientX = event.clientX;
      let clientY = event.clientY;
      let el = $(this);
      let width = el.width();
      let height = el.height();
      let position = el.position();
      
      function end() {
        el.unbind('mousemove')
          .unbind('mouseup')
          .unbind('mouseover');
      }
      
      el.mousemove(function (event) {
        position.left = Math.max(0, Math.min(position.left + event.clientX - clientX, size.w - width));
        position.top = Math.max(0, Math.min(position.top + event.clientY - clientY, size.h - height));
        clientX = event.clientX;
        clientY = event.clientY;
        if (position.left < 0.4 * size.w && isLeft) {
          el.removeClass('oml-right');
          isLeft = false;
        }
        if (position.left > 0.6 * size.w && !isLeft) {
          stage.addClass('oml-right');
          isLeft = true;
        }
        el.css('left', position.left).css('top', position.top);
      });
      el.mouseup(end);
      el.mouseover(end);
    });
  }
  
  // 切换主题
  static switchTheme(switchTheme = false) {
    let theme = localStorage.getItem('theme-mode') ?? 'light';
    switchTheme || (theme = 'light' === theme ? 'dark' : 'light');
    $('html').attr('theme', theme);
    let el = Utils.isMobile() ? $('#wl-bg-m') : $('#wl-bg');
    if ('dark' === theme) {
      el.fadeOut(8 * fadeTime);
      $('#wl-moon').attr('src', '/media/images/sun.png');
    } else {
      el.fadeIn(8 * fadeTime);
      $('#wl-moon').attr('src', '/media/images/moon.png');
    }
    localStorage.setItem('theme-mode', theme);
  }
  
  /// 给 CSS 添加父类
  static scopedCss(cssStyle, parentElement) {
    /**
     * Add a parent selector to all selectors passed in css
     * @param style
     * @param parent
     * @returns {string}
     */
    function scoped(style, parent) {
      //Css class name cannot start with a number
      if (/^[0-9]/.test(parent)) {
        parent = '_' + parent
      }
      
      //Ensure global uniqueness
      var symbol = '____'
      parent = '.' + symbol + parent + symbol
      
      //Handle normal css
      var css = normalCssScoped(style, parent)
      
      //Handle special css
      var match = css.match(/(?<=@media.*\(.*\) \{)(([^\{\}]*\{[^\{\}]+\}[^\{\}]*)+)(?<=\})/g) || []
      match.forEach(function (innerCss) {
        css = css.replace(innerCss, ' ' + normalCssScoped(innerCss, parent))
      })
      
      return css.replace(new RegExp(symbol, 'gm'), '')
    }
    
    /**
     * Replace basic css without media queries, animation functions
     * @param style
     * @param parent
     * @returns {string}
     */
    function normalCssScoped(style, parent) {
      
      var css = style
        .replace(/\/\*(.*)\*\//g, '')
        .replace(/\s+/g, ' ')                                 //Compressed blank
        .replace(/\s*{/g, ' {')
        .replace(/\s*}/g, ' }')
        .replace(/}(\s[^}])/g, '}\n$1')
        .replace(/^\s+/gm, '')
        .replace(/^([^@}])/gm, parent + ' $1')
        .replace(/,/g, ',' + parent);
      
      (css.match(/{(([^{}]*{[^{}]+}[^{}]*)*)}|{[^{}]*}/g) || []).forEach(function (v) {
        //Restore the string in braces
        css = css.replace(v, v.replace(new RegExp(parent, 'g'), ''))
      })
      
      return css
    }
    
    return scoped(cssStyle, parentElement);
  }
}
