const BOT_TOKEN = "8731667756:AAFXdM0jAO3WRhltLhoVBW0P3l_HXScKtno";
const CHAT_ID = "-1003869171938";

export default async function handler(req, res) {

   if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
   }

   const data = req.body;

   const text = `
New Writing Submission

User: ${data.name}

Task: ${data.title}

Time Used: ${data.timeUsed} seconds

Answer:

${data.answer}
`;

   await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {

      method: "POST",

      headers: {
         "Content-Type": "application/json"
      },

      body: JSON.stringify({

         chat_id: CHAT_ID,

         text: text

      })

   });

   res.status(200).json({ status: "ok" });

}