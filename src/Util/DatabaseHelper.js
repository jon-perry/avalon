class DatabaseHelper {
  constructor(MongoClient) {
    this.initDBO(MongoClient)
      .then((dbo) => {
        this.DBO = dbo;
      })
      .catch((err) => {
        throw err;
      });
    this.usersCollection = 'users';
    this.url = 'mongodb://localhost:27017/';
  }

  getUser(name) {
    return new Promise((resolve, reject) => {
      this.DBO.collection(this.usersCollection).findOne({ name: name }, (err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res);
      });
    });
  }

  createUser(name, password) {
    this.DBO.collection(this.usersCollection).insertOne({ name: name, password: password }, (err, res) => {
      if (err) {
        throw err;
      }
    });
  }

  async verifyCredentials(name, password) {
    const user = await this.getUser(name);
    if (user) {
      return user.password == password;
    }
    return false;
  }

  initDBO(MongoClient) {
    return new Promise((resolve, reject) => {
      MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true }, (err, db) => {
        if (err) {
          reject(err)
        }
        resolve(db.db('avalon'))
      });
    });
  }

  deleteAllUsers() {
    this.DBO.collection(this.usersCollection).drop((err, res) => {
      if (err) {
        throw err;
      }
      console.log('All users deleted');
    });
  }
}

module.exports = DatabaseHelper;