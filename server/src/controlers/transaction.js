const { user, transaction, profile, film} = require("../../models");

const midtransClient = require("midtrans-client");
const nodemailer = require("nodemailer");


exports.getTransactions = async (req, res) =>{
    try {
        const idBuyer = req.user.id;
        let data = await transaction.findAll({
          where: {
            idBuyer,
          },
          order: [["createdAt", "DESC"]],
          attributes: {
            exclude: ["updatedAt", "idBuyer", "idSeller", "idFilm"],
          },
          include: [
            {
              model: film,
              as: "film",
              attributes: {
                exclude: [
                  "createdAt",
                  "updatedAt",
                  "idUser",
                  "qty",
                  "price",
                  "desc",
                ],
              },
            },
            {
              model: user,
              as: "buyer",
              attributes: {
                exclude: ["createdAt", "updatedAt", "password", "status"],
              },
            },
            {
              model: user,
              as: "seller",
              attributes: {
                exclude: ["createdAt", "updatedAt", "password", "status"],
              },
            },
          ],
        });
    
        data = JSON.parse(JSON.stringify(data));
    
        data = data.map((item) => {
          return {
            ...item,
            film: {
              ...item.film,
              image: process.env.PATH_FILE + item.film.image,
            },
          };
        });
    
        res.status(200).send({
          status: "success",
          data,
        });
      } catch (error) {
        console.log(error);
        res.send({
          status: "failed",
          message: "Server Error",
        });
      }
};

exports.myListTransaksi = async (req, res) =>{
  try {
      const idBuyer = req.user.id;
      let data = await transaction.findAll({
        where: {
          idBuyer,
          status: 'success'
        },
        order: [["createdAt", "DESC" ]],
        attributes: {
          exclude: ["updatedAt", "idBuyer", "idSeller", "idFilm"],
        },
        include: [
          {
            model: film,
            as: "film",
            attributes: {
              exclude: [
                "createdAt",
                "updatedAt",
                "idUser",
                "qty",
                "price",
                "desc",
              ],
            },
          },
          {
            model: user,
            as: "buyer",
            attributes: {
              exclude: ["createdAt", "updatedAt", "password", "status"],
            },
          },
          {
            model: user,
            as: "seller",
            attributes: {
              exclude: ["createdAt", "updatedAt", "password", "status"],
            },
          },
        ],
      });
  
      data = JSON.parse(JSON.stringify(data));
  
      data = data.map((item) => {
        return {
          ...item,
          film: {
            ...item.film,
            image: process.env.PATH_FILE + item.film.image,
          },
        };
      });
  
      res.status(200).send({
        status: "success",
        data,
      });
    } catch (error) {
      console.log(error);
      res.send({
        status: "failed",
        message: "Server Error",
      });
    }
};


exports.getTransactionsAdmin = async (req, res) =>{
  try {
      let data = await transaction.findAll({
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["updatedAt", "idBuyer", "idSeller", "idFilm"],
        },
        include: [
          {
            model: film,
            as: "film",
            attributes: {
              exclude: [
                "createdAt",
                "updatedAt",
                "idUser",
                "qty",
                "price",
                "desc",
              ],
            },
          },
          {
            model: user,
            as: "buyer",
            attributes: {
              exclude: ["createdAt", "updatedAt", "password", "status"],
            },
          },
          {
            model: user,
            as: "seller",
            attributes: {
              exclude: ["createdAt", "updatedAt", "password", "status"],
            },
          },
        ],
      });
  
      data = JSON.parse(JSON.stringify(data));
  
      data = data.map((item) => {
        return {
          ...item,
          film: {
            ...item.film,
            image: process.env.PATH_FILE + item.film.image,
          },
        };
      });
  
      res.status(200).send({
        status: "success",
        data,
      });
    } catch (error) {
      console.log(error);
      res.send({
        status: "failed",
        message: "Server Error",
      });
    }
};


exports.addTransaction = async (req, res) =>{
    try {
        // Prepare transaction data from body here ...
        let data = req.body;
    
        data = {
          id: parseInt(data.idFilm + Math.random().toString().slice(3, 8)),
          ...data,
          idBuyer: req.user.id,
          status: "pending",
        };
    
        
        // Insert transaction data here ...
        const newData = await transaction.create(data);
    
        // Get buyer data here ...
        const buyerData = await user.findOne({
          include: {
            model: profile,
            as: "profile",
            attributes: {
              exclude: ["createdAt", "updatedAt", "idUser"],
            },
          },
          where: {
            id: newData.idBuyer,
          },
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        });
    
        // Create Snap API instance here ...
        let snap = new midtransClient.Snap({
          isProduction: false,
          serverKey: process.env.MIDTRANS_SERVER_KEY,
        });
    
        // Create parameter for Snap API here ...
        let parameter = {
          transaction_details: {
            order_id: newData.id,
            gross_amount: newData.price,
          },
          credit_card: {
            secure: true,
          },
          customer_details: {
            full_name: buyerData?.name,
            email: buyerData?.email,
            phone: buyerData?.profile?.phone,
          },
        };
    
        // Create trasaction token & redirect_url with snap variable here ...
        const payment = await snap.createTransaction(parameter);
        console.log(payment);
        res.send({
          status: "pending",
          message: "Pending transaction payment gateway",
          payment,
          film: {
            id: data.idFilm,
          },
        });
      } catch (error) {
        console.log(error);
        res.send({
          status: "failed",
          message: "Server Error",
        });
      }
    };
    
    // Create configurate midtrans client with CoreApi here ...
    const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY
    const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY
    
    const core = new midtransClient.CoreApi();
    
    core.apiConfig.set({
      isProduction: false,
      serverKey: MIDTRANS_SERVER_KEY,
      clientKey: MIDTRANS_CLIENT_KEY
    })
    
    /**
     *  Handle update transaction status after notification
     * from midtrans webhook
     * @param {string} status
     * @param {transactionId} transactionId
     */
    
    // Create function for handle https notification / WebHooks of payment status here ...
    exports.notification = async (req,res) => {
      try {
    
        const statusResponse = await core.transaction.notification(req.body)
    
        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status
        const fraudStatus = statusResponse.fraud_status
    
        if (transactionStatus == "capture") {
          if (fraudStatus == "challenge") {
            sendEmail("pending", orderId);
            // TODO set transaction status on your database to 'challenge'
            // and response with 200 OK
            updateTransaction("pending", orderId);
            res.status(200);
          } else if (fraudStatus == "accept") {
            sendEmail("success", orderId);
            // TODO set transaction status on your database to 'success'
            // and response with 200 OK
            updateProduct(orderId);
            updateTransaction("success", orderId);
            res.status(200);
          }
        } else if (transactionStatus == "settlement") {
          sendEmail("success", orderId);
          // TODO set transaction status on your database to 'success'
          // and response with 200 OK
          updateTransaction("success", orderId);
          res.status(200);
        } else if (
          transactionStatus == "cancel" ||
          transactionStatus == "deny" ||
          transactionStatus == "expire"
        ) {
          sendEmail("failed", orderId);
          // TODO set transaction status on your database to 'failure'
          // and response with 200 OK
          updateTransaction("failed", orderId);
          res.status(200);
        } else if (transactionStatus == "pending") {
          sendEmail("pending", orderId);
          // TODO set transaction status on your database to 'pending' / waiting payment
          // and response with 200 OK
          updateTransaction("pending", orderId);
          res.status(200);
        }
    
        
      } catch (error) {
        console.log(error)
        res.send({
          message: 'Server Error'
        })
      }
}


// Create function for handle transaction update status here ...
const updateTransaction = async (status, transactionId) => {
    await transaction.update(
      {
        status,
      },
      {
        where: {
          id: transactionId,
        },
      }
    );
  }; 
  
  // Create function for handle product update stock/qty here ...
  const updateProduct = async (orderId) => {
    const transactionData = await transaction.findOne({
      where: {
        id: orderId,
      },
    });
  
    const productData = await film.findOne({
      where: {
        id: transactionData.idFilm,
      },
    });
    
    const qty = productData.qty - 1;
    await film.update({ qty }, { where: { id: productData.id } });
  };

  // Create function receive two params (status,orderId) for handle send email here ...
const sendEmail = async (status, transactionId) => {
    // Config service and email account
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SYSTEM_EMAIL,
        pass: process.env.SYSTEM_PASSWORD,
      },
    });
  
    // Get transaction data
    let data = await transaction.findOne({
      where: {
        id: transactionId,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
      include: [
        {
          model: user,
          as: "buyer",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password", "status"],
          },
        },
        {
          model: film,
          as: "film",
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "idUser",
              "qty",
              "price",
              "desc",
            ],
          },
        },
      ],
    });
  
    data = JSON.parse(JSON.stringify(data));
  
    // Email options content
    const mailOptions = {
      from: process.env.SYSTEM_EMAIL,
      to: data.buyer.email,
      subject: "Payment status",
      text: "Your payment is <br />" + status,
      html: `<!DOCTYPE html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                  <title>Document</title>
                  <style>
                    h1 {
                      color: brown;
                    }
                  </style>
                </head>
                <body>
                  <h2>film payment :</h2>
                  <ul style="list-style-type:none;">
                    <li>Name : ${data.film.name}</li>
                    <li>Total payment: ${data.price}</li>
                    <li>Status : <b>${status}</b></li>
                  </ul>  
                </body>
              </html>`,
    };
  
    // Send an email if there is a change in the transaction status
    if (data.status != status) {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) throw err;
        console.log("Email sent: " + info.response);
  
        return res.send({
          status: "Success",
          message: info.response,
        });
      });
    }
  };