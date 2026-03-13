export default async (req, context) => {
   if (req.method !== "POST") {
      return new Response(
         JSON.stringify({ ok: false, error: "Method not allowed" }),
         {
            status: 405,
            headers: { "Content-Type": "application/json" }
         }
      );
   }

   try {
      const data = await req.json();

      const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
      const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

      if (!BOT_TOKEN || !CHAT_ID) {
         return new Response(
            JSON.stringify({ ok: false, error: "Missing environment variables" }),
            {
               status: 500,
               headers: { "Content-Type": "application/json" }
            }
         );
      }

      const text = ` Writing Exam Result

User: ${data.name}
Task: ${data.title}
Ishlatilingan vaqt: ${data.timeUsed} seconds
Auto Submitted: ${data.autoSubmitted ? "Yes" : "No"}

Answer:

${data.answer}`;

      const telegramResponse = await fetch(
         `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify({
               chat_id: CHAT_ID,
               text
            })
         }
      );

      const telegramResult = await telegramResponse.json();

      return new Response(JSON.stringify(telegramResult), {
         status: 200,
         headers: { "Content-Type": "application/json" }
      });
   } catch (error) {
      return new Response(
         JSON.stringify({
            ok: false,
            error: error.message
         }),
         {
            status: 500,
            headers: { "Content-Type": "application/json" }
         }
      );
   }
};