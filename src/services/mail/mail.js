import nodemailer from "nodemailer";

export const sendMailTo = async (address, code) => {
  console.log(typeof process.env.GMAIL_ID, process.env.GMAIL_PWD);
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_ID,
      pass: process.env.GMAIL_PWD,
    },
  });

  let info = await transporter.sendMail({
    // 보내는 곳의 이름과, 메일 주소를 입력
    from: `"BayClip Team" <${process.env.GMAIL_ID}>`,
    // 받는 곳의 메일 주소를 입력
    to: address,
    // 보내는 메일의 제목을 입력
    subject: "Bayclip certification CODE",
    // 보내는 메일의 내용을 입력
    // text: 일반 text로 작성된 내용
    // html: html로 작성된 내용
    html: `<b>${code}</b>`,
  });
};
