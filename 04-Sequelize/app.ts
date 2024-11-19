import path from 'path';
import express from 'express';
import sequelize from './data/database';
import adminRoutes from './routes/admin';
import storeRoutes from './routes/store';
import errorController from './controllers/error';
import Item from './models/Item';
import User from './models/User';
import Cart from './models/Cart';
import CartItem from './models/CartItem';

const app = express();

app.use(express.urlencoded({ extended: false }));

 // allows serving of static paths
app.use(express.static(path.join(import.meta.dirname, '../', 'public'), {
  maxAge: '1d', // Cache static assets for 1 day to improve load times
  etag: false  // Disable ETag generation for simpler cache management
}));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log('App.ts findUser error:', err));
});

app.use('/admin', adminRoutes); // adds URL filter to all routes
app.use(storeRoutes);
app.use(errorController);

Item.belongsTo(User, {onDelete: 'CASCADE'});
User.hasMany(Item);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Item, { through: CartItem });
Item.belongsToMany(Cart, { through: CartItem });

sequelize
  .sync()
  .then(() => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: 'Jock', email: 'jock@email.com' });
    }
    return user;
  })
  .then(() => {
    app.listen(3000, () => {
      console.log('Server is on track to port 3000');
    });
  })
  .catch((err) => {
    console.log('Server Error:', err);
  });
