/**
 * Định nghĩa cấu hình kết nối MongoDB cho ALM.
 * @interface MongoDbConfig
 * @property {string} uri - URI của MongoDB.
 * @property {string} database - Tên của database.
 * @property {{writeConcern: {w: 'majority' | number}, readConcern: {level: 'local' | 'majority'}}} options - Tùy chọn cho kết nối MongoDB.
 */
export interface IMongoDbConfig {
  uri: string;
  database: string;
  options: {
    writeConcern: {
      w: 'majority' | number;
    };
    readConcern: {
      level: 'local' | 'majority';
    };
  };
}

/**
 * Định nghĩa cấu hình mặc định cho MongoDB.
 * @const {MongoDbConfig} defaultMongoDbConfig
 */
export const defaultMongoDbConfig: IMongoDbConfig = {
  uri: process.env["ALM_MONGODB_URI"] || 'mongodb://localhost:27017',
  database: process.env["ALM_MONGODB_DATABASE"] || 'alm',
  options: {
    writeConcern: {
      w: 'majority',
    },
    readConcern: {
      level: 'local',
    },
  },
};
