import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

const router = new Router();
router
  .get("/", (context) => {
    console.log("Hello world!");
    context.response.body = "Hello world!";
  })
  .post("/run", async (context) => {
    // Here you can add your code sanitization and running logic
    const { code } = await context.request.body().value;
    // Sanitize the code (more robust sanitization is advisable)
    const sanitizedCode = code;  // Assume code is safe for demonstration
    console.log("Code received: ", code);
    // Run the code
    const result = await Deno.run({
      cmd: ["deno", "eval", sanitizedCode],
      stdout: "piped",
      stderr: "piped",
    });


    // context.response.body = "Code received!";
    // Read and decode the stdout and stderr
    const [outputBytes, errorBytes] = await Promise.all([
      result.output(),
      result.stderrOutput()
    ]);
    const outputText = new TextDecoder().decode(outputBytes);
    const errorText = new TextDecoder().decode(errorBytes);

    // Send the stdout and stderr in the response
    context.response.body = {
      output: outputText,
      error: errorText,
    };
  });

const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });