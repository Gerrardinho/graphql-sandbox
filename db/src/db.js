import Sequelize from 'sequelize';
import Faker from 'faker';
import _ from 'lodash';

const schema = 'node';

const sequelize = new Sequelize('xkzhzlmd', 'xkzhzlmd', 'rAI9GfnPXFzVdTQXfZf4HS9NzuqraazH', {
    host: 'babar.elephantsql.com',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
});

// Or you can simply use a connection uri
// const sequelize = new Sequelize('postgres://xkzhzlmd:rAI9GfnPXFzVdTQXfZf4HS9NzuqraazH@babar.elephantsql.com:5432/xkzhzlmd');

const Author = sequelize.define('author', {
    firstName: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    lastName: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    email: {
        type: Sequelize.TEXT,
        validate: {
            isEmail: true
        }
    }
}, { schema: schema});

const Book = sequelize.define('book', {
    title: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    release: {
        type: Sequelize.DATEONLY,
        allowNull: false
    }
}, { schema: schema});

// Relations
Author.belongsToMany(Book, { through: 'author_book' });
Book.belongsToMany(Author, { through: 'author_book' });



sequelize.dropSchema(schema, { logging: false})
    .then(() => {
        sequelize.createSchema(schema, {logging: false})
            .then(() => {

                console.log(`Schema ${schema} created`);

                sequelize.sync({ force: true, schema: schema }).then(() => {

                    _.times(10, ()=> {
                        Author.create({
                            firstName: Faker.name.firstName(),
                            lastName: Faker.name.lastName(),
                            email: Faker.internet.email()
                        }).then(author => {
                            author.createBook({
                                title: 'First book',
                                release: new Date().toISOString()
                            });
                            author.createBook({
                                title: 'Second book',
                                release: new Date().toISOString()
                            });
                        });
                    });

                });

            })
            .catch(err => console.log(err));
    });

export  default sequelize;
