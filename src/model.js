const { Sequelize, DataTypes } = require("sequelize");

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL environment variable is required");
  process.exit(1);
}

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
      allowNull: false,
    },
    fname: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    sname: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    profile_picture: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
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
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    caption: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
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
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
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
Recommendation.belongsToMany(Collection, {
  through: CollectionRecommendation,
  foreignKey: "recommendation_id",
});
Collection.belongsTo(User, { foreignKey: "user_id" });
Collection.belongsToMany(Recommendation, {
  through: CollectionRecommendation,
  foreignKey: "collection_id",
});

module.exports = {
  sequelize,
  User,
  Recommendation,
  Collection,
  CollectionRecommendation,
};
