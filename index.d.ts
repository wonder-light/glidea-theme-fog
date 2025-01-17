declare class FriendItem {
  // 名称
  siteName: string;
  // 网站链接
  siteLink: string;
  // 头像
  siteLogo: string;
  // 描述
  description: string;
}

declare class TalkItem {
  // 标签
  author: string;
  // 发布时间
  time: string;
  // 说说内容
  text: string;
  // 配图
  img: string;
}

declare class IconItem {
  // 菜单栏名称, 对应菜单名称
  menuName: string;
  // 图标(外链), 使用默认值 / 或填写图标外链
  iconUrl: string;
}

declare class Fog {
  // 菜单栏布局
  menuPosition: 'top' | 'left';
  // 文章列表风格
  postListMode: 'default' | 'elegant';
  // 网站名称颜色 默认：antiquewhite
  siteNameColor: string;
  // 网站描述颜色 默认：white
  siteDescriptionColor: string;
  // 网站菜单按钮颜色 默认：antiquewhite
  siteMenuColor: string;
  //文章标题颜色 默认：white
  titleColor: string;
  //底部信息颜色（默认:white）
  footInfoColor: string;
  // 站点名称字体
  siteNameFont: string;
  // 站点介绍字体
  siteDescriptionFont: string;
  // 文章标题字体
  titleFont: string;
  // 菜单栏字体
  siteMenuFont: string;
  // 文章正文字体
  postFont: string;
  // 是否开启站点创建时间
  siteGoTimeChoice: boolean;
  //输入日期（格式:2020/22/02）
  siteGoTime: string;
  // 是否开启访客统计, 不蒜子会影响网页加载速度，请慎重考虑
  siteNumChoice: boolean;
  // 访客统计URL
  siteNumUrl: string;
  // 是否开启文章阅读量统计, 需要在配置页面填写Leancloud_id和key值
  postNumChoice: boolean;
  // 文章阅读量统计URL
  postNumUrl: string;
  //填写网站备案号，如无则空着即可
  recordText: string;
  // 是否开启文章分享转载功能
  shareChoice: boolean;
  // 是否开启文章赞赏功能, 请在下方放置赞赏图片外链
  donateChoice: boolean;
  //请输入图片外链
  donateImg: string;
  //社交按钮开关, 是否开启个人社交信息展示栏
  socialChoice: 'default' | 'close';
  //社交按钮上的文字显示
  socialText: string;
  //链接地址
  github: string;
  //QQ号
  QQ: string;
  //链接地址
  zhihu: string;
  //链接地址
  bilibili: string;
  //链接地址
  wechat: string;
  //链接地址
  weibo: string;
  //链接地址
  wyy: string;
  //链接地址
  steam: string;
  
  
  
  // 是否开启看板娘
  live2d: boolean;
  //第三方评论系统选择
  commentChoice: 'default' | 'valine' | 'twikoo';
  //[valine/阅读量统计] Leancloud_appId
  Leancloud_appId: string;
  //[valine/阅读量统计] Leancloud_key
  Leancloud_key: string;
  //[twikoo] 配置查看文档 https://twikoo.js.org/
  twikooId: string;
  //是否开启哔哔, [丰富版说说系统]配置查看文档
  bbchoice: boolean;
  //哔哔-昵称
  bbname: string;
  //请输入头像外链【可以填写自己站点头像地址】
  bbavatar: string;
  //哔哔-每次加载的数目，默认值：5
  bblimit: number;
  //哔哔-加载时gif动画（请输入外链），默认：https://7.dusays.com/2021/03/04/d2d5e983e2961.gif
  bbgif: string;
  //是否开启哔哔-ontalk, 首页轮播哔哔消息
  bbonetalkchoice: boolean;
  //首页轮播哔哔消息时配置
  bbjson: string;
  
  //图片加载方式, 选择本地上传便在下方选项添加图片，选择外链则在下方输入框输入外链链接【推荐使用外链】
  bgchoice: 'default' | 'link';
  //input
  postdefaultimagelink: string;
  //input
  tagimagelink: string;
  //input
  bgimagelink: string;
  //input
  mobilebgimagelink: string;
  //input
  mobileplbgimagelink: string;
  //本地上传
  postdefaultimage: string;
  //本地上传
  tagimage: string;
  //本地上传
  bgimage: string;
  //本地上传
  mobilebgimage: string;
  //picture-upload
  mobileplbgimage: string;
  //代码主题
  codetheme: 'default' | 'vs2015' | 'rainbow' | 'dracula';
  //是否开启数学公式, 开启后支持数学公式（影响博客加载速度）
  Mathchoice: boolean;
  //是否开启友链
  friendsChoice: boolean;
  //提示信息
  friendsRule: string;
  //友链
  friends: Array<FriendItem>;
  //是否开启说说
  talkChoice: boolean;
  //说说
  talks: Array<TalkItem>;
  //图标icon, 默认值：Home / Archive / Tag / About / Talk / Friends (填写时删除空格)
  icons: Array<IconItem>;
  
  
  //是否开启音乐播放器
  aplayerChoice: boolean;
  // 音乐播放器的源平台
  aplayerServer: 'netease' | 'tencent' | 'kugou' | 'xiami' | 'baidu';
  // 音乐播放器的歌单ID
  aplayerId: string;
  // 音乐播放器的播放模式
  aplayerOrder: 'default' | 'random';
  // 音乐播放器是否自动播放
  aplayerAutoplay: boolean;
  
  
  // 即时通讯工具
  instantchoice: 'default' | 'daovoice' | 'crisp';
  //[使用daovoice时配置]在控制台-安装到网站-appid里的内容复制过来
  daovoice_id: string;
  //[使用Crisp时配置] 在设置-网站设置-网站id里的内容复制过来
  crisp_id: string;
}