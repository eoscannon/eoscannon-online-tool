let eos = null;
function getEos() {
  const httpEndpoint = 'https://mainnet.eoscannon.io';
  const chainId = 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906';
  const config = {
    httpEndpoint,
    chainId,
  };
  eos = Eos(config);
  $("#mainnet_chain").html('aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906');
}


//获取初始化信息
function getInitJson(){
  const expireInSeconds = 60 * 60; // 1 hour
  eos.getInfo({}).then((info) => {
    const chainDate = new Date(`${info.head_block_time}Z`);
    const expiration = new Date(chainDate.getTime() + expireInSeconds * 1000);
    const expirationStr = expiration.toISOString().split('.')[0];
    const refBlockNum = info.last_irreversible_block_num & 0xffff;
    eos.getBlock(info.last_irreversible_block_num).then(block => {
      const refBlockPrefix = block.ref_block_prefix;
      const transactionHeaders = {
        expiration: expirationStr,
        refBlockNum: refBlockNum,
        refBlockPrefix: refBlockPrefix,
        chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
      };
      document.getElementById('signed-message').value = JSON.stringify(transactionHeaders);
      makeCode();
    });
  });
}

//发送报文
function pushTransaction(){
  var signed = document.getElementById('send-message').value;
  eos.pushTransaction(JSON.parse(signed)).then((res) => {
    $(".transactionIdMain").html(res.transaction_id)
    alert(`发送报文成功,请在页尾查看transaction_id=${res.transaction_id}`);
  }).catch((err) => {
    console.log('Err:',err);
    alert(err.message);
  });
}

var qrcode = new QRCode(document.getElementById("qrcode"), {
  width : 300,
  height : 300
});

function makeCode () {
  var elText = document.getElementById("signed-message").value;
  qrcode.makeCode(elText);
}

$("#signed-message").change(function () {
    makeCode();
})

function doMain(){
  //window.clearInterval(initTest)
  init()
  $('#myTab li:first-child a').css('color','yellow')
  $('#myTab li:last-child a').css('color','#fff')
}

function init() {
  // 按钮添加复制到剪贴板功能
  new Clipboard('.btn');
  // 获取EOS
  getEos();
  // 获取初始化信息，将其赋值到信息框中
  getInitJson();
  // 定时更新初始化信息
  //setInterval(() => {getInitJson();}, 60000);
  $('#myTab li:first-child a').css('color','yellow')
}
window.onload = init;


//测试网方法
function getEosTest(data) {
  let httpEndpoint = document.getElementById('nodeUrlTest').value;
  let chainId = data.chain_id;
  $("#testnet_chain").html(data.chain_id);
  let config = {
    httpEndpoint,
    chainId,
  };
  eos = Eos(config);
}

//获取初始化信息
function getInitJsonTest(){
  console.log("eos====",eos)
  let expireInSeconds = 60 * 60; // 1 hour
  eos.getInfo({}).then((info) => {
    let chainDate = new Date(`${info.head_block_time}Z`);
    let expiration = new Date(chainDate.getTime() + expireInSeconds * 1000);
    let expirationStr = expiration.toISOString().split('.')[0];
    let refBlockNum = info.last_irreversible_block_num & 0xffff;
    let chainId = info.chain_id;
    eos.getBlock(info.last_irreversible_block_num).then(block => {
      let refBlockPrefix = block.ref_block_prefix;
      let transactionHeaders = {
        expiration: expirationStr,
        refBlockNum: refBlockNum,
        refBlockPrefix: refBlockPrefix,
        chainId: chainId
      };
      document.getElementById('signed-messageTest').value = JSON.stringify(transactionHeaders);
      makeCodeTest();
    });
  }).catch((err)=>{
    alert('请求失败')
    return
  });
}

//发送报文
function pushTransactionTest(){
  var signed = document.getElementById('send-messageTest').value;
  eos.pushTransaction(JSON.parse(signed)).then((res) => {
    console.log('res:',res)
    console.log('transaction_id:',res.transaction_id)
    alert(`发送报文成功,请在页尾查看transaction_id=${res.transaction_id}`);
    $(".transactionId").html(res.transaction_id)
  }).catch((err) => {
    console.log('Err:',err);
    alert('发送失败.',err.message);
  });
}

var qrcodeTset = new QRCode(document.getElementById("qrcodeTest"), {
  width : 300,
  height : 300
});

function makeCodeTest () {
  var elText = document.getElementById("signed-messageTest").value;
  qrcodeTset.makeCode(elText);
}

$("#signed-messageTest").change(function () {
  makeCodeTest();
})

function initTest() {
  // 按钮添加复制到剪贴板功能
  new Clipboard('.btn');
  document.getElementById('nodeUrlTest').value = 'https://tool.eoscannon.io/jungle'
  //document.getElementById('nodeUrlTest').value = 'http://dev.cryptolions.io:38888'
  //执行剩余操作
  dealTest()

}
function dealTest(){
  $('#myTab li:first-child a').css('color','#fff')
  $('#myTab li:last-child a').css('color','yellow')
  //window.clearInterval(init)
  getChainId();
  // 定时更新初始化信息
  //setInterval(() => {getInitJsonTest();}, 60000);
}

function getChainId(){
  $.ajax({
    url: document.getElementById('nodeUrlTest').value + "/v1/chain/get_info",
    type: 'get',
    success: function(data,state){
      console.log('state:',state)
      //这里显示从服务器返回的数据 // 获取EOS
      getEosTest(data);
      //// 获取初始化信息，将其赋值到信息框中
      getInitJsonTest();
    },
    error:function(){
      alert("请求失败，请稍后重试！")
    }
  })
}

function search(){
  console.log("signed====",$('.accountName').val())
  var signed = $('.accountName').val();
  eos.getAccount({'account_name': signed}).then(result => {
    console.log(result);
    let time = filterTime(result.created)
    $('.content').css('display','flex')
    $('.createdTime').html(time)
    $('.Cpu').html(result.total_resources.cpu_weight)
    $('.network').html(result.total_resources.net_weight)
    if(result.voter_info && result.voter_info.staked){
      $('.mortgage').html(result.voter_info.staked / 10000+' EOS')
    }else{
      $('.mortgage').html('0 ' + $('.tokenName').val())
    }
    if(result.voter_info && result.voter_info.producers){
      let producer = ''
      for(let i=0;i<result.voter_info.producers.length;i++){
        producer += result.voter_info.producers[i]
      }
      $('.node_done').html(producer)
    }else{
      $('.node_done').html('暂无')
    }
    if(result.cpu_limit){
      let num = result.cpu_limit.used/1000 + ' ms/' +result.cpu_limit.max/1000+' ms'
      let propotion = result.cpu_limit.used / result.cpu_limit.max
      $('.Cpu_Proportion').html(num)

    }
    if(result.net_limit){
      let netNum = result.net_limit.used + ' bytes/' +((result.net_limit.max/1024)/1024).toFixed(2)+' Mib'
      $('.network_Proportion').html(netNum)
    }
    if(result.ram_usage && result.ram_usage){
      let ramNum = (result.ram_usage/1024).toFixed(2)+' Kib/' + (result.ram_quota/1024).toFixed(2)+' Kib'
      $('.memory_Proportion').html(ramNum)
    }
    if(result.refund_request){
      $('.Cpu_back').html(result.refund_request.cpu_amount)
      $('.net_back').html(result.refund_request.net_amount)
    }else{
      $('.Cpu_back').html('0 EOS')
      $('.net_back').html('0 EOS')
    }

  }).catch((err) => {
    console.log('Err:',err);
    alert('发送失败.',err.message);
  });
  eos.getCurrencyBalance({
    "code": $('.constractName').val(),
    "account": signed,
    "symbol": $('.tokenName').val(),
  }).then((res)=> {
    if(res[0]){
      $('.balance').html(res[0])
    }else{
      $('.balance').html('0 ' + $('.tokenName').val())
    }
    // 4.1版本如果Balance为0,返回空数组
    console.log(res);
  }).catch((err)=>{
    console.log('err:',err)
    $('.balance').html('0 ' + $('.tokenName').val())
  });
}
function searchTest(){
  console.log("signed====",$('.accountNameTest').val())
  var signed = $('.accountNameTest').val();
  eos.getAccount({'account_name': signed}).then(result => {
    console.log(result);
    let time = filterTime(result.created)
    $('.contentTest').css('display','flex')
    $('.createdTimeTest').html(time)
    $('.CpuTest').html(result.total_resources.cpu_weight)
    $('.networkTest').html(result.total_resources.net_weight)
    if(result.voter_info){
      $('.mortgageTest').html(result.voter_info.staked / 10000 +' EOS')
    }
    if(result.voter_info && result.voter_info.producers){
      let producer = ''
      for(let i=0;i<result.voter_info.producers.length;i++){
        producer += result.voter_info.producers[i]
      }
      $('.node_done_test').html(producer)
    }else{
      $('.node_done_test').html('暂无')
    }
    if(result.cpu_limit){
      let num = result.cpu_limit.used/1000 + ' ms/' +result.cpu_limit.max/1000+' ms'
      let propotion = result.cpu_limit.used / result.cpu_limit.max
      $('.Cpu_ProportionTest').html(num)

    }
    if(result.net_limit){
      let netNum = result.net_limit.used + ' bytes/' +((result.net_limit.max/1024)/1024).toFixed(2)+' Mib'
      $('.network_ProportionTest').html(netNum)
    }
    if(result.ram_usage && result.ram_usage){
      let ramNum = (result.ram_usage/1024).toFixed(2)+' Kib/' + (result.ram_quota/1024).toFixed(2)+' Kib'
      $('.memory_ProportionTest').html(ramNum)
    }
    if(result.refund_request){
      $('.Cpu_back_test').html(result.refund_request.cpu_amount)
      $('.net_back_test').html(result.refund_request.net_amount)
    }else{
      $('.Cpu_back_test').html('0 EOS')
      $('.net_back_test').html('0 EOS')
    }
  }).catch((err) => {
    console.log('Err:',err);
    alert('发送失败.',err.message);
  });

  eos.getCurrencyBalance({
    "code": $('.constractNameTest').val(),
    "account": signed,
    "symbol": $('.tokenNameTest').val(),
  }).then((res)=> {
    if(res[0]){
      $('.balanceTest').html(res[0])
    }else{
      $('.balanceTest').html('0 EOS')
    }
    // 4.1版本如果Balance为0,返回空数组
    console.log(res);
  }).catch((err)=>{
    console.log('err:',err)
    $('.balance').html('0 EOS')
  });
}

function filterTime(time){
  let newTime = new Date(time)
  let year = newTime.getFullYear()
  let month = newTime.getMonth()<10? '0' + newTime.getMonth() : newTime.getMonth()
  let day = newTime.getDay()<10? '0' + newTime.getDay() : newTime.getDay()
  let hours = newTime.getHours()<10? '0' + newTime.getHours() : newTime.getHours()
  let min = newTime.getMinutes()<10? '0' + newTime.getMinutes(): newTime.getMinutes()
  let sec = newTime.getSeconds()<10? '0' + newTime.getSeconds(): newTime.getSeconds()
  return year+'-'+month+'-'+day+' '+hours+':'+min+':'+sec+' UTC'
}

//扫描事件
window.addEventListener('load', function () {
  const codeReader = new ZXing.BrowserQRCodeReader()
  codeReader.getVideoInputDevices()
    .then((videoInputDevices) => {
      const sourceSelect = document.getElementById('sourceSelect')
      const firstDeviceId = videoInputDevices[0].deviceId
      if (videoInputDevices.length > 1) {
        videoInputDevices.forEach((element) => {
          const sourceOption = document.createElement('option')
          sourceOption.text = element.label
          sourceOption.value = element.deviceId
          sourceSelect.appendChild(sourceOption)
        })

        const sourceSelectPanel = document.getElementById('sourceSelectPanel')
        sourceSelectPanel.style.display = 'block'
      }
//正式网
      document.getElementById('startButton').addEventListener('click', () => {
        codeReader.reset()
        console.log('Reset.')

        codeReader.decodeFromInputVideoDevice(firstDeviceId, 'video').then((result) => {
          console.log(result)
          document.getElementById('send-message').textContent = result.text
          //$('#startButton').html('重新扫描')
        }).catch((err) => {
          console.error(err)
          document.getElementById('send-message').textContent = err
        })
        console.log(`Started continous decode from camera with id ${firstDeviceId}`)
      })
//测试网
      document.getElementById('startButtonTest').addEventListener('click', () => {
        codeReader.reset()
        console.log('Reset.')

        codeReader.decodeFromInputVideoDevice(firstDeviceId, 'videoTest').then((result) => {
          console.log(result)
          //$('#startButtonTest').html('重新扫描')
          document.getElementById('send-messageTest').textContent = result.text
        }).catch((err) => {
          console.error(err)
          document.getElementById('send-messageTest').textContent = err
        })
        console.log(`Started continous decode from camera with id ${firstDeviceId}`)
      })

    })
    .catch((err) => {
      console.error(err)
    })
})