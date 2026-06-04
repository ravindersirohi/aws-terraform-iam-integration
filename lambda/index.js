exports.handler = async (event) => {

  // Health check endpoint
  if (event.path === '/health' || event.rawPath === '/health') {
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }

  // Default endpoint
  return {
    statusCode: 200,
    body: JSON.stringify("Demo Lambda Function is running!"),
    headers: {
      'Content-Type': 'application/json'
    }
  }
}