'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class film extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate(models) {
      // define association here
      film.belongsTo(models.user, {
        as: "user",
        foreignKey: {
          name: "idUser",
        },
      });

      film.hasMany(models.transaction, {
        as: "transaction",
        foreignKey: {
          name: "idFilm",
        },
      });
    }
  }

  film.init({
    title: DataTypes.STRING,
    image: DataTypes.STRING,
    category: DataTypes.STRING,
    price: DataTypes.INTEGER,
    link: DataTypes.STRING,
    desc: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'film',
  });
  return film;
};