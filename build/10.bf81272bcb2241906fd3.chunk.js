(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{ee98eb1d19acbbfb92cd:function(e,t,a){"use strict";a.r(t);a("0ebca53c1b8697ff3082");var o=a("f4369d707c99f1f35bde"),n=(a("2178a378cd4bc313ccb0"),a("aefad163ebec119b5ddd")),s=(a("88b403c8b36763f1da89"),a("65929ca351a8cfbf6429")),r=(a("179767b8db9206fed946"),a("a706fed6b17f4e559b73")),i=(a("6fe8b0e6cbe1b2dbd768"),a("528d6b723ddc28ff5abf")),c=a("38fe40aaedb88490d4df"),d=a.n(c),l=a("87a61a995c44dd45d235"),u=(a("96da8a7155dce770d74d"),a("36190f180cb6025b4c8b")),f=(a("3e1732693f17cb43c294"),a("d45a7a77f6858ec9b119")),b=document.body.clientHeight-170,p={BodyBox:f.a.article.withConfig({displayName:"styles__BodyBox"})(["background:#262626;color:#eee;.ant-layout{background:none;}.ant-btn{color:#fff;}"]),ConBox:f.a.div.withConfig({displayName:"styles__ConBox"})(["box-sizing:border-box;position:relative;width:100%;min-height:","px;.content{display:flex;padding-top:2rem;}.firstContent{width:50%;span{display:block;padding-bottom:1.2rem;}}.contentDetail{text-align:center;}.secondContent{display:flex;width:100%;justify-content:space-around;}.contentDetailDesc{display:block;.contentDetailDescTitle{padding-top:1rem;font-weight:bold;}span{text-align:center;display:block;}}"],b)},v=a("537e9378f1e5205c76aa"),m=a("e8c18121a227016693d8"),h=(a("11f2d0f6be39e37bc55d"),a("6851e8cfc06988feaf73"),Object(l.defineMessages)({TransferFromAccountNamePlaceholder:{id:"TransferPage TransferFromAccountNamePlaceholder",defaultMessage:"请输入私钥对应的账户名"},TransferToAccountNamePlaceholder:{id:"TransferPage TransferToAccountNamePlaceholder",defaultMessage:"请输入将要转入的账户名"},TransferContractPlaceholder:{id:"TransferPage TransferContractPlaceholder",defaultMessage:"请输入Contract"},TransferQuantityPlaceholder:{id:"TransferPage TransferQuantityPlaceholder",defaultMessage:"请输入转账的数量"},TransferDigitPlaceholder:{id:"TransferPage TransferDigitPlaceholder",defaultMessage:"请输入代币精度"},TransferSymbolPlaceholder:{id:"TransferPage TransferSymbolPlaceholder",defaultMessage:"请输入Symbol"},TransferMemoPlaceholder:{id:"TransferPage TransferMemoPlaceholder",defaultMessage:"请输入Memo，交易所转账必填"},TransferMemoHelp:{id:"TransferPage TransferMemoHelp",defaultMessage:"注：交易所转账必填"},FromLabel:{id:"TransferPage FromLabel",defaultMessage:"转账账户"},ToLabel:{id:"TransferPage ToLabel",defaultMessage:"接收账户"},ContractLabel:{id:"TransferPage ContractLabel",defaultMessage:"合约"},QuantityLabel:{id:"TransferPage QuantityLabel",defaultMessage:"转账数量"},DigitLabel:{id:"TransferPage DigitLabel",defaultMessage:"精度"},SymbolLabel:{id:"TransferPage SymbolLabel",defaultMessage:"单位"}}),a("9cada3e1a82441d5dc97")),g=a("45f569ed10adf086745a"),y=a("9c46063cff2d7d561477"),k=a("191e6578136ab57477d1");a.d(t,"AccountSearchPage",function(){return w});var S=function(){var e="function"==typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103;return function(t,a,o,n){var s=t&&t.defaultProps,r=arguments.length-3;if(a||0===r||(a={}),a&&s)for(var i in s)void 0===a[i]&&(a[i]=s[i]);else a||(a=s||{});if(1===r)a.children=n;else if(r>1){for(var c=Array(r),d=0;d<r;d++)c[d]=arguments[d+3];a.children=c}return{$$typeof:e,type:t,key:void 0===o?null:""+o,ref:null,props:a,_owner:null}}}(),T=function(){function e(e,t){for(var a=0;a<t.length;a++){var o=t[a];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,a,o){return a&&e(t.prototype,a),o&&e(t,o),t}}();var _=u.a.Search,C=i.a.Option,P=r.a.TabPane,w=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return a.handleGetTransaction=function(e){},a.searchBlance=function(e){console.log(e)},a.handleChange=function(e){console.log(e);console.log("this.state.netWorkStatus====",a.state.netWorkStatus),("main"==a.state.netWorkStatus?Object(v.b)():Object(v.c)()).getCurrencyBalance({code:e.key,account:a.state.account,symbol:e.label}).then(function(t){console.log("res===",t),a.setState({symbolBlance:t[0]||0,symbolCode:e.key})}).catch(function(e){s.a.error("暂无数据"),console.log("err:",e),a.setState({balance:0,symbolBlance:0,symbolCode:""})})},a.handleSearch=function(e){console.log("value:",e),a.setState({account:e});var t=void 0;console.log("this.state.netWorkStatus====",a.state.netWorkStatus);var o="",n=0,r=void 0,i=void 0,c=void 0,d=void 0;(t="main"==a.state.netWorkStatus?Object(v.b)():Object(v.c)()).getAccount({account_name:e}).then(function(l){if(l.voter_info)if(a.setState({voteProxy:l.voter_info.proxy}),l.voter_info.producers.length<1)a.setState({voteNodeStatus:!1});else for(var u=0;u<l.voter_info.producers.length;u++)o=l.voter_info.producers[u]+" , "+o;l.voter_info&&(n=l.voter_info.staked/1e4+" EOS"),l.refund_request?(r=l.refund_request.cpu_amount,i=l.refund_request.net_amount):(r="0 EOS",i="0 EOS"),c=l.cpu_limit.used?(l.cpu_limit.used/l.cpu_limit.max*100).toFixed(2):0,d=l.net_limit.used?(l.net_limit.used/l.net_limit.max*100).toFixed(2):0,a.setState({info:l,createTime:l.created,stake:n,voteNode:o,memoryContent:(l.ram_usage/1024).toFixed(2)+" Kib/"+(l.ram_quota/1024).toFixed(2)+" Kib",cpuContent:l.cpu_limit.used/1e3+" ms/"+l.cpu_limit.max/1e3+" ms",networkContent:l.net_limit.used+" bytes/"+(l.net_limit.max/1024/1024).toFixed(2)+" Mib",cpuMortgage:r,networkMortgage:i,memoryScale:(parseInt(l.ram_usage)/parseInt(l.ram_quota)*100).toFixed(2),cpuScale:c,networkScale:d,activeAdd:l.permissions[0].required_auth.keys[0].key,ownerAdd:l.permissions[1].required_auth.keys[0].key,cpuStake:l.total_resources.cpu_weight,networkStake:l.total_resources.net_weight}),t.getCurrencyBalance({code:"eosio.token",account:e,symbol:"EOS"}).then(function(e){a.setState({balance:e[0]||0,symbolBlance:e[0]||0,symbolCode:"eosio.token"})}).catch(function(e){s.a.error("暂无数据"),console.log("err:",e)})}).catch(function(e){s.a.error("暂无数据"),a.setState({info:""}),console.log("err:",e)})},a.state={info:"",formatMessage:a.props.intl.formatMessage,account:"",createTime:"",balance:0,stake:0,voteNode:"暂无",voteNodeStatus:!0,memoryContent:"",cpuContent:"",networkContent:"",cpuStake:"",cpuMortgage:"",networkStake:"",networkMortgage:"",memoryScale:0,cpuScale:0,networkScale:0,netWorkStatus:"",symbolBlance:0,defaultSelectedKeys:"1",activeAdd:"",ownerAdd:"",symbolCode:"",voteProxy:"暂无",QrCodeValue:a.props.intl.formatMessage(h.a.QrCodeInitValue)},a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,d.a.Component),T(t,[{key:"componentWillReceiveProps",value:function(e){this.setState({netWorkStatus:e.netWork}),console.log("nextProps netWork",e.netWork)}},{key:"componentWillMount",value:function(){this.setState({netWorkStatus:this.props.netWork}),console.log("this.props netWork",this.props.netWork)}},{key:"render",value:function(){var e=[{key:1,name:this.state.symbolBlance,address:this.state.symbolCode}],t=[{key:1,name:"active",address:this.state.activeAdd},{key:2,name:"owner",address:this.state.ownerAdd}];return S(m.b,{},void 0,S(m.c,{},void 0,S(p.ConBox,{},void 0,S(m.a,{},void 0,S(_,{placeholder:"search account",enterButton:"搜索",size:"large",onSearch:this.handleSearch})),this.state.info?S("div",{},void 0,S("div",{className:"content"},void 0,S("div",{className:"firstContent"},void 0,S("span",{},void 0,"账户：",this.state.account),S("span",{},void 0,"创建时间：",this.state.createTime),S("span",{},void 0,"EOS余额：",this.state.balance),S("span",{},void 0,"EOS抵押：",this.state.stake),S("span",{},void 0,"已投代理：",this.state.voteProxy),this.state.voteNodeStatus?S("span",{},void 0,"已投节点：",this.state.voteNode):S("span",{})),S("div",{className:"secondContent"},void 0,S("div",{className:"contentDetail"},void 0,S(u.c,{type:"dashboard",percent:this.state.memoryScale}),S("div",{className:"contentDetailDesc"},void 0,S("span",{},void 0,this.state.memoryContent),S("span",{className:"contentDetailDescTitle"},void 0,"内存"))),S("div",{className:"contentDetail"},void 0,S(u.c,{type:"dashboard",percent:this.state.cpuScale}),S("div",{className:"contentDetailDesc"},void 0,S("span",{},void 0,this.state.cpuContent),S("span",{className:"contentDetailDescTitle"},void 0,"CPU"),S("span",{},void 0,"抵押：",this.state.cpuStake),S("span",{},void 0,"赎回中：",this.state.cpuMortgage))),S("div",{className:"contentDetail"},void 0,S(u.c,{type:"dashboard",percent:this.state.networkScale}),S("div",{className:"contentDetailDesc"},void 0,S("span",{},void 0,this.state.networkContent),S("span",{className:"contentDetailDescTitle"},void 0,"网络"),S("span",{},void 0,"抵押：",this.state.networkStake),S("span",{},void 0,"赎回中：",this.state.networkMortgage))))),S("div",{style:{padding:"2rem 0"}},void 0,S(r.a,{defaultActiveKey:"1",onChange:this.searchBlance},void 0,S(P,{tab:"账户余额"},"1",S("div",{style:{padding:"1rem 0"}},void 0,S("span",{},void 0,"代币："),S(i.a,{labelInValue:!0,defaultValue:{key:"EOS"},style:{width:120},onChange:this.handleChange},void 0,S(C,{value:"eosio.token"},void 0,"EOS"),S(C,{value:"everipediaiq"},void 0,"IQ"),S(C,{value:"gyztomjugage"},void 0,"CETOS"),S(C,{value:"eoxeoxeoxeox"},void 0,"EOX"),S(C,{value:"ednazztokens"},void 0,"EDNA"),S(C,{value:"horustokenio"},void 0,"HORUS"),S(C,{value:"therealkarma"},void 0,"KARMA"),S(C,{value:"challengedac"},void 0,"CHL"),S(C,{value:"eosblackteam"},void 0,"BLACK"),S(C,{value:"eosadddddddd"},void 0,"ADD"),S(C,{value:"eosiochaince"},void 0,"CET"))),S("div",{},void 0,S(n.a,{columns:[{title:"余额",dataIndex:"name"},{title:"合约名",dataIndex:"address"}],dataSource:e,pagination:!1}))),S(P,{tab:"账户公钥"},"2",S(n.a,{columns:[{title:"组名",dataIndex:"name"},{title:"地址/账户",dataIndex:"address"}],dataSource:t,pagination:!1}))))):S("span",{}))))}}]),t}(),x=Object(y.b)({netWork:Object(k.b)()}),M=Object(l.injectIntl)(w),O=o.a.create()(M);t.default=Object(g.connect)(x)(O)}}]);