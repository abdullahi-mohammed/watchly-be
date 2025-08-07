// file: sequelize.js
import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('postgresql://bkddzvgcwxvucudslzgy:uteivznyofkqueosrirqiwemwhooej@9qasp5v56q8ckkf5dc.leapcellpool.com:6438/xcmryejgvrwapjfcmduk?schema=myschema');


const Test = sequelize.define('Test', {
    name: DataTypes.STRING,
}, { schema: 'my_schema', timestamps: false });

(async () => {
    await sequelize.sync();
    await Test.create({ name: 'Sequelize' });
    console.log(await Test.findAll());
})();

export default sequelize;
