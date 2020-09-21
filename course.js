module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define(
        'Course',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
                
            },
            description: {
                type: {
                    type: DataTypes.TEXT
                }
            },
            estimatedTime: {
                type: DataTypes.STRING,
            },
            materialsNeeded: {
                type: DataTypes.STRING
            },
        }, {});
    Course.associate = (models) => {
        Course.belongsTo(models.User, {
            foreignKey: {
                fieldName: 'userId',
                allowNull: false
            }
        });
    };


return Course;
}