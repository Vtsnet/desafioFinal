const express = require('express');
const multer = require('./services/multer');
const router = express();
router.use(express.json());
const allowUploadFile = multer.single('produto_imagem');

const authorization = require('./intermediarios/autenticacao');
const { alreadyExist } = require('./intermediarios/verificaUsuario');

const bodyReqValidation = require('./intermediarios/bodyReqValidation');
const { userBodySchema, userLoginSchema } = require('./validations/schemaUser');
const productBodySchema = require('./validations/schemaProducts');

const { validateProductId, checkDuplicateProduct } = require('./intermediarios/verificaProduto');
const { cadastrarUsuario, loginUser } = require('./controladores/usuarios');
const { cadastrarProduto, listarProdutos, encontrarIdProduto, apagarArquivo } = require('./controladores/produtos');
const { registerOrder, listOrders } = require('./controladores/pedidos');
const orderBodySchema = require('./validations/schemaOrder');
const { verifyProducts } = require('./intermediarios/verificaPedido');

router.post('/usuario', bodyReqValidation(userBodySchema), alreadyExist, cadastrarUsuario);
router.post('/login', bodyReqValidation(userLoginSchema), loginUser);

router.use(authorization);

router.post('/produto', allowUploadFile, bodyReqValidation(productBodySchema), checkDuplicateProduct, cadastrarProduto);

router.get('/produto', listarProdutos);
router.get('/produto/:id', validateProductId, encontrarIdProduto);
router.delete('/produto/:id', validateProductId, apagarArquivo);

router.post('/pedido', bodyReqValidation(orderBodySchema), verifyProducts, registerOrder);
router.get('/pedido', listOrders);

module.exports = router;
