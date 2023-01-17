import * as express from 'express';
import{ router} from './routes';

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(router);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

});
