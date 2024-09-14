'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.belongsTo(models.User, { foreignKey: 'educatorId' });
      Course.hasMany(models.Chapter, { foreignKey: 'courseId' });
      Course.hasMany(models.Page,{foreignKey:'courseId'});
      Course.hasMany(models.Enrollment,{foreignKey:'courseId'});
      Course.hasMany(models.Progress,{foreignKey:'courseId'});
    }
    static async addCourse(coursetitle,userId){
      const course=await this.create({
        educatorId:userId,
        coursetitle,
      })
      return course;
    }
  }
  Course.init({
    coursetitle: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};