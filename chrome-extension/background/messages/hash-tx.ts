import type { PlasmoMessaging } from "@plasmohq/messaging"

const HIDDEN_NUMBER = 541

export type RequestBody = {
  input: number
}

export type RequestResponse = any

const handler: PlasmoMessaging.MessageHandler<
  RequestBody,
  RequestResponse
> = async (req, res) => {
  const { input } = req.body


  const elem = document.addEventListener('click', () => {
    console.log('click', elem);
  })
  
  // .querySelector('body').childNodes[0]
res.send(document.URL)
  // res.send(input * 400000)
}

export default handler
