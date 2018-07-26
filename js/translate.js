// load I18N bundles
jQuery(document).ready(function() {
  loadBundles('pt_BR');

  // configure language combo box
  jQuery('#lang').change(function() {
    var selection = jQuery('#lang option:selected').val();
    loadBundles(selection != 'browser' ? selection : null);
    jQuery('#langBrowser').empty();
    if(selection == 'browser') {
      jQuery('#langBrowser').text('('+jQuery.i18n.browserLang()+')');
    }
  });

  // load files just for display purposes...
  jQuery('h4').each(function() {
    var file = 'bundle/' + jQuery(this).text();
    var code = jQuery(this).next().next('code');
    jQuery.get(file, function(data) {
      data = data.replace(/\n/mg, '<br/>');
      code.html(data);
    });
  });
  // ... and configure links to show/hide them
  jQuery('a.toggle').bind('click', function() {
    jQuery(this).next('code').slideToggle();
    return false;
  });
});

function loadBundles(lang) {
  jQuery.i18n.properties({
    name:'Messages',
    path:'bundle/',
    mode:'both',
    language:lang,
    callback: function() {
      updateExamples();
    }
  });
}

function updateExamples() {
  // Accessing values through the map
  var toolName = 'tool_name';
  var pageAttention = 'page_attention';
  var eosBlockHeight = 'eos_block_height';
  var mainNetTab = 'main_net_tab';
  var testNetTab = 'test_net_tab';
  var mainNetChainId = 'main_net_chain_id';
  var pasteMessage = 'paste_message';
  var copy = 'copy_btn';
  var sendMessageLabel = 'send_messageLabel';
  var startButton = 'start_button';
  var send = 'send_btn';
  var accountDetail = 'account_detail';
  var searchBtn = 'search_btn';
  var createdTime = 'created_time';
  var balance = 'balance_num';
  var mortgage = 'mortgage_num';
  var memory = 'memory_num';
  var network = 'network_num';
  var getExpTest = 'get_exp_test';
  var nodeDoneNum = 'node_done_num';
  var accountName = 'account_name';
  var constractName = 'constract_name';
  var tokenName = 'token_name';
  var redeemBack = 'redeem_back';
  var qrBtnMobile = 'qrbtn_mobile';

  console.log('========')
  $('#toolName').html(eval(toolName))
  $('#pageAttention').html(eval(pageAttention))
  $('.eosBlockHeight').html(eval(eosBlockHeight))
  $('#mainNetTab').html(eval(mainNetTab))
  $('#testNetTab').html(eval(testNetTab))
  $('#mainNetChainId').html(eval(mainNetChainId))
  $('#pasteMessage').html(eval(pasteMessage))
  $('.copy').html(eval(copy))
  $('.sendMessageLabel').html(eval(sendMessageLabel))
  $('.startButton').html(eval(startButton))
  $('.send').html(eval(send))
  $('.accountDetail').html(eval(accountDetail))
  $('.searchBtn').html(eval(searchBtn))
  $('.createdTime_num').html(eval(createdTime))
  $('.balance_num').html(eval(balance))
  $('.mortgage_num').html(eval(mortgage))
  $('.memory_num').html(eval(memory))
  $('.network_num').html(eval(network))
  $('.getExpTest_num').html(eval(getExpTest))
  $('.nodeDoneNum').html(eval(nodeDoneNum))
  $('.account_name').html(eval(accountName))
  $('.constract_name').html(eval(constractName))
  $('.token_name').html(eval(tokenName))
  $('.redeemBack').html(eval(redeemBack))
  $('.qrBtnMobile').html(eval(qrBtnMobile))

}