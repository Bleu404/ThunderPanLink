(function () {
    'use strict';
    var BleuButton;
    var appid, key;
    let toolbox = {
        addNewStyle() {
            let cssStyle = [
                '.btn_bleu{padding: 10px 25px;font-size: 16px;cursor: pointer;text-align: center;   text-decoration: none;outline: none;color: #fff;background-color: #008CBA;border: none;border-radius: 14px;display:block;margin:0 auto}',
                '.btn_bleu:hover{background-color: #008CEA}',
                '.btn_bleu:active{background-color: #008CEA;box-shadow: 0 5px #666;transform: translateY(4px);}',
                '.floatButton {position: fixed;bottom: 10%;left:49%;right: 0;margin:0 auto;z-index:9999}',
            ];
            BleuButton = '<div><input type="button" class="btn_bleu floatButton" id="btn_bleu" value="选择被翻译文件" ></div>';
            cssStyle.forEach(function (value) {
                GM_addStyle(value);
            });
        },

        getRegeditInfo() {

        },

    }

    let translator = {
        addTranslateButton() {
            toolbox.addNewStyle();
            $('body').append(BleuButton);
            this.buttonAddEvent();
        },

        buttonAddEvent() {
            $(".btn_bleu.floatButton").on("click", function () {
                GM_addStyle('#trans{position: fixed;width:200px;height:400px;background-color:white;z-index:9999}')
                let html = '<div id="trans" displau="block"></div>'
                $("body").prepend(html);
                /*swal({
                    title: '输入百度翻译appID和密钥',
                    html: '<input id="swal-input1" class="swal2-input">' +
                        '<input id="swal-input2" class="swal2-input">',
                    showCancelButton: true,
                    preConfirm: function () {
                        return new Promise(function (resolve) {
                            resolve([
                                $('#swal-input1').val(),
                                $('#swal-input2').val()
                            ])
                        })
                    },
                    onOpen: function () {
                        $('#swal-input1').val(GM_getValue("BDTappid"));
                        $('#swal-input2').focus();
                    }
                }).then(function (result) {
                    appid = result.value[0];
                    GM_setValue("BDTappid", appid);
                    key = result.value[1];
                    swal({
                        title: '选择被翻译文件',
                        html: '<input type="file" name="file" multiple="multiple" />',
                    }).then(function (file) {
                        var reader = new FileReader
                        reader.onload = function (e) {
                            swal({
                                imageUrl: e.target.result
                            })
                        }
                        reader.readAsDataURL(file)
                    })
                })*/
            });
        },

        translateFiles() {

        },

        init() {
            this.addTranslateButton();
            this.translateFiles();
        },
    }
    translator.init();
    // Your code here...
})();