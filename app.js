//invocamos express
const express =require('express')
const app = express()



//seteamos urlencoded para capturar datos del formulario
app.use(express.json());
app.use(express.urlencoded({
	extended: false
}));

//invocamos a dotenv
const dotenv = require('dotenv')
dotenv.config({path:'./.env'})// si o si incluir el path para q encuentre las variables de entorno, m falto esto la otra vez, imposible q lo encuentre

//directorio public
const path = require('path')
app.use(express.static(path.join(__dirname, 'public')))//me facilita porq ya me pone estando en la carpeta public

//establecemos motor de plantillas
//PRODFUNDIZAR MAS EN 
//app.set('views', './views') // specify the views directory
const hbs= require('hbs')
app.set('view engine', 'hbs')

//invocamos a bcryptjs
const bcryptjs= require('bcryptjs')

//invocamos a express-session y su configuracion
const session = require('express-session')
app.use(session({
  secret: 'keyboard cat',//se puede crear un random c js con clave aleatoria
  resave: false,
  saveUninitialized: false
  //luego volver a ver lo de la cookie expire
}))

//importamos base de datos invocamos el modulo de conexion a la base de datos
const db = require('./db')

//estableciendo las rutas

app.get('/', (req, res)=> {
	res.render('index', {
		titulo : 'Inicio',
	
		
	})
	
})

app.get('/login', (req,res)=> {
	res.render('login', {
		
		titulo: 'Login'
	})
	
})

app.get('/register', (req,res)=>{
	res.render('register', {
		
		titulo : 'Register'
	})
	
})

//rutas post

app.post('/register', (req,res)=> {
	let sql="INSERT INTO users SET ?"
	let cuerpo= req.body
	db.query(sql, [cuerpo], (err,data)=> {
		if(err) throw err;
		res.redirect('/')
		
	})
	
})

//autenticacion (login)
app.post('/login', (req,res)=> {
	let user = req.body.user
	let pass = req.body.pass
	let sql = "SELECT * FROM users WHERE user =? AND pass=?"
	if(user && pass) {
		db.query(sql, [user,pass], (err,data)=> {
			if(err) throw err;
			if(data.length>0) {
				res.send('Usuario encontrado')
			}else {
				res.render('login' , {
				titulo: 'Login',
				error: 'Nombre de usuario o contrasena incorrecto'
				
			})
				
			}
			
		})
	}else{
		res.render('login' , {
				titulo: 'Login',
				error: 'Por favor escriba usuario y contrasena para ingresar'
				
			})
		
		
	}
	
})



app.listen(3000, (req,res)=> {
	console.log('Servidor online')
	
})