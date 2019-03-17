class DatabaseHelper {
  constructor(MongoClient) {
    this.DBO = this.initDBO(MongoClient);
    this.usersCollection = 'users';
    this.url = 'mongodb://localhost:27017/';
  }

  getUser(name) {
    if (!this.DBO) {
      console.log('database not created yet');
      return;
    }

    return new Promise(resolve => {
      this.DBO.collection(this.usersCollection).findOne({ name: name }, (err, res) => {
        if (err) {
          throw err
        }
        resolve(res);
      });
    });
  }

  createUser(name, password) {
    if (!this.DBO) {
      console.log('database not created yet');
      return;
    }

    this.DBO.collection(this.usersCollection).insertOne({ name: name, password: password }, (err, res) => {
      if (err) {
        throw err;
      }
    });
  }

  async verifyCredentials(name, password) {
    if (!this.DBO) {
      console.log('database not created yet');
      return;
    }
    const user = await this.getUser(name);
    if (user) {
      return user.password == password;
    }
    return false;
  }

  initDBO(MongoClient) {
    MongoClient.connect('mongodb://localhost:27017/', (err, db) => {
      if (err) {
        throw err;
      }
      this.DBO = db.db('avalon');
    });
  }

  async deleterAllUsers() {
    if (!this.DBO) {
      console.log('database not created yet');
      return;
    }
    this.DBO.collection(this.usersCollection).drop((err, res) => {
      if (err) {
        throw err;
      }

      console.log('All users deleted');
    })
  }
}

module.exports = DatabaseHelper;