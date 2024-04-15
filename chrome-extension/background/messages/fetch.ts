import type { PlasmoMessaging } from "@plasmohq/messaging";
 
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
 console.log('req', req);

 const resp = await fetch(`http://127.0.0.1:8000/api/repo/similar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        "owner": req.body.owner,
        "name": req.body.name,
      })
  })

    const data = await resp.json()
 
  res.send({
    status: 200,
    body: data,
  })
}
 
export default handler