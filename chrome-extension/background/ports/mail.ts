// import type { PlasmoMessaging } from "@plasmohq/messaging";

// const SECRET = "LABARRE"

// const handler: PlasmoMessaging.PortHandler = async (req, res) => {


//   console.log('req.body', req);
  
//   // getPort("mail").postMessage("hello from background")

//   res.send("CAPTAIN")
//   // const { password } = req.body

//   // if (password !== SECRET) {
//   //   res.send("(HINT: HOMETOWN)")
//   // } else {
//   //   res.send("CAPTAIN")
//   // }
// }

// export default handler


import type { PlasmoMessaging } from "@plasmohq/messaging"
 
const handler: PlasmoMessaging.PortHandler = async (req, res) => {
  console.log(req)
 
  res.send({
    message: "Hello from port handler"
  })
}
 
export default handler