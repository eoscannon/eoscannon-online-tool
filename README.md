# EOS佳能离线工具
## 工具简介：
EOS佳能离线工具是由EOS佳能主导，为保护数字货币投资者安全交易而开发的工具。

目前工具提供**质押/解质押、设置代理、转账**等功能。工具仍在完善中，欢迎提供建议。

免责声明：该工具仅供学习、交流，不对使用过程中产生的收益、损失负责，请知悉。

## 使用方法：
准备两台设备：离线设备、联网设备
##### 首先：使用离线设备 
1. 下载项目，打开控制台
2. cd 项目根目录
3. npm install
4. npm start
5. 在浏览器地址栏输入：[http://localhost:3000](http://localhost:3000)
##### 然后：使用联网设备 
1. 打开 [https://tool.eoscannon.io/](https://tool.eoscannon.io/)
2. 点击 **复制初始化信息** 按钮
3. ![image](https://raw.githubusercontent.com/eoscannon/EosCannon-Offline-Tools/master/docs/stepImg/1.1.jpeg)
##### 然后：使用离线设备
1. 打开[http://localhost:3000](http://localhost:3000)，选择想要进行的操作页面
2. 在json字段输入框，输入已复制的初始化信息
3. ![image](https://raw.githubusercontent.com/eoscannon/EosCannon-Offline-Tools/master/docs/stepImg/2.1.jpeg)
4. 按照提示输入生成签名报文所需的字段
5. 点击 **生成签名报文** 按钮，生成的签名报文会自动填充在下面的输入框中。
6. ![image](https://raw.githubusercontent.com/eoscannon/EosCannon-Offline-Tools/master/docs/stepImg/2.2.jpeg)
7. 点击 **复制签名报文** 按钮，或扫描二维码，获取签名报文。
8. ![image](https://raw.githubusercontent.com/eoscannon/EosCannon-Offline-Tools/master/docs/stepImg/2.3.jpeg)
##### 最后：使用联网设备
1. 在[https://tool.eoscannon.io/](https://tool.eoscannon.io/)页面的发送交易输入框粘贴已复制的签名报文
2. 点击 **发送已签名报文** 按钮
3. ![image](https://raw.githubusercontent.com/eoscannon/EosCannon-Offline-Tools/master/docs/stepImg/1.2.jpeg)
4. 根据提示确认是否交易成功
