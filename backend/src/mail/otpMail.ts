const otpTemplate = (otp: string) => {
  return `<!DOCTYPE html>
  <html>
  
  <head>
    <meta charset="UTF-8">
    <title>X Genesis | OTP Verification</title>
    <style>s
      body {
        background-color: #ffffff;
        font-family: Arial, sans-serif;
        font-size: 16px;
        line-height: 1.5;
        color: #333333;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 30px 20px;
        text-align: center;
      }

      .brand {
        font-size: 24px;
        font-weight: bold;
        color: #000000;
        margin-bottom: 10px;
      }

      .heading {
        font-size: 20px;
        font-weight: bold;
        margin-top: 20px;
        margin-bottom: 20px;
      }

      .body {
        font-size: 16px;
        margin-bottom: 20px;
        text-align: left;
      }

      .otp {
        font-size: 28px;
        font-weight: bold;
        color: #FFD60A;
        margin: 20px auto;
      }

      .support {
        font-size: 14px;
        color: #777777;
        margin-top: 30px;
      }

      a {
        color: #000000;
        text-decoration: none;
      }
    </style>
  </head>
  
  <body>
    <div class="container">
      <div class="brand">X Genesis</div>
      <div class="heading">OTP Verification</div>
      <div class="body">
        <p>Hello,</p>
        <p>Thank you for signing up on <strong>X Genesis</strong>. Please use the OTP below to verify your account:</p>
        <div class="otp">${otp}</div>
        <p>This OTP is valid for <strong>5 minutes</strong>. If you didn’t request this, you can safely ignore this email.</p>
      </div>
      <div class="support">
        Need help? Contact us at <a href="mailto:support@xgenesis.com">support@xgenesis.com</a>
      </div>
    </div>
  </body>
  
  </html>`;
};

export default otpTemplate;
