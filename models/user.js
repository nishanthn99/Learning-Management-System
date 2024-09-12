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
    }
    static newUser(fname,lname,email,password,role){
      const user=this.create({
        firstname:fname,
        lastname:lname,
        password,
        email,
        role
      })
      return user;
    }


  }
  User.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.ENUM('Educator','Student')
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};