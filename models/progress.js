'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Progress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Progress.belongsTo(models.User, {
        foreignKey: "studentId",
      });
      Progress.belongsTo(models.Course, {
        foreignKey: "courseId",
      });
      Progress.belongsTo(models.Page, {
        foreignKey: "pageId",
      });
    }
    static async MarkedAsComplete(userId, pageId) {
      let pro = await Progress.findOne({ where: {studentId:userId, pageId} });
      if (pro) {
        return pro.markAsCompleted;
      } else {
        return false;
      }
    }
    static async getCompletionProgress(models,userId, courseId) {
      const totalPagesInCourse = await models.Page.getPagesInCourse(courseId);
      const completedPages = await Progress.findAll({ where: { studentId: userId, courseId } });
      let status;
      if (totalPagesInCourse > 0) {
        status = Math.floor((completedPages.length / totalPagesInCourse) * 100);
      } else {
      status = 0; 
      }
     return status;
    }
  }
  Progress.init({
    courseId: DataTypes.INTEGER,
    studentId: DataTypes.INTEGER,
    pageId: DataTypes.INTEGER,
    markAsCompleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Progress',
  });
  return Progress;
};