let eos = null;
function getEos() {
  const httpEndpoint = 'https://mainnet.eoscannon.io';
  const chainId = 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906';
  const config = {
    httpEndpoint,
    chainId,
  };
  eos = Eos(config);
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
        ref_block_num: refBlockNum,
        ref_block_prefix: refBlockPrefix,
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
    alert('发送报文成功');
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
  window.clearInterval(initTest)
  init()
  console.log('$===',$)
  $('#home').css('color','red')
  $('#ios').css('color','#fff')
}

function init() {
  // 按钮添加复制到剪贴板功能
  new Clipboard('.btn');
  // 获取EOS
  getEos();
  // 获取初始化信息，将其赋值到信息框中
  getInitJson();
  // 定时更新初始化信息
  setInterval(() => {getInitJson();}, 60000);
}
window.onload = init;


//测试网方法
function getEosTest() {
  let httpEndpoint = document.getElementById('nodeUrlTest').value;
  let chainId = document.getElementById('chainIdTest').value;
  let config = {
    httpEndpoint,
    chainId,
  };
  eos = Eos(config);
  console.log("httpEndpoint==", httpEndpoint )
  console.log("chainId==", chainId )
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
    eos.getBlock(info.last_irreversible_block_num).then(block => {
      let refBlockPrefix = block.ref_block_prefix;
      let transactionHeaders = {
        expiration: expirationStr,
        ref_block_num: refBlockNum,
        ref_block_prefix: refBlockPrefix,
      };
      document.getElementById('signed-messageTest').value = JSON.stringify(transactionHeaders);
      makeCodeTest();
    });
  }).catch((err)=>{
    "use strict";
    console.log('请求失败')
    alert('请求失败')
    return
  });
}

//发送报文
function pushTransactionTest(){
  var signed = document.getElementById('send-messageTest').value;
  eos.pushTransaction(JSON.parse(signed)).then((res) => {
    alert('发送报文成功');
  }).catch((err) => {
    console.log('Err:',err);
    alert(err.message);
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

  document.getElementById('chainIdTest').value = 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
  document.getElementById('nodeUrlTest').value = 'http://13.251.3.82:8888'
  //执行剩余操作
  dealTest()

}
function dealTest(){

  $('#ios').css('color','red')
  $('#home').css('color','#fff')
  window.clearInterval(init)
  // 获取EOS
  getEosTest();
  // 获取初始化信息，将其赋值到信息框中
  getInitJsonTest();
  // 定时更新初始化信息
  setInterval(() => {getInitJsonTest();}, 60000);
}