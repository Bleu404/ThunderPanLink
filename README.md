<h1>更新内容：可将播放列表导入坚果云，具体用法在下方第8条</h1>
<h1 style="color:red">脚本没有任何加速下载功能,只是改变下载或播放方式,想要加速可以充值</h1>
<pre>写脚本的初衷只是为了下载一些老的美剧，和看视频，很多在线看视频网站都是菠菜广告
客户端有p2p加速，下载热门资源会快
</pre>
🏷加载脚本失败,检查以下问题:🏷
<pre>0.刷新页面
1.确保脚本管理器中,只加载一个脚本进行测试
2.检查是否能加载外部js文件，<a href="https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js">点击此处，显示js文件则能加载</a>；不能加载，<a href="https://greasyfork.org/zh-CN/scripts/431256-%E8%BF%85%E9%9B%B7%E4%BA%91%E7%9B%98%E8%8E%B7%E5%8F%96%E7%9B%B4%E9%93%BE/discussions/101626">点击此处查看反馈</a>
</pre>
⚔安装前注意事项:⚔
<pre>1.本脚本没有任何加速下载功能,只是改变下载或播放方式,想要加速可以充值或活动
2.网上有其他的<a href="https://xunlei.kinh.cc/">云盘在线解析</a>,成功与否跟网络有关系
3.脚本不能获得敏感资源的直链,如果是想边下边播,可以尝试🧲<a href="https://webtorrent.io/desktop/">webtorrent</a>
</pre>
🐱‍👤AriaNG连接本地失败：🐱‍👤
<pre>https://developer.chrome.com/blog/private-network-access-update/
这是因为 Chromium 升级到高版本会出现的问题,三个解决方法
1.在地址栏中输入chrome://flags/#block-insecure-private-network-requests，将其设置为disabled；
2.用火狐浏览器来代替；
3.将本地的ariaNg保存至标签栏，用到的时候手动打开。
</pre>
🐱‍🚀导入坚果云失败：🐱‍🚀
<pre>
1.确保坚果云中根目录有填写的文件夹，否则会失败；
2.授权密码不是登陆密码，是授权第三方应用的密码，<a href="https://help.jianguoyun.com/?p=2064">开启方法</a>;
3.访问坚果云使用了代理，失败打开的页面中点击按钮获得使用时限。
</pre>

💼1.支持选择文件，<strong>文件夹</strong>（v1.1及以上版本）；

🔐2.<strong>“↓直链”</strong>点击之后，一段时间后出现按钮选择界面，按钮功能如下：

🧱3.<strong>“复制迅雷直链”</strong>点击复制文件名和链接，复制链接到浏览器地址栏可直接下载，但<strong>无法解析文件名</strong>；

🏆4.<strong>“复制idm下载链接”</strong>点击会复制导入idm的命令，具体用法如下：
 
<pre>4.1.<a href="https://jingyan.baidu.com/article/8275fc86403a3546a03cf6f0.html" target="_blank">设置window环境变量path</a>，<strong>然后将idm的安装路径添加进去</strong>（只需要设置一次，最终效果如最下方图）；

4.2按<strong>“window键+R”</strong>，输入<strong>cmd</strong>，点击<strong>确定</strong>，<strong>"Ctrl+V"</strong>粘贴命令，就会导入idm，然后手动开始下载。</pre>

🔭5.<strong>“curl下载.txt"</strong>点击会下载txt文件，文件里<strong>每一行是一条下载命令</strong>用法如下：

<pre>5.1.按<strong>“window键+R”</strong>，输入<strong>cmd</strong>，点击确定，复制一行命令，<strong>按Enter（回车键）</strong>，就会下载；按<strong>“CTRL+c”</strong>停止下载；

5.2.curl命令还有其他下载方式，分段下载，加代理等，感兴趣可以自行搜索。</pre>

💊6.<strong>“复制Xdown下载链接”</strong>，复制完直接打开Xdown，粘贴就行了。
</br></br>
🥇7.<strong>“基于aria2发送RPC任务”</strong>，点击可一键导入到支持aria2 RPC的客户端。<strong>确保Aria2后台打开了</strong>，不然导入不进去。

<pre><strong>可在左侧的“直链配置”，配置地址、端口、token</strong></pre>

🎬8.<strong>“导出播放列表”</strong>点击后会下载一个“.m3u”文件，或者将文件上传坚果云，可用本地播放器打开（如potplayer）
<pre>1.本地播放器可以自由调速，更换解码器、滤镜，<strong>可在左侧的“直链配置”，配置画质优先选择</strong>，是否导入坚果云；
2.potplayer连接坚果云中的播放列表。设置如最下方图，确定之后可能要输入账户和密码，按照配置中的输入就可以。
3.https://dav.jianguoyun.com/dav/ThunderPlaylist/xlPlaylist.m3u，其中ThunderPlaylist是你设置的文件夹名称。
</pre>

⚙9.<strong>直链配置</strong>
<pre>加入视频专用下载，不会下载原始资源，会根据云播最高清晰度下载视频</pre>

📖A.<strong>aria2远程发送问题汇总</strong>
<pre>1.远程发送失败，可以在“配置”中，勾选通过ariaNg发送，（如发送到vps上的aria2）
2.远程发送失败，通过ariaNg发送成功但多任务不成功，可以选择远程端使用脚本的本地发送
3.还有问题的话，可以不要勾选ariaNg发送，截一张控制台的图进行反馈
</pre>
