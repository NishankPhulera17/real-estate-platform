const ngrok = require('@ngrok/ngrok');
const { spawn } = require('child_process');
require('dotenv').config();

const AUTHTOKEN = process.env.NGROK_AUTHTOKEN || "320L03RGcCh8wzFJYnfZGiV3jGx_LNNJvtCJGfAJGy7iZmuo";
const PORT = process.env.PORT || 3000;

async function startTunnel() {
  console.log(`⏳ Initializing secure Ngrok HTTPS tunnel on port ${PORT}...`);
  try {
    const listener = await ngrok.connect({
      addr: PORT,
      authtoken: AUTHTOKEN,
    });
    
    const publicUrl = listener.url();
    console.log("\n=======================================================================");
    console.log("🚀 NGROK PUBLIC TUNNEL ESTABLISHED SUCCESSFULLY!");
    console.log(`🔗 Shareable Live Demo URL: \x1b[32m\x1b[1m${publicUrl}\x1b[0m`);
    console.log(`🔐 Automatically binding NEXTAUTH_URL to ${publicUrl}`);
    console.log("=======================================================================\n");

    // Launch Next.js dev server with NEXTAUTH_URL set to public url
    const devEnv = {
      ...process.env,
      NEXTAUTH_URL: publicUrl,
      PORT: PORT.toString(),
    };

    const nextProcess = spawn('node', ['node_modules/next/dist/bin/next', 'dev', '-p', PORT.toString()], {
      env: devEnv,
      stdio: 'inherit',
    });

    nextProcess.on('error', (err) => {
      console.error("❌ Failed to start Next.js development server:", err);
    });

    nextProcess.on('close', async (code) => {
      console.log(`\n🛑 Next.js development server exited (code ${code}). If you saw an EADDRINUSE error, stop any actively running 'npm run dev' terminals first! Closing Ngrok tunnel...`);
      await ngrok.disconnect();
      process.exit(code || 0);
    });

    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down Ngrok tunnel and development server...');
      await ngrok.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await ngrok.disconnect();
      process.exit(0);
    });

  } catch (error) {
    console.error("❌ Error initiating Ngrok tunnel:", error.message || error);
    process.exit(1);
  }
}

startTunnel();
