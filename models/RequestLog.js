const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define(
        'RequestLog',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            requestTime: {
                type: DataTypes.DATE,
                allowNull: false,
                field: 'request_time'
            },
            event: {
                type: DataTypes.STRING(100),
                allowNull: false,
                field: 'event'
            },
            requestMethod: {
                type: DataTypes.STRING(10),
                allowNull: false,
                field: 'request_method'
            },
            url: {
                type: DataTypes.TEXT,
                allowNull: false,
                field: 'url'
            },
            statusCode: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'status_code'
            }
        },
        {
            tableName: 'request_logs',
            timestamps: false
        }
    );
};