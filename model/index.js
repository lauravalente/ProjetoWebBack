const sequelize = require('../helpers/ConexãoBD');
const User = require('./UserModel');
const Project = require('./ProjectModel');
const Task = require('./TaskModel');

// Associações
Project.hasMany(User, { foreignKey: 'projectId', as: 'projectMembers', onDelete: 'SET NULL' });
Project.belongsTo(User, { foreignKey: 'leaderId', as: 'projectLeader', onDelete: 'SET NULL' });
User.belongsTo(Project, { foreignKey: 'projectId', as: 'project', onDelete: 'SET NULL' });

Task.belongsTo(Project, { foreignKey: 'projectId', as: 'taskProject', onDelete: 'SET NULL' });
Task.belongsTo(User, { foreignKey: 'requesterId', as: 'taskRequester', onDelete: 'SET NULL' });
Task.belongsTo(User, { foreignKey: 'responsibleId', as: 'taskResponsible', onDelete: 'SET NULL' });
Task.belongsTo(User, { foreignKey: 'createdById', as: 'taskCreatedBy', onDelete: 'SET NULL' });

// Sincronizar os modelos com o banco de dados
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Banco de dados sincronizado.');
    })
    .catch(error => {
        console.error('Erro ao sincronizar o banco de dados:', error);
    });

module.exports = {
    User,
    Project,
    Task,
};
