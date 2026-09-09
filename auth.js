import passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import {Strategy as FacebookStrategy} from 'passport-facebook';
import {db,seedUser} from './db.js';
const save=(provider,p)=>{const email=p.emails?.[0]?.value||`${provider}-${p.id}@oauth.local`;let u=db.prepare('SELECT * FROM users WHERE email=?').get(email);if(!u){db.prepare('INSERT INTO users(provider,provider_id,name,email,avatar) VALUES(?,?,?,?,?)').run(provider,p.id,p.displayName||'ClaimGuide User',email,p.photos?.[0]?.value||'');u=db.prepare('SELECT * FROM users WHERE email=?').get(email);}return u;};
passport.serializeUser((u,d)=>d(null,u.id));passport.deserializeUser((id,d)=>d(null,db.prepare('SELECT * FROM users WHERE id=?').get(id)));
if(process.env.GOOGLE_CLIENT_ID) passport.use(new GoogleStrategy({clientID:process.env.GOOGLE_CLIENT_ID,clientSecret:process.env.GOOGLE_CLIENT_SECRET,callbackURL:'/auth/google/callback'},(a,r,p,d)=>d(null,save('google',p))));
if(process.env.FACEBOOK_APP_ID) passport.use(new FacebookStrategy({clientID:process.env.FACEBOOK_APP_ID,clientSecret:process.env.FACEBOOK_APP_SECRET,callbackURL:'/auth/facebook/callback',profileFields:['id','displayName','emails','photos']},(a,r,p,d)=>d(null,save('facebook',p))));
export function authRoutes(app){
 app.get('/auth/google',(req,res,next)=>process.env.GOOGLE_CLIENT_ID?passport.authenticate('google',{scope:['profile','email']})(req,res,next):res.redirect('/?auth=not-configured'));
 app.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/?auth=failed'}),(req,res)=>res.redirect('/app'));
 app.get('/auth/facebook',(req,res,next)=>process.env.FACEBOOK_APP_ID?passport.authenticate('facebook',{scope:['email']})(req,res,next):res.redirect('/?auth=not-configured'));
 app.get('/auth/facebook/callback',passport.authenticate('facebook',{failureRedirect:'/?auth=failed'}),(req,res)=>res.redirect('/app'));
 app.post('/auth/demo',(req,res)=>{if(process.env.DEMO_AUTH!=='true')return res.status(404).end();req.login(seedUser(),e=>e?res.status(500).json({error:'Login failed'}):res.json({ok:true}));});
 app.post('/auth/logout',(req,res)=>req.logout(()=>res.json({ok:true})));
 app.get('/api/me',(req,res)=>res.json({user:req.user||null,demo:process.env.DEMO_AUTH==='true'}));
}
export const requireUser=(req,res,next)=>req.user?next():res.status(401).json({error:'Authentication required'});
