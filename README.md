# ThunderPanLink

<h1 style="color:red">脚本没有任何加速下载功能,只是改变下载或播放方式,想要加速可以充值</h1>

>写脚本的初衷只是为了下载一些老的美剧，和看视频，很多在线看视频网站都是菠菜广告  
客户端有p2p加速，下载热门资源会快

## 最新功能介绍:
>1.添加隐藏**回收站**功能，可自由彻底删除、恢复  
2.将左下角**直链配置**，转移到**脚本管理器**  
3.修改**本地播放**列表文件后缀为.m3u

## 加载脚本失败:
>1.刷新页面；清理浏览器缓存；退出浏览器重新登陆  
  2.确保脚本管理器中,只加载一个脚本进行测试  
  3.更换js文件,以下两种方案任选一种（访问网址看是否能加载js文件）：

  ```
  // @require      https://cdn.bootcdn.net/ajax/libs/limonte-sweetalert2/11.1.0/sweetalert2.all.min.js  
  // @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js  
  // @require      https://cdn.bootcdn.net/ajax/libs/clipboard.js/2.0.8/clipboard.min.js  
  ```
  ```
  // @require      https://unpkg.com/sweetalert2@11.1.0/dist/sweetalert2.all.min.js
  // @require      https://unpkg.com/jquery@3.5.1/dist/jquery.min.js
  // @require      https://unpkg.com/clipboard@2.0.8/dist/clipboard.min.js
  ```

## 安装注意事项:
  >1.链接都是时间限制过期后重新获取  
  2.脚本不能获得敏感资源的直链,如果是想边下边播,可以尝试🧲<a href="https://webtorrent.io/desktop/">webtorrent</a>
  
## 导入坚果云失败：
  >1.确保坚果云中根目录有填写的文件夹，否则会失败；  
  2.授权密码不是登陆密码，是授权第三方应用的密码，<a href="https://help.jianguoyun.com/?p=2064">开启方法</a>;

## 按钮使用介绍：
* 1.**显示文件链接**  
  >点击界面中的链接，可调用idm下载

* 2.**复制idm下载链接**  
  >点击会复制导入idm的命令，具体用法如下：  
  >1.<a href="https://jingyan.baidu.com/article/8275fc86403a3546a03cf6f0.html" target="_blank">设置window环境变量path</a>，**然后将idm的安装路径添加进去**（只需要设置一次，最终效果如最下方图）；  
   2.按**window键+R**，输入**cmd**，点击**确定**，**Ctrl+V**粘贴命令，就会导入idm，然后手动开始下载。

* 3.**curl下载.txt**  
  >点击会下载txt文件，文件里**每一行是一条下载命令**用法如下：  
  >1.按**window键+R**，输入**cmd**，点击确定，复制一行命令，**按Enter（回车键）**，就会下载；按**CTRL+c**停止下载；  
   2.curl命令还有其他下载方式，分段下载，加代理等，感兴趣可以自行搜索。  

* 4.**复制Xdown下载链接**  
  >复制完直接打开Xdown，粘贴就行了。  

* 5.**基于aria2发送RPC任务**  
  >点击可一键导入到Aria2或Motrix。**确保后台打开了，不然失败。**  
  >**可在左侧的“直链配置”，配置地址、端口、token**  

* 6.**导出播放列表**  
  >点击后会下载一个“.m3u”文件，或者将文件上传坚果云，可用本地播放器打开（如potplayer）  
  >1.本地播放器可以自由调速，更换解码器、滤镜，**可在左侧的“直链配置”，配置画质优先选择**，是否导入坚果云；  
  2.potplayer连接坚果云中的播放列表。设置如最下方图，确定之后可能要输入账户和密码，按照配置中的输入就可以。  
  3.https://dav.jianguoyun.com/dav/ThunderPlaylist/xlPlaylist.m3u，其中ThunderPlaylist是你设置的文件夹名称。  

* 7.**直链配置**  
  >加入视频专用下载，不会下载原始资源，会根据云播最高清晰度下载视频  
