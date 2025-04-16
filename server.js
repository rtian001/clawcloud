const UUID=process.env.UUID||'cf83007a-1db2-4ae5-a148-e7820566df5e'
const html=`
<!DOCTYPE html>
<html>

    <head>
        <meta charset="utf-8">
        <title>黑神话·悟空--拼图游戏</title>
        <style id="style1">
            div,
            body {
                margin: 0;
                padding: 0;
                overflow: hidden;
            }

            #game {
                width: 100vw;
                height: 100vh;
                overflow: hidden;
                transition: all 0.3s ease;
                background-repeat: no-repeat;
            }

            .block {
                position: absolute;
                box-sizing: border-box;
                transition: all 0.3s ease;
                border: 2px solid transparent;
                background-repeat: no-repeat;
            }

            .gamesboder {
                border-color: #ddd;
                border-radius: 10px;
            }
        </style>
    </head>

    <body>
        <div id="game">
        </div>
        <script>
        const UUID="${UUID}"
            if (location.search == '') {
                location.search = "?size=3x4"
            }
            if (location.search == '?uuid') {
                location.search = "?"+UUID;
            }
            const host = 'https://img.128877.xyz/'
            var imgs = [{
                name: 'wukong1.jpg',
                width: 3840,
                height: 1935
            }, {
                name: 'wukong2.jpg',
                width: 4320,
                height: 2160
            }, {
                name: 'wukong3.jpg',
                width: 3539,
                height: 2160
            }, {
                name: 'wukong4.jpg',
                width: 3840,
                height: 2160
            }];
            var gamediv = document.getElementById('game');
            var params = new URLSearchParams(window.location.search).get('size')?.split('x').map(n => n > 0 ? n < 10 ? n : 10 : 3);
            if (params && params.length == 1) params = params.concat(params)
            var g_size = params || [3, 3];
            var g_block = [],
                g_img = [];
            var gamestart = false
            var level = ~~(Math.random() * 4)
            init()
            switchImg(level)
            reSize()
            gamediv.addEventListener('click', start);
            window.addEventListener('resize', reSize);
            document.addEventListener('mouseenter', showboder)
            document.addEventListener('mouseleave', hiddenboder)
            document.addEventListener('contextmenu', function (event) {
                event.preventDefault();
                reSize(0)
            }, false);

            function showboder() {
                if (gamestart) return
                g_block.forEach(div => {
                    div.classList.add('gamesboder')
                })
            }

            function hiddenboder() {
                if (gamestart) return
                g_block.forEach(div => {
                    div.classList.remove('gamesboder')
                })
            }

            function init() {
                gamestart = false
                for (var i = 0; i < g_size[0]; i++) {
                    for (var j = 0; j < g_size[1]; j++) {
                        var ele = document.createElement('div');
                        ele.id = 'g-' + i + '-' + j;
                        ele.className = 'block';
                        ele.setAttribute('draggable', 'true'); //设置图片块允许拖放
                        ele.setAttribute('ondragstart', 'drag(event)'); //拖动函数
                        ele.setAttribute('ondragover', 'allowDrop(event)'); //设置游戏块的放置事件:允许放置
                        ele.setAttribute('ondrop', 'drop(event)'); //放置函数
                        gamediv.appendChild(ele);
                        g_block.push(ele)
                    }
                }
            }

            function switchImg(level) {
                let imgurl = 'url(' + host + imgs[level].name + ')'
                gamediv.style.backgroundImage = imgurl
                g_block.forEach(div => {
                    div.style.backgroundImage = imgurl
                })
            }

            function start() {
                if (!gamestart) {
                    gamestart = true
                    gamediv.style.backgroundImage = 'none'
                }
                for (var i = 0; i < g_block.length - 1; i++) {
                    var rnd = parseInt(Math.random() * (g_block.length - (i + 1)) + i + 1);
                    var tmp = g_block[i].style.transform;
                    g_block[i].style.transform = g_block[rnd].style.transform;
                    g_block[rnd].style.transform = tmp;
                }
            }

            function reSize(n) {
                if (n == 0) {
                    g_img = []
                    gamestart = false
                    gamediv.style.backgroundImage = 'url(' + host + imgs[level].name + ')'
                }
                // 获取窗口的宽度和高度  
                var width = document.documentElement.clientWidth || document.body.clientWidth;
                var height = document.documentElement.clientHeight || document.body.clientHeight;
                let imgscale_w = width / imgs[level].width;
                let imgscale_h = height / imgs[level].height;
                let img_w = width;
                let img_h = height;
                let offset_w = 0;
                let offset_h = 0;
                if (imgscale_h > imgscale_w) {
                    img_w = imgs[level].width * imgscale_h;
                    offset_w = (img_w - width) / 2;
                } else {
                    img_h = imgs[level].height * imgscale_w;
                    offset_h = (img_h - height) / 2;
                }
                //===设置背景图片格式
                gamediv.style.width = width + 'px'
                gamediv.style.height = height + 'px'
                gamediv.style.backgroundPosition = (-offset_w) + 'px ' + (-offset_h) + 'px'
                gamediv.style.backgroundSize = img_w + 'px ' + img_h + 'px';
                //=======设置游戏块图片格式
                var w = width / g_size[1],
                    h = height / g_size[0];
                for (var i = 0; i < g_size[0]; i++) {
                    for (var j = 0; j < g_size[1]; j++) {
                        ele = g_block[i * g_size[1] + j]
                        ele.style.width = w + 'px';
                        ele.style.height = h + 'px';
                        ele.style.backgroundSize = img_w + 'px ' + img_h + 'px';
                        ele.style.backgroundPosition = -(offset_w + j * w) + 'px -' + (offset_h + i * h) + 'px';
                        if (g_img.length < g_size[0] * g_size[1]) {
                            ele.style.transform = 'translate(' + (j * w) + 'px,' + (i * h) + 'px)';
                            g_img.push(ele.style.transform)
                        } else {
                            let id = g_img.indexOf(ele.style.transform)
                            let [x, y] = [id % g_size[1], ~~(id / g_size[1])]
                            ele.style.transform = 'translate(' + (x * w) + 'px,' + (y * h) + 'px)';
                            g_img[id] = ele.style.transform
                        }
                    }
                }
            }

            function drag(ev) {
                ev.dataTransfer.setData('text', ev.target.id);
            }

            function allowDrop(ev) {
                ev = ev || window.event;
                ev.preventDefault();
            }

            function drop(ev) {
                ev = ev || window.event;
                ev.preventDefault();
                var dragdiv = document.getElementById(ev.dataTransfer.getData('text'));
                var dropdiv = ev.target;
                var dragimg = dragdiv.style.transform;
                var dropimg = dropdiv.style.transform;
                dragdiv.style.transform = dropimg;
                dropdiv.style.transform = dragimg;
                if (checkOver() == true) {
                    gamestart = false
                    gamediv.classList.add('gamebg')
                    hiddenboder()
                    setTimeout(function () {
                        // alert('恭喜完成');
                        level = (level + 1) % 4
                        switchImg(level)
                        reSize()
                        showboder()
                    }, 1000);
                }
            }

            function checkOver() {
                for (var i = 0; i < g_block.length; i++) {
                    if (g_block[i].style.transform != g_img[i]) {
                        return false;
                    }
                }
                return true;
            }
        </script>
    </body>

</html>

`


const http = require('http'); 
const server = http.createServer((req,  res) => { 
  res.writeHead(200,  { 'Content-Type': 'text/html' }); 
    res.end(html); 
}); 

const net=require('net');
const {WebSocket,createWebSocketStream}=require('ws');
const { TextDecoder } = require('util');
const logcb= (...args)=>console.log.bind(this,...args);
const errcb= (...args)=>console.error.bind(this,...args);

const uuid= UUID.replace(/-/g, "");
const port= process.env.PORT||3000;

const wss=new WebSocket.Server({server,path:'/ws'});
wss.on('connection', ws=>{
    console.log("on connection")
    ws.once('message', msg=>{
        const [VERSION]=msg;
        const id=msg.slice(1, 17);
        if(!id.every((v,i)=>v==parseInt(uuid.substr(i*2,2),16))) return;
        let i = msg.slice(17, 18).readUInt8()+19;
        const port = msg.slice(i, i+=2).readUInt16BE(0);
        const ATYP = msg.slice(i, i+=1).readUInt8();
        const host= ATYP==1? msg.slice(i,i+=4).join('.')://IPV4
            (ATYP==2? new TextDecoder().decode(msg.slice(i+1, i+=1+msg.slice(i,i+1).readUInt8()))://domain
                (ATYP==3? msg.slice(i,i+=16).reduce((s,b,i,a)=>(i%2?s.concat(a.slice(i-1,i+1)):s), []).map(b=>b.readUInt16BE(0).toString(16)).join(':'):''));//ipv6

        logcb('conn:', host,port);
        ws.send(new Uint8Array([VERSION, 0]));
        const duplex=createWebSocketStream(ws);
        net.connect({host,port}, function(){
            this.write(msg.slice(i));
            duplex.on('error',errcb('E1:')).pipe(this).on('error',errcb('E2:')).pipe(duplex);
        }).on('error',errcb('Conn-Err:',{host,port}));
    }).on('error',errcb('EE:'));
});

server.listen(port,  () => { 
    console.log(` 服务器正在监听端口 ${port}`); 
}); 
