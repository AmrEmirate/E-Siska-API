import App from "./app";

const server = new App();

// Export the express app for Vercel
export default server.app;

// Only start the server if running directly (dev/prod server, not serverless)
if (require.main === module) {
  server.start();
}
