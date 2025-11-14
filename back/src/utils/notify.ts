import * as http from "http";
import * as https from "https";

export async function notifyLowStock(
  id_livro: number | string,
  qt_atual: number
): Promise<void> {
  const urlStr = process.env.NOTIFY_URL;
  if (!urlStr) {
    console.log("notifyLowStock: NOTIFY_URL not set, skipping notification");
    return;
  }

  try {
    const payload = JSON.stringify({ id_livro, qt_atual });
    const urlObj = new URL(urlStr);
    const lib = urlObj.protocol === "https:" ? https : http;
    const options: any = {
      hostname: urlObj.hostname,
      port: urlObj.port
        ? Number(urlObj.port)
        : urlObj.protocol === "https:"
        ? 443
        : 80,
      path: `${urlObj.pathname || "/"}${urlObj.search || ""}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
      },
    };

    await new Promise<void>((resolve) => {
      const req = lib.request(options, (res: any) => {
        let data = "";
        res.on("data", (chunk: any) => (data += chunk));
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log("notifyLowStock: notification sent successfully");
          } else {
            console.error(
              "notifyLowStock: notification service responded:",
              res.statusCode,
              data
            );
          }
          resolve();
        });
      });

      req.on("error", (err: any) => {
        console.error("notifyLowStock: error sending notification:", err);
        resolve();
      });

      req.write(payload);
      req.end();
    });
  } catch (err) {
    console.error("notifyLowStock: unexpected error:", err);
  }
}

export default notifyLowStock;
