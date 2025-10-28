const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
};

// Send OTP email
const sendOTPEmail = async (email, otp, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Job Tracker" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Email Verification - Job Tracker',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Job Tracker</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Email Verification</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${userName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Thank you for signing up with Job Tracker! To complete your registration, 
              please use the verification code below:
            </p>
            
            <div style="background: #fff; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
              <h3 style="color: #667eea; font-size: 32px; margin: 0; letter-spacing: 5px; font-weight: bold;">
                ${otp}
              </h3>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              This code will expire in <strong>10 minutes</strong>. If you didn't request this verification, 
              please ignore this email.
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #999; font-size: 14px;">
                Best regards,<br>
                The Job Tracker Team
              </p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 OTP email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    return false;
  }
};

// Send job status update notification
const sendStatusUpdateEmail = async (email, userName, jobData, oldStatus, newStatus) => {
  try {
    const transporter = createTransporter();
    
    const statusColors = {
      'applied': '#6c757d',
      'screening': '#17a2b8',
      'phone-interview': '#ffc107',
      'technical-interview': '#fd7e14',
      'onsite-interview': '#e83e8c',
      'final-interview': '#6f42c1',
      'offer': '#28a745',
      'accepted': '#20c997',
      'rejected': '#dc3545',
      'withdrawn': '#6c757d'
    };

    const statusLabels = {
      'applied': 'Applied',
      'screening': 'Screening',
      'phone-interview': 'Phone Interview',
      'technical-interview': 'Technical Interview',
      'onsite-interview': 'Onsite Interview',
      'final-interview': 'Final Interview',
      'offer': 'Offer Received',
      'accepted': 'Accepted',
      'rejected': 'Rejected',
      'withdrawn': 'Withdrawn'
    };

    const mailOptions = {
      from: `"Job Tracker" <${process.env.MAIL_USER}>`,
      to: email,
      subject: `Job Status Updated - ${jobData.companyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Job Tracker</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Status Update Notification</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${userName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Your job application status has been updated. Here are the details:
            </p>
            
            <div style="background: #fff; border-radius: 8px; padding: 25px; margin: 25px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h3 style="color: #333; margin-bottom: 15px;">${jobData.companyName}</h3>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #555;">Job ID:</strong> 
                <span style="color: #666;">${jobData.jobId}</span>
              </div>
              
              ${jobData.position ? `
                <div style="margin-bottom: 15px;">
                  <strong style="color: #555;">Position:</strong> 
                  <span style="color: #666;">${jobData.position}</span>
                </div>
              ` : ''}
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #555;">Previous Status:</strong> 
                <span style="color: ${statusColors[oldStatus] || '#666'};">${statusLabels[oldStatus] || oldStatus}</span>
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #555;">New Status:</strong> 
                <span style="color: ${statusColors[newStatus] || '#666'}; font-weight: bold;">${statusLabels[newStatus] || newStatus}</span>
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #555;">Round:</strong> 
                <span style="color: #666;">${jobData.roundNumber}</span>
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #555;">Last Updated:</strong> 
                <span style="color: #666;">${new Date(jobData.lastUpdated).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" 
                 style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                View Dashboard
              </a>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #999; font-size: 14px;">
                Best regards,<br>
                The Job Tracker Team
              </p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Status update email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending status update email:', error);
    return false;
  }
};

// Send welcome email
const sendWelcomeEmail = async (email, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Job Tracker" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Welcome to Job Tracker!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Job Tracker</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Welcome aboard!</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Welcome ${userName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Thank you for joining Job Tracker! Your account has been successfully verified and you're now ready to start tracking your job applications.
            </p>
            
            <div style="background: #fff; border-radius: 8px; padding: 25px; margin: 25px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h3 style="color: #333; margin-bottom: 15px;">What you can do now:</h3>
              <ul style="color: #666; line-height: 1.8;">
                <li>Add new job applications</li>
                <li>Track application status and rounds</li>
                <li>Set follow-up reminders</li>
                <li>View detailed statistics</li>
                <li>Search and filter your applications</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" 
                 style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Get Started
              </a>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #999; font-size: 14px;">
                Best regards,<br>
                The Job Tracker Team
              </p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Welcome email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return false;
  }
};

// Send contact form email to admin
const sendContactFormEmail = async (name, email, message) => {
  try {
    console.log('📧 Creating email transporter...');
    const transporter = createTransporter();
    console.log('📧 Email transporter created successfully');
    
    const mailOptions = {
      from: `"Job Tracker Contact Form" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_USER, // Send to admin email
      subject: `New Contact Form Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Job Tracker</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">New Contact Form Message</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">New Contact Form Submission</h2>
            
            <div style="background: #fff; border-radius: 8px; padding: 25px; margin: 25px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <div style="margin-bottom: 15px;">
                <strong style="color: #555;">From:</strong> 
                <span style="color: #666;">${name}</span>
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #555;">Email:</strong> 
                <span style="color: #666;">${email}</span>
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #555;">Message:</strong>
              </div>
              
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; border-left: 4px solid #667eea; margin-top: 10px;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #999; font-size: 14px;">
                This message was sent from the Job Tracker contact form.<br>
                Reply directly to ${email} to respond to the user.
              </p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Contact form email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending contact form email:', error);
    return false;
  }
};

// Send deadline reminder email
const sendDeadlineReminderEmail = async (email, userName, jobData) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Job Tracker" <${process.env.MAIL_USER}>`,
      to: email,
      subject: `Upcoming Follow-up Reminder - ${jobData.companyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Job Tracker</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Follow-up Reminder</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${userName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              This is a reminder about your upcoming follow-up for the following job application:
            </p>
            
            <div style="background: #fff; border-radius: 8px; padding: 25px; margin: 25px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h3 style="color: #333; margin-bottom: 15px;">${jobData.companyName}</h3>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #555;">Job ID:</strong> 
                <span style="color: #666;">${jobData.jobId}</span>
              </div>
              
              ${jobData.position ? `
                <div style="margin-bottom: 15px;">
                  <strong style="color: #555;">Position:</strong> 
                  <span style="color: #666;">${jobData.position}</span>
                </div>
              ` : ''}
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #555;">Current Status:</strong> 
                <span style="color: #666;">${jobData.status}</span>
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #555;">Follow-up Date:</strong> 
                <span style="color: #666; font-weight: bold;">${new Date(jobData.nextFollowUp).toLocaleDateString()}</span>
              </div>
              
              ${jobData.notes ? `
                <div style="margin-bottom: 15px;">
                  <strong style="color: #555;">Notes:</strong> 
                  <span style="color: #666;">${jobData.notes}</span>
                </div>
              ` : ''}
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" 
                 style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                View Application
              </a>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #999; font-size: 14px;">
                Best regards,<br>
                The Job Tracker Team
              </p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Deadline reminder email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending deadline reminder email:', error);
    return false;
  }
};

module.exports = {
  sendOTPEmail,
  sendStatusUpdateEmail,
  sendWelcomeEmail,
  sendContactFormEmail,
  sendDeadlineReminderEmail
};
