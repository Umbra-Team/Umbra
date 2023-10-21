import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

const router = new Router();
router
  .get("/hello", (context) => {
    console.log("Hello world!");
    context.response.body = "Hello world!";
  })
  .post("/run", async (context) => {
    // Inspecting the request
    console.log("Method:", context.request.method);
    console.log("URL:", context.request.url);
    console.log("Headers:", context.request.headers);

     // Memory usage before processing the request
    const beforeMemoryUsage = Deno.memoryUsage().heapUsed;

    const body = await context.request.body().value;
    console.log("Body:", body);

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

    // Memory usage after processing the request
    const afterMemoryUsage = Deno.memoryUsage().heapUsed;
    console.log(`Memory usage before: ${beforeMemoryUsage}, after: ${afterMemoryUsage}, difference: ${afterMemoryUsage - beforeMemoryUsage}`);
  });

const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });