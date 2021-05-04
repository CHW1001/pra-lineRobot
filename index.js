// 直接打名字代表套件,引用自己資料要'./'叫出
import linebot from 'linebot'
import dotenv from 'dotenv'
import axios from 'axios'

// 讓套件讀取.env檔案
// 讀取後可以用process.env.變數 使用
dotenv.config()

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.listen('/', process.env.PORT, () => {
  console.log('機器人啟動')
})

bot.on('message', async event => {
  if (event.message.type === 'text') {
    try {
      const response = await axios.get('https://cloud.culture.tw/frontsite/trans/SearchPerformPlaceAction.do?method=doFindPerformPlaceTypeJ')
      const data = response.data.filter(data => {
        return data['placeName'] === event.message.text
      })

      let reply = ''
      for (const d of data) {
        reply += `地址:${d['address']} \n管理單位:${['managerUnit']} \n聯絡電話:${d['officePhone']} \n電子信箱:${['email']} \n登記制度:${['register']} \n\n`
      }
      event.reply(reply)
    } catch (error) {
      event.reply('發生錯誤')
    }
  }
})
