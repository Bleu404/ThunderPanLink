// ==UserScript==
// @name         迅雷云盘
// @namespace    http://tampermonkey.net/
// @version      1.5.0
// @description  获取迅雷云盘的文件链接，可利用本地播放器看视频；可将播放列表导入坚果云；可利用其他工具下载（如idm，curl，Xdown，Motrix，Aria2）。
// @author       bleu
// @compatible   edge Tampermonkey
// @compatible   chrome Tampermonkey
// @compatible   firefox Tampermonkey
// @license      MIT
// @icon         https://pan.xunlei.com/icon.png
// @supportURL   https://greasyfork.org/zh-CN/scripts/431256/feedback
// @match        https://pan.xunlei.com/*
// @exclude      https://pan.xunlei.com/s*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/limonte-sweetalert2/11.1.0/sweetalert2.all.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/clipboard.js/2.0.8/clipboard.min.js
// ==/UserScript==
(function () {
    'use strict';
    const originFetch = fetch;
    var linkConfig;
    var reqHeaders, filesURL;
    var arryIndex;
    var fileArry;
    var filetxt;
    var temp_path;
    var running = {
        'runStatus': false,
        'successNum': 0,
        'failNum': 0,
        'exit': false,
        'resultNum': 0,
        'needHandle': true,
    }
    var $BleuButton, $bleu_config;
    function swalCloseFunc() {
        let local_path = $('#config_path').val().trim();
        let aria2 = {
            'ip': $('#config_ip').val().trim(),
            'port': $('#config_port').val().trim(),
            'token': $('#config_token').val().trim(),
        };
        let jgy = {
            'path': $('#jgy_path').val().trim(),
            'account': $('#jgy_account').val().trim(),
            'password': $('#jgy_password').val().trim(),
        };
        let qualityAry = $('#bleu_select').val();
        qualityAry = qualityAry === 'highlow' ? ['selected', ''] : ['', 'selected'];
        let checkAry = [],
            autoClick = {
                state: false,
                itemIndex: 0
            },
            itemcount = 0;
        $('.td-checkbox__inner.bleu').each((index, item) => {
            checkAry[index] = '';
            if (item.checked) {
                checkAry[index] = 'checked';
                autoClick.itemIndex = index;
                itemcount++;
            }
            if (index === $('.td-checkbox__inner.bleu').length - 1 && itemcount === 1) {
                autoClick.state = true;
            }
        })
        $('.td-checkbox__inner.bleucb').each((index,item) => {
            checkAry[item.getAttribute('index')] = '';
            if (item.checked) {
                checkAry[item.getAttribute('index')] = 'checked';
            }
        })
        localStorage.setItem("linkConfig", JSON.stringify({
            'local_path': local_path,
            'displays': checkAry,
            'aria2': aria2,
            'jgy':jgy,
            'quality': qualityAry,
            'autoClick': autoClick,
        }));
        window.ariaNgUI&&window.ariaNgUI.close();
    }
    var main = {
        addCssStyle() {
            let cssStyle = `
                .btn_bleu{width: 250px;font-size: 20px;padding: 10px 25px;cursor: pointer;text-align: center;text-decoration: none;outline: none;color: #fff;background-color: #2670ea;border: none;border-radius: 100px;display:block;margin:12px auto}
                .btn_bleu:hover{background-color: #3F85FE;box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);}
                .btn_bleu:active{background-color: #3F85FE;box-shadow: 0 5px #666;transform: translateY(4px)}
                .bleu_sa_close {width: 30px;height: 30px;font-size: 30px;}
                .bleu_sa_title {font-size: 25px;}
                .bleu_sa_container{margin: 0;font-size: 20px;}
                .bleu_sa_popup {padding: 0 0 0;}
                .bleu_a{text-decoration: underline;color: #2670ea;font-size: 15px;}
                .bleu_a:hover{color: #3F85FE}
                .bleu_sa_footer{margin: 0;padding-top: 20px;}
                .bleu_sa_title_min{font-size: 20px;padding: 0;}
                .bleu_sa_popup_min{padding: 0 0 0;width: auto;}
                .bleu_config{position: absolute;left: 5%;bottom: 10%;width: 60px;height: 60px;line-height: 60px;border-radius: 50%;cursor: pointer;font-size: 13px;background-color: #2670ea;color: #fff;text-align: center;}
                .bleu_config:hover{background-color: #3F85FE}
                .bleu_config_item{border-radius: 10px;font-size: 20px;margin: 12px 50px;color: #fff;background-color: #3F85FE;box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);}
                .bleu_config_item label{font-size: 15px}
                .bleu_config_item input.bleu_inp{margin: 0px 10px;font-size: 15px;}
                .bleu_config_item input.td-checkbox__inner{margin: 0px 10px 0px 0px}
                .bleu_inp{width:60%}
                .bleu_config_item p{text-align: left;margin: 0px 20px;}
                #bleu_select{margin: 0px 10px;background-color: #3F85FE;font-size: 15px;border: none;}
                `;
            let style = document.createElement('style');
            style.innerHTML = cssStyle;
            document.querySelector('head').appendChild(style);
        },
        addElements() {
            $BleuButton = $('<div id="bleu_btn" class="pan-list-menu-item pan-list-menu-item__active"><i class="xlpfont xlp-download"></i><span>直链</span></div>');
            $('div.pan-list-menu').prepend($BleuButton);
            $('.file-features-btns-wrap').length != 0 ? $('.file-features-btns-wrap').prepend($BleuButton) : $BleuButton;
            $bleu_config = $('<div class="bleu_config">直链配置</div>')
            $('.bleu_config').length == 0 && $('#__nuxt').append($bleu_config);
        },
        addButtonEvent() {
            $BleuButton.on('click', async function () {
                main.swalForInfo('==获取直链中,请等待==', '', 'center');
                if (running.runStatus) {
                    return
                }
                main.isResetConfig();
                try {
                    running.needHandle && await main.getAllInfo();
                } catch (error) {
                    console.log(error);
                    main.swalForInfo('==请刷新页面重新尝试！==', '', 'center');
                    return;
                }
                let $swalHtml = $(`
            <div><input type="button" style="display:${linkConfig.displays[0]==='checked'?'block':'none'}" class="btn_bleu xdown" value="复制迅雷直链"></input></div>
            <div><input type="button" style="display:${linkConfig.displays[1]==='checked'?'block':'none'}" class="btn_bleu xdown" value="复制idm下载链接"></input></div>
            <div><input type="button" style="display:${linkConfig.displays[2]==='checked'?'block':'none'}" class="btn_bleu" value="curl下载.txt"></input></div>
            <div><input type="button" style="display:${linkConfig.displays[3]==='checked'?'block':'none'}" class="btn_bleu xdown" value="复制Xdown下载链接"></input></div>
            <div><input type="button" style="display:${linkConfig.displays[4]==='checked'?'block':'none'}" class="btn_bleu" value="基于aria2发送RPC任务"></input></div>
            <div><input type="button" style="display:${linkConfig.displays[5]==='checked'?'block':'none'}" class="btn_bleu" value="导出播放列表"></input></div>
            <a class="bleu_a" href="https://greasyfork.org/zh-CN/scripts/431256" target="_blank">按钮功能说明</a>
            `)
                let mainui = swal.fire({
                    title: `成功${running.successNum}条；失败${running.failNum}条`,
                    html: $swalHtml,
                    width: 400 + 'px',
                    showConfirmButton: false,
                    showCloseButton: true,
                    allowOutsideClick: false,
                    footer: ' ',
                    customClass: {
                        title: 'bleu_sa_title',
                        popup: 'bleu_sa_popup',
                        closeButton: 'bleu_sa_close',
                        htmlContainer: 'bleu_sa_container',
                        footer: 'bleu_sa_footer'
                    },
                })
                $('.btn_bleu').on('click', function (item) {
                    let temp = item.target.defaultValue;
                    main.getCollatedData(temp)
                })
                if (linkConfig.autoClick.state) {
                    $('.btn_bleu')[linkConfig.autoClick.itemIndex].click();
                    setTimeout(() => {
                        mainui.close();
                    }, 1000);
                }
            })
            $bleu_config.on('click', function () {
                main.isResetConfig();
                let swalConfig = `
                <div class="bleu_config_item"><b>本地下载路径</b>
                <p><label>目录</label><input type="text" class="bleu_inp" id="config_path" value="${linkConfig.local_path}"/></p>
                </div>
                <div class="bleu_config_item"><b>功能按钮显示</b>
                <p><input type="checkbox" ${linkConfig.displays[0]} class="td-checkbox__inner bleu"></input><label>显示“复制迅雷直链”</label></p>
                <p><input type="checkbox" ${linkConfig.displays[1]} class="td-checkbox__inner bleu"></input><label>显示“复制idm下载链接”</label></p>
                <p><input type="checkbox" ${linkConfig.displays[2]} class="td-checkbox__inner bleu"></input><label>显示“curl下载.txt”</label></p>
                <p><input type="checkbox" ${linkConfig.displays[3]} class="td-checkbox__inner bleu"></input><label>显示“复制Xdown下载链接”</label></p>
                <p><input type="checkbox" ${linkConfig.displays[4]} class="td-checkbox__inner bleu"></input><label>显示“基于aria2发送RPC任务”</label></p>
                <p><input type="checkbox" ${linkConfig.displays[5]} class="td-checkbox__inner bleu"></input><label>显示“导出播放列表”</label></p>
                </div>
                <div class="bleu_config_item"><b>配置aria2任务</b>
                <p><input type="checkbox" index="7" ${linkConfig.displays[7]} class="td-checkbox__inner bleucb"></input><label>通过ariaNg远程发送任务</label></p>
                <p><label>地址</label><input type="text" class="bleu_inp" id="config_ip" value="${linkConfig.aria2.ip}"/></p>
                <p><label>端口</label><input type="text" class="bleu_inp" id="config_port" value="${linkConfig.aria2.port}"/></p>
                <p><label>密钥</label><input type="text" class="bleu_inp" id="config_token" value="${linkConfig.aria2.token}"/></p>
                </div>
                <div class="bleu_config_item"><b>播放列表设置</b>
                <p><label>画质选择</label><select id="bleu_select">
                <option value="highlow" ${linkConfig.quality[0]}>从高到低</option>
                <option value="lowhigh" ${linkConfig.quality[1]}>从低到高</option>
                </select></p>
                <b>列表存坚果云</b>
                <p><label>文件夹</label><input type="text" class="bleu_inp" id="jgy_path" value="${linkConfig.jgy.path}"/></p>
                <p><label>账户</label><input type="text" class="bleu_inp" id="jgy_account" value="${linkConfig.jgy.account}"/></p>
                <p><label>授权密码</label><input type="text" class="bleu_inp" id="jgy_password" value="${linkConfig.jgy.password}"/></p>
                </div>
                <div class="bleu_config_item"><b>视频专用下载</b>
                <p><input type="checkbox" index="6" ${linkConfig.displays[6]} class="td-checkbox__inner bleucb"></input><label>勾选此项，不下载源文件，下载云播最高清晰度视频。</label></p>
                </div>
                `
                swal.fire({
                    title: `直链配置`,
                    html: swalConfig,
                    width: 400 + 'px',
                    showConfirmButton: false,
                    showCloseButton: true,
                    allowOutsideClick: false,
                    footer: ' ',
                    customClass: {
                        title: 'bleu_sa_title',
                        popup: 'bleu_sa_popup',
                        closeButton: 'bleu_sa_close',
                        htmlContainer: 'bleu_sa_container',
                        footer: 'bleu_sa_footer'
                    },
                }).then(swalCloseFunc)
            })
        },
        isResetConfig(){
            linkConfig = JSON.parse(localStorage.getItem("linkConfig")) || {
                'local_path': 'D:\\Downloads',
                'displays': ['checked', 'checked', 'checked', 'checked', 'checked', 'checked', '',''],
                'aria2': {
                    'ip': 'http://localhost',
                    'port': '16800',
                    'token': ''
                },
                'jgy':{
                    'path':'ThunderPlaylist',
                    'account':'',
                    'password':''
                },
                'quality': ['selected', ''],
            };
            if(!linkConfig.jgy){
                linkConfig.jgy = {
                    'path':'ThunderPlaylist',
                    'account':'',
                    'password':''
                }
            }
        },
        setInitValue() {
            arryIndex = 0;
            fileArry = [];
            filetxt = [];
            temp_path = '';
            running.runStatus = true;
            running.successNum = 0;
            running.failNum = 0;
            running.resultNum = 0;
            running.needHandle = false;
            $('.pan-list-item').on('click', function () {
                running.needHandle = true;
            })
            $('.pan-list-item a').on('click', function () {
                running.needHandle = true;
            })
            $('.td-breadcrumb__item a').on('click', function () {
                running.needHandle = true;
            })
            $('.td-checkbox__inner').on('click', function () {
                running.needHandle = true;
            })
        },
        async getAllInfo() {
            main.setInitValue();
            await main.getFileSign();
            if (running.exit) {
                running.exit = false;
                main.swalForInfo('==请刷新页面重新尝试！==', '', 'center');
                return;
            }
            $('li.pan-list-item').each((index, item) => {
                if (item.getAttribute('class') === 'pan-list-item') {
                    delete(fileArry[0][index]);
                }
            });
            await main.getAllFiles(fileArry[0]);
            running.runStatus = false;
            running.resultNum = running.successNum + running.failNum;
        },
        async getAllFiles(loopArry) {
            for (let index = 0; index < loopArry.length; index++) {
                if (loopArry[index]) {
                    if (loopArry[index].kind === 'drive#file') {
                        await main.getDirectLink(loopArry[index].id);
                    }
                    if (loopArry[index].kind === 'drive#folder') {
                        temp_path += `\\${loopArry[index].name}`;
                        await main.getFileSign(loopArry[index]);
                        await main.getAllFiles(fileArry[arryIndex - 1]);
                    }
                }

            }
            temp_path = temp_path.substring(0, temp_path.lastIndexOf('\\'));
        },
        getFileSign(folder) {
            return new Promise((resolve, reject) => {
                let runURL;
                if (folder) {
                    runURL = `https://api-pan.xunlei.com/drive/v1/files?limit=100&parent_id=${folder.id}&filters={"phase":{"eq":"${folder.phase}"},"trashed":{"eq":${folder.trashed}}}&with_audit=true`;
                    runURL = encodeURI(runURL);
                } else {
                    runURL = filesURL;
                }
                fileArry[arryIndex] = [];
                $.ajax({
                    type: "get",
                    timeout: 2000,
                    headers: reqHeaders,
                    url: runURL,
                    //dataType: "json",
                    success: function (data, textStatus) {
                        data.files.forEach((item) => {
                            let temp = {
                                'kind': item.kind,
                                'id': item.id,
                                'name': item.name,
                                'phase': item.phase,
                                'trashed': item.trashed
                            };
                            fileArry[arryIndex].push(temp);
                        });
                        arryIndex++;
                        resolve(textStatus);
                    },
                    error: function (err) {
                        runURL === filesURL ? running.exit = true : running.exit = false;
                        reject(err);
                    }
                });
            });
        },
        getDirectLink(sign) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    type: "get",
                    timeout: 2000,
                    headers: reqHeaders,
                    url: `https://api-pan.xunlei.com/drive/v1/files/${sign}`,
                    //dataType: "json",
                    success: function (data, textStatus) {
                        running.successNum++;
                        let mediasLink = [];
                        if (data.medias != []) {
                            data.medias.forEach(function (item) {
                                if (item.link != null) {
                                    mediasLink.push({
                                        'name': item.media_name,
                                        'url': item.link.url
                                    })
                                }
                            })
                        }
                        let temp = {
                            'name': data.name,
                            'link': data.web_content_link,
                            'path': temp_path,
                            'medias': mediasLink
                        };
                        filetxt.push(temp);
                        resolve(textStatus);
                    },
                    error: function (err) {
                        running.failNum++;
                        reject(err);
                    }
                });
            });

        },
        _downFlie(fnmae, data) {
            var elementA = document.createElement('a');
            elementA.download = fnmae;
            elementA.style.display = 'none';
            var blob = new Blob([data]);
            elementA.href = URL.createObjectURL(blob);
            document.body.appendChild(elementA);
            elementA.click();
            document.body.removeChild(elementA);
        },
        async getCollatedData(dataType) {
            if (running.resultNum === 0) {
                return;
            }
            if (dataType.match('aria2')) {
                main.swalForInfo('==基于aria2发送RPC任务中,请等待==', '', 'center');
            }
            var swalTitle = '';
            let nameLinkTxt = '';
            var mediaIndex, selectedURL;
            if (dataType.match('播放')) {
                nameLinkTxt = '#EXTM3U\n'
            }
            filetxt.forEach(async (item) => {
                selectedURL = linkConfig.displays[6]=='checked' && item.medias.length > 0 ? item.medias[0].url : item.link;
                if (dataType.match('aria2')) {
                    return
                }
                if (dataType.match('迅雷直链')) {
                    nameLinkTxt += `${item.name}\n${selectedURL}\n`;
                }
                if (dataType.match('idm')) {
                    nameLinkTxt += `idman /d "${selectedURL}" /p "${linkConfig.local_path}${item.path}" /f "${item.name}" /a\nping 127.0.0.1 -n 2 >nul\n`;
                }
                if (dataType.match('curl')) {
                    nameLinkTxt += `echo 正在下载这个文件：&echo "${linkConfig.local_path}${item.path}\\${item.name}"&curl -L "${selectedURL}" -o "${linkConfig.local_path}${item.path}\\${item.name}"\n\n`;
                }
                if (dataType.match('Xdown')) {
                    nameLinkTxt += `aria2c "${selectedURL}" --dir "${linkConfig.local_path}${item.path}" --out "${item.name}"\n`;
                }
                if (dataType.match('播放')) {
                    mediaIndex = linkConfig.quality[0] === '' ? item.medias.length - 1 : 0;
                    nameLinkTxt += `#EXTINF:-1 ,${item.name}\n${item.medias[mediaIndex].url}\n`;
                }
            });
            if (dataType.match('复制')) {
                new ClipboardJS('.btn_bleu.xdown', {
                    text: function () {
                        return nameLinkTxt;
                    }
                });
                main.swalForInfo('复制链接成功！', 1000, 'top-end');
            } else if (dataType.match('aria2')) {
                swalTitle = `导入成功，请到aria2客户端查看任务!`;
                for (let index = 0; index < filetxt.length; index++) {
                    try {
                        selectedURL = linkConfig.displays[6]=='checked' && filetxt[index].medias.length > 0 ? filetxt[index].medias[0].url : filetxt[index].link;
                        if(linkConfig.displays[7]==''){
                            await main.sendDataByRPC(index,selectedURL);
                        }
                        else{//使用ariaNg发送
                            let timedelay = 100;
                            if(!window.ariaNgUI || window.ariaNgUI.closed){
                                window.ariaNgUI = window.open(`http://ariang.js.org/#!/settings/rpc/set/${linkConfig.aria2.ip.split('://')[0]}/${linkConfig.aria2.ip.split('://')[1]}/${linkConfig.aria2.port}/jsonrpc/${btoa(linkConfig.aria2.token)}`,'_blank');
                                timedelay = 2000;//不延迟，不能修改rpc配置
                            }
                            setTimeout(()=>{
                                window.ariaNgUI == null?swalTitle = `导入失败，ariaNg页面被拦截了！`:swalTitle;
                                window.ariaNgUI.location.href = `http://ariang.js.org/#!/new/task?url=${window.btoa(selectedURL)}&out=${encodeURIComponent(filetxt[index].name)}&dir=${encodeURIComponent(linkConfig.local_path)}${encodeURIComponent(filetxt[index].path)}`;
                            },timedelay)
                        }
                    } catch (error) {
                        console.log(error.responseText);
                        swalTitle.match('成功')?swalTitle = `导入失败，确认配置aria2没问题！`:swalTitle;
                        break;
                    }
                }
                main.swalForInfo(swalTitle, 3000, 'top-end');
            } else {
                let filenam = `${dataType.replace('.txt','')}${(new Date()).valueOf()}.txt`;
                if (dataType.match('播放')) {
                    main.putDataToJGY(filenam,nameLinkTxt);
                }else{
                    this._downFlie(filenam, nameLinkTxt);
                }
            }
        },
        swalForInfo(satitle, satime, saposition) {
            Swal.fire({
                title: satitle,
                position: saposition,
                showConfirmButton: false,
                timer: satime,
                customClass: {
                    title: 'bleu_sa_title_min',
                    popup: 'bleu_sa_popup_min'
                }
            })
        },
        putDataToJGY(filenam,nameLinkTxt){
            if(linkConfig.jgy.account==''){
                filenam =`${$('.td-breadcrumb__item').last()[0].innerText}.m3u`;
                this._downFlie(filenam, nameLinkTxt);
            }
            else{
                $.ajaxPrefilter((options)=> {
                    if (options.crossDomain && $.support.cors) {
                        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
                    }
                });
                $.ajax({
                    type: "put",
                    headers: {"authorization": `Basic ${btoa(linkConfig.jgy.account+':'+linkConfig.jgy.password)}`},
                    url: `https://dav.jianguoyun.com/dav/${linkConfig.jgy.path}/xlPlaylist.m3u`,
                    data:nameLinkTxt,
                    crossDomain:true,
                    success:()=> {
                        main.swalForInfo("导入到坚果云成功！", 3000, 'top-end');
                    },
                    error: ()=> {
                        window.open('https://cors-anywhere.herokuapp.com/','_blank');
                        main.swalForInfo("导入到坚果云失败！", 3000, 'top-end');
                    }
                })
            }
        },
        sendDataByRPC(index,selectedURL) {
            let jsonData = {
                id: new Date().getTime(),
                jsonrpc: '2.0',
                method: 'aria2.addUri',
                params: [`token:${linkConfig.aria2.token}`, [selectedURL], {
                    dir: linkConfig.local_path + filetxt[index].path,
                    out: filetxt[index].name
                }]
            }
            jsonData = JSON.stringify(jsonData);
            return new Promise((resolve, reject) => {
                $.ajax({
                    type: 'post',
                    url: `${linkConfig.aria2.ip}:${linkConfig.aria2.port}/jsonrpc`,
                    data: jsonData,
                    //dataType: "json",
                    success: function (textStatus) {
                        resolve(textStatus);
                    },
                    error: function (err) {
                        reject(err);
                    }
                });
            });
        },
        hookFetch() {
            Object.defineProperty(window, "fetch", {
                configurable: true,
                enumerable: true,
                // writable: true,
                get() {
                    return (url, options) => {
                        if (url.indexOf('https://api-pan.xunlei.com/drive/v1/files?limit=100&') === 0) {
                            filesURL = url;
                            reqHeaders = options.headers;
                        }
                        return originFetch(url, options)
                    }
                }
            })
        },
        initUI() {
            var observer = new MutationObserver(function (mutationsList) {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        if (mutation.target.querySelector('.pan-list-menu') && $('#bleu_btn').length == 0) {
                            main.addElements();
                            main.addButtonEvent();
                            break;
                        }
                    }
                }
            });
            observer.observe($('#__layout')[0], {
                childList: true,
                subtree: true,
            });
        },
    }
    window.onunload = ()=>{window.ariaNgUI&&window.ariaNgUI.close();};
    main.hookFetch();
    main.addCssStyle();
    main.initUI();
})();
