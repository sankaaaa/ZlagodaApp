const express = require('express');
const pgp = require('pg-promise')();

const app = express();

const cn = {
    connectionString: 'postgres://postgres.qlyuxputrdmikamgcowo:Prka20152020!@aws-0-us-west-1.pooler.supabase.com:5432/postgres',
};
const db = pgp(cn);

app.get('/product', (req, res) => {
    db.any('SELECT * FROM product;')
        .then(result => {
            res.json(result);
        })
        .catch(error => {
            res.status(500).json({error: error.message});
        });
});

app.delete('/product/:id', (req, res) => {
    const productId = req.params.id;
    db.none('DELETE FROM product WHERE id_product = $1', productId)
        .then(() => {
            res.json({message: 'Product deleted successfully'});
        })
        .catch(error => {
            res.status(500).json({error: error.message});
        });
});

const PORT = 8081

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});