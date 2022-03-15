const { Sequelize, Model, DataTypes } = require('sequelize');
const pg = require('pg');
const { Umzug, SequelizeStorage } = require('umzug');

const sequelize = new Sequelize('postgres://postgres@localhost/test', {
  dialect: 'postgres',
  dialectModule: pg,
  dialectOptions: {
    ssl: false,
  },
  define: {
    underscored: true,
  },
  logging: false,
});

const umzug = new Umzug({
  migrations: [
    {
      name: '0001-create-tags',
      up: async ({ context: queryInterface }) => {
        return queryInterface.createTable('tags', {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
          },
          type: {
            type: DataTypes.ENUM(
              'NEW',
              'ORIGINAL',
              'DUPLICATE',
            ),
            allowNull: false,
          },
          created_at: {
            allowNull: false,
            type: DataTypes.DATE,
          },
          updated_at: {
            allowNull: false,
            type: DataTypes.DATE,
          },
        });
      },
      down: async ({ context: queryInterface }) => {
        return queryInterface.dropTable('tags');
      },
    }
  ],
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});


class Tags extends Model {};

Tags.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  type: DataTypes.STRING,
}, { sequelize, modelName: 'tags' });

(async () => {
  await umzug.up();

  await umzug.down({ to: 0 });
})();