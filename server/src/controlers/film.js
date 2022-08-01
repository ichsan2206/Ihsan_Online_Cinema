const {film, user} = require("../../models");

exports.getFilms = async (req, res) =>{
    try {
        let data = await film.findAll({
            include: [
                {
                  model: user,
                  as: "user",
                  attributes: {
                    exclude: ["createdAt", "updatedAt", "password"],
                  },
                },
              ],
              attributes: {
                exclude: ["createdAt", "updatedAt", "idUser"],
              },
            });
            data = JSON.parse(JSON.stringify(data))
            data = data.map((item)=>{
                return{
                    ...item,
                    image: process.env.PATH_FILE + item.image
                }
            }
            )
            res.status(200).send({
                status: "success",
                data,
              });
        } catch (error) {
          console.log(error);
            res.status(400).send({
                status: "eror",
                massage: "server eror"
              });
        }
}

exports.getLanding = async (req, res) =>{
    try {
        let data = await film.findAll({
              attributes: {
                exclude: ["createdAt", "updatedAt", "idUser"],
              },
            });
            data = JSON.parse(JSON.stringify(data))
            data = data.map((item)=>{
                return{
                    ...item,
                    image: process.env.PATH_FILE + item.image
                }
            }
            )
            res.status(200).send({
                status: "success",
                data,
              });
        } catch (error) {
          console.log(error);
            res.status(400).send({
                status: "eror",
                massage: "server eror"
              });
        }
}

exports.addFilms = async (req, res) =>{
    try {
    
    
        const data = {
          title: req.body.title,
          image: req.file.filename,
          category: req.body.category   ,
          price: req.body.price,
          link: req.body.link,
          desc: req.body.desc,
          idUser: req.user.id,
        };
    
        let newFilm = await film.create(data);
    

    
    let filmData = await film.findOne({
            where: {
              id: newFilm.id,
            },
            include: [
              {
                model: user,
                as: "user",
                attributes: {
                  exclude: ["createdAt", "updatedAt", "password"],
                },
              },
            ],
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'idUser'],
            },
          });
    
          filmData =JSON.parse(JSON.stringify(filmData))
          filmData={
            ...filmData,
            image: process.env.PATH_FILE + filmData.image
        }
    
        res.status(201).send({
            status: "success",
            filmData,
          });
    
        } catch (error) {
          console.log(error);
              res.status(401).send({
                status: "eror",
                massage: "server eror"
              });        
        }
}

exports.detailFilm = async (req, res) =>{
  try {
    const { id } = req.params;
    
    let data = await film.findOne({
      where: {
        id,
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    data = {
      ...data,
      image: process.env.PATH_FILE + data.image,
    };

    res.send({
      status: "success...",
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
}