'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Course, {
        foreignKey: 'educatorId',
      });
      User.hasMany(models.Enrollment, {
        foreignKey: "userId",
      });
      User.hasMany(models.Enrollment, {
        foreignKey: "educatorId",
      });
      User.hasMany(models.Progress, {
        foreignKey: "studentId",
      });
    }
    static newUser(fname, lname, email, password, role) {
      const user = this.create({
        firstname: fname,
        lastname: lname,
        password,
        email,
        role
      })
      return user;
    }


  }
  User.init({
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3,20],
      }
    },
    lastname: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate:{
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, 100],
        notNull:true
      }
    },
    role: {
      type: DataTypes.ENUM('Educator', 'Student'),
      allowNull:false,
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};