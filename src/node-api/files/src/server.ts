import { json as parseJSON } from 'body-parser';
import * as express from 'express';
import { Application } from 'express';
import { routeApp } from './routes';

const app: Application = express();
app.use(parseJSON());
routeApp(app);


app.listen(8080, () => console.log('Server running on 8080.'));
