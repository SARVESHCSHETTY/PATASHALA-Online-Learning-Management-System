import nodemailer from "nodemailer";

export const sendOtpEmail = async (toEmail, otp, expiryMinutes = 10) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to: toEmail,
    subject: "Your OTP Code",
    html: `<p>Your OTP is <b>${otp}</b>. It will expire in ${expiryMinutes} minutes.</p>`,
  });
};

export const sendPurchaseSuccessEmail = async (toEmail, course) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to: toEmail,
    subject: `Course Purchase Successful: ${course.courseTitle}`,
    html: `
      <h2>Congratulations! You have successfully purchased <b>${course.courseTitle}</b></h2>
      <p><b>Subtitle:</b> ${course.subTitle || "-"}</p>
      <p><b>Description:</b> ${course.description || "-"}</p>
      <p><b>Category:</b> ${course.category || "-"}</p>
      <p><b>Level:</b> ${course.courseLevel || "-"}</p>
      <p><b>Price:</b> ${course.coursePrice ? `₹${course.coursePrice}` : "Free"}</p>
      <p><b>Number of Lectures:</b> ${course.lectures?.length || 0}</p>
      <p><b>Instructor:</b> ${course.creator?.name || "-"}</p>
      <img src="${course.courseThumbnail}" alt="Course Thumbnail" style="max-width:300px;margin-top:16px;border-radius:8px;" />
      <p style="margin-top:16px;">Thank you for your purchase! Happy learning!</p>
    `,
  });
};
