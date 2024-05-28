const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
});

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fname: {
      type: DataTypes.STRING(255),
    },
    sname: {
      type: DataTypes.STRING(255),
    },
    profile_picture: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    bio: {
      type: DataTypes.TEXT,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

const Recommendation = sequelize.define(
  "Recommendation",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.STRING(255),
    },
    caption: {
      type: DataTypes.TEXT,
    },
    category: {
      type: DataTypes.STRING(50),
    },
    pictures: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "recommendations",
    timestamps: false,
  }
);

const Collection = sequelize.define(
  "Collection",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING(255),
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    tableName: "collections",
    timestamps: true,
  }
);

const CollectionRecommendation = sequelize.define(
  "CollectionRecommendation",
  {
    collection_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "collections",
        key: "id",
      },
    },
    recommendation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "recommendations",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "CollectionRecommendation",
    tableName: "collection_recommendations",
    timestamps: false,
  }
);

User.hasMany(Recommendation, { foreignKey: "user_id" });
Recommendation.belongsTo(User, { foreignKey: "user_id" });
Recommendation.belongsToMany(Collection, { through: CollectionRecommendation });
Collection.belongsTo(User, { foreignKey: "user_id" });
Collection.belongsToMany(Recommendation, {
  through: CollectionRecommendation,
});

module.exports = {
  sequelize,
  User,
  Recommendation,
  Collection,
  CollectionRecommendation,
};
