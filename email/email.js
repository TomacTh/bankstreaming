const nodemailer = require('nodemailer')


 

   const smtpTransport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
          type: 'OAuth2',
          user: `${process.env.EMAIL}`,
          clientId: `${process.env.ID}`,
          clientSecret: `${process.env.SECRET}`,
          refreshToken: `${process.env.REFRESH_TOKEN}`,
          accessToken: `${process.env.ACCESS_TOKEN}`
      }
  });


const sendContactEmail = (message) => {
    

 
  
    
    var mail = {
      from: `${process.env.EMAIL}`,
      to: `${process.env.EMAIL}`,
      subject: `Contact bankstreaming from  name: ${message.name} email: ${message.email}`,
      html: `<p>${message.text}</p>`
    }
    
    smtpTransport.sendMail(mail, (error, response) =>{
      if(error){
        console.log("Erreur lors de l'envoie du mail!", error);
      }else{
        console.log("Mail envoyé avec succès!")
      }
      smtpTransport.close();
    });
    

}

const sendRegisterEmail = (username, email) => {
    


  
  var mail = {
    from: `${process.env.EMAIL}`,
    to: email,
    subject: `Welcome on BANKSTREAMING`,
    html: `<h1>Thank you for suscribe</h1>
          <p>Dear ${username} we are very happy you join us, we hope you will enjoy our site!
          Have a very good day ;) </p>
    `
  }
  
  smtpTransport.sendMail(mail, (error, response) =>{
    if(error){
      console.log("Erreur lors de l'envoie du mail!", error);
    }else{
      console.log("Mail envoyé avec succès!")
    }
    smtpTransport.close();
  });
  

}



module.exports = {sendContactEmail, sendRegisterEmail};

